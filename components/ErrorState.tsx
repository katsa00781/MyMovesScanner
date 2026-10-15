import { Pressable, Text, View } from 'react-native';

import { strings } from '@/constants/strings';

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
      <Text className="text-center font-semibold text-[16px] text-textSecondary">
        {message}
      </Text>
      <Pressable
        onPress={onRetry}
        className="rounded-pill bg-chip px-6 py-3 active:opacity-60">
        <Text className="font-bold text-[15px] text-textPrimary">
          {strings.common.retry}
        </Text>
      </Pressable>
    </View>
  );
}
