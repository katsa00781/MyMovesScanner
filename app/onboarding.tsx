import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AgeChip } from '@/components/AgeChip';
import { ErrorState } from '@/components/ErrorState';
import { OnboardingFooter } from '@/components/OnboardingFooter';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { ProviderCard, ProviderCardSkeleton } from '@/components/ProviderCard';
import { strings } from '@/constants/strings';
import { colors, TABLET_MIN_WIDTH } from '@/constants/theme';
import { type KidsAgeLimit, kidsAgeLimits } from '@/data/kidsAgeLimits';
import { useProviders } from '@/hooks/useProviders';
import { useProvidersStore } from '@/store/useProvidersStore';
import { useSettingsStore } from '@/store/useSettingsStore';

// Design (01, 09): telefonon 2, tableten 4 oszlop; tableten a tartalom max. 880 széles.
const SIDE_PADDING = 21;
const TABLET_CONTENT_MAX_WIDTH = 880;
const SKELETON_ROWS = 3;

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;

  const savedIds = useProvidersStore((state) => state.selectedProviderIds);
  const saveProviders = useProvidersStore((state) => state.saveProviders);
  const completeOnboarding = useProvidersStore((state) => state.completeOnboarding);
  const savedAgeLimit = useSettingsStore((state) => state.kidsAgeLimit);
  const setKidsAgeLimit = useSettingsStore((state) => state.setKidsAgeLimit);
  const { providers, loading, error, retry } = useProviders();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedIds, setSelectedIds] = useState(savedIds);
  // Amíg nincs érintés, a mentett korhatár látszik (a store visszatöltése után is helyes).
  const [pickedAgeLimit, setPickedAgeLimit] = useState<KidsAgeLimit | null>(null);
  const ageLimit = pickedAgeLimit ?? savedAgeLimit;

  const columns = isTablet ? 4 : 2;
  const gap = isTablet ? 21 : 17;
  const cardHeight = isTablet ? 145 : 120;
  const contentWidth = Math.min(
    width - 2 * SIDE_PADDING,
    isTablet ? TABLET_CONTENT_MAX_WIDTH : Infinity,
  );
  const cardWidth = Math.floor((contentWidth - gap * (columns - 1)) / columns);

  function toggle(id: number) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  }

  // Az onboarding csak a 2. lépés végén (vagy a Kihagyomnál) zárul le (D-023); addig a
  // (tabs) őr ide irányít vissza, és az 1. lépés a mentett szolgáltatókkal indul.
  function continueFromProviders() {
    saveProviders(selectedIds);
    setStep(2);
  }

  function finish() {
    setKidsAgeLimit(ageLimit);
    skip();
  }

  function skip() {
    completeOnboarding();
    router.replace('/');
  }

  // Narancs fény a tetején, a design háttere. Nincs külön gradiens könyvtár: a RN saját
  // radial-gradient stílusa; a sugarak a PNG-ből kiolvasott kifutás.
  const glowStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 460,
    experimental_backgroundImage: `radial-gradient(ellipse ${isTablet ? 550 : 250}px ${
      isTablet ? 360 : 310
    }px at 50% 40px, ${colors.accent}2B 0%, ${colors.accent}17 45%, ${colors.accent}00 100%)`,
  } as const;

  let content;
  if (step === 2) {
    // Nincs saját design: a Gyerek sarok korhatár-chipjei (04, 12) az onboarding stílusában.
    content = (
      <View
        accessibilityRole="radiogroup"
        className={`flex-row gap-3 ${isTablet ? 'justify-center' : ''}`}>
        {kidsAgeLimits.map((limit) => (
          <AgeChip
            key={limit}
            limit={limit}
            selected={limit === ageLimit}
            onPress={() => setPickedAgeLimit(limit)}
          />
        ))}
      </View>
    );
  } else if (error) {
    content = <ErrorState onRetry={retry} />;
  } else if (!loading && providers.length === 0) {
    content = <ErrorState message={strings.common.empty} onRetry={retry} />;
  } else {
    content = (
      <View className="flex-row flex-wrap" style={{ gap }}>
        {loading
          ? Array.from({ length: columns * SKELETON_ROWS }, (_, i) => (
              <ProviderCardSkeleton key={i} width={cardWidth} height={cardHeight} />
            ))
          : providers.map((provider) => (
              <ProviderCard
                key={provider.provider_id}
                provider={provider}
                selected={selectedIds.includes(provider.provider_id)}
                width={cardWidth}
                height={cardHeight}
                onPress={() => toggle(provider.provider_id)}
              />
            ))}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View pointerEvents="none" style={glowStyle} />
      {/* A key újraindítja a görgetést: a rövid 2. lépés ne örökölje az 1. lépés eltolását. */}
      <ScrollView
        key={step}
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: insets.top + (isTablet ? 80 : 14),
          paddingBottom: 24,
        }}>
        <View style={{ width: contentWidth }}>
          <OnboardingHeader step={step} isTablet={isTablet} />
          {content}
        </View>
      </ScrollView>
      <OnboardingFooter
        label={
          step === 1 ? strings.onboarding.continueWith(selectedIds.length) : strings.onboarding.done
        }
        disabled={step === 1 && selectedIds.length === 0}
        isTablet={isTablet}
        onContinue={step === 1 ? continueFromProviders : finish}
        onSkip={skip}
      />
    </View>
  );
}
