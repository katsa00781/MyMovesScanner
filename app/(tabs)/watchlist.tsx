import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { PosterCard } from '@/components/PosterCard';
import { PosterGrid } from '@/components/PosterGrid';
import { ScreenTitle } from '@/components/ScreenTitle';
import { SegmentedControl } from '@/components/SegmentedControl';
import { strings } from '@/constants/strings';
import { gridLayout, isWideContent, TABLET_MIN_WIDTH, watchlistLayout } from '@/constants/theme';
import { useWatchlist } from '@/hooks/useWatchlist';
import { matchesSegment, type WatchlistSegment } from '@/lib/watchlistStatus';
import { titleHref } from '@/lib/routes';

export default function WatchlistScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const wide = isWideContent(width);
  const { entries, counts, isEmpty, loading, error, retry } = useWatchlist();
  const [segment, setSegment] = useState<WatchlistSegment>('all');

  const { inset } = gridLayout[isTablet ? 'tablet' : 'phone'];
  const bar = watchlistLayout[isTablet ? 'tablet' : 'phone'];
  const visible = entries.filter((entry) => matchesSegment(entry.status, segment));

  const control = (
    <SegmentedControl
      value={segment}
      onChange={setSegment}
      segments={[
        { key: 'all', label: `${strings.watchlist.all} ${counts.all}` },
        { key: 'available', label: `${strings.watchlist.availableNow} ${counts.available}` },
        { key: 'soon', label: `${strings.watchlist.comingSoon} ${counts.soon}` },
      ]}
    />
  );

  let body;
  if (loading) {
    body = <PosterGrid data={[]} loading keyExtractor={() => ''} renderCard={() => <View />} />;
  } else if (error) {
    body = <ErrorState onRetry={retry} />;
  } else if (isEmpty) {
    body = <EmptyState message={strings.watchlist.empty} />;
  } else if (visible.length === 0) {
    body = <EmptyState />;
  } else {
    body = (
      <PosterGrid
        data={visible}
        keyExtractor={({ item }) => `${item.type}:${item.id}`}
        renderCard={({ item, status }, cardWidth) => (
          <PosterCard
            title={item.title}
            posterPath={item.posterPath}
            width={cardWidth}
            status={status}
            onPress={() => router.push(titleHref(item.type, item.id))}
          />
        )}
      />
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ paddingHorizontal: inset, paddingTop: bar.barTop }}>
          <View className="flex-row items-center justify-between" style={{ minHeight: bar.barHeight }}>
            <ScreenTitle>{strings.watchlist.title}</ScreenTitle>
            {wide ? <View style={{ width: watchlistLayout.tablet.controlWidth }}>{control}</View> : null}
          </View>
          {wide ? null : <View style={{ marginTop: watchlistLayout.phone.controlGap }}>{control}</View>}
        </View>
        <View style={{ marginTop: watchlistLayout.gridTop }}>{body}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
