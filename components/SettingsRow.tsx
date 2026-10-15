import { SymbolView, type SFSymbol } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type Props = {
  label: string;
  /** Színes négyzetben megjelenő ikon a sor elején (08, 16 design). */
  icon?: { name: SFSymbol; color: string };
  /** Jobbra igazított, másodlagos színű érték. */
  value?: string;
  /** Ha van, a sor koppintható és nyíl áll a végén. */
  onPress?: () => void;
  /** Egyéni jobb oldali elem (pl. kapcsoló); nyíl ilyenkor nincs. */
  right?: ReactNode;
  /** Narancs címke, alacsonyabb sor (a „Szolgáltatók szerkesztése”). */
  accent?: boolean;
};

// Egy sor a Beállítások kártyáiban. A koppintható sorban a Pressable-n csak className van (D-026).
export function SettingsRow({ label, icon, value, onPress, right, accent = false }: Props) {
  const content = (
    <>
      {icon ? (
        <View
          className="mr-[17px] h-[30px] w-[30px] items-center justify-center rounded-[8px]"
          style={{ backgroundColor: icon.color }}>
          <SymbolView name={icon.name} size={17} weight="medium" tintColor={colors.textPrimary} />
        </View>
      ) : null}
      <Text
        numberOfLines={1}
        className={`flex-1 text-[17px] ${accent ? 'text-accent' : 'text-textPrimary'}`}>
        {label}
      </Text>
      {value ? <Text className="ml-3 text-[17px] text-textSecondary">{value}</Text> : null}
      {onPress ? (
        <SymbolView
          name="chevron.right"
          size={13}
          weight="semibold"
          tintColor={colors.chevron}
          style={{ marginLeft: 9 }}
        />
      ) : null}
      {right}
    </>
  );

  const height = accent ? 'h-[52px]' : 'h-[54px]';
  const padding = onPress ? 'pl-[15px] pr-[18px]' : 'px-[15px]';
  if (!onPress) {
    return <View className={`${height} flex-row items-center ${padding}`}>{content}</View>;
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`${height} flex-row items-center ${padding} active:opacity-70`}>
      {content}
    </Pressable>
  );
}

// Vékony elválasztó a kártya sorai között; `inset`: az ikon utáni címkéhez igazítva indul.
export function SettingsSeparator({ inset = false }: { inset?: boolean }) {
  return <View className={`h-px bg-chip ${inset ? 'ml-[62px]' : ''}`} />;
}
