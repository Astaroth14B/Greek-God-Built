import React from 'react';
import Svg, { Line, Circle, Ellipse } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme';

/**
 * Clean gold skeleton/pose guide overlay for workout camera
 */
const SkeletonOverlay = ({ width = 200, height = 400 }) => {
  const color = Colors.gold;
  const sw = 2.5; // stroke width
  const dotR = 5; // joint dot radius

  // Normalized body keypoints (as % of width/height)
  const kp = {
    head: [0.5, 0.07],
    neck: [0.5, 0.14],
    lShoulder: [0.35, 0.2],
    rShoulder: [0.65, 0.2],
    lElbow: [0.28, 0.34],
    rElbow: [0.72, 0.34],
    lWrist: [0.22, 0.46],
    rWrist: [0.78, 0.46],
    lHip: [0.4, 0.5],
    rHip: [0.6, 0.5],
    lKnee: [0.36, 0.68],
    rKnee: [0.64, 0.68],
    lAnkle: [0.34, 0.86],
    rAnkle: [0.66, 0.86],
  };

  const pt = (key) => [kp[key][0] * width, kp[key][1] * height];

  const bones = [
    ['head', 'neck'],
    ['neck', 'lShoulder'], ['neck', 'rShoulder'],
    ['lShoulder', 'lElbow'], ['lElbow', 'lWrist'],
    ['rShoulder', 'rElbow'], ['rElbow', 'rWrist'],
    ['lShoulder', 'lHip'], ['rShoulder', 'rHip'],
    ['lHip', 'rHip'],
    ['lHip', 'lKnee'], ['lKnee', 'lAnkle'],
    ['rHip', 'rKnee'], ['rKnee', 'rAnkle'],
  ];

  const joints = Object.keys(kp);

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.overlay]}>
      <Svg width={width} height={height} style={styles.svg}>
        {/* Bones / limbs */}
        {bones.map(([a, b], i) => {
          const [x1, y1] = pt(a);
          const [x2, y2] = pt(b);
          return (
            <Line
              key={i}
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              stroke={color}
              strokeWidth={sw}
              strokeOpacity={0.8}
            />
          );
        })}
        {/* Head ellipse */}
        <Ellipse
          cx={pt('head')[0]}
          cy={pt('head')[1]}
          rx={width * 0.07}
          ry={width * 0.07}
          stroke={color}
          strokeWidth={sw}
          fill="transparent"
          strokeOpacity={0.9}
        />
        {/* Joint dots (skip head) */}
        {joints.filter(j => j !== 'head').map((key, i) => (
          <Circle
            key={i}
            cx={pt(key)[0]}
            cy={pt(key)[1]}
            r={dotR}
            fill={color}
            fillOpacity={0.9}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  svg: {},
});

export default SkeletonOverlay;
