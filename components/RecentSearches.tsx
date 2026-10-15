import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors, searchLayout } from '@/constants/theme';

type RecentProps = {
  searches: string[];
  onPick: (query: string) => void;
  onClear: () => void;
};

// Legutóbbi keresések telefonon (05 design): címke + „Törlés”, alatta vízszintesen görgethető
// chip-sor. A sor a margóig tart, a szélén a chip levágva marad, mint a designban.
export function RecentChips({ searches, onPick, onClear, inset }: RecentProps & { inset: number }) {
  return (
    <View style={{ paddingHorizontal: inset }}>
      <View className="h-[20px] flex-row items-center justify-between">
        <Text className="font-semibold text-[15px] text-textSecondary">{strings.search.recent}</Text>
        <Pressable onPress={onClear} hitSlop={8} className="px-[6px] active:opacity-70">
          <Text className="text-[15px] text-accent">{strings.common.clear}</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        className="mt-[17px]"
        contentContainerClassName="gap-2">
        {searches.map((query) => (
          <Pressable
            key={query}
            onPress={() => onPick(query)}
            accessibilityRole="button"
            className="h-[36px] flex-row items-center gap-2 rounded-pill bg-surface px-[13px] active:opacity-70">
            <SymbolView name="clock" size={14} tintColor={colors.textSecondary} />
            <Text className="font-medium text-[16px] text-textPrimary">{query}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// Legutóbbi keresések iPaden (13 design): bal oszlop, „Törlés” a fejlécben, soronként törlés-gomb.
export function RecentList({
  searches,
  onPick,
  onRemove,
  onClear,
}: RecentProps & { onRemove: (query: string) => void }) {
  return (
    <View>
      <View className="h-[36px] flex-row items-center justify-between">
        <Text className="font-bold text-section text-textPrimary">{strings.search.recentShort}</Text>
        {searches.length > 0 ? (
          <Pressable onPress={onClear} hitSlop={8} className="px-[6px] active:opacity-70">
            <Text className="text-[15px] text-accent">{strings.common.clear}</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={{ marginTop: searchLayout.tablet.recentListTop }}>
        {searches.length === 0 ? (
          <Text className="py-4 text-[16px] text-textSecondary">{strings.search.noRecent}</Text>
        ) : (
          searches.map((query) => (
            <View
              key={query}
              className="h-[50.5px] flex-row items-center border-b border-separator">
              <Pressable
                onPress={() => onPick(query)}
                accessibilityRole="button"
                className="h-full min-w-0 flex-1 flex-row items-center gap-4 active:opacity-70">
                <SymbolView name="clock" size={17} tintColor={colors.textSecondary} />
                <Text numberOfLines={1} className="min-w-0 flex-1 text-[17px] text-textPrimary">
                  {query}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onRemove(query)}
                accessibilityRole="button"
                accessibilityLabel={strings.search.removeRecent}
                className="mr-1 h-full w-9 items-center justify-center active:opacity-70">
                <SymbolView name="xmark" size={11} tintColor={colors.textSecondary} />
              </Pressable>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
