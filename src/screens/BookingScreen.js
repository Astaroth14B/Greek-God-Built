import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import useAppStore from '../store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';

export default function BookingScreen({ navigation, route }) {
  const { pro } = route.params || {};
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { addBooking } = useAppStore();

  if (!pro) return null;

  const handleBook = () => {
    if (!selectedSlot) return;
    const booking = {
      proId: pro.id,
      proName: pro.name,
      proSpecialty: pro.specialty,
      initials: pro.initials || pro.name.slice(0, 2).toUpperCase(),
      slot: selectedSlot,
      price: pro.price,
    };
    addBooking(booking);
    navigation.replace('Confirmation', { booking, pro });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
          <Text style={styles.backText}>Back to Coaches</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Book Consultation</Text>

        {/* Pro Summary Card */}
        <Card style={styles.proCard} highlighted>
          <View style={styles.proRow}>
            <View style={styles.proAvatar}>
              <Text style={styles.proInitials}>{pro.initials || pro.name.slice(0, 2).toUpperCase()}</Text>
            </View>
            <View style={styles.proInfo}>
              <Text style={styles.proName}>{pro.name}</Text>
              <Text style={styles.proSpecialty}>{pro.specialty}</Text>
              <Text style={styles.proPrice}>{pro.price}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={Colors.gold} />
              <Text style={styles.ratingVal}>{pro.rating}</Text>
            </View>
          </View>
          <View style={styles.expRow}>
            <Ionicons name="briefcase-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.expText}>{pro.experience} experience · {pro.reviews} completed sessions</Text>
          </View>
        </Card>

        {/* Session Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>SESSION SPECIFICATIONS</Text>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.gold} />
            <Text style={styles.detailText}>
              {new Date(Date.now() + 86400000).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })} (Tomorrow)
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="videocam-outline" size={16} color={Colors.gold} />
            <Text style={styles.detailText}>High-definition video consultation via secure link</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color={Colors.gold} />
            <Text style={styles.detailText}>45-minute dedicated 1-on-1 coaching breakdown</Text>
          </View>
        </Card>

        {/* Time Slots */}
        <Text style={styles.slotTitle}>AVAILABLE TIME SLOTS</Text>
        <View style={styles.slotsGrid}>
          {(pro.availability || []).map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slotBtn,
                  isSelected && styles.slotBtnActive,
                ]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={isSelected ? Colors.bg : Colors.textSecondary}
                />
                <Text style={[styles.slotText, isSelected && styles.slotTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedSlot && (
          <Card style={styles.selectedCard}>
            <View style={styles.selectedRow}>
              <Ionicons name="checkmark-circle-outline" size={18} color={Colors.gold} />
              <Text style={styles.selectedText}>
                Selected slot: {selectedSlot} tomorrow
              </Text>
            </View>
          </Card>
        )}

        {/* Price Summary */}
        <Card style={styles.priceCard}>
          <Text style={styles.sectionTitle}>PRICE BREAKDOWN</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>1 consultation session</Text>
            <Text style={styles.priceValue}>{pro.price}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Platform & protocol access</Text>
            <Text style={[styles.priceValue, { color: Colors.gold }]}>Complimentary</Text>
          </View>
          <View style={[styles.priceRow, styles.priceTotalRow]}>
            <Text style={styles.priceTotalLabel}>Total Due</Text>
            <Text style={styles.priceTotalValue}>{pro.price}</Text>
          </View>
        </Card>

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.bookBtn, !selectedSlot && styles.bookBtnDisabled]}
          disabled={!selectedSlot}
          onPress={handleBook}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark" size={20} color={selectedSlot ? Colors.bg : Colors.textMuted} />
          <Text style={[styles.bookBtnText, !selectedSlot && styles.bookBtnTextDisabled]}>
            {selectedSlot ? `Confirm Booking · ${selectedSlot}` : 'Select a time slot'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.cancelNote}>
          Free cancellation up to 24 hours prior to appointment.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.md, paddingTop: 60, paddingBottom: 40 },

  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.md },
  backText: { fontSize: FontSizes.xs, color: Colors.textSecondary },

  title: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.md },

  proCard: { marginBottom: Spacing.md },
  proRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  proAvatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center',
    marginRight: 12, borderWidth: 1, borderColor: Colors.borderGold,
  },
  proInitials: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.gold },
  proInfo: { flex: 1 },
  proName: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.textPrimary },
  proSpecialty: { fontSize: FontSizes.xs, color: Colors.gold, fontWeight: '600', marginTop: 1 },
  proPrice: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600', marginTop: 2 },
  ratingContainer: { alignItems: 'center', gap: 2 },
  ratingVal: { fontSize: FontSizes.xs, color: Colors.textPrimary, fontWeight: '700' },
  expRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 4 },
  expText: { fontSize: 10, color: Colors.textMuted },

  detailsCard: { marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  detailText: { flex: 1, fontSize: FontSizes.xs, color: Colors.textPrimary, lineHeight: 18 },

  slotTitle: {
    fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
  },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.md },
  slotBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: Radii.md, backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    minWidth: '47%',
  },
  slotBtnActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  slotText: { fontSize: FontSizes.xs, fontWeight: '600', color: Colors.textSecondary },
  slotTextActive: { color: Colors.bg, fontWeight: '800' },

  selectedCard: { marginBottom: Spacing.md, borderColor: Colors.borderGold, backgroundColor: Colors.goldGlow },
  selectedRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  selectedText: { fontSize: FontSizes.xs, color: Colors.gold, fontWeight: '700' },

  priceCard: { marginBottom: Spacing.md },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  priceLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary },
  priceValue: { fontSize: FontSizes.xs, color: Colors.textPrimary, fontWeight: '600' },
  priceTotalRow: {
    borderTopWidth: 1, borderTopColor: Colors.border,
    paddingTop: 10, marginTop: 4, marginBottom: 0,
  },
  priceTotalLabel: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textPrimary },
  priceTotalValue: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.gold },

  bookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.gold, paddingVertical: 16,
    borderRadius: Radii.full, gap: 8, marginBottom: 12, ...Shadows.gold,
  },
  bookBtnDisabled: { backgroundColor: Colors.bgElevated, shadowOpacity: 0, elevation: 0 },
  bookBtnText: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.bg, letterSpacing: 0.3 },
  bookBtnTextDisabled: { color: Colors.textMuted },

  cancelNote: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
});
