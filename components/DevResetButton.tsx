import AsyncStorage from '@react-native-async-storage/async-storage';
import { DevSettings, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// CSAK FEJLESZTÉSHEZ (a gyökér layout `__DEV__` esetén rendereli): törli az AsyncStorage-t
// (szolgáltatók, onboarding, beállítások, később watchlist), és újratölti az appot, így az
// onboarding újra kipróbálható. Ship előtt eltávolítandó (D-029).
export function DevResetButton() {
  const insets = useSafeAreaInsets();

  async function reset() {
    await AsyncStorage.clear();
    DevSettings.reload();
  }

  return (
    <View className="absolute" style={{ top: insets.top + 4, right: 72 }}>
      <Pressable
        onPress={reset}
        accessibilityRole="button"
        className="rounded-pill border border-accent bg-background/80 px-3 py-1 active:opacity-60">
        <Text className="font-bold text-[11px] text-accent">DEV · RESET</Text>
      </Pressable>
    </View>
  );
}
