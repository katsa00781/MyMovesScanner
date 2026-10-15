import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors } from '@/constants/theme';
import { logoUrl, posterUrl, profileUrl } from '@/lib/tmdbImage';
import type { OfferKind, SearchRow } from '@/types/app';

const KIND_LABEL: Record<OfferKind, string> = {
  stream: strings.search.stream,
  rent: strings.search.rent,
  buy: strings.search.buy,
};

// A sor két szélessége a designban: telefon 67 px-es, iPad 79 px-es poszter (2:3).
const posterSize = (isTablet: boolean) => (isTablet ? 'w-[79px]' : 'w-[67px]');

function Poster({ row, isTablet }: { row: SearchRow; isTablet: boolean }) {
  const { type, imagePath, title } = row.result;
  const uri = type === 'person' ? profileUrl(imagePath) : posterUrl(imagePath);
  return (
    <View
      className={`aspect-[2/3] overflow-hidden rounded-[8px] bg-surface ${posterSize(isTablet)}`}>
      {uri ? (
        <Image source={uri} style={{ flex: 1 }} contentFit="cover" />
      ) : (
        <View className="flex-1 items-center justify-center p-1">
          <Text numberOfLines={4} className="text-center font-semibold text-[11px] text-textSecondary">
            {title}
          </Text>
        </View>
      )}
      <View
        pointerEvents="none"
        className="absolute inset-0 rounded-[8px] border border-white/[0.07]"
      />
    </View>
  );
}

// „Előfizetés / Kölcsönzés / Vásárlás” chip a szolgáltató logójával (05, 13 design).
function ProviderChip({ kind, logoPath }: { kind: OfferKind; logoPath: string | null }) {
  return (
    <View className="h-[30px] flex-row items-center gap-2 rounded-pill bg-chip pl-1 pr-[10px]">
      <View className="h-[22px] w-[22px] overflow-hidden rounded-[7px]">
        <Image source={logoUrl(logoPath)} style={{ flex: 1 }} contentFit="cover" />
      </View>
      <Text className="font-semibold text-[15px] text-textPrimary">{KIND_LABEL[kind]}</Text>
    </View>
  );
}

// Találati sor (05, 13 design): poszter, cím + „A szolgáltatóidon” jelzés, év · típus · műfaj,
// Előfizetés / Kölcsönzés / Vásárlás chipek, jobbra nyíl. A személy sora ugyanilyen, de chip és
// nyíl nélkül, és nem koppintható (nincs személy-oldal a v1-ben, D-046). A részletek előtt a chip
// helyén helykitöltő áll. Az utolsó sor alatt nincs elválasztó.
export function SearchResultRow({
  row,
  isTablet,
  last,
  onPress,
}: {
  row: SearchRow;
  isTablet: boolean;
  last: boolean;
  onPress: () => void;
}) {
  const { result } = row;
  const isPerson = result.type === 'person';
  const meta = isPerson
    ? [strings.search.person, result.role]
    : [result.year, result.type === 'tv' ? strings.common.series : strings.common.film, row.genre];

  return (
    <Pressable
      onPress={onPress}
      disabled={isPerson}
      accessibilityRole={isPerson ? undefined : 'button'}
      className={`flex-row items-center py-[10px] active:opacity-70 ${
        last ? '' : 'border-b border-separator'
      }`}>
      <Poster row={row} isTablet={isTablet} />
      <View className="ml-[15px] min-w-0 flex-1">
        <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
          <Text
            numberOfLines={1}
            className={`max-w-full font-semibold text-textPrimary ${
              isTablet ? 'text-[20px] leading-[24px]' : 'text-[18px] leading-[22px]'
            }`}>
            {result.title}
          </Text>
          {row.onMyServices ? (
            <View className="h-[24px] justify-center rounded-pill bg-accent/15 px-[11px]">
              <Text className="font-semibold text-[13px] text-accent">
                {strings.search.onYourServices}
              </Text>
            </View>
          ) : null}
        </View>
        <Text numberOfLines={1} className="mt-[6px] text-[15px] leading-[18px] text-textSecondary">
          {meta.filter(Boolean).join(' · ')}
        </Text>
        {row.details === 'loading' ? (
          <View className="mt-[5px] h-[30px] w-[88px] rounded-pill bg-chip opacity-50" />
        ) : row.chips.length > 0 ? (
          <View className="mt-[5px] flex-row flex-wrap gap-[6px]">
            {row.chips.map((offer) => (
              <ProviderChip key={offer.key} kind={offer.kind} logoPath={offer.provider.logo_path} />
            ))}
          </View>
        ) : null}
      </View>
      {isPerson ? null : (
        <View className="ml-2 mr-[2px] w-[14px] items-center">
          <SymbolView name="chevron.right" size={13} weight="semibold" tintColor={colors.outline} />
        </View>
      )}
    </Pressable>
  );
}

// Betöltés közbeni helykitöltő sor (a sor méreteivel).
export function SearchResultSkeleton({ isTablet }: { isTablet: boolean }) {
  return (
    <View className="flex-row items-center border-b border-separator py-[10px]">
      <View className={`aspect-[2/3] rounded-[8px] bg-surface ${posterSize(isTablet)}`} />
      <View className="ml-[15px] flex-1 gap-[9px]">
        <View className="h-[18px] w-[55%] rounded-pill bg-chip" />
        <View className="h-[14px] w-[40%] rounded-pill bg-chip" />
        <View className="h-[30px] w-[88px] rounded-pill bg-chip" />
      </View>
    </View>
  );
}
