import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { MOCK_PROS, PRO_CATEGORIES } from '../data/mockPros';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <View style={styles.stars}>
      {Array.from({ length: 5 }, (_, i) => (
        <Ionicons
          key={i}
          name={i < full ? 'star' : (hasHalf && i === full) ? 'star-half' : 'star-outline'}
          size={12}
          color={Colors.gold}
        />
      ))}
      <Text style={styles.ratingNum}>{rating}</Text>
    </View>
  );
};

const CATEGORY_ICONS = { All: 'people-outline', Trainer: 'barbell-outline', Dietitian: 'restaurant-outline', Doctor: 'medkit-outline' };

export default function ProsScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_PROS.filter((pro) => {
    const catMatch = activeCategory === 'All' || pro.category === activeCategory.toLowerCase();
    const searchMatch = pro.name.toLowerCase().includes(search.toLowerCase()) ||
      pro.specialty.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Coaches & Specialists</Text>
          <Text style={styles.subtitle}>Verified strength coaches, nutritionists & sports physicians</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or specialty..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* Category Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <View style={styles.categoryRow}>
            {PRO_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryBtn, isActive && styles.categoryBtnActive]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Ionicons
                    name={CATEGORY_ICONS[cat] || 'person-outline'}
                    size={14}
                    color={isActive ? Colors.gold : Colors.textSecondary}
                  />
                  <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Results count */}
        <Text style={styles.resultsCount}>
          {filtered.length} verified coach{filtered.length !== 1 ? 'es' : ''} available
        </Text>

        {/* Pro Cards */}
        {filtered.map((pro) => (
          <Card key={pro.id} style={styles.proCard}>
            {/* Avatar & Header */}
            <View style={styles.proHeader}>
              <View style={styles.proAvatar}>
                <Text style={styles.proInitials}>{pro.initials || pro.name.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View style={styles.proInfo}>
                <Text style={styles.proName}>{pro.name}</Text>
                <Text style={styles.proSpecialty}>{pro.specialty}</Text>
                <StarRating rating={pro.rating} />
              </View>
              <View style={styles.proPriceContainer}>
                <Text style={styles.proPrice}>{pro.price}</Text>
                <View style={styles.expBadge}>
                  <Text style={styles.expText}>{pro.experience}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.proBio}>{pro.bio}</Text>

            {/* Reviews */}
            <View style={styles.reviewRow}>
              <Ionicons name="chatbubble-outline" size={12} color={Colors.textMuted} />
              <Text style={styles.reviewCount}>{pro.reviews} verified sessions</Text>
            </View>

            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => navigation.navigate('Booking', { pro })}
              activeOpacity={0.85}
            >
              <Text style={styles.bookBtnText}>Book 1-on-1 Consultation</Text>
              <Ionicons name="arrow-forward" size={15} color={Colors.bg} />
            </TouchableOpacity>
          </Card>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={36} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No specialists found</Text>
            <Text style={styles.emptyDesc}>Try searching with a different keyword or category.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.md, paddingTop: 60, paddingBottom: 32 },

  header: { marginBottom: Spacing.md },
  title: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginTop: 4 },

  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgInput, borderRadius: Radii.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, marginBottom: Spacing.md,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: FontSizes.sm, color: Colors.textPrimary },

  categoryScroll: { marginBottom: Spacing.md },
  categoryRow: { flexDirection: 'row', gap: 8 },
  categoryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radii.full, backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
  },
  categoryBtnActive: { backgroundColor: Colors.goldGlow, borderColor: Colors.borderGold },
  categoryText: { fontSize: FontSizes.xs, fontWeight: '600', color: Colors.textSecondary },
  categoryTextActive: { color: Colors.gold, fontWeight: '700' },

  resultsCount: {
    fontSize: 10, color: Colors.textMuted,
    marginBottom: 12, letterSpacing: 0.8, textTransform: 'uppercase',
  },

  proCard: { marginBottom: 12 },
  proHeader: { flexDirection: 'row', marginBottom: 10 },
  proAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center',
    marginRight: 12, borderWidth: 1, borderColor: Colors.borderGold,
  },
  proInitials: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.gold },
  proInfo: { flex: 1 },
  proName: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textPrimary },
  proSpecialty: { fontSize: FontSizes.xs, color: Colors.gold, fontWeight: '600', marginTop: 1 },
  stars: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  ratingNum: { fontSize: 10, color: Colors.textSecondary, marginLeft: 4, fontWeight: '700' },
  proPriceContainer: { alignItems: 'flex-end' },
  proPrice: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textPrimary },
  expBadge: {
    backgroundColor: Colors.bgElevated, borderRadius: Radii.sm,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  expText: { fontSize: 9, color: Colors.textMuted, textTransform: 'uppercase' },

  proBio: {
    fontSize: FontSizes.xs, color: Colors.textSecondary,
    lineHeight: 18, marginBottom: 10,
  },
  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 12 },
  reviewCount: { fontSize: 10, color: Colors.textMuted },

  bookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.gold, borderRadius: Radii.md,
    paddingVertical: 12, gap: 6, ...Shadows.gold,
  },
  bookBtnText: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.bg, letterSpacing: 0.3 },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.textPrimary, marginTop: 10, marginBottom: 6 },
  emptyDesc: { fontSize: FontSizes.sm, color: Colors.textSecondary, textAlign: 'center' },
});
