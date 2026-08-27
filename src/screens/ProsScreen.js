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
  const half = rating % 1 >= 0.5;
  return (
    <View style={styles.stars}>
      {Array.from({ length: 5 }, (_, i) => (
        <Text key={i} style={styles.star}>
          {i < full ? '★' : half && i === full ? '⯨' : '☆'}
        </Text>
      ))}
      <Text style={styles.ratingNum}>{rating}</Text>
    </View>
  );
};

const CATEGORY_ICONS = { All: 'people', Trainer: 'barbell', Dietitian: 'nutrition', Doctor: 'medical' };

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
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Find a Pro</Text>
          <Text style={styles.subtitle}>Connect with certified trainers, dietitians & doctors</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
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
            {PRO_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryBtn, activeCategory === cat && styles.categoryBtnActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Ionicons
                  name={CATEGORY_ICONS[cat] || 'person'}
                  size={14}
                  color={activeCategory === cat ? Colors.bg : Colors.textSecondary}
                />
                <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Results count */}
        <Text style={styles.resultsCount}>
          {filtered.length} professional{filtered.length !== 1 ? 's' : ''} available
        </Text>

        {/* Pro Cards */}
        {filtered.map((pro) => (
          <Card key={pro.id} style={styles.proCard}>
            {/* Avatar */}
            <View style={styles.proHeader}>
              <View style={styles.proAvatar}>
                <Text style={styles.proAvatarEmoji}>{pro.emoji}</Text>
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
              <Ionicons name="chatbubble-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.reviewCount}>{pro.reviews} reviews</Text>
            </View>

            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => navigation.navigate('Booking', { pro })}
            >
              <Text style={styles.bookBtnText}>Book Session</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.bg} />
            </TouchableOpacity>
          </Card>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyDesc}>Try a different search or category.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.md, paddingTop: 60, paddingBottom: 40 },

  header: { marginBottom: Spacing.md },
  title: { fontSize: FontSizes.xxxl, fontWeight: '900', color: Colors.textPrimary },
  subtitle: { fontSize: FontSizes.md, color: Colors.textSecondary, marginTop: 4 },

  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgInput, borderRadius: Radii.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, marginBottom: Spacing.md,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: FontSizes.md, color: Colors.textPrimary },

  categoryScroll: { marginBottom: Spacing.md },
  categoryRow: { flexDirection: 'row', gap: 8 },
  categoryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radii.full, backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
  },
  categoryBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  categoryText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textSecondary },
  categoryTextActive: { color: Colors.bg },

  resultsCount: {
    fontSize: FontSizes.xs, color: Colors.textMuted,
    marginBottom: 12, letterSpacing: 0.5,
  },

  proCard: { marginBottom: 12 },
  proHeader: { flexDirection: 'row', marginBottom: 10 },
  proAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center',
    marginRight: 12, borderWidth: 2, borderColor: Colors.borderAccent,
  },
  proAvatarEmoji: { fontSize: 26 },
  proInfo: { flex: 1 },
  proName: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.textPrimary },
  proSpecialty: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: '600', marginVertical: 2 },
  stars: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  star: { fontSize: 12, color: '#FFD700' },
  ratingNum: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginLeft: 4, fontWeight: '600' },
  proPriceContainer: { alignItems: 'flex-end' },
  proPrice: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.green },
  expBadge: {
    backgroundColor: Colors.bgElevated, borderRadius: Radii.sm,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  expText: { fontSize: FontSizes.xs, color: Colors.textMuted },

  proBio: {
    fontSize: FontSizes.sm, color: Colors.textSecondary,
    lineHeight: 20, marginBottom: 10,
  },
  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  reviewCount: { fontSize: FontSizes.xs, color: Colors.textMuted },

  bookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.accent, borderRadius: Radii.md,
    paddingVertical: 12, gap: 8, ...Shadows.accent,
  },
  bookBtnText: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.bg },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  emptyDesc: { fontSize: FontSizes.md, color: Colors.textSecondary },
});
