import { useRouter } from 'expo-router';
import { ActionSheetIOS, ScrollView, Switch, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AboutCard } from '@/components/AboutCard';
import { MyServicesCard } from '@/components/MyServicesCard';
import { ScreenTitle } from '@/components/ScreenTitle';
import { SettingsBackLink } from '@/components/SettingsBackLink';
import { SettingsRow, SettingsSeparator } from '@/components/SettingsRow';
import { SettingsSection } from '@/components/SettingsSection';
import { strings } from '@/constants/strings';
import { colors, settingsLayout, TABLET_MIN_WIDTH } from '@/constants/theme';
import { kidsAgeLimits } from '@/data/kidsAgeLimits';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const layout = settingsLayout[isTablet ? 'tablet' : 'phone'];

  const user = useAuthStore((state) => state.user);
  const ageLimit = useSettingsStore((state) => state.kidsAgeLimit);
  const setAgeLimit = useSettingsStore((state) => state.setKidsAgeLimit);
  const hideMature = useSettingsStore((state) => state.hideMature);
  const setHideMature = useSettingsStore((state) => state.setHideMature);

  const pickAgeLimit = () => {
    const labels = kidsAgeLimits.map((limit) => `${limit}+`);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: strings.settings.ageLimit,
        options: [...labels, strings.common.cancel],
        cancelButtonIndex: labels.length,
      },
      (index) => {
        if (index < kidsAgeLimits.length) setAgeLimit(kidsAgeLimits[index]);
      },
    );
  };

  // A Notifications szekció a v1-ben rejtett (D-013). A Régió és a Nyelv nem választható (D-049),
  // ezért nyíl nélküli sor; az „Árak” sor kimarad (D-012).
  const services = (
    <SettingsSection title={strings.settings.myServices} footnote={strings.settings.servicesNote}>
      <MyServicesCard onEdit={() => router.push('/onboarding')} />
    </SettingsSection>
  );
  const regionLanguage = (
    <SettingsSection title={strings.settings.regionLanguage}>
      <SettingsRow
        label={strings.settings.region}
        icon={{ name: 'globe', color: colors.settingsBlue }}
        value={strings.settings.regionValue}
      />
      <SettingsSeparator inset />
      <SettingsRow
        label={strings.settings.appLanguage}
        icon={{ name: 'translate', color: colors.settingsPurple }}
        value={strings.settings.languageValue}
      />
    </SettingsSection>
  );
  const kidsCorner = (
    <SettingsSection title={strings.settings.kidsCorner}>
      <SettingsRow
        label={strings.settings.ageLimit}
        icon={{ name: 'face.smiling', color: colors.settingsTeal }}
        value={`${ageLimit}+`}
        onPress={pickAgeLimit}
      />
      <SettingsSeparator inset />
      <SettingsRow
        label={strings.settings.hideMature}
        icon={{ name: 'checkmark.shield', color: colors.settingsGreen }}
        right={
          <Switch
            value={hideMature}
            onValueChange={setHideMature}
            trackColor={{ true: colors.accent }}
            thumbColor={colors.textPrimary}
            accessibilityLabel={strings.settings.hideMature}
          />
        }
      />
    </SettingsSection>
  );
  const account = (
    <SettingsSection title={strings.account.title} footnote={user ? undefined : strings.account.rowNote}>
      <SettingsRow
        label={user ? strings.account.email : strings.account.signInRow}
        icon={{ name: 'person.crop.circle', color: colors.settingsBlue }}
        value={user?.email}
        onPress={() => router.push('/account')}
      />
    </SettingsSection>
  );
  const about = (
    <SettingsSection title={strings.settings.about}>
      <AboutCard />
    </SettingsSection>
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
        <View style={{ width: '100%', maxWidth: layout.maxWidth, paddingHorizontal: layout.inset }}>
          <View style={{ paddingTop: layout.backTop, paddingLeft: layout.backOffset }}>
            <SettingsBackLink onPress={() => router.back()} />
          </View>
          <View
            className="justify-center"
            style={{ height: layout.titleHeight, marginTop: layout.titleGap, paddingLeft: layout.titleOffset }}>
            <ScreenTitle>{strings.settings.title}</ScreenTitle>
          </View>
          <View style={{ marginTop: layout.firstSectionGap }}>
            {isTablet ? (
              <View className="flex-row items-start" style={{ gap: settingsLayout.tablet.columnGap }}>
                <View className="flex-1" style={{ gap: settingsLayout.sectionGap }}>
                  {services}
                  {regionLanguage}
                  {kidsCorner}
                </View>
                <View className="flex-1" style={{ gap: settingsLayout.sectionGap }}>
                  {account}
                  {about}
                </View>
              </View>
            ) : (
              <View style={{ gap: settingsLayout.sectionGap }}>
                {services}
                {regionLanguage}
                {kidsCorner}
                {account}
                {about}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
