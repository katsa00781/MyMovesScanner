import { Text, useWindowDimensions, View } from 'react-native';

import { strings } from '@/constants/strings';
import { railLayout, TABLET_MIN_WIDTH } from '@/constants/theme';

// Forrásmegjelölés a Főoldal és az Adatlap alján (02, 10, 06, 14 design): TMDB és JustWatch;
// oldalsó margója alapból a rail-eké, az Adatlap a sajátját adja.
export function SourceCredit({ inset }: { inset?: number }) {
  const { width } = useWindowDimensions();
  const padX = inset ?? railLayout[width >= TABLET_MIN_WIDTH ? 'tablet' : 'phone'].inset;
  return (
    <View style={{ paddingHorizontal: padX, gap: 5 }}>
      <Text className="text-[12px] leading-[19px] text-textSecondary">{strings.home.tmdbCredit}</Text>
      <Text className="text-[12px] leading-[19px] text-textSecondary">{strings.home.justWatchCredit}</Text>
    </View>
  );
}
