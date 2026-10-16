// Bejelentkezés, regisztráció, kijelentkezés (Supabase Auth, e-mail + jelszó, D-051).
import { isAuthRetryableFetchError, type AuthError, type Session } from '@supabase/supabase-js';

import { strings } from '@/constants/strings';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export type AuthResult =
  | { ok: true; /** Igaz, ha a regisztrációt e-mailben meg kell erősíteni (még nincs munkamenet). */ needsConfirmation: boolean }
  | { ok: false; message: string };

const errors = strings.account.errors;

// A Supabase hibakódjai (AuthError.code) → magyar szöveg.
const errorMessages: Record<string, string> = {
  invalid_credentials: errors.invalidCredentials,
  email_not_confirmed: errors.emailNotConfirmed,
  user_already_exists: errors.userExists,
  email_exists: errors.userExists,
  weak_password: errors.weakPassword,
  validation_failed: errors.invalidEmail,
  email_address_invalid: errors.invalidEmail,
  signup_disabled: errors.signupDisabled,
  over_request_rate_limit: errors.rateLimit,
  over_email_send_rate_limit: errors.rateLimit,
};

function messageFor(error: AuthError): string {
  if (isAuthRetryableFetchError(error)) return errors.network;
  return errorMessages[error.code ?? ''] ?? errors.generic;
}

function applySession(session: Session | null) {
  const email = session?.user.email;
  useAuthStore.setState({ user: session && email ? { id: session.user.id, email } : null });
}

/** Betölti a mentett munkamenetet és követi a változásokat. A gyökér layout hívja egyszer. */
export function startAuthListener() {
  supabase.auth
    .getSession()
    .then(({ data }) => applySession(data.session))
    .catch(() => applySession(null))
    .finally(() => useAuthStore.setState({ hasHydrated: true }));

  const { data } = supabase.auth.onAuthStateChange((_event, session) => applySession(session));
  return () => data.subscription.unsubscribe();
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  return error ? { ok: false, message: messageFor(error) } : { ok: true, needsConfirmation: false };
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
  if (error) return { ok: false, message: messageFor(error) };
  // Már regisztrált címnél a Supabase (e-mail megerősítéssel) hibát helyett üres `identities`-t ad.
  if (data.user?.identities?.length === 0) return { ok: false, message: errors.userExists };
  return { ok: true, needsConfirmation: data.session === null };
}

/** Kijelentkezik; a helyi adat (watchlist, szolgáltatók) az eszközön marad. */
export async function signOut() {
  await supabase.auth.signOut();
}
