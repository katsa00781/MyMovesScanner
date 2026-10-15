import { Pressable, ScrollView, Text } from 'react-native';

import { strings } from '@/constants/strings';
import { browseGenres, type GenreKey } from '@/data/browseGenres';

// Műfaj chipek a Böngészéshez (03, 11 design): vízszintesen görgethető sor, a kijelölt chip fehér.
export function GenreChips({
  value,
  onChange,
  inset,
}: {
  value: GenreKey;
  onChange: (key: GenreKey) => void;
  /** Oldalsó margó: a sor a képernyő széléig görgethető, a tartalom a margótól indul. */
  inset: number;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2"
      contentContainerStyle={{ paddingHorizontal: inset }}>
      {browseGenres.map(({ key }) => {
        const selected = key === value;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            className={`h-[38px] items-center justify-center rounded-pill px-[17px] active:opacity-70 ${
              selected ? 'bg-textPrimary' : 'bg-chip'
            }`}>
            <Text
              className={`font-semibold text-[16px] ${selected ? 'text-background' : 'text-textPrimary'}`}>
              {strings.browse.genres[key]}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
