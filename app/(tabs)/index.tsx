import { useRouter } from 'expo-router';
import { Linking, ScrollView, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { HeroCarousel } from '@/components/HeroCarousel';
import { PosterCard } from '@/components/PosterCard';
import { PosterRail } from '@/components/PosterRail';
import { strings } from '@/constants/strings';
import { useBlurayReleases } from '@/hooks/useBlurayReleases';
import { useHeroItems } from '@/hooks/useHeroItems';
import { useNewOnMyServices } from '@/hooks/useNewOnMyServices';
import { formatRelativeDate, formatShortDate } from '@/lib/format';
import { useWatchlistStore } from '@/store/useWatchlistStore';

export default function HomeScreen() {
  const router = useRouter();
  const newOn = useNewOnMyServices();
  const bluray = useBlurayReleases();
  const heroItems = useHeroItems(newOn.titles);
  const toggleWatchlist = useWatchlistStore((state) => state.toggle);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ gap: 44 }}>
        <HeroCarousel
          items={heroItems}
          loading={newOn.loading}
          onTrailer={(item) =>
            Linking.openURL(`https://www.youtube.com/watch?v=${item.trailerKey}`)
          }
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
            />
          )}
        />
      </View>
    </ScrollView>
  );
}
