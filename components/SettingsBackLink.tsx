import { SymbolView } from 'expo-symbols';
import { Pressable, Text } from 'react-native';

import { strings } from '@/constants/strings';
import { colors } from '@/constants/theme';

// „‹ Főoldal” link a Beállítások tetején (08 design). Az iPad designban nincs (ott az oldalsáv
// visszavisz), de a Beállítások gyökér-route, oldalsáv nélkül (D-049), ezért ott is kell.
export function SettingsBackLink({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={strings.title.back}
      className="h-[22px] flex-row items-center gap-[7px] self-start active:opacity-60">
      <SymbolView name="chevron.left" size={17} weight="semibold" tintColor={colors.accent} />
      <Text className="text-[17px] text-accent">{strings.tabs.home}</Text>
    </Pressable>
  );
}
