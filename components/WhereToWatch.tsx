import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { strings } from '@/constants/strings';
import { colors, TABLET_MIN_WIDTH } from '@/constants/theme';
import { logoUrl } from '@/lib/tmdbImage';
import type { OfferKind, WatchOffer } from '@/types/app';

type Filter = 'all' | OfferKind;

// A típusok szövege a Keresés chipjeivel közös (előfizetés / kölcsönzés / vásárlás).
const KIND_LABEL: Record<OfferKind, string> = {
  stream: strings.search.stream,
  rent: strings.search.rent,
  buy: strings.search.buy,
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: strings.common.all },
  { key: 'stream', label: KIND_LABEL.stream },
  { key: 'rent', label: KIND_LABEL.rent },
  { key: 'buy', label: KIND_LABEL.buy },
];

function OfferRow({
  offer,
  first,
  onOpen,
}: {
  offer: WatchOffer;
  first: boolean;
  onOpen: () => void;
}) {
  // A designban a „Stream” gomb narancs, ha a saját előfizetésemen van (D-012: ár helyett „Megnyitás”).
  const accent = offer.kind === 'stream' && offer.mine;
  return (
    <View
      className={`flex-row items-center gap-[13px] px-[15px] py-3 ${
        first ? '' : 'border-t border-separator'
      }`}>
      <View className="h-[46px] w-[46px] overflow-hidden rounded-[11px] border border-white/15">
        <Image source={logoUrl(offer.provider.logo_path)} style={{ flex: 1 }} contentFit="cover" />
      </View>
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="font-semibold text-[17px] leading-[21px] text-textPrimary">
          {offer.provider.provider_name}
        </Text>
        <Text numberOfLines={1} className="text-[14px] leading-[17px] text-textSecondary">
          {KIND_LABEL[offer.kind]}
        </Text>
      </View>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        className={`h-[35px] flex-row items-center justify-center gap-[6px] rounded-pill px-[18px] active:opacity-70 ${
          accent ? 'bg-accent' : 'bg-chip'
        }`}>
        {accent ? <SymbolView name="play.fill" size={10} tintColor={colors.ctaText} /> : null}
        <Text className={`font-bold text-[16px] ${accent ? 'text-ctaText' : 'text-textPrimary'}`}>
          {strings.title.open}
        </Text>
      </Pressable>
    </View>
  );
}

// „Hol nézhető” (06, 14 design): szekciócím + „Adatok: JustWatch”, Mind / Előfizetés / Kölcsönzés /
// Vásárlás szűrő, szolgáltatónként egy sor. Ár és minőség nincs (D-012): a gomb a szolgáltatót
// nyitja (D-042). A vízszintes margót a használó adja.
export function WhereToWatch({
  offers,
  onOpen,
}: {
  offers: WatchOffer[];
  onOpen: (offer: WatchOffer) => void;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  // A magyar szűrőfeliratok hosszabbak a designénál: telefonon a chipek szűkebbek (15 px, 11 px
  // kitöltés), hogy mind a négy egy sorba férjen; iPaden a design mérete (16 px, 16 px).
  const isTablet = useWindowDimensions().width >= TABLET_MIN_WIDTH;
  const visible = filter === 'all' ? offers : offers.filter((offer) => offer.kind === filter);

  return (
    <View>
      <View className="flex-row items-baseline justify-between gap-4">
        <Text
          numberOfLines={1}
          className="min-w-0 shrink font-bold text-section leading-[28px] text-textPrimary">
          {strings.title.whereToWatch}
        </Text>
        <Text className="text-[13px] text-textSecondary">{strings.title.dataBy}</Text>
      </View>
      {offers.length > 0 ? (
        <View className={`mt-[11px] flex-row flex-wrap ${isTablet ? 'gap-[9px]' : 'gap-2'}`}>
          {FILTERS.map(({ key, label }) => {
            const selected = key === filter;
            return (
              <Pressable
                key={key}
                onPress={() => setFilter(key)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                className={`h-[34px] items-center justify-center rounded-pill active:opacity-70 ${
                  isTablet ? 'px-4' : 'px-[11px]'
                } ${selected ? 'bg-textPrimary' : 'bg-chip'}`}>
                <Text
                  className={`font-semibold ${isTablet ? 'text-[16px]' : 'text-[15px]'} ${
                    selected ? 'text-ctaText' : 'text-textPrimary'
                  }`}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
      <View className="mt-3 overflow-hidden rounded-cardLarge bg-surface">
        {visible.length > 0 ? (
          visible.map((offer, index) => (
            <OfferRow key={offer.key} offer={offer} first={index === 0} onOpen={() => onOpen(offer)} />
          ))
        ) : (
          <EmptyState message={offers.length === 0 ? strings.title.noOffers : strings.common.empty} />
        )}
      </View>
    </View>
  );
}
