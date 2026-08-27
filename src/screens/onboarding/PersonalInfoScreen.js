import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../../theme';
import useAppStore from '../../store/useAppStore';

const SEX_OPTIONS = [
  { label: '♂ Male', value: 'male' },
  { label: '♀ Female', value: 'female' },
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

        <Text style={styles.stepLabel}>Step 1 of 3</Text>
        <Text style={styles.title}>Tell us about{'\n'}yourself</Text>
        <Text style={styles.subtitle}>We'll personalize your plan based on this.</Text>

        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your first name"
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
            {SEX_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionBtn, sex === opt.value && styles.optionBtnActive]}
                onPress={() => setSex(opt.value)}
              >
                <Text style={[styles.optionText, sex === opt.value && styles.optionTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
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
        >
          <Text style={styles.nextBtnText}>Continue →</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.lg, paddingTop: 60 },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },

  stepLabel: {
    fontSize: FontSizes.xs,
    color: Colors.accent,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 42,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },

  field: { marginBottom: Spacing.md },
  fieldLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.bgInput,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: FontSizes.md,
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
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accent,
  },
  optionText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  optionTextActive: { color: Colors.accent },

  rowFields: { flexDirection: 'row' },

  nextBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: Radii.full,
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...Shadows.accent,
  },
  nextBtnDisabled: {
    backgroundColor: Colors.bgElevated,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: Colors.bg,
  },
});
