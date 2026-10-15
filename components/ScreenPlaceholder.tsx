import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Ideiglenes üres képernyő; a valódi képernyő feature-ével kerül le.
export function ScreenPlaceholder({ title }: { title: string }) {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Text className="px-5 pt-4 font-extrabold text-title text-textPrimary">{title}</Text>
    </SafeAreaView>
  );
}
