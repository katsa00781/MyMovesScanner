import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ErrorState';
import { OnboardingFooter } from '@/components/OnboardingFooter';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { ProviderCard, ProviderCardSkeleton } from '@/components/ProviderCard';
import { strings } from '@/constants/strings';
import { colors, TABLET_MIN_WIDTH } from '@/constants/theme';
import { useProviders } from '@/hooks/useProviders';
import { useProvidersStore } from '@/store/useProvidersStore';

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
  const { providers, loading, error, retry } = useProviders();
  const [selectedIds, setSelectedIds] = useState(savedIds);

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

  // A 2. lépés (Kids korhatár) külön feladat; addig a folytatás itt zárja le az onboardingot.
  function finish(ids: number[]) {
    saveProviders(ids);
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
  if (error) {
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
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: insets.top + (isTablet ? 80 : 14),
          paddingBottom: 24,
        }}>
        <View style={{ width: contentWidth }}>
          <OnboardingHeader isTablet={isTablet} />
          {content}
        </View>
      </ScrollView>
      <OnboardingFooter
        count={selectedIds.length}
        isTablet={isTablet}
        onContinue={() => finish(selectedIds)}
        onSkip={() => finish(savedIds)}
      />
    </View>
  );
}
