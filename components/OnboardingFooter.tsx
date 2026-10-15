import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { strings } from '@/constants/strings';
import { colors } from '@/constants/theme';

function RegionLabel() {
  return (
    <View className="flex-row items-center gap-[6px]">
      <SymbolView name="globe" size={16} tintColor={colors.textSecondary} />
      <Text className="text-[14px] text-textSecondary">{strings.onboarding.region}</Text>
    </View>
  );
}

function SkipButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={12} className="active:opacity-60">
      <Text className="font-semibold text-[16px] text-textPrimary">
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
        className={`items-center justify-center rounded-button bg-accent px-4 active:opacity-80 ${
          isTablet ? 'h-[58px] w-[396px]' : 'h-[56px] w-full'
        } ${disabled ? 'opacity-40' : ''}`}>
        <Text className="font-bold text-[17px] text-ctaText">
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
