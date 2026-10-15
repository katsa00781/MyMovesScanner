import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { posterUrl } from '@/lib/tmdbImage';

// Gyerek sarok kártya a 04 / 12 designból: nagy 2:3 poszter (20 px sarok), alatta színes pötty +
// cím. A pötty színét a hívó adja (körbeforgó paletta). A design posztereibe sült címek
// helykitöltők: a valódi poszter a TMDB-ből jön.
export function KidsTitleCard({
  title,
  posterPath,
  accent,
  width,
  onPress,
}: {
  title: string;
  posterPath: string;
  accent: string;
  width: number;
  onPress?: () => void;
}) {
  return (
    <View style={{ width }}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
        className="active:opacity-80">
        <View className="aspect-[2/3] w-full overflow-hidden rounded-kidsCard bg-surface">
          <Image source={posterUrl(posterPath)} style={{ flex: 1 }} contentFit="cover" />
        </View>
        <View className="mt-3 h-5 flex-row items-center gap-[10px]">
          <View className="h-[10px] w-[10px] rounded-pill" style={{ backgroundColor: accent }} />
          <Text numberOfLines={1} className="shrink font-bold text-[16px] text-textPrimary">
            {title}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

// Betöltés közbeni helykitöltő, a kártya méretével.
export function KidsTitleCardSkeleton({ width }: { width: number }) {
  return (
    <View style={{ width }}>
      <View className="aspect-[2/3] w-full rounded-kidsCard bg-surface" />
      <View className="mt-3 h-5 justify-center">
        <View className="h-[12px] w-[60%] rounded-pill bg-chip" />
      </View>
    </View>
  );
}
