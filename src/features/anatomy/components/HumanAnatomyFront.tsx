import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { G, Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { MuscleId, MuscleStatus, MUSCLE_STATUS_COLORS } from '../types';

interface HumanAnatomyFrontProps {
  selectedMuscle: MuscleId | null;
  onSelectMuscle: (muscle: MuscleId) => void;
  muscleStatusMap: Record<MuscleId, MuscleStatus>;
  width?: number;
  height?: number;
}

export function HumanAnatomyFront({
  selectedMuscle,
  onSelectMuscle,
  muscleStatusMap,
  width = 280,
  height = 420,
}: HumanAnatomyFrontProps) {
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
        <Defs>
          <LinearGradient id="silhouetteGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#18181B" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#09090B" stopOpacity="0.9" />
          </LinearGradient>
        </Defs>

        {/* Base Silhouette (Head, Neck, Hands, Feet) */}
        <G id="silhouette" opacity={0.6}>
          {/* Head */}
          <Circle cx="100" cy="22" r="14" fill="#27272A" />
          {/* Neck */}
          <Path d="M93 34 L107 34 L105 46 L95 46 Z" fill="#27272A" />
          {/* Hands */}
          <Circle cx="32" cy="168" r="6" fill="#27272A" />
          <Circle cx="168" cy="168" r="6" fill="#27272A" />
          {/* Feet */}
          <Path d="M72 284 L88 284 L85 294 L68 294 Z" fill="#27272A" />
          <Path d="M112 284 L128 284 L132 294 L115 294 Z" fill="#27272A" />
        </G>

        {/* 1. SHOULDERS (Deltoids Front) */}
        <G id="shoulders" onPress={() => onSelectMuscle('shoulders')}>
          {/* Left Deltoid */}
          <Path
            d="M66 48 C60 48 48 55 45 68 C42 80 48 90 56 94 C60 86 64 72 68 60 Z"
            fill={getColor('shoulders')}
            stroke={getStroke('shoulders')}
            strokeWidth={getStrokeWidth('shoulders')}
          />
          {/* Right Deltoid */}
          <Path
            d="M134 48 C140 48 152 55 155 68 C158 80 152 90 144 94 C140 86 136 72 132 60 Z"
            fill={getColor('shoulders')}
            stroke={getStroke('shoulders')}
            strokeWidth={getStrokeWidth('shoulders')}
          />
        </G>

        {/* 2. CHEST (Pectorals) */}
        <G id="chest" onPress={() => onSelectMuscle('chest')}>
          {/* Left Pec */}
          <Path
            d="M98 52 L68 52 C65 65 66 84 80 88 C90 90 98 84 98 70 Z"
            fill={getColor('chest')}
            stroke={getStroke('chest')}
            strokeWidth={getStrokeWidth('chest')}
          />
          {/* Right Pec */}
          <Path
            d="M102 52 L132 52 C135 65 134 84 120 88 C110 90 102 84 102 70 Z"
            fill={getColor('chest')}
            stroke={getStroke('chest')}
            strokeWidth={getStrokeWidth('chest')}
          />
        </G>

        {/* 3. BICEPS */}
        <G id="biceps" onPress={() => onSelectMuscle('biceps')}>
          {/* Left Bicep */}
          <Path
            d="M52 92 C46 95 44 112 46 126 C50 128 58 124 60 115 C62 104 58 95 52 92 Z"
            fill={getColor('biceps')}
            stroke={getStroke('biceps')}
            strokeWidth={getStrokeWidth('biceps')}
          />
          {/* Right Bicep */}
          <Path
            d="M148 92 C154 95 156 112 154 126 C150 128 142 124 140 115 C138 104 142 95 148 92 Z"
            fill={getColor('biceps')}
            stroke={getStroke('biceps')}
            strokeWidth={getStrokeWidth('biceps')}
          />
        </G>

        {/* 4. FOREARMS (Front) */}
        <G id="forearms" onPress={() => onSelectMuscle('forearms')}>
          {/* Left Forearm */}
          <Path
            d="M44 128 C38 136 34 152 33 162 C37 165 44 162 47 154 C50 144 51 134 44 128 Z"
            fill={getColor('forearms')}
            stroke={getStroke('forearms')}
            strokeWidth={getStrokeWidth('forearms')}
          />
          {/* Right Forearm */}
          <Path
            d="M156 128 C162 136 166 152 167 162 C163 165 156 162 153 154 C150 144 149 134 156 128 Z"
            fill={getColor('forearms')}
            stroke={getStroke('forearms')}
            strokeWidth={getStrokeWidth('forearms')}
          />
        </G>

        {/* 5. ABS (Rectus Abdominis) */}
        <G id="abs" onPress={() => onSelectMuscle('abs')}>
          {/* Upper Abs */}
          <Path
            d="M87 92 H98 V105 H87 Z M102 92 H113 V105 H102 Z"
            fill={getColor('abs')}
            stroke={getStroke('abs')}
            strokeWidth={getStrokeWidth('abs')}
          />
          {/* Mid Abs */}
          <Path
            d="M87 108 H98 V121 H87 Z M102 108 H113 V121 H102 Z"
            fill={getColor('abs')}
            stroke={getStroke('abs')}
            strokeWidth={getStrokeWidth('abs')}
          />
          {/* Lower Abs */}
          <Path
            d="M88 124 H98 V138 C94 144 90 144 88 138 Z M102 124 H112 V138 C110 144 106 144 102 138 Z"
            fill={getColor('abs')}
            stroke={getStroke('abs')}
            strokeWidth={getStrokeWidth('abs')}
          />
        </G>

        {/* 6. OBLIQUES */}
        <G id="obliques" onPress={() => onSelectMuscle('obliques')}>
          {/* Left Oblique */}
          <Path
            d="M74 92 C72 106 72 124 76 138 C80 138 84 134 84 120 C84 106 82 96 74 92 Z"
            fill={getColor('obliques')}
            stroke={getStroke('obliques')}
            strokeWidth={getStrokeWidth('obliques')}
          />
          {/* Right Oblique */}
          <Path
            d="M126 92 C128 106 128 124 124 138 C120 138 116 134 116 120 C116 106 118 96 126 92 Z"
            fill={getColor('obliques')}
            stroke={getStroke('obliques')}
            strokeWidth={getStrokeWidth('obliques')}
          />
        </G>

        {/* 7. QUADRICEPS (Thighs Front) */}
        <G id="quadriceps" onPress={() => onSelectMuscle('quadriceps')}>
          {/* Left Quad */}
          <Path
            d="M74 148 C68 160 66 185 70 205 C75 212 84 212 88 202 C93 186 94 165 92 148 Z"
            fill={getColor('quadriceps')}
            stroke={getStroke('quadriceps')}
            strokeWidth={getStrokeWidth('quadriceps')}
          />
          {/* Right Quad */}
          <Path
            d="M126 148 C132 160 134 185 130 205 C125 212 116 212 112 202 C107 186 106 165 108 148 Z"
            fill={getColor('quadriceps')}
            stroke={getStroke('quadriceps')}
            strokeWidth={getStrokeWidth('quadriceps')}
          />
        </G>

        {/* Knees */}
        <Circle cx="80" cy="216" r="5" fill="#27272A" />
        <Circle cx="120" cy="216" r="5" fill="#27272A" />

        {/* 8. CALVES (Front Shins & Gastrocnemius edges) */}
        <G id="calves" onPress={() => onSelectMuscle('calves')}>
          {/* Left Calf */}
          <Path
            d="M73 224 C68 238 69 256 74 274 C78 276 83 274 85 264 C87 250 86 235 83 224 Z"
            fill={getColor('calves')}
            stroke={getStroke('calves')}
            strokeWidth={getStrokeWidth('calves')}
          />
          {/* Right Calf */}
          <Path
            d="M127 224 C132 238 131 256 126 274 C122 276 117 274 115 264 C113 250 114 235 117 224 Z"
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
