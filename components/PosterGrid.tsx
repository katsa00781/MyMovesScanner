import type { ReactElement } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { KidsTitleCardSkeleton } from '@/components/KidsTitleCard';
import { PosterCardSkeleton } from '@/components/PosterCard';
import {
  gridColumns,
  gridLayout,
  isWideContent,
  kidsLayout,
  layout,
  TABLET_MIN_WIDTH,
} from '@/constants/theme';

// Poszter rács a 07 / 15 designból: telefonon 3, iPaden 6 (álló iPaden 4) oszlop, a kártyaszélesség a képernyő
// (iPaden az oldalsáv nélküli) szélességéből jön. Nem görgethető: a képernyő ScrollView-jába kerül.
// `loading`: két sornyi helykitöltő kártya. `kids`: a Gyerek sarok (04 / 12) nagyobb kártyái:
// telefonon 2, iPaden 4 (álló iPaden 3) oszlop, saját margó, köz és sorköz (a felirat helyével együtt).
export function PosterGrid<T>({
  data,
  loading = false,
  kids = false,
  keyExtractor,
  renderCard,
  rowGap: rowGapOverride,
}: {
  data: T[];
  loading?: boolean;
  kids?: boolean;
  /** A rács sorköze, ha eltér a `gridLayout` értékétől (Böngészés telefonon). */
  rowGap?: number;
  keyExtractor: (item: T) => string;
  renderCard: (item: T, cardWidth: number) => ReactElement;
}) {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const mode = isTablet ? 'tablet' : 'phone';
  const { inset, gap, rowGap: defaultRowGap } = kids ? kidsLayout[mode] : gridLayout[mode];
  const rowGap = rowGapOverride ?? defaultRowGap;
  const columnsMode = isTablet && !isWideContent(width) ? 'tabletNarrow' : mode;
  const columns = gridColumns[columnsMode][kids ? 'kids' : 'default'];
  const available = width - (isTablet ? layout.sidebarWidth : 0);
  // Lefelé kerekítve, hogy a sor a törtpixelek miatt ne törjön új sorba.
  const cardWidth = Math.floor((available - 2 * inset - (columns - 1) * gap) / columns);

  return (
    <View className="flex-row flex-wrap" style={{ paddingHorizontal: inset, columnGap: gap, rowGap }}>
      {loading
        ? Array.from({ length: columns * 2 }, (_, i) =>
            kids ? (
              <KidsTitleCardSkeleton key={i} width={cardWidth} />
            ) : (
              <PosterCardSkeleton key={i} width={cardWidth} withCaption={false} />
            ),
          )
        : data.map((item) => (
            <View key={keyExtractor(item)}>{renderCard(item, cardWidth)}</View>
          ))}
    </View>
  );
}
