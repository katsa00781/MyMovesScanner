import { Text, View } from 'react-native';

import { strings } from '@/constants/strings';

// Üres lista (érvényes eredmény, nincs újrapróbálás); a hibához lásd: ErrorState.
export function EmptyState({ message = strings.common.empty }: { message?: string }) {
  return (
    <View className="items-center py-12">
      <Text className="text-center font-semibold text-[16px] text-textSecondary">{message}</Text>
    </View>
  );
}
