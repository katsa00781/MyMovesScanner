import { useRouter } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { Keyboard, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { RecentChips, RecentList } from '@/components/RecentSearches';
import { SearchCategoryChips } from '@/components/SearchCategoryChips';
import { SearchField } from '@/components/SearchField';
import { ScreenTitle } from '@/components/ScreenTitle';
import { SearchFilterChips } from '@/components/SearchFilterChips';
import { SearchResultRow, SearchResultSkeleton } from '@/components/SearchResultRow';
import { strings } from '@/constants/strings';
import { browseLayout, layout, searchLayout, TABLET_MIN_WIDTH } from '@/constants/theme';
import type { SearchCategory } from '@/data/searchCategories';
import type { SearchFilter } from '@/data/searchFilters';
import { useSearch } from '@/hooks/useSearch';
import { titleHref } from '@/lib/routes';
import { matchCategories } from '@/lib/searchCategories';
import { useSearchStore } from '@/store/useSearchStore';
import type { SearchResult } from '@/types/app';

const SKELETON_ROWS = 5;

export default function SearchScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const mode = isTablet ? 'tablet' : 'phone';
  const spec = searchLayout[mode];
  const bar = browseLayout[mode];
  // Széles iPaden a Legutóbbiak külön oszlopba kerülnek; álló iPaden egy oszlop, mint a telefonon.
  const twoColumns = isTablet && width - layout.sidebarWidth >= searchLayout.tablet.twoColumnsMin;

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilter>('all');
  // A begépelt szóra illeszkedő kategóriák (D-048) és a kiválasztott; a Személyek szűrőnél nincs kategória.
  const [category, setCategory] = useState<SearchCategory>();
  const matches = useMemo(() => (filter === 'people' ? [] : matchCategories(query)), [query, filter]);
  const activeCategory = filter === 'people' ? undefined : category;
  const search = useSearch(query, filter, activeCategory);
  const { recentSearches, add, remove, clear } = useSearchStore();

  // A szöveg módosítása (törlés is) kikapcsolja a kategóriát: újra a szöveges keresés érvényes.
  const changeQuery = (text: string) => {
    setQuery(text);
    setCategory(undefined);
  };
  const pickCategory = (picked: SearchCategory | undefined) => {
    setCategory(picked);
    if (picked) add(query);
  };
  const pickRecent = (text: string) => {
    changeQuery(text);
    add(text);
  };
  const cancel = () => {
    changeQuery('');
    setFilter('all');
    Keyboard.dismiss();
  };
  const openTitle = (result: SearchResult) => {
    if (result.type === 'person') return;
    add(query);
    router.push(titleHref(result.type, result.id));
  };

  let results: ReactNode;
  if (!search.active) {
    results = <EmptyState message={strings.search.hint} />;
  } else if (search.error) {
    results = <ErrorState onRetry={search.retry} />;
  } else if (search.loading) {
    results = Array.from({ length: SKELETON_ROWS }, (_, i) => (
      <SearchResultSkeleton key={i} isTablet={isTablet} />
    ));
  } else if (search.empty) {
    results = <EmptyState />;
  } else {
    results = search.rows.map((row, index) => (
      <SearchResultRow
        key={row.result.key}
        row={row}
        isTablet={isTablet}
        last={index === search.rows.length - 1}
        onPress={() => openTitle(row.result)}
      />
    ));
  }

  const hasRecent = recentSearches.length > 0;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <View style={{ paddingHorizontal: spec.inset, paddingTop: bar.barTop }}>
          <View className="justify-center" style={{ minHeight: bar.barHeight }}>
            <ScreenTitle>{strings.search.title}</ScreenTitle>
          </View>
        </View>

        <View style={{ marginTop: spec.fieldGap, paddingHorizontal: spec.inset }}>
          <SearchField
            value={query}
            onChangeText={changeQuery}
            onSubmit={() => add(query)}
            onCancel={cancel}
            isTablet={isTablet}
          />
        </View>

        {twoColumns ? (
          <View
            className="flex-row"
            style={{
              marginTop: searchLayout.tablet.columnsTop,
              paddingHorizontal: spec.inset,
              columnGap: searchLayout.tablet.columnGap,
            }}>
            <View style={{ width: searchLayout.tablet.recentWidth }}>
              <RecentList
                searches={recentSearches}
                onPick={pickRecent}
                onRemove={remove}
                onClear={clear}
              />
            </View>
            <View className="min-w-0 flex-1">
              <View className="min-h-[36px] flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3">
                {search.active ? (
                  <Text
                    numberOfLines={1}
                    className="max-w-full shrink font-bold text-section text-textPrimary">
                    {strings.search.resultsFor(
                      activeCategory
                        ? strings.search.categories[activeCategory.key as keyof typeof strings.search.categories]
                        : search.term,
                    )}
                  </Text>
                ) : null}
                <View className="ml-auto">
                  <SearchFilterChips value={filter} onChange={setFilter} isTablet={isTablet} />
                </View>
              </View>
              {matches.length > 0 ? (
                <View style={{ marginTop: searchLayout.tablet.columnResultsTop }}>
                  <SearchCategoryChips
                    categories={matches}
                    selectedKey={activeCategory?.key}
                    onSelect={pickCategory}
                    inset={0}
                  />
                </View>
              ) : null}
              <View style={{ marginTop: searchLayout.tablet.columnResultsTop }}>{results}</View>
            </View>
          </View>
        ) : (
          <>
            {matches.length > 0 ? (
              <View style={{ marginTop: spec.recentGap }}>
                <SearchCategoryChips
                  categories={matches}
                  selectedKey={activeCategory?.key}
                  onSelect={pickCategory}
                  inset={spec.inset}
                />
              </View>
            ) : null}
            {hasRecent ? (
              <View style={{ marginTop: spec.recentGap }}>
                <RecentChips
                  searches={recentSearches}
                  onPick={pickRecent}
                  onClear={clear}
                  inset={spec.inset}
                />
              </View>
            ) : null}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={{ flexGrow: 0, marginTop: hasRecent ? spec.filterGap : spec.recentGap }}
              contentContainerStyle={{ paddingHorizontal: spec.inset }}>
              <SearchFilterChips value={filter} onChange={setFilter} isTablet={isTablet} />
            </ScrollView>
            <View style={{ marginTop: spec.resultsTop, paddingHorizontal: spec.inset }}>{results}</View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
