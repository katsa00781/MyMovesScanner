import { Image } from 'expo-image';
import { View } from 'react-native';

import { images } from '@/constants/images';

// A `tmdb-logo.png` egy 1254 × 1254 px-es kép, amelyen a TMDB és a Mymoviescanner logó egymás
// mellett áll; innen csak a TMDB jelet (px-ben, a forrásképen) vágjuk ki, a kép átalakítása nélkül.
const SOURCE_SIZE = 1254;
const CROP = { x: 95, y: 495, width: 445, height: 210 };

export function TmdbLogo({ height = 30 }: { height?: number }) {
  const scale = height / CROP.height;
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="TMDB"
      className="overflow-hidden rounded-[6px]"
      style={{ width: CROP.width * scale, height }}>
      <Image
        source={images.tmdbLogo}
        contentFit="fill"
        style={{
          position: 'absolute',
          left: -CROP.x * scale,
          top: -CROP.y * scale,
          width: SOURCE_SIZE * scale,
          height: SOURCE_SIZE * scale,
        }}
      />
    </View>
  );
}
