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
      proEmoji: pro.emoji,
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
          <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
          <Text style={styles.backText}>Back to Professionals</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Book a Session</Text>

        {/* Pro Summary */}
        <Card style={styles.proCard}>
          <View style={styles.proRow}>
            <View style={styles.proAvatar}>
              <Text style={styles.proAvatarEmoji}>{pro.emoji}</Text>
            </View>
            <View style={styles.proInfo}>
              <Text style={styles.proName}>{pro.name}</Text>
              <Text style={styles.proSpecialty}>{pro.specialty}</Text>
              <Text style={styles.proPrice}>{pro.price}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStar}>⭐</Text>
              <Text style={styles.ratingVal}>{pro.rating}</Text>
            </View>
          </View>
          <View style={styles.expRow}>
            <Ionicons name="briefcase-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.expText}>{pro.experience} experience • {pro.reviews} reviews</Text>
          </View>
        </Card>

        {/* Session Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Session Details</Text>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.accent} />
            <Text style={styles.detailText}>
              {new Date(Date.now() + 86400000).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })} (Tomorrow)
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="videocam-outline" size={16} color={Colors.accent} />
            <Text style={styles.detailText}>Video consultation (Zoom link sent via email)</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color={Colors.accent} />
            <Text style={styles.detailText}>45-minute session</Text>
          </View>
        </Card>

        {/* Time Slots */}
        <Text style={styles.slotTitle}>Choose a Time Slot</Text>
        <View style={styles.slotsGrid}>
          {(pro.availability || []).map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.slotBtn,
                selectedSlot === slot && styles.slotBtnActive,
              ]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Ionicons
                name="time"
                size={14}
                color={selectedSlot === slot ? Colors.bg : Colors.textSecondary}
              />
              <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedSlot && (
          <Card style={styles.selectedCard}>
            <View style={styles.selectedRow}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.green} />
              <Text style={styles.selectedText}>
                Selected: {selectedSlot} tomorrow
              </Text>
            </View>
          </Card>
        )}

        {/* Price Summary */}
        <Card style={styles.priceCard}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>1 session × {pro.price}</Text>
            <Text style={styles.priceValue}>{pro.price}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Platform fee</Text>
            <Text style={[styles.priceValue, { color: Colors.green }]}>FREE</Text>
          </View>
          <View style={[styles.priceRow, styles.priceTotalRow]}>
            <Text style={styles.priceTotalLabel}>Total</Text>
            <Text style={styles.priceTotalValue}>{pro.price}</Text>
          </View>
        </Card>

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.bookBtn, !selectedSlot && styles.bookBtnDisabled]}
          disabled={!selectedSlot}
          onPress={handleBook}
        >
          <Ionicons name="checkmark-circle" size={22} color={Colors.bg} />
          <Text style={styles.bookBtnText}>
            {selectedSlot ? `Confirm Booking at ${selectedSlot}` : 'Select a time slot'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.cancelNote}>
          📅 Free cancellation up to 24 hours before the session.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.md, paddingTop: 60, paddingBottom: 40 },

  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.md },
  backText: { fontSize: FontSizes.sm, color: Colors.textSecondary },

  title: { fontSize: FontSizes.xxxl, fontWeight: '900', color: Colors.textPrimary, marginBottom: Spacing.md },

  proCard: { marginBottom: Spacing.md },
  proRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  proAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center',
    marginRight: 12, borderWidth: 2, borderColor: Colors.borderAccent,
  },
  proAvatarEmoji: { fontSize: 24 },
  proInfo: { flex: 1 },
  proName: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.textPrimary },
  proSpecialty: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: '600' },
  proPrice: { fontSize: FontSizes.sm, color: Colors.green, fontWeight: '700', marginTop: 2 },
  ratingContainer: { alignItems: 'center' },
  ratingStar: { fontSize: 20 },
  ratingVal: { fontSize: FontSizes.sm, color: Colors.textSecondary, fontWeight: '700' },
  expRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  expText: { fontSize: FontSizes.xs, color: Colors.textMuted },

  detailsCard: { marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12,
  },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  detailText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textPrimary, lineHeight: 20 },

  slotTitle: {
    fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10,
  },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.md },
  slotBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: Radii.md, backgroundColor: Colors.bgCard,
    borderWidth: 1.5, borderColor: Colors.border,
    minWidth: '45%',
  },
  slotBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  slotText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textSecondary },
  slotTextActive: { color: Colors.bg },

  selectedCard: { marginBottom: Spacing.md, borderColor: Colors.green + '44', backgroundColor: Colors.green + '0F' },
  selectedRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  selectedText: { fontSize: FontSizes.sm, color: Colors.green, fontWeight: '600' },

  priceCard: { marginBottom: Spacing.md },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priceLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  priceValue: { fontSize: FontSizes.sm, color: Colors.textPrimary, fontWeight: '600' },
  priceTotalRow: {
    borderTopWidth: 1, borderTopColor: Colors.border,
    paddingTop: 10, marginTop: 4, marginBottom: 0,
  },
  priceTotalLabel: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary },
  priceTotalValue: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.accent },

  bookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.accent, paddingVertical: 16,
    borderRadius: Radii.full, gap: 10, marginBottom: 12, ...Shadows.accent,
  },
  bookBtnDisabled: { backgroundColor: Colors.bgElevated, shadowOpacity: 0, elevation: 0 },
  bookBtnText: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.bg },

  cancelNote: { fontSize: FontSizes.xs, color: Colors.textMuted, textAlign: 'center' },
});
