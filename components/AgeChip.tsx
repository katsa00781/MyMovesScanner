import { Pressable, Text } from 'react-native';

import type { KidsAgeLimit } from '@/data/kidsAgeLimits';

// Korhatár-chip a Gyerek sarok designból (04, 12): sötét pill, kijelölve világoskék.
export function AgeChip({
  limit,
  selected,
  onPress,
}: {
  limit: KidsAgeLimit;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      className={`h-[44px] items-center justify-center rounded-pill px-[17px] active:opacity-70 ${
        selected ? 'bg-kidsBlue' : 'bg-chip'
      }`}>
      <Text className={`font-bold text-[18px] ${selected ? 'text-ctaText' : 'text-textPrimary'}`}>
        {limit}+
      </Text>
    </Pressable>
  );
}
