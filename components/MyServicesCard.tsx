import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { SettingsRow, SettingsSeparator } from '@/components/SettingsRow';
import { strings } from '@/constants/strings';
import { useMyProviders } from '@/hooks/useMyProviders';
import { logoUrl } from '@/lib/tmdbImage';

const SKELETON_LOGOS = 4;

// „Szolgáltatóim” kártya (08, 16 design): a kiválasztott szolgáltatók logói és nevei, alatta a
// szerkesztés. Betöltés közben helykitöltő, hiba esetén újrapróbálás, szolgáltató nélkül üzenet.
export function MyServicesCard({ onEdit }: { onEdit: () => void }) {
  const { providers, loading, error, retry } = useMyProviders();

  let content;
  if (loading) {
    content = (
      <>
        <View className="flex-row gap-[9px]">
          {Array.from({ length: SKELETON_LOGOS }, (_, i) => (
            <View key={i} className="h-[43px] w-[43px] rounded-[10px] bg-chip" />
          ))}
        </View>
        <View className="mt-[13px] h-[14px] w-[60%] rounded-pill bg-chip" />
      </>
    );
  } else if (error) {
    content = (
      <View className="flex-row items-center justify-between">
        <Text className="text-[14px] text-textSecondary">{strings.common.loadError}</Text>
        <Pressable onPress={retry} hitSlop={8} accessibilityRole="button" className="active:opacity-60">
          <Text className="font-semibold text-[14px] text-accent">{strings.common.retry}</Text>
        </Pressable>
      </View>
    );
  } else if (providers.length === 0) {
    content = <Text className="text-[14px] text-textSecondary">{strings.home.noServices}</Text>;
  } else {
    content = (
      <>
        <View className="flex-row flex-wrap gap-[9px]">
          {providers.map((provider) => (
            <View
              key={provider.provider_id}
              accessibilityLabel={provider.provider_name}
              className="h-[43px] w-[43px] overflow-hidden rounded-[10px]">
              <Image source={logoUrl(provider.logo_path)} style={{ flex: 1 }} contentFit="cover" />
            </View>
          ))}
        </View>
        <Text className="mt-[11px] text-[14px] leading-[18px] text-textSecondary">
          {providers.map((provider) => provider.provider_name).join(', ')}
        </Text>
      </>
    );
  }

  return (
    <>
      <View className="px-[15px] pb-[13px] pt-[14px]">{content}</View>
      <SettingsSeparator />
      <SettingsRow label={strings.settings.editServices} accent onPress={onEdit} />
    </>
  );
}
