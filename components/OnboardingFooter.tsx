import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { strings } from '@/constants/strings';
import { colors } from '@/constants/theme';

function RegionLabel() {
  return (
    <View className="flex-row items-center gap-[6px]">
      <SymbolView name="globe" size={16} tintColor={colors.textSecondary} />
      <Text className="font-nunito text-[14px] text-textSecondary">{strings.onboarding.region}</Text>
    </View>
  );
}

function SkipButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={12} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      <Text className="font-nunito-semibold text-[16px] text-textPrimary">
        {strings.onboarding.skip}
      </Text>
    </Pressable>
  );
}

// Fix lábléc a lista alatt. Telefonon: régió, CTA, kihagyás egymás alatt;
// tableten: keskeny CTA, alatta egy sorban a régió és a kihagyás.
export function OnboardingFooter({
  count,
  isTablet,
  onContinue,
  onSkip,
}: {
  count: number;
  isTablet: boolean;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const insets = useSafeAreaInsets();
  const disabled = count === 0;

  return (
    <View className="items-center px-[21px] pt-3" style={{ paddingBottom: insets.bottom + 16 }}>
      {isTablet ? null : (
        <View className="mb-3">
          <RegionLabel />
        </View>
      )}
      <Pressable
        onPress={onContinue}
        disabled={disabled}
        accessibilityRole="button"
        className="items-center justify-center rounded-button bg-accent"
        style={({ pressed }) => ({
          width: isTablet ? 396 : '100%',
          height: isTablet ? 58 : 56,
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
        })}>
        <Text className="font-nunito-bold text-[17px] text-ctaText">
          {strings.onboarding.continueWith(count)}
        </Text>
      </Pressable>
      {isTablet ? (
        <View className="mt-6 flex-row items-center gap-[19px]">
          <RegionLabel />
          <SkipButton onPress={onSkip} />
        </View>
      ) : (
        <View className="mt-[26px]">
          <SkipButton onPress={onSkip} />
        </View>
      )}
    </View>
  );
}
