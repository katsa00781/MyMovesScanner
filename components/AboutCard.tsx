import Constants from 'expo-constants';
import { Text, View } from 'react-native';

import { SettingsSeparator } from '@/components/SettingsRow';
import { TmdbLogo } from '@/components/TmdbLogo';
import { strings } from '@/constants/strings';

// „Névjegy” kártya (08, 16 design): verzió, és a kötelező forrásmegjelölés (TMDB logó + szöveg,
// JustWatch). A design ár-szövegét (D-012) és a TMDB logót (CLAUDE.md) a design nem mutatja.
export function AboutCard() {
  return (
    <>
      <View className="h-[48px] flex-row items-center justify-between px-[17px]">
        <Text className="text-[17px] text-textPrimary">{strings.settings.version}</Text>
        <Text className="text-[17px] text-textSecondary">{Constants.expoConfig?.version}</Text>
      </View>
      <View className="mx-[17px]">
        <SettingsSeparator />
      </View>
      <View className="gap-[9px] px-[17px] pb-[14px] pt-[12px]">
        <TmdbLogo />
        <Text className="text-[14px] leading-[19.5px] text-textSoft">
          <Text className="font-bold text-textPrimary">{strings.settings.tmdb}</Text>
          {strings.settings.tmdbText}
        </Text>
        <Text className="text-[14px] leading-[19.5px] text-textSoft">
          <Text className="font-bold text-textPrimary">{strings.settings.justWatch}</Text>
          {strings.settings.justWatchText}
        </Text>
      </View>
    </>
  );
}
