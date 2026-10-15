import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors } from '@/constants/theme';
import { logoUrl } from '@/lib/tmdbImage';
import type { Provider } from '@/types/tmdb';

// „Előfizetéseim” szűrő a Böngészéshez (03 design): a gomb az összes szolgáltatót visszakapcsolja,
// mellette a saját szolgáltatók logói; a bekapcsoltak narancs keretesek, a kikapcsoltak halványak.
export function ProviderFilter({
  providers,
  activeIds,
  onToggle,
  onReset,
  inset,
}: {
  providers: Provider[];
  activeIds: number[];
  onToggle: (providerId: number) => void;
  onReset: () => void;
  /** Oldalsó margó: a sor a képernyő széléig görgethető, a tartalom a margótól indul. */
  inset: number;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="items-center gap-[3px]"
      contentContainerStyle={{ paddingHorizontal: inset }}>
      <Pressable
        onPress={onReset}
        accessibilityRole="button"
        className="mr-[5px] h-[46px] flex-row items-center rounded-[14px] bg-chip px-[17px] active:opacity-70">
        <SymbolView name="slider.horizontal.3" size={16} weight="semibold" tintColor={colors.textPrimary} />
        <Text className="ml-[11px] font-semibold text-[16px] text-textPrimary">
          {strings.browse.myServices}
        </Text>
      </Pressable>
      {providers.map((provider) => {
        const active = activeIds.includes(provider.provider_id);
        return (
          <Pressable
            key={provider.provider_id}
            onPress={() => onToggle(provider.provider_id)}
            accessibilityRole="checkbox"
            accessibilityLabel={provider.provider_name}
            accessibilityState={{ checked: active }}
            className={`h-[55px] w-[55px] items-center justify-center rounded-[17px] border-[2.5px] active:opacity-70 ${
              active ? 'border-accent' : 'border-transparent'
            }`}>
            <View className={`h-[46px] w-[46px] overflow-hidden rounded-[12px] ${active ? '' : 'opacity-50'}`}>
              <Image source={logoUrl(provider.logo_path)} style={{ flex: 1 }} contentFit="cover" />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
