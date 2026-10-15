import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, ScrollView, Share, Text, useWindowDimensions, View } from 'react-native';

import { CastRail } from '@/components/CastRail';
import { DiscCard } from '@/components/DiscCard';
import { ErrorState } from '@/components/ErrorState';
import { SourceCredit } from '@/components/SourceCredit';
import { TitleAbout } from '@/components/TitleAbout';
import { TitleHero } from '@/components/TitleHero';
import { WhereToWatch } from '@/components/WhereToWatch';
import { TABLET_MIN_WIDTH, titleColumns, titleLayout, titleSections } from '@/constants/theme';
import { useTitleDetails } from '@/hooks/useTitleDetails';
import { providerSearchUrl, tmdbUrl, trailerUrl } from '@/lib/titleInfo';
import type { WatchOffer } from '@/types/app';
import { useWatchlistStore } from '@/store/useWatchlistStore';

export default function TitleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type: string; id: string }>();
  const type = params.type === 'tv' ? 'tv' : 'movie';
  const id = Number(params.id);
  const { title, loading, error, retry } = useTitleDetails(type, id);
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const size = isTablet ? 'tablet' : 'phone';
  const { padX } = titleLayout[size];
  const { gap } = titleSections[size];

  const watchlisted = useWatchlistStore((state) =>
    state.items.some((item) => item.type === type && item.id === id),
  );
  const toggleWatchlist = useWatchlistStore((state) => state.toggle);

  const toggle = () => {
    if (!title) return;
    toggleWatchlist({
      id: title.id,
      type: title.type,
      title: title.title,
      posterPath: title.posterPath,
    });
  };
  // A szolgáltató keresőoldala a címmel; ha ahhoz nincs link, a TMDB „hol nézhető” oldala (D-042).
  const openOffer = (offer: WatchOffer) => {
    if (!title) return;
    const url = providerSearchUrl(offer.provider.provider_name, title.title) ?? title.watchLink;
    if (url) Linking.openURL(url);
  };

  const whereToWatch = title ? <WhereToWatch offers={title.offers} onOpen={openOffer} /> : null;
  // „Emlékeztess”: a címet a watchlistre teszi (D-013); ha már rajta van, nem veszi le.
  const disc = title?.disc ? (
    <DiscCard
      disc={title.disc}
      watchlisted={watchlisted}
      onRemind={() => {
        if (!watchlisted) toggle();
      }}
    />
  ) : null;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 32 }}>
      <TitleHero
        title={title}
        loading={loading}
        watchlisted={watchlisted}
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        onShare={() => {
          if (title) Share.share({ message: `${title.title}\n${tmdbUrl(type, id)}` });
        }}
        onTrailer={() => {
          if (title?.trailerKey) Linking.openURL(trailerUrl(title.trailerKey));
        }}
        onToggleWatchlist={toggle}
      />
      {error ? <ErrorState onRetry={retry} /> : null}
      {title ? (
        <View style={{ paddingTop: isTablet ? 64 : 28, gap }}>
          {isTablet ? (
            <View style={{ paddingHorizontal: padX, flexDirection: 'row', gap: titleColumns.gap }}>
              <View style={{ flex: titleColumns.left }}>{whereToWatch}</View>
              <View style={{ flex: titleColumns.right, gap: 12 }}>
                <TitleAbout overview={title.overview} facts={title.facts} />
                {disc}
              </View>
            </View>
          ) : (
            <>
              {title.overview ? (
                <View style={{ paddingHorizontal: padX }}>
                  <Text className="max-w-[600px] text-[17px] leading-[24px] text-textSoft">
                    {title.overview}
                  </Text>
                </View>
              ) : null}
              <View style={{ paddingHorizontal: padX }}>{whereToWatch}</View>
              {disc ? <View style={{ paddingHorizontal: padX }}>{disc}</View> : null}
            </>
          )}
          <CastRail cast={title.cast} />
          <SourceCredit inset={padX} />
        </View>
      ) : null}
    </ScrollView>
  );
}
