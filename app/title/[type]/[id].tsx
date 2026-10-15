import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, ScrollView, Share, Text, useWindowDimensions, View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { TitleHero } from '@/components/TitleHero';
import { TABLET_MIN_WIDTH, titleLayout } from '@/constants/theme';
import { useTitleDetails } from '@/hooks/useTitleDetails';
import { tmdbUrl, trailerUrl } from '@/lib/titleInfo';
import { useWatchlistStore } from '@/store/useWatchlistStore';

export default function TitleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type: string; id: string }>();
  const type = params.type === 'tv' ? 'tv' : 'movie';
  const id = Number(params.id);
  const { title, loading, error, retry } = useTitleDetails(type, id);
  const { width } = useWindowDimensions();
  const padX = titleLayout[width >= TABLET_MIN_WIDTH ? 'tablet' : 'phone'].padX;

  const watchlisted = useWatchlistStore((state) =>
    state.items.some((item) => item.type === type && item.id === id),
  );
  const toggleWatchlist = useWatchlistStore((state) => state.toggle);

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
        onToggleWatchlist={() => {
          if (!title) return;
          toggleWatchlist({
            id: title.id,
            type: title.type,
            title: title.title,
            posterPath: title.posterPath,
          });
        }}
      />
      {error ? <ErrorState onRetry={retry} /> : null}
      {title?.overview ? (
        <View style={{ paddingHorizontal: padX }} className="mt-7">
          <Text className="max-w-[600px] text-[17px] leading-[24px] text-textSoft">
            {title.overview}
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
