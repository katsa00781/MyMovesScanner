import { Text, View } from 'react-native';

import { strings } from '@/constants/strings';

// Telefonon balra zárt „n. lépés” + cím; tableten középre igazított márkanév + cím.
export function OnboardingHeader({ isTablet }: { isTablet: boolean }) {
  if (isTablet) {
    return (
      <View className="mb-9 items-center">
        <View className="flex-row items-center gap-2">
          <View className="h-[10px] w-[10px] rounded-pill bg-accent" />
          <Text className="font-nunito-bold text-[18px] text-textPrimary">{strings.appName}</Text>
        </View>
        <Text className="mt-3 text-center font-nunito-extrabold text-[48px] leading-[54px] text-textPrimary">
          {strings.onboarding.title}
        </Text>
        <Text className="mt-3 max-w-[600px] text-center font-nunito text-[20px] leading-[28px] text-textSecondary">
          {strings.onboarding.subtitle}
        </Text>
      </View>
    );
  }

  return (
    <View className="mb-7">
      <Text className="font-nunito-extrabold text-[13px] tracking-widest text-accent">
        {strings.onboarding.step(1, 2)}
      </Text>
      <Text className="mt-1.5 font-nunito-extrabold text-title leading-[40px] text-textPrimary">
        {strings.onboarding.title}
      </Text>
      <Text className="mt-3 font-nunito text-[16px] leading-[23px] text-textSecondary">
        {strings.onboarding.subtitle}
      </Text>
    </View>
  );
}
