import { SymbolView } from 'expo-symbols';
import { Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors } from '@/constants/theme';

// Zöld „felnőtt tartalom elrejtve” jelzés a Gyerek sarok tetején (04, 12 design).
// `width`: iPaden fix szélesség (a design szerint), telefonon a teljes sor.
export function MatureHiddenBadge({ width }: { width?: number }) {
  return (
    <View
      className="h-[31px] flex-row items-center gap-2 rounded-pill bg-kidsMintSoft pl-[14px]"
      style={width === undefined ? undefined : { width }}>
      <SymbolView name="checkmark.shield" size={15} weight="semibold" tintColor={colors.kidsMint} />
      <Text className="font-bold text-[15px] text-kidsMint">{strings.kids.matureHidden}</Text>
    </View>
  );
}
