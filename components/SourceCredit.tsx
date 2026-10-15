import { Text, useWindowDimensions, View } from 'react-native';

import { strings } from '@/constants/strings';
import { railLayout, TABLET_MIN_WIDTH } from '@/constants/theme';

// Forrásmegjelölés a Főoldal alján (02 / 10 design): TMDB és JustWatch, a rail-ek margójával.
export function SourceCredit() {
  const { width } = useWindowDimensions();
  const { inset } = railLayout[width >= TABLET_MIN_WIDTH ? 'tablet' : 'phone'];
  return (
    <View style={{ paddingHorizontal: inset, gap: 5 }}>
      <Text className="text-[12px] leading-[19px] text-textSecondary">{strings.home.tmdbCredit}</Text>
      <Text className="text-[12px] leading-[19px] text-textSecondary">{strings.home.justWatchCredit}</Text>
    </View>
  );
}
