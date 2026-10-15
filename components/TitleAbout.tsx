import { Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import type { TitleFacts } from '@/types/app';

function FactRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <View className="flex-row">
      <Text className="w-[83px] text-[14px] leading-[23.5px] text-textSecondary">{label}</Text>
      <Text className="min-w-0 flex-1 text-[14px] leading-[23.5px] text-textPrimary">{value}</Text>
    </View>
  );
}

// iPad „Névjegy” oszlop (14 design): leírás, alatta rendező / nyelv / ország. Telefonon a leírás
// a hero alatt áll, ez a blokk nincs.
export function TitleAbout({ overview, facts }: { overview: string; facts: TitleFacts }) {
  return (
    <View>
      <Text className="font-bold text-section leading-[28px] text-textPrimary">
        {strings.title.about}
      </Text>
      {overview ? (
        <Text className="mt-[13px] text-[17px] leading-[25px] text-textSoft">{overview}</Text>
      ) : null}
      <View className="mt-3">
        <FactRow label={strings.title.director} value={facts.director} />
        <FactRow label={strings.title.language} value={facts.language} />
        <FactRow label={strings.title.country} value={facts.country} />
      </View>
    </View>
  );
}
