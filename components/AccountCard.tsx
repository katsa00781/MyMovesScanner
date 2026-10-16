import { useState } from 'react';

import { SettingsRow, SettingsSeparator } from '@/components/SettingsRow';
import { SettingsSection } from '@/components/SettingsSection';
import { strings } from '@/constants/strings';
import { colors } from '@/constants/theme';
import { signOut } from '@/lib/auth';
import type { AuthUser } from '@/store/useAuthStore';

// Bejelentkezett nézet: az e-mail cím és a kijelentkezés. Nincs hozzá design (D-052).
export function AccountCard({ user }: { user: AuthUser }) {
  const [busy, setBusy] = useState(false);

  async function handleSignOut() {
    if (busy) return;
    setBusy(true);
    await signOut();
    setBusy(false);
  }

  return (
    <SettingsSection title={strings.account.signedIn} footnote={strings.account.signedInNote}>
      <SettingsRow
        label={strings.account.email}
        icon={{ name: 'person.crop.circle', color: colors.settingsBlue }}
        value={user.email}
      />
      <SettingsSeparator inset />
      <SettingsRow label={strings.account.signOut} danger onPress={handleSignOut} />
    </SettingsSection>
  );
}
