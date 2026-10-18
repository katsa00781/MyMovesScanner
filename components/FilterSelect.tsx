import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors } from '@/constants/theme';

export type SelectOption = { key: string; label: string };

// Select a Keresés szűrőihez (D-056, D-057): a gomb a kiválasztottat mutatja, koppintásra lapként
// nyíló lista, pipával a kijelölteken. `multiple`: több is kijelölhető (a Műfajnál, „és”
// kapcsolattal), egyébként a választás után a lap bezárul, és az újabb választás cserél.
// `required`: mindig van kiválasztott elem (nincs „Törlés”, a kijelöltre koppintás csak bezár).
// `active`: a gomb narancs árnyalatú, ha a szűrő eltér az alapértéktől.
// Nincs hozzá design: a Böngészés rendezés-gombja és a Beállítások sorai a minta (D-056).
export function FilterSelect({
  title,
  hint,
  options,
  selectedKeys,
  multiple = false,
  required = false,
  summary,
  active = selectedKeys.length > 0,
  onChange,
  isTablet,
}: {
  title: string;
  hint: string;
  options: readonly SelectOption[];
  selectedKeys: readonly string[];
  multiple?: boolean;
  required?: boolean;
  /** A gomb felirata; alapból a kiválasztott felirata (több esetén „első +n”), vagy a cím. */
  summary?: string;
  active?: boolean;
  onChange: (keys: string[]) => void;
  isTablet: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selectedLabels = options.filter((option) => selectedKeys.includes(option.key)).map((o) => o.label);
  const text =
    summary ??
    (selectedLabels.length === 0
      ? title
      : selectedLabels.length > 1
        ? `${selectedLabels[0]} +${selectedLabels.length - 1}`
        : selectedLabels[0]);

  const toggle = (key: string) => {
    const isSelected = selectedKeys.includes(key);
    if (multiple) {
      onChange(isSelected ? selectedKeys.filter((item) => item !== key) : [...selectedKeys, key]);
      return;
    }
    onChange(isSelected && !required ? [] : [key]);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={text === title ? title : `${title}: ${text}`}
        className={`flex-row items-center rounded-pill px-4 active:opacity-70 ${
          isTablet ? 'h-[36px]' : 'h-[34px]'
        } ${active ? 'bg-accent/15' : 'bg-chip'}`}>
        <Text
          numberOfLines={1}
          className={`max-w-[200px] font-semibold text-[16px] ${active ? 'text-accent' : 'text-textPrimary'}`}>
          {text}
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
              disabled={required || selectedKeys.length === 0}
              hitSlop={8}
              accessibilityRole="button"
              className={`active:opacity-60 ${required || selectedKeys.length === 0 ? 'opacity-0' : ''}`}>
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
            {options.map((option) => {
              const isSelected = selectedKeys.includes(option.key);
              return (
                <Pressable
                  key={option.key}
                  onPress={() => toggle(option.key)}
                  accessibilityRole={multiple ? 'checkbox' : 'radio'}
                  accessibilityState={multiple ? { checked: isSelected } : { selected: isSelected }}
                  className="min-h-[50px] flex-row items-center justify-between border-b border-separator px-5 active:opacity-60">
                  <Text className="flex-1 text-[17px] text-textPrimary">{option.label}</Text>
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
