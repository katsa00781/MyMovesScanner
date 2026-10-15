import type { ReactElement } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { PosterCardSkeleton } from '@/components/PosterCard';
import { SectionHeader } from '@/components/SectionHeader';
import { railLayout, TABLET_MIN_WIDTH } from '@/constants/theme';

const SKELETON_COUNT = 6;

// Szekciócím + vízszintesen görgethető poszter-sor, betöltés (skeleton) / hiba + újra / üres
// állapottal. A kártyát a hívó adja (`renderCard`), a rail a design szerinti szélességet adja át.
// Teljes szélességű: a margót (telefon 21, iPad 35) a rail maga tartja.
export function PosterRail<T>({
  title,
  data,
  loading,
  error,
  onRetry,
  onSeeAll,
  keyExtractor,
  renderCard,
}: {
  title: string;
  data: T[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onSeeAll?: () => void;
  keyExtractor: (item: T) => string;
  renderCard: (item: T, cardWidth: number) => ReactElement;
}) {
  const { width } = useWindowDimensions();
  const { cardWidth, gap, inset } = railLayout[width >= TABLET_MIN_WIDTH ? 'tablet' : 'phone'];

  let body;
  if (loading) {
    body = (
      <View className="flex-row overflow-hidden" style={{ gap, paddingHorizontal: inset }}>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <PosterCardSkeleton key={i} width={cardWidth} />
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
        renderItem={({ item }) => renderCard(item, cardWidth)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap, paddingHorizontal: inset }}
      />
    );
  }

  return (
    <View>
      <View className="mb-[23px]" style={{ paddingHorizontal: inset }}>
        <SectionHeader title={title} onSeeAll={onSeeAll} />
      </View>
      {body}
    </View>
  );
}
