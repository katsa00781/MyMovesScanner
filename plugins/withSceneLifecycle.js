// iOS 27 összeomlik indításkor, ha az app nem a scene-alapú életciklust használja.
// Az SDK 57 `expo` csomagja tartalmazza az `ExpoAppSceneDelegate`-et, de az SDK 57 prebuild sablon
// még nem generálja; ez a plugin az SDK 58 sablon szerint illeszti be (SceneDelegate, Info.plist,
// AppDelegate). SDK 58-ra váltáskor törölhető.
const fs = require('fs');
const path = require('path');
const {
  IOSConfig,
  withDangerousMod,
  withInfoPlist,
  withXcodeProject,
} = require('expo/config-plugins');

const SCENE_DELEGATE = `internal import Expo

@objc(SceneDelegate)
class SceneDelegate: ExpoAppSceneDelegate {
  // Extension point for config plugins.
}
`;

const SCENE_DELEGATE_FILE = 'SceneDelegate.swift';

function withSceneManifest(config) {
  return withInfoPlist(config, (mod) => {
    mod.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate',
          },
        ],
      },
    };
    return mod;
  });
}

// A SceneDelegate hozza létre az ablakot és indítja a React Nativet, az AppDelegate csak a factoryt adja.
function patchAppDelegate(source) {
  if (source.includes('ExpoReactNativeFactoryProvider')) return source;

  const withProvider = source.replace(
    'class AppDelegate: ExpoAppDelegate {',
    'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {'
  );
  const withoutWindow = withProvider.replace(
    /\n#if os\(iOS\) \|\| os\(tvOS\)\n\s*window = UIWindow[\s\S]*?#endif\n/,
    '\n    // Az ablakot és a React Native indítást a `SceneDelegate` végzi (iOS 27 követelmény).\n'
  );
  if (withProvider === source || withoutWindow === withProvider) {
    throw new Error('withSceneLifecycle: az AppDelegate.swift szerkezete nem a várt, a plugin nem illeszthető.');
  }
  return withoutWindow;
}

function withSceneFiles(config) {
  return withDangerousMod(config, [
    'ios',
    (mod) => {
      const appDir = path.join(mod.modRequest.platformProjectRoot, mod.modRequest.projectName);
      fs.writeFileSync(path.join(appDir, SCENE_DELEGATE_FILE), SCENE_DELEGATE);

      const appDelegatePath = path.join(appDir, 'AppDelegate.swift');
      const source = fs.readFileSync(appDelegatePath, 'utf8');
      fs.writeFileSync(appDelegatePath, patchAppDelegate(source));
      return mod;
    },
  ]);
}

function withSceneInXcodeProject(config) {
  return withXcodeProject(config, (mod) => {
    const filepath = `${mod.modRequest.projectName}/${SCENE_DELEGATE_FILE}`;
    const project = mod.modResults;
    if (!project.hasFile(filepath)) {
      IOSConfig.XcodeUtils.addBuildSourceFileToGroup({
        filepath,
        groupName: mod.modRequest.projectName,
        project,
      });
    }
    return mod;
  });
}

module.exports = (config) =>
  withSceneInXcodeProject(withSceneFiles(withSceneManifest(config)));
