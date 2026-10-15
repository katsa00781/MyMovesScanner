import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

import { strings } from '@/constants/strings';
import { colors, heroLayout, layout, TABLET_MIN_WIDTH } from '@/constants/theme';
import { backdropUrl, logoUrl } from '@/lib/tmdbImage';
import type { HeroItem } from '@/types/app';

type HeroCarouselProps = {
  items: HeroItem[];
  loading: boolean;
  onTrailer: (item: HeroItem) => void;
  onToggleWatchlist: (item: HeroItem) => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
};

// Hero a 02 / 10 designból: teljes szélességű backdrop-lapozó, rajta a szolgáltató („ÚJ A …”),
// cím, meta + korhatár, Előzetes és Watchlist gomb; telefonon alul középen, iPaden jobb alul a
// pöttyök. A felső sáv telefonon márkanév + beállítások, iPaden kereső ikon (a márkanév az
// oldalsávban van). A kép feletti sötétítés nélkülözi a gradiens-könyvtárat (D-024 mintája).
export function HeroCarousel({
  items,
  loading,
  onTrailer,
  onToggleWatchlist,
  onOpenSettings,
  onOpenSearch,
}: HeroCarouselProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const { height, padX, barPadX, contentBottom, dotsBottom } =
    heroLayout[isTablet ? 'tablet' : 'phone'];
  const pageWidth = width - (isTablet ? layout.sidebarWidth : 0);
  const [activeIndex, setActiveIndex] = useState(0);

  const topBarTop = insets.top + 3;
  const topBar = (
    <View
      className="absolute left-0 right-0 flex-row items-center justify-between"
      style={{ top: topBarTop, paddingHorizontal: barPadX }}>
      {isTablet ? (
        <View />
      ) : (
        <View className="flex-row items-center gap-2">
          <View className="h-[10px] w-[10px] rounded-pill bg-accent" />
          <Text className="font-bold text-[18px] text-textPrimary">{strings.appName}</Text>
        </View>
      )}
      <Pressable
        onPress={isTablet ? onOpenSearch : onOpenSettings}
        accessibilityRole="button"
        accessibilityLabel={isTablet ? strings.tabs.search : strings.tabs.settings}
        className={`items-center justify-center rounded-pill bg-white/15 active:opacity-60 ${
          isTablet ? 'h-[46px] w-[46px]' : 'h-[42px] w-[42px]'
        }`}>
        <SymbolView
          name={isTablet ? 'magnifyingglass' : 'gearshape'}
          size={isTablet ? 20 : 19}
          weight="medium"
          tintColor={colors.textPrimary}
        />
      </Pressable>
    </View>
  );

  // Betöltés: a hero méretű helykitöltő; üres / hibás lista: csak a felső sáv marad (a lista
  // alatti rail mutatja a hibát vagy az üres állapotot).
  if (loading || items.length === 0) {
    return (
      <View
        className={loading ? 'bg-surface' : ''}
        style={{ height: loading ? height : topBarTop + 46 + 12 }}>
        {topBar}
      </View>
    );
  }

  const background = colors.background;
  const bottomFade = {
    experimental_backgroundImage: `linear-gradient(to bottom, ${background}66 0%, ${background}00 22%, ${background}00 38%, ${background}F2 78%, ${background} 100%)`,
  } as const;
  const sideFade = {
    experimental_backgroundImage: `linear-gradient(to right, ${background}E6 0%, ${background}99 35%, ${background}00 70%)`,
  } as const;

  return (
    <View style={{ height }}>
      <FlatList
        horizontal
        pagingEnabled
        data={items}
        keyExtractor={(item) => item.title.key}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) =>
          setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / pageWidth))
        }
        renderItem={({ item }) => {
          const { title } = item;
          const providerLogo = logoUrl(title.provider.logo_path);
          const trailerEnabled = Boolean(item.trailerKey);
          return (
            <View style={{ width: pageWidth, height }}>
              <Image
                source={backdropUrl(title.backdropPath)}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
              <View pointerEvents="none" style={[StyleSheet.absoluteFill, bottomFade]} />
              {isTablet ? (
                <View pointerEvents="none" style={[StyleSheet.absoluteFill, sideFade]} />
              ) : null}
              <View
                className="absolute bottom-0 left-0 right-0"
                style={{ paddingHorizontal: padX, paddingBottom: contentBottom }}>
                <View className="flex-row items-center gap-[10px]">
                  {providerLogo ? (
                    <View className="h-[22px] w-[22px] overflow-hidden rounded-[6px]">
                      <Image source={providerLogo} style={{ flex: 1 }} contentFit="cover" />
                    </View>
                  ) : null}
                  <Text className="font-extrabold text-[13px] tracking-widest text-textPrimary">
                    {strings.home.newOn(title.provider.provider_name)}
                  </Text>
                </View>
                <Text
                  numberOfLines={2}
                  className={`mt-[14px] font-extrabold tracking-[-1px] text-textPrimary ${
                    isTablet ? 'text-[64px] leading-[68px]' : 'text-[44px] leading-[48px]'
                  }`}>
                  {title.title}
                </Text>
                {isTablet && title.overview ? (
                  <Text
                    numberOfLines={2}
                    className="mt-2 max-w-[450px] text-[17px] leading-[25px] text-textSoft">
                    {title.overview}
                  </Text>
                ) : null}
                <View className="mt-[13px] h-[22px] flex-row items-center gap-[10px]">
                  <Text numberOfLines={1} className="shrink text-[15px] text-textSoft">
                    {item.meta}
                  </Text>
                  {item.certification ? (
                    <View className="h-[22px] items-center justify-center rounded-pill bg-white/15 px-[9px]">
                      <Text className="font-bold text-[13px] text-textPrimary">
                        {item.certification}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View className="mt-[15px] flex-row gap-3">
                  <Pressable
                    onPress={() => onTrailer(item)}
                    disabled={!trailerEnabled}
                    accessibilityRole="button"
                    className={`h-[52px] flex-row items-center justify-center gap-2 rounded-button bg-textPrimary active:opacity-80 ${
                      isTablet ? 'w-[197px]' : 'flex-1'
                    } ${trailerEnabled ? '' : 'opacity-40'}`}>
                    <SymbolView name="play.fill" size={14} tintColor={colors.ctaText} />
                    <Text className="font-bold text-[17px] text-ctaText">
                      {strings.common.trailer}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onToggleWatchlist(item)}
                    accessibilityRole="button"
                    accessibilityLabel={strings.common.watchlistAdd}
                    accessibilityState={{ selected: item.watchlisted }}
                    className={`h-[52px] items-center justify-center rounded-button border border-white/10 bg-white/15 active:opacity-70 ${
                      isTablet ? 'flex-row gap-2 px-6' : 'w-[52px]'
                    }`}>
                    <SymbolView
                      name={item.watchlisted ? 'checkmark' : 'plus'}
                      size={20}
                      weight="semibold"
                      tintColor={item.watchlisted ? colors.accent : colors.textPrimary}
                    />
                    {isTablet ? (
                      <Text className="font-bold text-[17px] text-textPrimary">
                        {strings.common.watchlistAdd}
                      </Text>
                    ) : null}
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />
      {items.length > 1 ? (
        <View
          pointerEvents="none"
          className={`absolute flex-row items-center gap-[6px] ${isTablet ? '' : 'left-0 right-0 justify-center'}`}
          style={isTablet ? { right: padX, bottom: dotsBottom } : { bottom: dotsBottom }}>
          {items.map((item, index) => (
            <View
              key={item.title.key}
              className={`h-[6px] rounded-pill ${
                index === activeIndex ? 'w-[18px] bg-white' : 'w-[6px] bg-white/35'
              }`}
            />
          ))}
        </View>
      ) : null}
      {topBar}
    </View>
  );
}
