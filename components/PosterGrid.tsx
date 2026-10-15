import type { ReactElement } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { PosterCardSkeleton } from '@/components/PosterCard';
import { gridColumns, gridLayout, layout, TABLET_MIN_WIDTH } from '@/constants/theme';

// Poszter rács a 07 / 15 designból: telefonon 3, iPaden 6 oszlop, a kártyaszélesség a képernyő
// (iPaden az oldalsáv nélküli) szélességéből jön. Nem görgethető: a képernyő ScrollView-jába kerül.
// `loading`: két sornyi helykitöltő kártya.
export function PosterGrid<T>({
  data,
  loading = false,
  keyExtractor,
  renderCard,
}: {
  data: T[];
  loading?: boolean;
  keyExtractor: (item: T) => string;
  renderCard: (item: T, cardWidth: number) => ReactElement;
}) {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const { inset, gap, rowGap } = gridLayout[isTablet ? 'tablet' : 'phone'];
  const columns = gridColumns[isTablet ? 'tablet' : 'phone'].default;
  const available = width - (isTablet ? layout.sidebarWidth : 0);
  // Lefelé kerekítve, hogy a sor a törtpixelek miatt ne törjön új sorba.
  const cardWidth = Math.floor((available - 2 * inset - (columns - 1) * gap) / columns);

  return (
    <View className="flex-row flex-wrap" style={{ paddingHorizontal: inset, columnGap: gap, rowGap }}>
      {loading
        ? Array.from({ length: columns * 2 }, (_, i) => (
            <PosterCardSkeleton key={i} width={cardWidth} withCaption={false} />
          ))
        : data.map((item) => (
            <View key={keyExtractor(item)}>{renderCard(item, cardWidth)}</View>
          ))}
    </View>
  );
}
