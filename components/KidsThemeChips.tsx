import { Pressable, ScrollView, Text } from 'react-native';

import { strings } from '@/constants/strings';
import { kidsThemes, type KidsThemeKey } from '@/data/kidsThemes';

// Téma chipek a Gyerek sarokhoz (04, 12 design): vízszintesen görgethető sor. A kijelölt chip
// világoskék (mint a korhatár-chip), újra koppintva a téma kikapcsol.
export function KidsThemeChips({
  value,
  onChange,
  inset,
}: {
  value: KidsThemeKey | undefined;
  onChange: (key: KidsThemeKey | undefined) => void;
  /** Oldalsó margó: a sor a képernyő széléig görgethető, a tartalom a margótól indul. */
  inset: number;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-[10px]"
      contentContainerStyle={{ paddingHorizontal: inset }}>
      {kidsThemes.map(({ key }) => {
        const selected = key === value;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(selected ? undefined : key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            className={`h-[42px] items-center justify-center rounded-pill px-[18px] active:opacity-70 ${
              selected ? 'bg-kidsBlue' : 'bg-chip'
            }`}>
            <Text
              className={`font-semibold text-[17px] ${selected ? 'text-ctaText' : 'text-textPrimary'}`}>
              {strings.kids.themes[key]}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
