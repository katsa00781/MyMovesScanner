import type { Href } from 'expo-router';
import type { SFSymbol } from 'expo-symbols';

import { strings } from '@/constants/strings';

export type TabItem = {
  /** Az app/(tabs) alatti route fájl neve. */
  name: string;
  href: Href;
  label: string;
  icon: SFSymbol;
};

export const tabs: readonly TabItem[] = [
  { name: 'index', href: '/', label: strings.tabs.home, icon: 'house' },
  { name: 'browse', href: '/browse', label: strings.tabs.browse, icon: 'square.grid.2x2' },
  { name: 'kids', href: '/kids', label: strings.tabs.kids, icon: 'face.smiling' },
  { name: 'search', href: '/search', label: strings.tabs.search, icon: 'magnifyingglass' },
  { name: 'watchlist', href: '/watchlist', label: strings.tabs.watchlist, icon: 'bookmark' },
];
