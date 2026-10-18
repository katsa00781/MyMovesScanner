import { SymbolView } from 'expo-symbols';
import { Pressable, Text, TextInput, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors, searchLayout } from '@/constants/theme';

// Az Edge Function 300 karakternél hosszabb paramétert elutasít (hiba állapot lenne a találat helyett).
const MAX_QUERY_LENGTH = 100;

// Keresőmező + „Mégse” (05, 13 design): lekerekített mező nagyítóval és törlés-gombbal. A „Mégse”
// és a szöveg-gombok a designban 6 px-szel beljebb végződnek a margónál (ez a gomb belső kitöltése).
export function SearchField({
  value,
  onChangeText,
  onSubmit,
  onCancel,
  isTablet,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isTablet: boolean;
}) {
  const spec = searchLayout[isTablet ? 'tablet' : 'phone'];
  return (
    <View className="flex-row items-center">
      <View
        className="flex-1 flex-row items-center bg-surface pl-[15px] pr-3"
        style={{ height: spec.fieldHeight, borderRadius: spec.fieldRadius }}>
        <SymbolView name="magnifyingglass" size={17} tintColor={colors.textSecondary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder={strings.search.placeholder}
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.accent}
          returnKeyType="search"
          maxLength={MAX_QUERY_LENGTH}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never"
          accessibilityLabel={strings.search.placeholder}
          className={`ml-3 h-full flex-1 p-0 text-textPrimary ${isTablet ? 'text-[18px]' : 'text-[17px]'}`}
        />
        {value.length > 0 ? (
          <Pressable
            onPress={() => onChangeText('')}
            accessibilityRole="button"
            accessibilityLabel={strings.search.clearField}
            hitSlop={8}
            className="h-[23px] w-[23px] items-center justify-center rounded-pill bg-segmentSelected active:opacity-70">
            <SymbolView name="xmark" size={10} weight="bold" tintColor={colors.ctaText} />
          </Pressable>
        ) : null}
      </View>
      <Pressable
        onPress={onCancel}
        accessibilityRole="button"
        className="ml-3 px-[6px] py-2 active:opacity-70">
        <Text className="text-[17px] text-accent">{strings.common.cancel}</Text>
      </Pressable>
    </View>
  );
}
