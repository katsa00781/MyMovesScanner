import { useRouter } from 'expo-router';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountCard } from '@/components/AccountCard';
import { AuthForm } from '@/components/AuthForm';
import { ScreenTitle } from '@/components/ScreenTitle';
import { SettingsBackLink } from '@/components/SettingsBackLink';
import { strings } from '@/constants/strings';
import { accountLayout, settingsLayout, TABLET_MIN_WIDTH } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';

// Fiók: bejelentkezés / regisztráció, bejelentkezve a kijelentkezés (D-051). Nincs hozzá design
// (D-052): a Beállítások fejléc-elrendezését követi, az űrlap iPaden középre igazított és keskeny.
export default function AccountScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const layout = settingsLayout[width >= TABLET_MIN_WIDTH ? 'tablet' : 'phone'];
  const user = useAuthStore((state) => state.user);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
        <View
          style={{
            width: '100%',
            maxWidth: accountLayout.maxWidth + 2 * layout.inset,
            paddingHorizontal: layout.inset,
          }}>
          <View style={{ paddingTop: layout.backTop, paddingLeft: layout.backOffset }}>
            <SettingsBackLink label={strings.settings.title} onPress={() => router.back()} />
          </View>
          <View
            className="justify-center"
            style={{ height: layout.titleHeight, marginTop: layout.titleGap, paddingLeft: layout.titleOffset }}>
            <ScreenTitle>{strings.account.title}</ScreenTitle>
          </View>
          <View style={{ marginTop: layout.firstSectionGap }}>
            {user ? <AccountCard user={user} /> : <AuthForm />}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
