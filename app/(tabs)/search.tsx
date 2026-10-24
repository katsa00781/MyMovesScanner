import { useRouter } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { Keyboard, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { HiddenResults } from '@/components/HiddenResults';
import { RecentChips, RecentList } from '@/components/RecentSearches';
import { SearchCategoryChips } from '@/components/SearchCategoryChips';
import { SearchField } from '@/components/SearchField';
import { SearchSelects } from '@/components/SearchSelects';
import { ScreenTitle } from '@/components/ScreenTitle';
import { SearchFilterChips } from '@/components/SearchFilterChips';
import { SearchResultRow, SearchResultSkeleton } from '@/components/SearchResultRow';
import { strings } from '@/constants/strings';
import { browseLayout, layout, searchLayout, TABLET_MIN_WIDTH } from '@/constants/theme';
import { defaultResultFilters, noResultFilters, type ResultFilters } from '@/data/resultFilters';
import type { SearchCategory } from '@/data/searchCategories';
import type { SearchFilter } from '@/data/searchFilters';
import { useSearch } from '@/hooks/useSearch';
import { isNarrowed, resolveFilters } from '@/lib/resultFilters';
import { titleHref } from '@/lib/routes';
import { isTheme, matchCategories, noSelection, type CategorySelection } from '@/lib/searchCategories';
import { useProvidersStore } from '@/store/useProvidersStore';
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
  // A begépelt szóra illeszkedő kategóriák (D-048) és a kiválasztottak (D-056): műfajok („és”
  // kapcsolattal) és egy téma. A Személyek szűrőnél nincs kategória.
  const [genres, setGenres] = useState<SearchCategory[]>([]);
  const [theme, setTheme] = useState<SearchCategory>();
  const matches = useMemo(() => (filter === 'people' ? [] : matchCategories(query)), [query, filter]);
  const selection = useMemo<CategorySelection>(
    () => (filter === 'people' ? noSelection : { genres, theme }),
    [filter, genres, theme],
  );
  // A találati lista szűrői (D-057); a Személyek szűrőnél nincs szűrés. Az elérhetőség az éppen
  // kiválasztott szolgáltatókhoz igazodik (a Beállításokban módosíthatók).
  const [pickedFilters, setPickedFilters] = useState<ResultFilters>(defaultResultFilters);
  const providerIds = useProvidersStore((state) => state.selectedProviderIds);
  const filters = useMemo(
    () => (filter === 'people' ? noResultFilters : resolveFilters(pickedFilters, providerIds)),
    [filter, pickedFilters, providerIds],
  );
  const search = useSearch(query, filter, selection, filters);
  const { recentSearches, add, remove, clear } = useSearchStore();
  const selectedKeys = [...selection.genres, ...(selection.theme ? [selection.theme] : [])].map(
    (category) => category.key,
  );
  const selectionLabel = [...selection.genres, ...(selection.theme ? [selection.theme] : [])]
    .map((category) => strings.search.categories[category.key as keyof typeof strings.search.categories])
    .join(' · ');

  // A szöveg módosítása (törlés is) kiüríti a kategóriákat: újra a szöveges keresés érvényes.
  const changeQuery = (text: string) => {
    setQuery(text);
    setGenres([]);
    setTheme(undefined);
  };
  // A begépelt szóra illeszkedő chip: ugyanazt a kiválasztást kapcsolja, mint a select.
  const toggleCategory = (picked: SearchCategory) => {
    if (isTheme(picked)) {
      setTheme(theme?.key === picked.key ? undefined : picked);
    } else {
      setGenres(
        genres.some((genre) => genre.key === picked.key)
          ? genres.filter((genre) => genre.key !== picked.key)
          : [...genres, picked],
      );
    }
    if (!selectedKeys.includes(picked.key)) add(query);
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
  } else if (search.empty && search.hidden === 0) {
    results = <EmptyState message={isNarrowed(filters) ? strings.search.filters.noResults : undefined} />;
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
  // Szöveges keresésnél az elérhetőség miatt rejtett címek (pl. friss, még nem nézhető film) egy
  // koppintással előhozhatók.
  const hiddenNote =
    search.active && !search.error && !search.loading && search.hidden > 0 ? (
      <HiddenResults
        count={search.hidden}
        onShowAll={() => setPickedFilters({ ...filters, availability: noResultFilters.availability })}
      />
    ) : null;

  const hasRecent = recentSearches.length > 0;

  // Select sor (D-056, D-057): a Személyek szűrőnél nincs kategória és szűrés, ezért rejtett.
  const selects = (inset: number) =>
    filter === 'people' ? null : (
      <SearchSelects
        genres={genres}
        onGenres={setGenres}
        theme={theme}
        onTheme={setTheme}
        filters={filters}
        onFilters={setPickedFilters}
        isTablet={isTablet}
        inset={inset}
      />
    );

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
                    {strings.search.resultsFor(selectionLabel || search.term)}
                  </Text>
                ) : null}
                <View className="ml-auto">
                  <SearchFilterChips value={filter} onChange={setFilter} isTablet={isTablet} />
                </View>
              </View>
              {filter === 'people' ? null : (
                <View style={{ marginTop: searchLayout.tablet.columnResultsTop }}>{selects(0)}</View>
              )}
              {matches.length > 0 ? (
                <View style={{ marginTop: searchLayout.tablet.columnResultsTop }}>
                  <SearchCategoryChips
                    categories={matches}
                    selectedKeys={selectedKeys}
                    onToggle={toggleCategory}
                    inset={0}
                  />
                </View>
              ) : null}
              <View style={{ marginTop: searchLayout.tablet.columnResultsTop }}>
                {results}
                {hiddenNote}
              </View>
            </View>
          </View>
        ) : (
          <>
            {matches.length > 0 ? (
              <View style={{ marginTop: spec.recentGap }}>
                <SearchCategoryChips
                  categories={matches}
                  selectedKeys={selectedKeys}
                  onToggle={toggleCategory}
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
            {filter === 'people' ? null : (
              <View style={{ marginTop: spec.selectTop }}>{selects(spec.inset)}</View>
            )}
            <View style={{ marginTop: spec.resultsTop, paddingHorizontal: spec.inset }}>
              {results}
              {hiddenNote}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
