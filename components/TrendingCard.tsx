import { Text, useWindowDimensions, View } from 'react-native';

import { PosterCard, PosterCardSkeleton } from '@/components/PosterCard';
import { colors, TABLET_MIN_WIDTH, trendingLayout } from '@/constants/theme';

// A kártya alatti hely a poszter alján: a design szerint a rail alatt ennyivel több a hely, és
// a sorszám körvonala sem vágódik le a lista szélén.
const BOTTOM_PAD = 2;
// SF számjegy: az alapvonal ennyivel (a betűméret arányában) van a szövegdoboz alja felett.
const DESCENT = 0.24;
// A körvonal vastagsága; 8 irányba eltolt példányokból áll (RN-ben nincs szöveg-körvonal).
const OUTLINE = 1;
const OUTLINE_OFFSETS = [
  [-OUTLINE, -OUTLINE],
  [0, -OUTLINE],
  [OUTLINE, -OUTLINE],
  [-OUTLINE, 0],
  [OUTLINE, 0],
  [-OUTLINE, OUTLINE],
  [0, OUTLINE],
  [OUTLINE, OUTLINE],
] as const;

// Nagy, üreges sorszám: a körvonal-színű, eltolt példányokra egy háttérszínű kitöltés kerül,
// így a számjegy belseje fekete marad. A jobb széle `right` px-re van az elem jobb szélétől,
// és balra nyúlik; a poszter a számjegy jobb részét eltakarja.
function OutlinedNumber({ value, size, right }: { value: number; size: number; right: number }) {
  const base = { fontSize: size };
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="absolute"
      style={{ right, bottom: BOTTOM_PAD - Math.round(size * DESCENT) }}>
      {OUTLINE_OFFSETS.map(([x, y]) => (
        <Text
          key={`${x}${y}`}
          allowFontScaling={false}
          className="absolute font-extrabold"
          style={[base, { left: x, top: y, color: colors.outline }]}>
          {value}
        </Text>
      ))}
      <Text allowFontScaling={false} className="font-extrabold" style={[base, { color: colors.background }]}>
        {value}
      </Text>
    </View>
  );
}

// „Népszerű Magyarországon” elem a 02 / 10 designból: sorszám a poszter mögött, állandó
// elemszélességgel. A kártya csak posztert mutat (a design posztereibe sült cím helykitöltő).
export function TrendingCard({
  rank,
  title,
  posterPath,
  width,
  onPress,
}: {
  rank: number;
  title: string;
  posterPath: string | null;
  width: number;
  onPress?: () => void;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const { lead, pitch, numberSize, numberOverlap } =
    trendingLayout[screenWidth >= TABLET_MIN_WIDTH ? 'tablet' : 'phone'];

  return (
    <View style={{ width: pitch, paddingBottom: BOTTOM_PAD }}>
      <OutlinedNumber value={rank} size={numberSize} right={pitch - lead - numberOverlap} />
      <View style={{ marginLeft: lead }}>
        <PosterCard title={title} posterPath={posterPath} width={width} onPress={onPress} />
      </View>
    </View>
  );
}

// Betöltés közbeni helykitöltő, az elem méretével (sorszám nélkül).
export function TrendingCardSkeleton({ width }: { width: number }) {
  const { width: screenWidth } = useWindowDimensions();
  const { lead, pitch } = trendingLayout[screenWidth >= TABLET_MIN_WIDTH ? 'tablet' : 'phone'];
  return (
    <View style={{ width: pitch, paddingBottom: BOTTOM_PAD }}>
      <View style={{ marginLeft: lead }}>
        <PosterCardSkeleton width={width} withCaption={false} />
      </View>
    </View>
  );
}
