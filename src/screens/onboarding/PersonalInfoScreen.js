import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../../theme';
import useAppStore from '../../store/useAppStore';
import { Ionicons } from '@expo/vector-icons';

const SEX_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

export default function PersonalInfoScreen({ navigation }) {
  const { profile, setProfile } = useAppStore();
  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState(String(profile.age || 25));
  const [sex, setSex] = useState(profile.sex || 'male');
  const [height, setHeight] = useState(String(profile.heightCm || 175));
  const [weight, setWeight] = useState(String(profile.weightKg || 75));

  const canContinue = name.trim() && age && height && weight;

  const handleContinue = () => {
    setProfile({
      ...profile,
      name: name.trim(),
      age: parseInt(age) || 25,
      sex,
      heightCm: parseFloat(height) || 175,
      weightKg: parseFloat(weight) || 75,
    });
    navigation.navigate('Goal');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View style={styles.progressRow}>
          <View style={[styles.progressDot, styles.progressActive]} />
          <View style={styles.progressLine} />
          <View style={styles.progressDot} />
          <View style={styles.progressLine} />
          <View style={styles.progressDot} />
        </View>

        <Text style={styles.stepLabel}>STEP 1 OF 3</Text>
        <Text style={styles.title}>Biometric Profile</Text>
        <Text style={styles.subtitle}>Enter baseline metrics for basal metabolic calculation.</Text>

        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Athlete Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="First name"
            placeholderTextColor={Colors.textMuted}
            autoCorrect={false}
          />
        </View>

        {/* Age */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="25"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>

        {/* Sex */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Biological Sex</Text>
          <View style={styles.optionRow}>
            {SEX_OPTIONS.map((opt) => {
              const isSelected = sex === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionBtn, isSelected && styles.optionBtnActive]}
                  onPress={() => setSex(opt.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Height / Weight */}
        <View style={styles.rowFields}>
          <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.fieldLabel}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="175"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.fieldLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="75"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, !canContinue && styles.nextBtnDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
          activeOpacity={0.85}
        >
          <Text style={[styles.nextBtnText, !canContinue && styles.nextBtnTextDisabled]}>
            Next Step
          </Text>
          <Ionicons name="arrow-forward" size={16} color={canContinue ? Colors.bg : Colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.lg, paddingTop: 60, paddingBottom: 40 },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  progressLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.border,
    marginHorizontal: 6,
  },

  stepLabel: {
    fontSize: 10,
    color: Colors.gold,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 18,
  },

  field: { marginBottom: Spacing.md },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.bgInput,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },

  optionRow: { flexDirection: 'row', gap: 10 },
  optionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radii.md,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  optionBtnActive: {
    backgroundColor: Colors.goldGlow,
    borderColor: Colors.borderGold,
  },
  optionText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  optionTextActive: { color: Colors.gold, fontWeight: '700' },

  rowFields: { flexDirection: 'row' },

  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    borderRadius: Radii.full,
    gap: 8,
    marginTop: Spacing.lg,
    ...Shadows.gold,
  },
  nextBtnDisabled: {
    backgroundColor: Colors.bgElevated,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: Colors.bg,
    letterSpacing: 0.5,
  },
  nextBtnTextDisabled: {
    color: Colors.textMuted,
  },
});
