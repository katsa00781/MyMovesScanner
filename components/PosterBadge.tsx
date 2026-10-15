import { SymbolView } from 'expo-symbols';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';

// Poszterre tett pill (Blu-ray formátum, watchlist státusz). `accent`: narancs, pipával
// („Elérhető most”); egyébként áttetsző fekete. A hívó korlátozza a szélességet; ha a felirat
// nem fér el, a betű legfeljebb 80%-ig zsugorodik (iOS), utána három pont (D-030).
export function PosterBadge({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <View
      className={`h-[23px] shrink flex-row items-center gap-[6px] rounded-pill px-[10px] ${
        accent ? 'bg-accent' : 'bg-black/70'
      }`}>
      {accent ? (
        <SymbolView name="checkmark" size={11} weight="bold" tintColor={colors.ctaText} />
      ) : null}
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        className={`shrink font-bold text-[12px] ${accent ? 'text-ctaText' : 'text-textPrimary'}`}>
        {label}
      </Text>
    </View>
  );
}
