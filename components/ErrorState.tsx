import { Pressable, StyleSheet, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors, radius } from '@/constants/theme';

// A Pressable-n `style` függvény van (lenyomás), ezért nincs rajta className.
const styles = StyleSheet.create({
  retry: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.chip,
  },
});

// Hiba / üres állapot újrapróbálással, listákhoz.
export function ErrorState({
  message = strings.common.loadError,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <View className="items-center gap-4 py-12">
      <Text className="text-center font-nunito-semibold text-[16px] text-textSecondary">
        {message}
      </Text>
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [styles.retry, { opacity: pressed ? 0.6 : 1 }]}>
        <Text className="font-nunito-bold text-[15px] text-textPrimary">
          {strings.common.retry}
        </Text>
      </Pressable>
    </View>
  );
}
