import { Pressable, Text, View } from 'react-native';

export type Segment<K extends string> = { key: K; label: string };

// iOS-szerű szegmens-vezérlő (07, 15 design): sötét sáv, a kijelölt elem világosabb pirula.
// A szegmensek a feliratukhoz igazodnak, a maradék helyet egyenlően kapják (`flex-auto`).
export function SegmentedControl<K extends string>({
  segments,
  value,
  onChange,
}: {
  segments: Segment<K>[];
  value: K;
  onChange: (key: K) => void;
}) {
  return (
    <View accessibilityRole="tablist" className="flex-row rounded-[11px] bg-surface p-[2px]">
      {segments.map((segment) => {
        const selected = segment.key === value;
        return (
          <Pressable
            key={segment.key}
            onPress={() => onChange(segment.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            className={`h-[34px] flex-auto items-center justify-center rounded-[9px] px-3 active:opacity-70 ${
              selected ? 'bg-segmentSelected' : ''
            }`}>
            <Text numberOfLines={1} className="font-semibold text-[15px] text-textPrimary">
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
