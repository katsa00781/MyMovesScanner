import { Text, useWindowDimensions } from 'react-native';

import { TABLET_MIN_WIDTH } from '@/constants/theme';

// A fül-képernyők nagy félkövér címe (Böngészés, Keresés, Watchlist, Beállítások): telefonon 34,
// iPaden 40 pt (a designból mérve). A tablet sormagassága a fejléc-sorok kalibrált magassága, hogy
// a nagyobb betű ne tolja lejjebb a tartalmat; a betű a designhoz mérten 2,5 px-szel lejjebb ül.
export function ScreenTitle({ children }: { children: string }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  return (
    <Text
      className={`font-extrabold text-textPrimary ${
        isTablet ? 'relative top-[2.5px] text-titleTablet leading-[41px]' : 'text-title'
      }`}>
      {children}
    </Text>
  );
}
