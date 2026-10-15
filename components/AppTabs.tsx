import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { useWindowDimensions } from 'react-native';

import { BottomTabBar, BottomTabButton } from '@/components/BottomTabBar';
import { Sidebar, SidebarButton } from '@/components/Sidebar';
import { TABLET_MIN_WIDTH } from '@/constants/theme';
import { tabs } from '@/data/tabs';

// Telefonon alsó tab bar, tableten bal oldali oldalsáv (width >= 768).
export function AppTabs() {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const Button = isTablet ? SidebarButton : BottomTabButton;

  const triggers = tabs.map((tab) => (
    <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
      <Button tab={tab} />
    </TabTrigger>
  ));

  const list = <TabList asChild>{isTablet ? <Sidebar>{triggers}</Sidebar> : <BottomTabBar>{triggers}</BottomTabBar>}</TabList>;

  return (
    <Tabs style={{ flex: 1, flexDirection: isTablet ? 'row' : 'column' }}>
      {isTablet ? list : null}
      <TabSlot style={{ flex: 1 }} />
      {isTablet ? null : list}
    </Tabs>
  );
}
