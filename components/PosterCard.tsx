import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { PosterBadge } from '@/components/PosterBadge';
import { logoUrl, posterUrl } from '@/lib/tmdbImage';

export type PosterStatus = { label: string; available?: boolean };

type PosterCardProps = {
  title: string;
  posterPath: string | null;
  /** A kártya szélessége; a magasság a 2:3 poszterarányból jön. */
  width: number;
  /** Bal felső sarok: a szolgáltató logója (Főoldal, Böngészés). Nem kombinálandó a `status`-szal. */
  providerLogoPath?: string | null;
  /** Bal felső sarok: státusz (Watchlist). */
  status?: PosterStatus;
  /** Jobb felső sarok: Blu-ray formátum (4K UHD, Steelbook, Blu-ray). */
  formatLabel?: string;
  /** Ha meg van adva, a poszter alatt cím + alcím látszik (rail); egyébként csak a poszter (rács). */
  subtitle?: string;
  onPress?: () => void;
};

// Poszter kártya a 02/03/07 designból: 2:3 poszter, 1 px halvány keret, sarokbadge-ek,
// opcionálisan cím + alcím alatta. A design posztereibe sült címek helykitöltők: a valódi
// poszter a TMDB-ből jön; ha nincs, a cím látszik a kártyán.
export function PosterCard({
  title,
  posterPath,
  width,
  providerLogoPath,
  status,
  formatLabel,
  subtitle,
  onPress,
}: PosterCardProps) {
  const poster = posterUrl(posterPath);
  const providerLogo = logoUrl(providerLogoPath ?? null);

  return (
    <View style={{ width }}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
        className="active:opacity-80">
        <View>
          <View className="aspect-[2/3] w-full overflow-hidden rounded-poster bg-surface">
            {poster ? (
              <Image source={poster} style={{ flex: 1 }} contentFit="cover" />
            ) : (
              <View className="flex-1 items-center justify-center p-2">
                <Text
                  numberOfLines={4}
                  className="text-center font-semibold text-[13px] text-textSecondary">
                  {title}
                </Text>
              </View>
            )}
            <View
              pointerEvents="none"
              className="absolute inset-0 rounded-poster border border-white/[0.07]"
            />
            {providerLogo ? (
              <View className="absolute left-[9px] top-[9px] h-[25px] w-[25px] overflow-hidden rounded-[7px]">
                <Image source={providerLogo} style={{ flex: 1 }} contentFit="cover" />
              </View>
            ) : null}
          </View>
          {/* A pillek a vágó poszter-konténeren kívül vannak: a státusz-pill a designban
              kissé túllóg a kártya jobb szélén (D-030), a formátum-pill a poszteren belül marad. */}
          {status ? (
            <View
              pointerEvents="none"
              className="absolute left-[9px] top-[9px] flex-row"
              style={{ maxWidth: width - 1 }}>
              <PosterBadge label={status.label} accent={status.available} />
            </View>
          ) : null}
          {formatLabel ? (
            <View
              pointerEvents="none"
              className="absolute right-[9px] top-[9px] flex-row"
              style={{ maxWidth: width - 18 }}>
              <PosterBadge label={formatLabel} />
            </View>
          ) : null}
        </View>
        {subtitle ? (
          <View className="mt-[6px]">
            <Text numberOfLines={1} className="font-semibold text-[15px] leading-[20px] text-textPrimary">
              {title}
            </Text>
            <Text numberOfLines={1} className="mt-px text-[13px] leading-[16px] text-textSecondary">
              {subtitle}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

// Betöltés közbeni helykitöltő, a kártya méretével (felirat-sorokkal, ha a kártyának van).
export function PosterCardSkeleton({
  width,
  withCaption = true,
}: {
  width: number;
  withCaption?: boolean;
}) {
  return (
    <View style={{ width }}>
      <View className="aspect-[2/3] w-full rounded-poster bg-surface" />
      {withCaption ? (
        <View className="mt-[10px] gap-[7px]">
          <View className="h-[14px] w-[80%] rounded-pill bg-chip" />
          <View className="h-[12px] w-[55%] rounded-pill bg-chip" />
        </View>
      ) : null}
    </View>
  );
}
