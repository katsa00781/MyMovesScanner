import { Redirect } from 'expo-router';

import { AppTabs } from '@/components/AppTabs';
import { useProvidersStore } from '@/store/useProvidersStore';

export default function TabsLayout() {
  const onboardingDone = useProvidersStore((state) => state.onboardingDone);

  if (!onboardingDone) return <Redirect href="/onboarding" />;
  return <AppTabs />;
}
