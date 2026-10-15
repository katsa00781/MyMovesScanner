import type { ReactElement } from 'react';
import { FlatList, Text, useWindowDimensions, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { KidsPickCardSkeleton } from '@/components/KidsPickCard';
import { PosterCardSkeleton } from '@/components/PosterCard';
import { SectionHeader } from '@/components/SectionHeader';
import { TrendingCardSkeleton } from '@/components/TrendingCard';
import { railLayout, TABLET_MIN_WIDTH, trendingLayout, wideRailLayout } from '@/constants/theme';

const SKELETON_COUNT = 6;

// A rail három kártyaformája: álló poszter, sorszámos poszter (Népszerű), fekvő kártya (Gyerek).
// Mindegyiknek más a mérete és a helykitöltője; a margó (telefon 21, iPad 35) közös.
const variants = {
  poster: { layout: railLayout, skeleton: (width: number) => <PosterCardSkeleton width={width} /> },
  trending: { layout: trendingLayout, skeleton: (width: number) => <TrendingCardSkeleton width={width} /> },
  wide: { layout: wideRailLayout, skeleton: (width: number) => <KidsPickCardSkeleton width={width} /> },
};

// Szekciócím + vízszintesen görgethető kártya-sor, betöltés (skeleton) / hiba + újra / üres
// állapottal. A kártyát a hívó adja (`renderCard`), a rail a design szerinti szélességet adja át.
// Teljes szélességű: a margót a rail maga tartja.
export function PosterRail<T>({
  title,
  note,
  variant = 'poster',
  data,
  loading,
  error,
  onRetry,
  onSeeAll,
  keyExtractor,
  renderCard,
}: {
  title: string;
  /** Kis szürke sor a cím alatt (pl. „Német megjelenés”). */
  note?: string;
  variant?: keyof typeof variants;
  data: T[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onSeeAll?: () => void;
  keyExtractor: (item: T) => string;
  renderCard: (item: T, cardWidth: number, index: number) => ReactElement;
}) {
  const { width } = useWindowDimensions();
  const { layout, skeleton } = variants[variant];
  const { cardWidth, gap, inset } = layout[width >= TABLET_MIN_WIDTH ? 'tablet' : 'phone'];

  let body;
  if (loading) {
    body = (
      <View className="flex-row overflow-hidden" style={{ gap, paddingHorizontal: inset }}>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <View key={i}>{skeleton(cardWidth)}</View>
        ))}
      </View>
    );
  } else if (error) {
    body = (
      <View style={{ paddingHorizontal: inset }}>
        <ErrorState onRetry={onRetry} />
      </View>
    );
  } else if (data.length === 0) {
    body = (
      <View style={{ paddingHorizontal: inset }}>
        <EmptyState />
      </View>
    );
  } else {
    body = (
      <FlatList
        horizontal
        data={data}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => renderCard(item, cardWidth, index)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap, paddingHorizontal: inset }}
      />
    );
  }

  return (
    <View>
      <View className="mb-[23px]" style={{ paddingHorizontal: inset }}>
        <SectionHeader title={title} onSeeAll={onSeeAll} />
        {note ? <Text className="mt-1 text-[13px] text-textSecondary">{note}</Text> : null}
      </View>
      {body}
    </View>
  );
}
