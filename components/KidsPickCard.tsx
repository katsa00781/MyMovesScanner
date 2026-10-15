import { Image } from 'expo-image';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';

import { colors, TABLET_MIN_WIDTH } from '@/constants/theme';
import { backdropUrl } from '@/lib/tmdbImage';

// Olvashatóság: sötétítés a kép alján, a cím alatt; a design poszterébe ez sütve van.
const bottomFade = {
  experimental_backgroundImage: `linear-gradient(to bottom, ${colors.background}00 30%, ${colors.background}B3 100%)`,
} as const;
const titleShadow = {
  textShadowColor: `${colors.background}73`,
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 6,
} as const;

// Fekvő gyerek kártya a 02 / 10 designból: backdrop, rajta a cím, alatta színes pötty +
// „korhatár · műfaj”. A pötty színét a hívó adja (körbeforgó paletta).
export function KidsPickCard({
  title,
  backdropPath,
  caption,
  accent,
  width,
  onPress,
}: {
  title: string;
  backdropPath: string | null;
  caption: string;
  accent: string;
  width: number;
  onPress?: () => void;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= TABLET_MIN_WIDTH;
  const backdrop = backdropUrl(backdropPath);

  return (
    <View style={{ width }}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
        className="active:opacity-80">
        <View className="aspect-[173/100] w-full overflow-hidden rounded-cardLarge bg-surface">
          {backdrop ? <Image source={backdrop} style={{ flex: 1 }} contentFit="cover" /> : null}
          <View pointerEvents="none" className="absolute inset-0" style={bottomFade} />
          <Text
            numberOfLines={2}
            className={`absolute bottom-0 left-0 right-0 px-4 pb-[14px] font-extrabold text-textPrimary ${
              isTablet ? 'text-[23px] leading-[25px]' : 'text-[22px] leading-[24px]'
            }`}
            style={titleShadow}>
            {title}
          </Text>
        </View>
        {caption ? (
          <View className="mt-[9px] flex-row items-center gap-[7px]">
            <View className="h-2 w-2 rounded-pill" style={{ backgroundColor: accent }} />
            <Text numberOfLines={1} className="shrink text-[13px] leading-[16px] text-textSecondary">
              {caption}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

// Betöltés közbeni helykitöltő, a kártya méretével.
export function KidsPickCardSkeleton({ width }: { width: number }) {
  return (
    <View style={{ width }}>
      <View className="aspect-[173/100] w-full rounded-cardLarge bg-surface" />
      <View className="mt-[9px] h-[12px] w-[45%] rounded-pill bg-chip" />
    </View>
  );
}
