import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/constants/theme';
import { logoUrl } from '@/lib/tmdbImage';
import type { Provider } from '@/types/tmdb';

type Size = { width: number; height: number };

// A Pressable-n `style` függvény van (lenyomás), ezért nincs rajta className:
// a NativeWind a függvényt nem alkalmazza, a méretek elvesznének.
const styles = StyleSheet.create({
  card: {
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: radius.cardLarge,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.surface,
  },
  selected: { borderColor: colors.accent },
});

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
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        { width, height, opacity: pressed ? 0.7 : 1 },
      ]}>
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
