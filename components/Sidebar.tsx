import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { TabTriggerSlotProps } from 'expo-router/ui';
import type { ReactNode, Ref } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { strings } from '@/constants/strings';
import { colors, layout } from '@/constants/theme';
import type { TabItem } from '@/data/tabs';

// iPad oldalsáv: a TabList asChild ezt rendereli, a gyerekei a TabTrigger-ek.
export function Sidebar({ children }: { children?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="border-r border-separator bg-sidebar px-[15px]"
      style={{
        width: layout.sidebarWidth,
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 16,
      }}>
      <View className="mb-[22px] flex-row items-center gap-[10px] px-[15px]">
        <View className="h-[10px] w-[10px] rounded-pill bg-accent" />
        <Text className="font-nunito-extrabold text-[20px] text-textPrimary">
          {strings.appName}
        </Text>
      </View>
      <View className="gap-1">{children}</View>
      <View className="mx-[15px] my-4 h-px bg-separator" />
      <Link href="/settings" asChild>
        <Pressable
          className="h-12 flex-row items-center gap-[14px] rounded-card px-[15px]"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <SymbolView name="gearshape" size={22} tintColor={colors.textPrimary} />
          <Text className="font-nunito-semibold text-[17px] text-textPrimary">
            {strings.tabs.settings}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

type ButtonProps = TabTriggerSlotProps & { tab: TabItem; ref?: Ref<View> };

export function SidebarButton({ tab, isFocused, children: _children, ...props }: ButtonProps) {
  return (
    <Pressable
      {...props}
      className={`h-12 flex-row items-center gap-[14px] rounded-card px-[15px] ${
        isFocused ? 'bg-sidebarSelected' : ''
      }`}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      <SymbolView
        name={tab.icon}
        size={22}
        tintColor={isFocused ? colors.accent : colors.textPrimary}
      />
      <Text className="font-nunito-semibold text-[17px] text-textPrimary">{tab.label}</Text>
    </Pressable>
  );
}
