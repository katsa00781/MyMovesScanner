import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors } from '@/constants/theme';
import { formatFullDate } from '@/lib/format';
import type { DiscRelease } from '@/types/app';

// „Lemezen” kártya (06, 14 design): formátum, „Megjelenés Magyarországon · dátum” (DE adatnál
// „Német megjelenés”), és az „Emlékeztess” gomb, ami a címet a watchlistre teszi (D-013).
export function DiscCard({
  disc,
  watchlisted,
  onRemind,
}: {
  disc: DiscRelease;
  watchlisted: boolean;
  onRemind: () => void;
}) {
  const where = disc.region === 'HU' ? strings.title.releaseInHungary : strings.home.germanRelease;
  return (
    <View className="min-h-[86px] flex-row items-center gap-[15px] rounded-cardLarge bg-surface px-4 py-4">
      <View className="h-[50px] w-[50px] items-center justify-center rounded-[12px] bg-disc">
        <SymbolView name="opticaldisc" size={26} tintColor={colors.textPrimary} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="font-semibold text-[17px] leading-[21px] text-textPrimary">
          {disc.formats}
        </Text>
        <Text className="text-[14px] leading-[16px] text-textSecondary">
          {`${where} · ${formatFullDate(disc.date)}`}
        </Text>
      </View>
      <Pressable
        onPress={onRemind}
        disabled={watchlisted}
        accessibilityRole="button"
        className="h-[35px] flex-row items-center justify-center gap-[7px] rounded-pill bg-chip px-[14px] active:opacity-70">
        <SymbolView
          name={watchlisted ? 'checkmark' : 'bell'}
          size={14}
          weight="semibold"
          tintColor={watchlisted ? colors.accent : colors.textPrimary}
        />
        <Text className="font-semibold text-[15px] text-textPrimary">
          {watchlisted ? strings.title.onWatchlist : strings.title.remindMe}
        </Text>
      </Pressable>
    </View>
  );
}
