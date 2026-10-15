import { Image } from 'expo-image';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { strings } from '@/constants/strings';
import { castGradients, TABLET_MIN_WIDTH, titleLayout, titleSections } from '@/constants/theme';
import { profileUrl } from '@/lib/tmdbImage';
import type { CastMember } from '@/types/app';

/** „Ilona Varga” → „IV”; egy szavas névből egy betű. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1][0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

// „Szereplők és stáb” (06, 14 design): vízszintes sor körökkel. TMDB profilkép, ennek híján a
// monogram színátmenetes körön. Saját oldalsó margója van, hogy a lista szélig görgessen.
export function CastRail({ cast }: { cast: CastMember[] }) {
  const { width } = useWindowDimensions();
  const size = width >= TABLET_MIN_WIDTH ? 'tablet' : 'phone';
  const { padX } = titleLayout[size];
  const { castCircle, castItem, castGap, castInitials, castNameGap } = titleSections[size];

  if (cast.length === 0) return null;
  return (
    <View>
      <Text
        style={{ paddingHorizontal: padX }}
        className="font-bold text-section leading-[28px] text-textPrimary">
        {strings.title.cast}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: padX, gap: castGap }}
        className="mt-[14px]">
        {cast.map((member, index) => {
          const [top, bottom] = castGradients[index % castGradients.length];
          const photo = profileUrl(member.profilePath);
          return (
            <View key={member.key} style={{ width: castItem }} className="items-center">
              <View
                className="items-center justify-center overflow-hidden"
                style={{
                  width: castCircle,
                  height: castCircle,
                  borderRadius: castCircle / 2,
                  backgroundColor: top,
                  experimental_backgroundImage: `linear-gradient(to bottom, ${top}, ${bottom})`,
                }}>
                {photo ? (
                  <Image source={photo} style={{ width: castCircle, height: castCircle }} contentFit="cover" />
                ) : (
                  <Text
                    className="font-bold text-textPrimary/90"
                    style={{ fontSize: castInitials }}>
                    {initials(member.name)}
                  </Text>
                )}
              </View>
              <Text
                numberOfLines={2}
                style={{ marginTop: castNameGap }}
                className="text-center font-bold text-[14px] leading-[17px] text-textPrimary">
                {member.name}
              </Text>
              {member.role ? (
                <Text
                  numberOfLines={2}
                  className="mt-px text-center text-[13px] leading-[16px] text-textSecondary">
                  {member.role}
                </Text>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
