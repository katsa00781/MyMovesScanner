import { useState } from 'react';

import { SettingsRow, SettingsSeparator } from '@/components/SettingsRow';
import { SettingsSection } from '@/components/SettingsSection';
import { strings } from '@/constants/strings';
import { colors } from '@/constants/theme';
import { signOut } from '@/lib/auth';
import { syncNow } from '@/lib/sync';
import type { AuthUser } from '@/store/useAuthStore';
import { useSyncStore } from '@/store/useSyncStore';

// Bejelentkezett nézet: az e-mail cím, a szinkron állapota és a kijelentkezés. Nincs hozzá design
// (D-052). Hiba esetén a Szinkron sor koppintásra újra próbálkozik.
export function AccountCard({ user }: { user: AuthUser }) {
  const [busy, setBusy] = useState(false);
  const status = useSyncStore((state) => state.status);
  const dirty = useSyncStore((state) => state.dirty);

  const failed = status === 'error';
  const syncValue = failed
    ? strings.account.syncFailed
    : status === 'syncing' || dirty
      ? strings.account.syncing
      : strings.account.syncUpToDate;

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
      <SettingsRow
        label={strings.account.sync}
        icon={{ name: 'arrow.triangle.2.circlepath', color: colors.settingsGreen }}
        value={syncValue}
        onPress={failed ? syncNow : undefined}
      />
      <SettingsSeparator inset />
      <SettingsRow label={strings.account.signOut} danger onPress={handleSignOut} />
    </SettingsSection>
  );
}
