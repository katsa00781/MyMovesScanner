// Fiók szinkron (D-051): a watchlist, a szolgáltatók és a beállítások egy dokumentumként
// utaznak. Offline-first: a store-ok a helyi forrás, a szerver másolat.
//
// Szabályok:
//  - belépéskor, ha az eszközön még nem volt fiók: a watchlist egyesül, a többi a szerveré;
//  - ha az eszközön másik fiók adata volt: a szerver felülír (nincs szerver adat → üres lap),
//    hogy az egyik fiók adata ne kerüljön a másikéba;
//  - ugyanaz a fiók: ha van el nem küldött helyi változás (`dirty`), a helyi nyer és feltöltődik,
//    egyébként a szerver felülír;
//  - módosítás után 1,5 mp késleltetéssel a teljes dokumentum feltöltődik (utolsó írás nyer).
import { AppState } from 'react-native';

import { fetchUserData, saveUserData, type SyncData } from '@/lib/syncApi';
import { useProvidersStore } from '@/store/useProvidersStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useSyncStore } from '@/store/useSyncStore';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import type { WatchlistItem } from '@/types/app';

const PUSH_DELAY_MS = 1500;

function readLocal(): SyncData {
  const { selectedProviderIds, onboardingDone } = useProvidersStore.getState();
  const { kidsAgeLimit, hideMature } = useSettingsStore.getState();
  const { items } = useWatchlistStore.getState();
  return {
    v: 1,
    providerIds: selectedProviderIds,
    onboardingDone,
    kidsAgeLimit,
    hideMature,
    watchlist: items,
  };
}

// Közben a store-ok változása nem számít helyi módosításnak (a setState szinkron értesít).
let applyingRemote = false;

function applyData(data: SyncData) {
  applyingRemote = true;
  try {
    useProvidersStore.setState({
      selectedProviderIds: data.providerIds,
      onboardingDone: data.onboardingDone,
    });
    useSettingsStore.setState({ kidsAgeLimit: data.kidsAgeLimit, hideMature: data.hideMature });
    useWatchlistStore.setState({ items: data.watchlist });
  } finally {
    applyingRemote = false;
  }
}

/** Alaphelyzet: mintha az app első indítása lenne (másik fiók adatának eltávolítására). */
function resetLocal() {
  const providers = useProvidersStore.getInitialState();
  const settings = useSettingsStore.getInitialState();
  applyData({
    v: 1,
    providerIds: providers.selectedProviderIds,
    onboardingDone: providers.onboardingDone,
    kidsAgeLimit: settings.kidsAgeLimit,
    hideMature: settings.hideMature,
    watchlist: [],
  });
}

/** Egyesíti a két watchlistet (típus + azonosító szerint), legújabb elöl. */
export function mergeWatchlists(local: WatchlistItem[], remote: WatchlistItem[]): WatchlistItem[] {
  const byKey = new Map<string, WatchlistItem>();
  for (const item of [...local, ...remote]) byKey.set(`${item.type}:${item.id}`, item);
  return [...byKey.values()].sort((a, b) => b.addedAt - a.addedAt);
}

// A műveletek sorban futnak, hogy a letöltés és a feltöltés ne keveredjen.
let queue: Promise<void> = Promise.resolve();
function enqueue(operation: () => Promise<void>) {
  queue = queue.then(operation, operation);
  return queue;
}

let changeCount = 0;

async function push() {
  const startedAt = changeCount;
  useSyncStore.setState({ status: 'syncing' });
  try {
    await saveUserData(readLocal());
    // Ha közben újabb módosítás érkezett, a `dirty` marad, és az is feltöltődik.
    useSyncStore.setState({ status: 'idle', dirty: changeCount !== startedAt });
  } catch {
    useSyncStore.setState({ status: 'error' });
  }
}

async function pull(userId: string) {
  useSyncStore.setState({ status: 'syncing' });
  try {
    const remote = await fetchUserData();
    const { lastUserId, dirty } = useSyncStore.getState();
    const local = readLocal();

    if (lastUserId !== null && lastUserId !== userId) {
      // Másik fiók adata van az eszközön: nem vihetjük át az újba.
      if (remote) applyData(remote);
      else resetLocal();
      useSyncStore.setState({ lastUserId: userId, dirty: false, status: 'idle' });
      if (!remote) await push();
      return;
    }

    if (!remote) {
      useSyncStore.setState({ lastUserId: userId });
      await push();
      return;
    }

    if (lastUserId === null) {
      // Az eszközön még nem volt fiók: a helyi watchlist nem veszhet el.
      applyData({ ...remote, watchlist: mergeWatchlists(local.watchlist, remote.watchlist) });
      useSyncStore.setState({ lastUserId: userId });
      await push();
      return;
    }

    if (dirty) {
      await push();
    } else {
      applyData(remote);
      useSyncStore.setState({ status: 'idle' });
    }
  } catch {
    useSyncStore.setState({ status: 'error' });
  }
}

let retry: (() => void) | null = null;

/** Újrapróbálja a szinkront (hibánál a Fiók képernyőn). Bejelentkezés nélkül nem csinál semmit. */
export function syncNow() {
  retry?.();
}

/**
 * Elindítja a szinkront a bejelentkezett felhasználóhoz: azonnali letöltés, majd módosítás utáni
 * feltöltés és letöltés, ha az app előtérbe kerül. Visszaadja a leállító függvényt.
 */
export function startSync(userId: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const pullNow = () => {
    enqueue(() => pull(userId));
  };
  retry = pullNow;

  function markChanged() {
    if (applyingRemote) return;
    changeCount += 1;
    useSyncStore.setState({ dirty: true });
    clearTimeout(timer);
    timer = setTimeout(() => {
      enqueue(push);
    }, PUSH_DELAY_MS);
  }

  const unsubscribers = [
    useWatchlistStore.subscribe((state, prev) => {
      if (state.items !== prev.items) markChanged();
    }),
    useProvidersStore.subscribe((state, prev) => {
      if (
        state.selectedProviderIds !== prev.selectedProviderIds ||
        state.onboardingDone !== prev.onboardingDone
      ) {
        markChanged();
      }
    }),
    useSettingsStore.subscribe((state, prev) => {
      if (state.kidsAgeLimit !== prev.kidsAgeLimit || state.hideMature !== prev.hideMature) {
        markChanged();
      }
    }),
  ];

  const appState = AppState.addEventListener('change', (state) => {
    if (state === 'active') pullNow();
  });

  pullNow();

  return () => {
    clearTimeout(timer);
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    appState.remove();
    if (retry === pullNow) retry = null;
  };
}
