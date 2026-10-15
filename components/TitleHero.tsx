import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { strings } from '@/constants/strings';
import { colors, TABLET_MIN_WIDTH, titleLayout } from '@/constants/theme';
import { backdropUrl, logoUrl } from '@/lib/tmdbImage';
import type { TitlePage } from '@/types/app';

type TitleHeroProps = {
  /** Betöltés közben / hiba esetén nincs. */
  title?: TitlePage;
  loading: boolean;
  watchlisted: boolean;
  onBack: () => void;
  onShare: () => void;
  onTrailer: () => void;
  onToggleWatchlist: () => void;
};

function RoundButton({
  icon,
  label,
  size,
  onPress,
}: {
  icon: 'chevron.left' | 'square.and.arrow.up';
  label: string;
  size: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="items-center justify-center rounded-pill bg-chip/75 active:opacity-60"
      style={{ width: size, height: size }}>
      <SymbolView name={icon} size={19} weight="semibold" tintColor={colors.textPrimary} />
    </Pressable>
  );
}

// Adatlap hero a 06 / 14 designból: backdrop, rajta vissza + megosztás, (iPaden a saját
// szolgáltatóm), cím, meta + korhatár + TMDB értékelés, Előzetes és Watchlist gomb. A kép
// feletti sötétítés a Főoldal hero mintája (RN `experimental_backgroundImage`, D-024).
export function TitleHero({
  title,
  loading,
  watchlisted,
  onBack,
  onShare,
  onTrailer,
  onToggleWatchlist,
}: TitleHeroProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const { height, padX, barPadX } = titleLayout[isTablet ? 'tablet' : 'phone'];
  const buttonSize = isTablet ? 46 : 42;
  const topBarTop = insets.top + 3;

  const topBar = (
    <View
      className="absolute left-0 right-0 flex-row items-center justify-between"
      style={{ top: topBarTop, paddingHorizontal: barPadX }}>
      <RoundButton icon="chevron.left" label={strings.title.back} size={buttonSize} onPress={onBack} />
      {title ? (
        <RoundButton
          icon="square.and.arrow.up"
          label={strings.title.share}
          size={buttonSize}
          onPress={onShare}
        />
      ) : null}
    </View>
  );

  // Betöltés: hero méretű helykitöltő; hiba: csak a felső sáv (az állapotot a képernyő mutatja).
  if (!title) {
    return (
      <View
        className={loading ? 'bg-surface' : ''}
        style={{ height: loading ? height : topBarTop + buttonSize + 12 }}>
        {topBar}
      </View>
    );
  }

  const background = colors.background;
  const bottomFade = {
    experimental_backgroundImage: `linear-gradient(to bottom, ${background}66 0%, ${background}00 18%, ${background}00 42%, ${background}F2 72%, ${background} 88%)`,
  } as const;
  const sideFade = {
    experimental_backgroundImage: `linear-gradient(to right, ${background}E6 0%, ${background}99 35%, ${background}00 70%)`,
  } as const;

  const providerLogo = title.myProvider ? logoUrl(title.myProvider.logo_path) : null;
  const trailerEnabled = Boolean(title.trailerKey);
  const certification = title.certification ? (
    <View className="h-[26px] items-center justify-center rounded-[6px] border-[1.5px] border-certBorder px-[10px]">
      <Text className={`font-bold text-textPrimary ${isTablet ? 'text-[17px]' : 'text-[15px]'}`}>
        {title.certification}
      </Text>
    </View>
  ) : null;
  const rating = title.rating ? (
    <View className="flex-row items-center gap-[6px]">
      <SymbolView name="star.fill" size={isTablet ? 15 : 14} tintColor={colors.star} />
      <Text className={`font-bold text-textPrimary ${isTablet ? 'text-[17px]' : 'text-[15px]'}`}>
        {title.rating}
        <Text className="font-normal text-textSecondary"> TMDB</Text>
      </Text>
    </View>
  ) : null;

  return (
    <View style={{ height }}>
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
        style={{ paddingHorizontal: padX }}>
        {isTablet && title.myProvider ? (
          <View className="mb-[15px] flex-row items-center gap-2">
            {providerLogo ? (
              <View className="h-[26px] w-[26px] overflow-hidden rounded-[7px]">
                <Image source={providerLogo} style={{ flex: 1 }} contentFit="cover" />
              </View>
            ) : null}
            <Text className="font-extrabold text-[13px] tracking-widest text-textPrimary">
              {strings.title.onYourService(title.myProvider.provider_name)}
            </Text>
          </View>
        ) : null}
        <Text
          numberOfLines={2}
          className={`font-extrabold tracking-[-1px] text-textPrimary ${
            isTablet ? 'text-[72px] leading-[76px]' : 'text-[44px] leading-[48px]'
          }`}>
          {title.title}
        </Text>
        <View className={`flex-row items-center gap-[14px] ${isTablet ? 'mt-[11px]' : 'mt-[7px]'}`}>
          <Text
            numberOfLines={1}
            className={`shrink text-textSoft ${isTablet ? 'text-[17px]' : 'text-[15px]'}`}>
            {title.meta}
          </Text>
          {certification}
          {isTablet ? rating : null}
        </View>
        {!isTablet && rating ? <View className="mt-[10px]">{rating}</View> : null}
        <View className={`flex-row ${isTablet ? 'mt-[17px] gap-[13px]' : 'mt-[23px] gap-[11px]'}`}>
          <Pressable
            onPress={onTrailer}
            disabled={!trailerEnabled}
            accessibilityRole="button"
            className={`h-[52px] flex-row items-center justify-center gap-2 rounded-button bg-textPrimary active:opacity-80 ${
              isTablet ? 'w-[188px]' : 'flex-[165]'
            } ${trailerEnabled ? '' : 'opacity-40'}`}>
            <SymbolView name="play.fill" size={14} tintColor={colors.ctaText} />
            <Text className="font-bold text-[17px] text-ctaText">{strings.common.trailer}</Text>
          </Pressable>
          <Pressable
            onPress={onToggleWatchlist}
            accessibilityRole="button"
            accessibilityState={{ selected: watchlisted }}
            className={`h-[52px] flex-row items-center justify-center gap-2 rounded-button bg-chip active:opacity-70 ${
              isTablet ? 'w-[205px]' : 'flex-[190]'
            }`}>
            <SymbolView
              name={watchlisted ? 'checkmark' : 'plus'}
              size={20}
              weight="semibold"
              tintColor={watchlisted ? colors.accent : colors.textPrimary}
            />
            <Text numberOfLines={1} className="font-bold text-[17px] text-textPrimary">
              {isTablet
                ? watchlisted
                  ? strings.title.onWatchlist
                  : strings.title.watchlistAdd
                : strings.common.watchlistAdd}
            </Text>
          </Pressable>
        </View>
      </View>
      {topBar}
    </View>
  );
}
