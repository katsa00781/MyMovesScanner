import { useMemo } from 'react';
import { ScrollView } from 'react-native';

import { FilterSelect, type SelectOption } from '@/components/FilterSelect';
import { strings } from '@/constants/strings';
import {
  defaultResultFilters,
  providerAvailability,
  ratingOptions,
  type ResultFilters,
  sinceOptions,
} from '@/data/resultFilters';
import { searchCategories, type SearchCategory } from '@/data/searchCategories';
import { useMyProviders } from '@/hooks/useMyProviders';
import { isTheme } from '@/lib/searchCategories';

const categoryLabel = (category: SearchCategory) =>
  strings.search.categories[category.key as keyof typeof strings.search.categories];

const toOption = (category: SearchCategory): SelectOption => ({
  key: category.key,
  label: categoryLabel(category),
});

// Ábécé szerint (magyar rendezéssel).
const byLabel = (a: SelectOption, b: SelectOption) => a.label.localeCompare(b.label, 'hu');
const genreOptions = searchCategories.filter((category) => !isTheme(category)).map(toOption).sort(byLabel);
const themeOptions = searchCategories.filter(isTheme).map(toOption).sort(byLabel);

const ratingSelectOptions = ratingOptions.map((n) => ({
  key: String(n),
  label: n === 0 ? strings.search.filters.rating.any : `${n}+`,
}));
const sinceSelectOptions = sinceOptions.map((n) => ({
  key: String(n),
  label: n === 0 ? strings.search.filters.since.any : strings.search.filters.since.years(n),
}));

// A Keresés select sora (D-056, D-057): Műfaj és Téma (kategóriák), Elérhetőség, Értékelés,
// Megjelenés (a találati lista szűrői). Vízszintesen görgethető, mint a szűrő chipek.
export function SearchSelects({
  genres,
  onGenres,
  theme,
  onTheme,
  filters,
  onFilters,
  isTablet,
  inset,
}: {
  genres: readonly SearchCategory[];
  onGenres: (next: SearchCategory[]) => void;
  theme: SearchCategory | undefined;
  onTheme: (next: SearchCategory | undefined) => void;
  /** Az érvényesített szűrők (`resolveFilters`). */
  filters: ResultFilters;
  onFilters: (next: ResultFilters) => void;
  isTablet: boolean;
  inset: number;
}) {
  const { providers } = useMyProviders();
  const labels = strings.search.filters.availability;
  const availabilityOptions = useMemo<SelectOption[]>(
    () => [
      { key: 'hu', label: labels.hu },
      ...(providers.length > 0 ? [{ key: 'mine', label: labels.mine }] : []),
      ...providers.map((provider) => ({
        key: providerAvailability(provider.provider_id),
        label: provider.provider_name,
      })),
      { key: 'all', label: labels.all },
    ],
    [providers, labels],
  );
  const findCategory = (key: string) => searchCategories.find((category) => category.key === key);
  const availabilityLabel = availabilityOptions.find((option) => option.key === filters.availability)?.label;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={{ flexGrow: 0 }}
      contentContainerClassName="gap-2"
      contentContainerStyle={{ paddingHorizontal: inset }}>
      <FilterSelect
        title={strings.search.select.genre}
        hint={strings.search.select.genreHint}
        options={genreOptions}
        selectedKeys={genres.map((genre) => genre.key)}
        multiple
        onChange={(keys) => onGenres(keys.flatMap((key) => findCategory(key) ?? []))}
        isTablet={isTablet}
      />
      <FilterSelect
        title={strings.search.select.theme}
        hint={strings.search.select.themeHint}
        options={themeOptions}
        selectedKeys={theme ? [theme.key] : []}
        onChange={(keys) => onTheme(keys[0] ? findCategory(keys[0]) : undefined)}
        isTablet={isTablet}
      />
      <FilterSelect
        title={labels.title}
        hint={labels.hint}
        options={availabilityOptions}
        selectedKeys={[filters.availability]}
        required
        summary={availabilityLabel}
        active={filters.availability !== defaultResultFilters.availability}
        onChange={(keys) => onFilters({ ...filters, availability: keys[0] ?? defaultResultFilters.availability })}
        isTablet={isTablet}
      />
      <FilterSelect
        title={strings.search.filters.rating.title}
        hint={strings.search.filters.rating.hint}
        options={ratingSelectOptions}
        selectedKeys={[String(filters.minRating)]}
        required
        summary={
          filters.minRating > 0
            ? `${strings.search.filters.rating.title} ${filters.minRating}+`
            : strings.search.filters.rating.title
        }
        active={filters.minRating > 0}
        onChange={(keys) => onFilters({ ...filters, minRating: Number(keys[0] ?? 0) })}
        isTablet={isTablet}
      />
      <FilterSelect
        title={strings.search.filters.since.title}
        hint={strings.search.filters.since.hint}
        options={sinceSelectOptions}
        selectedKeys={[String(filters.sinceYears)]}
        required
        summary={
          filters.sinceYears > 0
            ? strings.search.filters.since.years(filters.sinceYears)
            : strings.search.filters.since.title
        }
        active={filters.sinceYears > 0}
        onChange={(keys) => onFilters({ ...filters, sinceYears: Number(keys[0] ?? 0) })}
        isTablet={isTablet}
      />
    </ScrollView>
  );
}
