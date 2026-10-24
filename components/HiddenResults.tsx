import { Pressable, Text, View } from 'react-native';

import { strings } from '@/constants/strings';

// A Keresés listája alatt (vagy üres lista helyén): ennyi cím rejtve az Elérhetőség szűrő miatt,
// a gomb minden találatot mutat. A stílus az ErrorState-é.
export function HiddenResults({ count, onShowAll }: { count: number; onShowAll: () => void }) {
  return (
    <View className="items-center gap-4 py-8">
      <Text className="text-center font-semibold text-[16px] text-textSecondary">
        {strings.search.filters.hidden(count)}
      </Text>
      <Pressable onPress={onShowAll} className="rounded-pill bg-chip px-6 py-3 active:opacity-60">
        <Text className="font-bold text-[15px] text-textPrimary">{strings.search.filters.showAll}</Text>
      </Pressable>
    </View>
  );
}
