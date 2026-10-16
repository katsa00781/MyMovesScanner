import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { SegmentedControl } from '@/components/SegmentedControl';
import { SettingsSection } from '@/components/SettingsSection';
import { SettingsSeparator } from '@/components/SettingsRow';
import { strings } from '@/constants/strings';
import { colors } from '@/constants/theme';
import { signIn, signUp } from '@/lib/auth';

type Mode = 'signIn' | 'signUp';
type Message = { kind: 'error' | 'info'; text: string };

const modes = [
  { key: 'signIn', label: strings.account.modeSignIn },
  { key: 'signUp', label: strings.account.modeSignUp },
] as const;

// Bejelentkezés / regisztráció űrlap (e-mail + jelszó). Nincs hozzá design (D-052): a Beállítások
// kártya-stílusa, a szegmens-vezérlő és az onboarding CTA gombja. Siker után a `useAuthStore`
// változik, a Fiók képernyő ilyenkor a bejelentkezett nézetre vált.
export function AuthForm() {
  const passwordRef = useRef<TextInput>(null);
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !busy;

  function changeMode(next: Mode) {
    setMode(next);
    setMessage(null);
  }

  async function submit() {
    if (!canSubmit) return;
    setBusy(true);
    setMessage(null);
    const result = mode === 'signIn' ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (!result.ok) {
      setMessage({ kind: 'error', text: result.message });
    } else if (result.needsConfirmation) {
      setMode('signIn');
      setPassword('');
      setMessage({ kind: 'info', text: strings.account.confirmSent });
    }
  }

  const inputClass = 'h-full flex-1 p-0 text-[17px] text-textPrimary';

  return (
    <View style={{ gap: 17 }}>
      <SegmentedControl segments={[...modes]} value={mode} onChange={changeMode} />

      <SettingsSection title={strings.account.title} footnote={strings.account.formNote}>
        <View className="h-[54px] flex-row items-center px-[15px]">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={strings.account.email}
            placeholderTextColor={colors.textSecondary}
            selectionColor={colors.accent}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            accessibilityLabel={strings.account.email}
            className={inputClass}
          />
        </View>
        <SettingsSeparator />
        <View className="h-[54px] flex-row items-center px-[15px]">
          <TextInput
            ref={passwordRef}
            value={password}
            onChangeText={setPassword}
            placeholder={strings.account.password}
            placeholderTextColor={colors.textSecondary}
            selectionColor={colors.accent}
            secureTextEntry
            autoCapitalize="none"
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
            autoCorrect={false}
            textContentType={mode === 'signIn' ? 'password' : 'newPassword'}
            returnKeyType="go"
            onSubmitEditing={submit}
            accessibilityLabel={strings.account.password}
            className={inputClass}
          />
        </View>
      </SettingsSection>

      {message ? (
        <Text
          accessibilityRole={message.kind === 'error' ? 'alert' : undefined}
          className={`px-[17px] text-[14px] leading-[19.5px] ${
            message.kind === 'error' ? 'text-danger' : 'text-textSecondary'
          }`}>
          {message.text}
        </Text>
      ) : null}

      <Pressable
        onPress={submit}
        disabled={!canSubmit}
        accessibilityRole="button"
        className={`h-[56px] items-center justify-center rounded-button bg-accent px-4 active:opacity-80 ${
          canSubmit ? '' : 'opacity-40'
        }`}>
        {busy ? (
          <ActivityIndicator color={colors.ctaText} />
        ) : (
          <Text className="font-bold text-[17px] text-ctaText">
            {mode === 'signIn' ? strings.account.submitSignIn : strings.account.submitSignUp}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
