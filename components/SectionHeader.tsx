import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors } from '@/constants/theme';

// Szekciócím (22 pt) jobbra az „Összes >” hivatkozással, ha van `onSeeAll`.
// A vízszintes margót a használó adja (a rail a képernyő margójához igazít).
export function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text numberOfLines={1} className="min-w-0 shrink font-bold text-section leading-[28px] text-textPrimary">
        {title}
      </Text>
      {onSeeAll ? (
        <Pressable
          onPress={onSeeAll}
          hitSlop={12}
          accessibilityRole="button"
          className="flex-row items-center gap-[5px] active:opacity-60">
          <Text className="text-[15px] text-textSecondary">{strings.common.seeAll}</Text>
          <SymbolView name="chevron.right" size={12} weight="semibold" tintColor={colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}
