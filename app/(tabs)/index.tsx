import { useRouter } from 'expo-router';
import { Linking, ScrollView, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { HeroCarousel } from '@/components/HeroCarousel';
import { KidsPickCard } from '@/components/KidsPickCard';
import { PosterCard } from '@/components/PosterCard';
import { PosterRail } from '@/components/PosterRail';
import { SourceCredit } from '@/components/SourceCredit';
import { TrendingCard } from '@/components/TrendingCard';
import { strings } from '@/constants/strings';
import { kidsAccents } from '@/constants/theme';
import { useBlurayReleases } from '@/hooks/useBlurayReleases';
import { useHeroItems } from '@/hooks/useHeroItems';
import { useKidsPicks } from '@/hooks/useKidsPicks';
import { useNewOnMyServices } from '@/hooks/useNewOnMyServices';
import { useTrendingInHungary } from '@/hooks/useTrendingInHungary';
import { formatRelativeDate, formatShortDate } from '@/lib/format';
import { titleHref } from '@/lib/routes';
import { trailerUrl } from '@/lib/titleInfo';
import { useWatchlistStore } from '@/store/useWatchlistStore';

export default function HomeScreen() {
  const router = useRouter();
  const newOn = useNewOnMyServices();
  const bluray = useBlurayReleases();
  const trending = useTrendingInHungary();
  const kidsPicks = useKidsPicks();
  const heroItems = useHeroItems(newOn.titles);
  const toggleWatchlist = useWatchlistStore((state) => state.toggle);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ gap: 44 }}>
        <HeroCarousel
          items={heroItems}
          loading={newOn.loading}
          onTrailer={(item) => {
            if (item.trailerKey) Linking.openURL(trailerUrl(item.trailerKey));
          }}
          onOpenTitle={({ title }) => router.push(titleHref(title.type, title.id))}
          onToggleWatchlist={({ title }) =>
            toggleWatchlist({
              id: title.id,
              type: title.type,
              title: title.title,
              posterPath: title.posterPath,
            })
          }
          onOpenSettings={() => router.push('/settings')}
          onOpenSearch={() => router.navigate('/search')}
        />
        {newOn.hasServices || newOn.loading || newOn.error ? (
          <PosterRail
            title={strings.home.newOnServices}
            data={newOn.titles}
            loading={newOn.loading}
            error={newOn.error}
            onRetry={newOn.retry}
            onSeeAll={() => router.navigate('/browse')}
            keyExtractor={(title) => title.key}
            renderCard={(title, width) => (
              <PosterCard
                title={title.title}
                posterPath={title.posterPath}
                width={width}
                providerLogoPath={title.provider.logo_path}
                subtitle={`${formatRelativeDate(title.releaseDate)} · ${title.provider.provider_name}`}
                onPress={() => router.push(titleHref(title.type, title.id))}
              />
            )}
          />
        ) : (
          <EmptyState message={strings.home.noServices} />
        )}
        <PosterRail
          title={strings.home.newBluray}
          note={bluray.region === 'DE' && bluray.titles.length > 0 ? strings.home.germanRelease : undefined}
          data={bluray.titles}
          loading={bluray.loading}
          error={bluray.error}
          onRetry={bluray.retry}
          keyExtractor={(title) => title.key}
          renderCard={(title, width) => (
            <PosterCard
              title={title.title}
              posterPath={title.posterPath}
              width={width}
              formatLabel={title.format}
              subtitle={`${formatShortDate(title.releaseDate)} · ${strings.watchlist.bluray}`}
              onPress={() => router.push(titleHref('movie', title.id))}
            />
          )}
        />
        <PosterRail
          variant="trending"
          title={strings.home.trending}
          data={trending.titles}
          loading={trending.loading}
          error={trending.error}
          onRetry={trending.retry}
          keyExtractor={(title) => title.key}
          renderCard={(title, width, index) => (
            <TrendingCard
              rank={index + 1}
              title={title.title}
              posterPath={title.posterPath}
              width={width}
              onPress={() => router.push(titleHref(title.type, title.id))}
            />
          )}
        />
        <PosterRail
          variant="wide"
          title={strings.home.kidsPicks}
          data={kidsPicks.titles}
          loading={kidsPicks.loading}
          error={kidsPicks.error}
          onRetry={kidsPicks.retry}
          onSeeAll={() => router.navigate('/kids')}
          keyExtractor={(title) => title.key}
          renderCard={(title, width, index) => (
            <KidsPickCard
              title={title.title}
              backdropPath={title.backdropPath}
              caption={title.caption}
              accent={kidsAccents[index % kidsAccents.length]}
              width={width}
              onPress={() => router.push(titleHref('movie', title.id))}
            />
          )}
        />
        <SourceCredit />
      </View>
    </ScrollView>
  );
}
