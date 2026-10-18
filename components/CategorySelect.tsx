import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors } from '@/constants/theme';
import type { SearchCategory } from '@/data/searchCategories';

const label = (category: SearchCategory) =>
  strings.search.categories[category.key as keyof typeof strings.search.categories];

// Select a Keresés kategóriáihoz (D-056): a gomb a kiválasztottat mutatja, koppintásra lapként
// nyíló lista, pipával a kijelölteken. `multiple`: több is kijelölhető (a Műfajnál, „és”
// kapcsolattal), egyébként a választás után a lap bezárul, és az újabb választás cserél.
// Nincs hozzá design: a Böngészés rendezés-gombja és a Beállítások sorai a minta (D-056).
export function CategorySelect({
  title,
  hint,
  options,
  selected,
  multiple,
  onChange,
  isTablet,
}: {
  title: string;
  hint: string;
  options: readonly SearchCategory[];
  selected: readonly SearchCategory[];
  multiple: boolean;
  onChange: (next: SearchCategory[]) => void;
  isTablet: boolean;
}) {
  const [open, setOpen] = useState(false);
  const sorted = useMemo(
    () => [...options].sort((a, b) => label(a).localeCompare(label(b), 'hu')),
    [options],
  );
  const active = selected.length > 0;
  const summary = active
    ? selected.length > 1
      ? `${label(selected[0])} +${selected.length - 1}`
      : label(selected[0])
    : title;

  const toggle = (category: SearchCategory) => {
    const isSelected = selected.some((item) => item.key === category.key);
    if (multiple) {
      onChange(isSelected ? selected.filter((item) => item.key !== category.key) : [...selected, category]);
      return;
    }
    onChange(isSelected ? [] : [category]);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={active ? `${title}: ${summary}` : title}
        className={`flex-row items-center rounded-pill px-4 active:opacity-70 ${
          isTablet ? 'h-[36px]' : 'h-[34px]'
        } ${active ? 'bg-accent/15' : 'bg-chip'}`}>
        <Text
          numberOfLines={1}
          className={`max-w-[200px] font-semibold text-[16px] ${active ? 'text-accent' : 'text-textPrimary'}`}>
          {summary}
        </Text>
        <Text className={`ml-[7px] text-[10px] ${active ? 'text-accent' : 'text-textPrimary'}`}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setOpen(false)}>
        <View className="flex-1 bg-background">
          <View className="h-[56px] flex-row items-center justify-between border-b border-separator px-5">
            <Pressable
              onPress={() => onChange([])}
              disabled={!active}
              hitSlop={8}
              accessibilityRole="button"
              className={`active:opacity-60 ${active ? '' : 'opacity-0'}`}>
              <Text className="text-[17px] text-accent">{strings.common.clear}</Text>
            </Pressable>
            <Text className="font-bold text-[17px] text-textPrimary">{title}</Text>
            <Pressable
              onPress={() => setOpen(false)}
              hitSlop={8}
              accessibilityRole="button"
              className="active:opacity-60">
              <Text className="font-semibold text-[17px] text-accent">{strings.search.select.done}</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
            <Text className="px-5 pb-2 pt-3 text-[14px] text-textSecondary">{hint}</Text>
            {sorted.map((category) => {
              const isSelected = selected.some((item) => item.key === category.key);
              return (
                <Pressable
                  key={category.key}
                  onPress={() => toggle(category)}
                  accessibilityRole={multiple ? 'checkbox' : 'radio'}
                  accessibilityState={multiple ? { checked: isSelected } : { selected: isSelected }}
                  className="min-h-[50px] flex-row items-center justify-between border-b border-separator px-5 active:opacity-60">
                  <Text className="text-[17px] text-textPrimary">{label(category)}</Text>
                  {isSelected ? (
                    <SymbolView name="checkmark" size={17} weight="semibold" tintColor={colors.accent} />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
