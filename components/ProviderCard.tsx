import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { logoUrl } from '@/lib/tmdbImage';
import type { Provider } from '@/types/tmdb';

type Size = { width: number; height: number };

// Szolgáltató kártya az onboardinghoz: logó, név, jobb felül kijelölés-jelző.
// Kijelölve narancs keret + pipa; a keret helye mindig foglalt, nincs elugrás.
export function ProviderCard({
  provider,
  selected,
  width,
  height,
  onPress,
}: Size & { provider: Provider; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      className={`justify-between rounded-cardLarge border-2 bg-surface p-4 ${
        selected ? 'border-accent' : 'border-transparent'
      }`}
      style={({ pressed }) => ({ width, height, opacity: pressed ? 0.7 : 1 })}>
      <View className="flex-row items-start justify-between">
        <View className="h-[50px] w-[50px] overflow-hidden rounded-[11px]">
          <Image source={logoUrl(provider.logo_path)} style={{ flex: 1 }} contentFit="cover" />
        </View>
        {selected ? (
          <View className="h-[26px] w-[26px] items-center justify-center rounded-pill bg-accent">
            <SymbolView name="checkmark" size={12} weight="bold" tintColor={colors.ctaText} />
          </View>
        ) : (
          <View className="h-[26px] w-[26px] rounded-pill border-[1.5px] border-textSecondary/70" />
        )}
      </View>
      <Text numberOfLines={1} className="font-nunito-semibold text-[17px] text-textPrimary">
        {provider.provider_name}
      </Text>
    </Pressable>
  );
}

// Betöltés közbeni helykitöltő, a kártya méretével.
export function ProviderCardSkeleton({ width, height }: Size) {
  return (
    <View className="justify-between rounded-cardLarge bg-surface p-[18px]" style={{ width, height }}>
      <View className="h-[50px] w-[50px] rounded-[11px] bg-chip" />
      <View className="h-[14px] w-[60%] rounded-pill bg-chip" />
    </View>
  );
}
