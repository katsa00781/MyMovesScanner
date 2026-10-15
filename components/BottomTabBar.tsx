import { SymbolView } from 'expo-symbols';
import type { TabTriggerSlotProps } from 'expo-router/ui';
import type { ReactNode, Ref } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout } from '@/constants/theme';
import type { TabItem } from '@/data/tabs';

// A TabList asChild ezt a komponenst rendereli; a gyerekei a TabTrigger-ek.
export function BottomTabBar({ children }: { children?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row border-t border-separator bg-tabBar"
      style={{ height: layout.tabBarHeight + insets.bottom, paddingBottom: insets.bottom }}>
      {children}
    </View>
  );
}

type ButtonProps = TabTriggerSlotProps & { tab: TabItem; ref?: Ref<View> };

export function BottomTabButton({ tab, isFocused, children: _children, ...props }: ButtonProps) {
  const color = isFocused ? colors.accent : colors.textSecondary;
  return (
    <Pressable
      {...props}
      className="flex-1 items-center justify-center gap-1"
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      <SymbolView name={tab.icon} size={24} tintColor={color} />
      <Text className="font-bold text-[11px]" style={{ color }}>
        {tab.label}
      </Text>
    </Pressable>
  );
}
