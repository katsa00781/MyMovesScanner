import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

// Beállítások szekció (08, 16 design): nagybetűs felirat, lekerekített kártya, opcionális lábjegyzet.
export function SettingsSection({
  title,
  footnote,
  children,
}: {
  title: string;
  footnote?: string;
  children: ReactNode;
}) {
  return (
    <View>
      <Text className="mb-[9px] pl-[17px] font-semibold text-[13px] uppercase leading-[16px] tracking-[0.5px] text-textSecondary">
        {title}
      </Text>
      <View className="overflow-hidden rounded-[14px] bg-surface">{children}</View>
      {footnote ? (
        <Text className="mt-2 px-[17px] text-[14px] leading-[19.5px] text-textSecondary">{footnote}</Text>
      ) : null}
    </View>
  );
}
