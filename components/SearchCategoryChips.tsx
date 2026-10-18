import { Pressable, ScrollView, Text } from 'react-native';

import { strings } from '@/constants/strings';
import type { SearchCategory } from '@/data/searchCategories';

// A begépelt szóra illeszkedő kategóriák (D-048): vízszintesen görgethető chip-sor, gyorsválasztás
// a Műfaj / Téma select mellé (D-056). A kategória narancs árnyalatú, mint az „A szolgáltatóidon”
// jelzés; a kijelölt fehér, mint a szűrők.
export function SearchCategoryChips({
  categories,
  selectedKeys,
  onToggle,
  inset,
}: {
  categories: SearchCategory[];
  selectedKeys: readonly string[];
  /** Koppintásra kijelöli, a kijelöltre újra koppintva kikapcsolja. */
  onToggle: (category: SearchCategory) => void;
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
        const selected = selectedKeys.includes(category.key);
        return (
          <Pressable
            key={category.key}
            onPress={() => onToggle(category)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
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
