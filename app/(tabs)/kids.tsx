import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgeChip } from '@/components/AgeChip';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { KidsThemeChips } from '@/components/KidsThemeChips';
import { KidsTitleCard } from '@/components/KidsTitleCard';
import { MatureHiddenBadge } from '@/components/MatureHiddenBadge';
import { PosterGrid } from '@/components/PosterGrid';
import { SectionHeader } from '@/components/SectionHeader';
import { strings } from '@/constants/strings';
import { colors, kidsAccents, kidsLayout, TABLET_MIN_WIDTH } from '@/constants/theme';
import { kidsAgeLimits } from '@/data/kidsAgeLimits';
import { kidsThemes, type KidsThemeKey } from '@/data/kidsThemes';
import { useKidsTitles } from '@/hooks/useKidsTitles';
import { titleHref } from '@/lib/routes';
import { useSettingsStore } from '@/store/useSettingsStore';

// Ennyi képpontra az alsó széltől kér a lista újabb oldalt.
const LOAD_MORE_DISTANCE = 600;

export default function KidsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const layout = kidsLayout[isTablet ? 'tablet' : 'phone'];

  const ageLimit = useSettingsStore((state) => state.kidsAgeLimit);
  const setAgeLimit = useSettingsStore((state) => state.setKidsAgeLimit);
  const hideMature = useSettingsStore((state) => state.hideMature);
  const [themeKey, setThemeKey] = useState<KidsThemeKey>();
  const theme = kidsThemes.find((t) => t.key === themeKey);
  // Ha a „Felnőtt tartalom elrejtése” ki van kapcsolva, nincs korhatár-szűrés, badge és chip (D-049).
  const { titles, loading, loadingMore, error, loadMore, retry } = useKidsTitles(
    hideMature ? ageLimit : null,
    theme,
  );

  const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
    if (contentOffset.y + layoutMeasurement.height >= contentSize.height - LOAD_MORE_DISTANCE) {
      loadMore();
    }
  };

  const ageChips = (
    <View className="flex-row gap-3" style={{ marginTop: layout.ageChipsTop }}>
      {kidsAgeLimits.map((limit) => (
        <AgeChip
          key={limit}
          limit={limit}
          selected={limit === ageLimit}
          onPress={() => setAgeLimit(limit)}
        />
      ))}
    </View>
  );

  let body;
  if (loading) {
    body = <PosterGrid kids data={[]} loading keyExtractor={() => ''} renderCard={() => <View />} />;
  } else if (error) {
    body = <ErrorState onRetry={retry} />;
  } else if (titles.length === 0) {
    body = <EmptyState />;
  } else {
    body = (
      <>
        <PosterGrid
          kids
          data={titles}
          keyExtractor={(item) => item.key}
          renderCard={(item, cardWidth) => (
            <KidsTitleCard
              title={item.title}
              posterPath={item.posterPath}
              accent={kidsAccents[titles.indexOf(item) % kidsAccents.length]}
              width={cardWidth}
              onPress={() => router.push(titleHref(item.type, item.id))}
            />
          )}
        />
        {loadingMore ? (
          <View className="items-center py-6">
            <ActivityIndicator color={colors.textSecondary} />
          </View>
        ) : null}
      </>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        onScroll={onScroll}
        scrollEventThrottle={100}>
        <View style={{ paddingHorizontal: layout.inset, paddingTop: layout.barTop }}>
          <View className="flex-row justify-between">
            <View className={isTablet ? undefined : 'flex-1'}>
              <View className="justify-center" style={{ minHeight: layout.barHeight }}>
                <Text
                  className={`font-extrabold leading-[44px] text-textPrimary ${
                    isTablet ? 'text-kidsTitleTablet' : 'text-kidsTitle'
                  }`}>
                  {strings.kids.title}
                </Text>
              </View>
              {hideMature ? (
                <View style={{ marginTop: layout.badgeGap }}>
                  <MatureHiddenBadge width={layout.badgeWidth} />
                </View>
              ) : null}
              {isTablet || !hideMature ? null : (
                <View style={{ marginTop: layout.ageChipsGap }}>{ageChips}</View>
              )}
            </View>
            {isTablet && hideMature ? ageChips : null}
          </View>
        </View>

        <View style={{ marginTop: layout.themesGap }}>
          <KidsThemeChips value={themeKey} onChange={setThemeKey} inset={layout.inset} />
        </View>

        <View style={{ marginTop: layout.headingGap, paddingHorizontal: layout.inset }}>
          <SectionHeader title={strings.kids.bigAdventures} />
        </View>

        <View style={{ marginTop: layout.gridTop }}>{body}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
