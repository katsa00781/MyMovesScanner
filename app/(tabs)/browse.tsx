import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { GenreChips } from '@/components/GenreChips';
import { PosterCard } from '@/components/PosterCard';
import { PosterGrid } from '@/components/PosterGrid';
import { ProviderFilter } from '@/components/ProviderFilter';
import { strings } from '@/constants/strings';
import { browseLayout, colors, gridLayout, TABLET_MIN_WIDTH } from '@/constants/theme';
import { browseGenres, type GenreKey } from '@/data/browseGenres';
import { browseSorts, type BrowseSort } from '@/data/browseSorts';
import { useBrowseTitles } from '@/hooks/useBrowseTitles';
import { useMyProviders } from '@/hooks/useMyProviders';
import { titleHref } from '@/lib/routes';

// Ennyi képpontra az alsó széltől kér a lista újabb adagot.
const LOAD_MORE_DISTANCE = 600;

export default function BrowseScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const layout = browseLayout[isTablet ? 'tablet' : 'phone'];
  const { inset } = gridLayout[isTablet ? 'tablet' : 'phone'];

  const myProviders = useMyProviders();
  // A kikapcsolt szolgáltatók; a Böngészés alapból mindet mutatja, a beállítás nem tárolódik.
  const [excluded, setExcluded] = useState<number[]>([]);
  const [genreKey, setGenreKey] = useState<GenreKey>('all');
  const [sort, setSort] = useState<BrowseSort>('newest');

  const active = useMemo(
    () => myProviders.providers.filter((p) => !excluded.includes(p.provider_id)),
    [myProviders.providers, excluded],
  );
  const activeIds = active.map((p) => p.provider_id);
  const genre = browseGenres.find((g) => g.key === genreKey) ?? browseGenres[0];
  const { titles, total, loading, loadingMore, error, loadMore, retry } = useBrowseTitles(
    active,
    genre,
    sort,
  );

  // Az utolsó bekapcsolt szolgáltatót nem lehet kikapcsolni: szolgáltató nélkül nincs mit szűrni.
  const toggleProvider = (providerId: number) =>
    setExcluded((current) => {
      if (current.includes(providerId)) return current.filter((id) => id !== providerId);
      return active.length > 1 ? [...current, providerId] : current;
    });

  const pickSort = () => {
    const labels = browseSorts.map((key) => strings.browse.sorts[key]);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: strings.browse.sortTitle,
        options: [...labels, strings.common.cancel],
        cancelButtonIndex: labels.length,
      },
      (index) => {
        if (index < browseSorts.length) setSort(browseSorts[index]);
      },
    );
  };

  const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
    if (contentOffset.y + layoutMeasurement.height >= contentSize.height - LOAD_MORE_DISTANCE) {
      loadMore();
    }
  };

  const countText =
    total === undefined ? null : (
      <Text className={`text-textSecondary ${isTablet ? 'text-[15px]' : 'text-[14px]'}`}>
        {strings.browse.count(total, active.length)}
      </Text>
    );
  const sortLabel = strings.browse.sorts[sort];

  const hasServices = myProviders.providers.length > 0;
  let body;
  if (myProviders.loading || (hasServices && loading)) {
    body = <PosterGrid data={[]} loading keyExtractor={() => ''} renderCard={() => <View />} />;
  } else if (myProviders.error) {
    body = <ErrorState onRetry={myProviders.retry} />;
  } else if (!hasServices) {
    body = <EmptyState message={strings.home.noServices} />;
  } else if (error) {
    body = <ErrorState onRetry={retry} />;
  } else if (titles.length === 0) {
    body = <EmptyState />;
  } else {
    body = (
      <>
        <PosterGrid
          data={titles}
          rowGap={layout.rowGap}
          keyExtractor={(item) => item.key}
          renderCard={(item, cardWidth) => (
            <PosterCard
              title={item.title}
              posterPath={item.posterPath}
              width={cardWidth}
              providerLogoPath={item.provider.logo_path}
              onPress={() => router.push(titleHref(item.type, item.id))}
            />
          )}
        />
        {loadingMore ? (
          <View className="items-center py-6">
            <ActivityIndicator color={colors.textSecondary} />
          </View>
        ) : null}
      </>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        onScroll={onScroll}
        scrollEventThrottle={100}>
        <View style={{ paddingHorizontal: inset, paddingTop: layout.barTop }}>
          <View className="flex-row items-center justify-between" style={{ minHeight: layout.barHeight }}>
            <Text className="font-extrabold text-title text-textPrimary">{strings.browse.title}</Text>
            {isTablet && hasServices ? (
              <View className="flex-row items-center gap-[14px]">
                {countText}
                <Pressable
                  onPress={pickSort}
                  accessibilityRole="button"
                  accessibilityLabel={strings.browse.sortTitle}
                  className="h-[37px] flex-row items-center rounded-pill bg-chip px-[18px] active:opacity-70">
                  <Text className="font-semibold text-[15px] text-textPrimary">{sortLabel}</Text>
                  <Text className="ml-[7px] text-[10px] text-textPrimary">▾</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>

        {hasServices ? (
          <>
            <View style={{ marginTop: layout.servicesGap }}>
              <ProviderFilter
                providers={myProviders.providers}
                activeIds={activeIds}
                onToggle={toggleProvider}
                onReset={() => setExcluded([])}
                inset={inset}
              />
            </View>
            <View style={{ marginTop: layout.genresGap }}>
              <GenreChips value={genreKey} onChange={setGenreKey} inset={inset} />
            </View>
            {isTablet ? null : (
              <View
                className="flex-row items-center justify-between"
                style={{ marginTop: layout.countGap, height: layout.countHeight, paddingHorizontal: inset }}>
                <View>{countText}</View>
                <Pressable
                  onPress={pickSort}
                  accessibilityRole="button"
                  accessibilityLabel={strings.browse.sortTitle}
                  className="active:opacity-70">
                  <Text className="text-[14px] text-textSecondary">{sortLabel}</Text>
                </Pressable>
              </View>
            )}
          </>
        ) : null}

        <View style={{ marginTop: layout.gridTop }}>{body}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
