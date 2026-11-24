import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { MuscleId, MuscleStatus, MUSCLE_STATUS_COLORS } from '../types';

interface HumanAnatomyBackProps {
  selectedMuscle: MuscleId | null;
  onSelectMuscle: (muscle: MuscleId) => void;
  muscleStatusMap: Record<MuscleId, MuscleStatus>;
  width?: number;
  height?: number;
}

export function HumanAnatomyBack({
  selectedMuscle,
  onSelectMuscle,
  muscleStatusMap,
  width = 280,
  height = 420,
}: HumanAnatomyBackProps) {
  const getColor = (id: MuscleId) => {
    const status = muscleStatusMap[id] ?? 'not_trained';
    return MUSCLE_STATUS_COLORS[status];
  };

  const isSelected = (id: MuscleId) => selectedMuscle === id;

  const getStroke = (id: MuscleId) => {
    if (isSelected(id)) return '#FFFFFF';
    return 'rgba(0, 0, 0, 0.4)';
  };

  const getStrokeWidth = (id: MuscleId) => (isSelected(id) ? 2.5 : 1);

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox="0 0 200 300" style={styles.svg}>
        {/* Silhouette (Head, Neck, Hands, Feet) */}
        <G id="silhouette" opacity={0.6}>
          {/* Back of Head */}
          <Circle cx="100" cy="22" r="14" fill="#27272A" />
          {/* Hands */}
          <Circle cx="32" cy="168" r="6" fill="#27272A" />
          <Circle cx="168" cy="168" r="6" fill="#27272A" />
          {/* Feet Back */}
          <Path d="M72 284 L88 284 L85 294 L68 294 Z" fill="#27272A" />
          <Path d="M112 284 L128 284 L132 294 L115 294 Z" fill="#27272A" />
        </G>

        {/* 1. TRAPS (Trapezius Upper & Mid diamond) */}
        <G id="traps" onPress={() => onSelectMuscle('traps')}>
          <Path
            d="M93 34 L100 48 L107 34 L124 48 L100 88 L76 48 Z"
            fill={getColor('traps')}
            stroke={getStroke('traps')}
            strokeWidth={getStrokeWidth('traps')}
          />
        </G>

        {/* 2. REAR DELTS (Shoulders Back) */}
        <G id="shoulders" onPress={() => onSelectMuscle('shoulders')}>
          {/* Left Rear Delt */}
          <Path
            d="M74 48 C64 48 50 56 46 68 C44 78 48 88 56 90 C62 82 68 70 74 60 Z"
            fill={getColor('shoulders')}
            stroke={getStroke('shoulders')}
            strokeWidth={getStrokeWidth('shoulders')}
          />
          {/* Right Rear Delt */}
          <Path
            d="M126 48 C136 48 150 56 154 68 C156 78 152 88 144 90 C138 82 132 70 126 60 Z"
            fill={getColor('shoulders')}
            stroke={getStroke('shoulders')}
            strokeWidth={getStrokeWidth('shoulders')}
          />
        </G>

        {/* 3. TRICEPS */}
        <G id="triceps" onPress={() => onSelectMuscle('triceps')}>
          {/* Left Tricep */}
          <Path
            d="M52 90 C46 94 44 112 46 124 C50 128 58 122 60 114 C62 102 58 94 52 90 Z"
            fill={getColor('triceps')}
            stroke={getStroke('triceps')}
            strokeWidth={getStrokeWidth('triceps')}
          />
          {/* Right Tricep */}
          <Path
            d="M148 90 C154 94 156 112 154 124 C150 128 142 122 140 114 C138 102 142 94 148 90 Z"
            fill={getColor('triceps')}
            stroke={getStroke('triceps')}
            strokeWidth={getStrokeWidth('triceps')}
          />
        </G>

        {/* 4. FOREARMS (Back) */}
        <G id="forearms" onPress={() => onSelectMuscle('forearms')}>
          {/* Left Forearm */}
          <Path
            d="M44 126 C38 134 34 150 33 162 C37 165 44 162 47 154 C50 144 51 132 44 126 Z"
            fill={getColor('forearms')}
            stroke={getStroke('forearms')}
            strokeWidth={getStrokeWidth('forearms')}
          />
          {/* Right Forearm */}
          <Path
            d="M156 126 C162 134 166 150 167 162 C163 165 156 162 153 154 C150 144 149 132 156 126 Z"
            fill={getColor('forearms')}
            stroke={getStroke('forearms')}
            strokeWidth={getStrokeWidth('forearms')}
          />
        </G>

        {/* 5. LATS (Latissimus Dorsi) */}
        <G id="lats" onPress={() => onSelectMuscle('lats')}>
          {/* Left Lat */}
          <Path
            d="M76 68 C70 82 72 106 78 122 C84 122 88 116 90 98 C92 84 88 74 76 68 Z"
            fill={getColor('lats')}
            stroke={getStroke('lats')}
            strokeWidth={getStrokeWidth('lats')}
          />
          {/* Right Lat */}
          <Path
            d="M124 68 C130 82 128 106 122 122 C116 122 112 116 110 98 C108 84 112 74 124 68 Z"
            fill={getColor('lats')}
            stroke={getStroke('lats')}
            strokeWidth={getStrokeWidth('lats')}
          />
        </G>

        {/* 6. LOWER BACK (Erector Spinae) */}
        <G id="lower_back" onPress={() => onSelectMuscle('lower_back')}>
          <Path
            d="M92 92 H108 V136 H92 Z"
            fill={getColor('lower_back')}
            stroke={getStroke('lower_back')}
            strokeWidth={getStrokeWidth('lower_back')}
          />
        </G>

        {/* 7. GLUTES (Gluteus Maximus) */}
        <G id="glutes" onPress={() => onSelectMuscle('glutes')}>
          {/* Left Glute */}
          <Path
            d="M74 138 C68 144 68 166 74 176 C84 178 94 174 98 158 C98 144 90 138 74 138 Z"
            fill={getColor('glutes')}
            stroke={getStroke('glutes')}
            strokeWidth={getStrokeWidth('glutes')}
          />
          {/* Right Glute */}
          <Path
            d="M126 138 C132 144 132 166 126 176 C116 178 106 174 102 158 C102 144 110 138 126 138 Z"
            fill={getColor('glutes')}
            stroke={getStroke('glutes')}
            strokeWidth={getStrokeWidth('glutes')}
          />
        </G>

        {/* 8. HAMSTRINGS (Back of Thighs) */}
        <G id="hamstrings" onPress={() => onSelectMuscle('hamstrings')}>
          {/* Left Hamstring */}
          <Path
            d="M74 180 C68 190 68 206 72 214 C78 216 86 216 88 208 C92 198 94 186 92 180 Z"
            fill={getColor('hamstrings')}
            stroke={getStroke('hamstrings')}
            strokeWidth={getStrokeWidth('hamstrings')}
          />
          {/* Right Hamstring */}
          <Path
            d="M126 180 C132 190 132 206 128 214 C122 216 114 216 112 208 C108 198 106 186 108 180 Z"
            fill={getColor('hamstrings')}
            stroke={getStroke('hamstrings')}
            strokeWidth={getStrokeWidth('hamstrings')}
          />
        </G>

        {/* Back of Knee */}
        <Circle cx="80" cy="218" r="4" fill="#27272A" />
        <Circle cx="120" cy="218" r="4" fill="#27272A" />

        {/* 9. CALVES BACK (Gastrocnemius Diamond) */}
        <G id="calves" onPress={() => onSelectMuscle('calves')}>
          {/* Left Calf Diamond */}
          <Path
            d="M72 224 C66 236 68 256 74 274 C78 276 84 274 86 262 C88 248 86 234 82 224 Z"
            fill={getColor('calves')}
            stroke={getStroke('calves')}
            strokeWidth={getStrokeWidth('calves')}
          />
          {/* Right Calf Diamond */}
          <Path
            d="M128 224 C134 236 132 256 126 274 C122 276 116 274 114 262 C112 248 114 234 118 224 Z"
            fill={getColor('calves')}
            stroke={getStroke('calves')}
            strokeWidth={getStrokeWidth('calves')}
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    overflow: 'visible',
  },
});
