import { Pressable, ScrollView, Text } from 'react-native';

import { strings } from '@/constants/strings';
import type { SearchCategory } from '@/data/searchCategories';

// A begépelt szóra illeszkedő kategóriák (D-048): vízszintesen görgethető chip-sor. A kategória
// narancs árnyalatú, mint az „A szolgáltatóidon” jelzés; a kijelölt fehér, mint a szűrők.
export function SearchCategoryChips({
  categories,
  selectedKey,
  onSelect,
  inset,
}: {
  categories: SearchCategory[];
  selectedKey: string | undefined;
  /** Ugyanarra újra koppintva `undefined`-ot ad: kikapcsolja. */
  onSelect: (category: SearchCategory | undefined) => void;
  inset: number;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={{ flexGrow: 0 }}
      contentContainerClassName="gap-2"
      contentContainerStyle={{ paddingHorizontal: inset }}>
      {categories.map((category) => {
        const selected = category.key === selectedKey;
        return (
          <Pressable
            key={category.key}
            onPress={() => onSelect(selected ? undefined : category)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            className={`h-[34px] items-center justify-center rounded-pill px-4 active:opacity-70 ${
              selected ? 'bg-textPrimary' : 'bg-accent/15'
            }`}>
            <Text className={`font-semibold text-[16px] ${selected ? 'text-ctaText' : 'text-accent'}`}>
              {strings.search.categories[category.key as keyof typeof strings.search.categories]}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
