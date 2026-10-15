import { Pressable, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { searchFilters, type SearchFilter } from '@/data/searchFilters';

const labels: Record<SearchFilter, string> = {
  all: strings.common.all,
  films: strings.common.films,
  series: strings.common.seriesPlural,
  people: strings.common.people,
};

// Mind / Filmek / Sorozatok / Személyek (05, 13 design): a kijelölt chip fehér. A telefon
// 34, az iPad 36 px magas. A magyar feliratok együtt szélesebbek a telefonnál: a hívó
// vízszintesen görgethető sorba teheti.
export function SearchFilterChips({
  value,
  onChange,
  isTablet,
}: {
  value: SearchFilter;
  onChange: (filter: SearchFilter) => void;
  isTablet: boolean;
}) {
  return (
    <View className="flex-row gap-2">
      {searchFilters.map(({ key }) => {
        const selected = key === value;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            className={`items-center justify-center rounded-pill px-4 active:opacity-70 ${
              isTablet ? 'h-[36px]' : 'h-[34px]'
            } ${selected ? 'bg-textPrimary' : 'bg-chip'}`}>
            <Text
              className={`font-semibold text-[16px] ${selected ? 'text-ctaText' : 'text-textPrimary'}`}>
              {labels[key]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
