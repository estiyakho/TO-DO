import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingActionButton } from '@/components/floating-action-button';
import { AppFonts } from '@/constants/fonts';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTaskStore } from '@/store/use-task-store';
import { getMonthGrid, getWeekdayLabels } from '@/utils/calendar';
import { formatMonthLabel, toDayKey } from '@/utils/date';

const GRID_COLUMNS = 7;
const GRID_GAP = 10;
const CARD_HORIZONTAL_PADDING = 28;

function parseHexColor(value: string) {
  const hex = value.replace('#', '');
  if (hex.length !== 6) return null;
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function readableTextOn(color: string) {
  const rgb = parseHexColor(color);
  if (!rgb) {
    return '#F8FAFC';
  }
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.6 ? '#0F172A' : '#F8FAFC';
}

export default function CalendarScreen() {
  const colors = useAppTheme();
  const { width } = useWindowDimensions();
  const scheduledTasks = useTaskStore((state) => state.scheduledTasks);
  const addScheduledTask = useTaskStore((state) => state.addScheduledTask);
  const deleteScheduledTask = useTaskStore((state) => state.deleteScheduledTask);
  const settings = useTaskStore((state) => state.settings);

  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() => toDayKey(new Date()));
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const weekdayLabels = useMemo(() => getWeekdayLabels(settings.firstDayOfWeek), [settings.firstDayOfWeek]);
  const monthGrid = useMemo(
    () => getMonthGrid(currentMonth, settings.firstDayOfWeek),
    [currentMonth, settings.firstDayOfWeek]
  );
  const taskDates = useMemo(() => new Set(scheduledTasks.map((task) => task.date)), [scheduledTasks]);
  const dayTasks = useMemo(
    () => scheduledTasks.filter((task) => task.date === selectedDay),
    [selectedDay, scheduledTasks]
  );

  const availableGridWidth = Math.max(width - CARD_HORIZONTAL_PADDING - 24, 280);
  const daySize = Math.floor((availableGridWidth - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS);

  const handleSaveTask = () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    addScheduledTask({ title: trimmed, description, date: selectedDay });
    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        <View style={styles.header}>
          <Pressable
            onPress={() => setCurrentMonth((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))}
            style={styles.headerIcon}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.monthTitle, { color: colors.text }]}>{formatMonthLabel(currentMonth)}</Text>
          <Pressable style={[styles.modePill, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}> 
            <Text style={[styles.modeText, { color: colors.textMuted }]}>Month</Text>
          </Pressable>
          <Pressable
            onPress={() => setCurrentMonth((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))}
            style={styles.headerIcon}>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.weekRow}>
          {weekdayLabels.map((label) => (
            <Text key={label} style={[styles.weekday, { color: colors.textMuted }]}>
              {label}
            </Text>
          ))}
        </View>

        <View style={[styles.grid, { gap: GRID_GAP }]}> 
          {monthGrid.map((cell) => {
            const selected = cell.key === selectedDay;
            const hasTasks = taskDates.has(cell.key);
            const labelColor = selected ? readableTextOn(colors.accent) : cell.inCurrentMonth ? colors.text : colors.textMuted;

            return (
              <Pressable
                key={cell.key}
                onPress={() => setSelectedDay(cell.key)}
                style={[
                  styles.dayCell,
                  {
                    backgroundColor: selected ? colors.accent : 'transparent',
                    height: daySize,
                    width: daySize,
                    borderWidth: selected ? 0 : 1,
                    borderColor: cell.inCurrentMonth ? colors.border : `${colors.border}55`,
                  },
                ]}>
                <Text style={[styles.dayNumber, { color: labelColor }]}>{cell.date.getDate()}</Text>
                {hasTasks ? (
                  <View
                    style={[
                      styles.dayDot,
                      { backgroundColor: selected ? readableTextOn(colors.accent) : colors.accent },
                    ]}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Calendar tasks</Text>
          {dayTasks.length ? (
            <Text style={[styles.sectionCount, { color: colors.textMuted }]}>{dayTasks.length}</Text>
          ) : null}
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {dayTasks.length ? (
            dayTasks.map((task) => (
              <View
                key={task.id}
                style={[styles.todoCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}> 
                <View style={styles.todoHeader}>
                  <Text style={[styles.todoTitle, { color: colors.text }]}>{task.title}</Text>
                  <Pressable onPress={() => deleteScheduledTask(task.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                  </Pressable>
                </View>
                {task.description ? (
                  <Text style={[styles.todoDescription, { color: colors.textMuted }]}>{task.description}</Text>
                ) : null}
              </View>
            ))
          ) : (
            <View style={styles.emptyBlock}>
              <View style={[styles.emptyIconWrap, { backgroundColor: `${colors.accent}33` }]}>
                <Ionicons name="calendar-outline" size={34} color={colors.accent} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Add a calendar task</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>Tasks created here stay on the calendar only.</Text>
            </View>
          )}
        </ScrollView>

        <FloatingActionButton onPress={() => setShowAddModal(true)} />
      </View>

      <Modal animationType="slide" transparent visible={showAddModal} onRequestClose={() => setShowAddModal(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowAddModal(false)} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalWrapper}>
          <View style={[styles.modalCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>New calendar task</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>Saved for {selectedDay}</Text>

            <View style={styles.formField}>
              <Text style={[styles.label, { color: colors.textSoft }]}>Title</Text>
              <TextInput
                autoFocus
                onChangeText={setTitle}
                placeholder="What do you want to remember?"
                placeholderTextColor="#64748B"
                style={[styles.modalInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                value={title}
              />
            </View>

            <View style={styles.formField}>
              <Text style={[styles.label, { color: colors.textSoft }]}>Notes</Text>
              <TextInput
                multiline
                numberOfLines={4}
                onChangeText={setDescription}
                placeholder="Optional details"
                placeholderTextColor="#64748B"
                style={[styles.modalInput, styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                textAlignVertical="top"
                value={description}
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => {
                  setShowAddModal(false);
                  setTitle('');
                  setDescription('');
                }}
                style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.secondaryButtonText, { color: colors.textSoft }]}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={!title.trim()}
                onPress={handleSaveTask}
                style={[styles.primaryButton, { backgroundColor: colors.accent }, !title.trim() && styles.primaryButtonDisabled]}>
                <Text style={styles.primaryButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 14, paddingTop: 8 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 14,
  },
  headerIcon: {
    padding: 6,
  },
  monthTitle: {
    flex: 1,
    fontFamily: AppFonts.bold,
    fontSize: 18,
    textAlign: 'center',
  },
  modePill: {
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  modeText: {
    fontFamily: AppFonts.semibold,
    fontSize: 13,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekday: {
    flex: 1,
    fontFamily: AppFonts.semibold,
    fontSize: 12,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: 14,
    justifyContent: 'center',
    paddingVertical: 6,
  },
  dayNumber: {
    fontFamily: AppFonts.semibold,
    fontSize: 18,
    textAlign: 'center',
  },
  dayDot: {
    borderRadius: 999,
    height: 6,
    marginTop: 6,
    width: 6,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontFamily: AppFonts.bold,
    fontSize: 17,
  },
  sectionCount: {
    fontFamily: AppFonts.semibold,
    fontSize: 13,
    marginLeft: 8,
  },
  body: {
    flexGrow: 1,
    paddingBottom: 96,
  },
  todoCard: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  todoHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 6,
  },
  todoTitle: {
    flex: 1,
    fontFamily: AppFonts.semibold,
    fontSize: 16,
  },
  todoDescription: {
    fontFamily: AppFonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  deleteButton: {
    padding: 6,
  },
  emptyBlock: {
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyIconWrap: {
    alignItems: 'center',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: 20,
    width: 80,
  },
  emptyTitle: {
    fontFamily: AppFonts.bold,
    fontSize: 18,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: AppFonts.medium,
    fontSize: 15,
    textAlign: 'center',
  },
  modalBackdrop: {
    backgroundColor: '#0f172a99',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  modalWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    padding: 14,
  },
  modalCard: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    padding: 16,
    width: '100%',
  },
  modalTitle: {
    fontFamily: AppFonts.bold,
    fontSize: 18,
  },
  modalSubtitle: {
    fontFamily: AppFonts.medium,
    fontSize: 14,
  },
  formField: {
    gap: 8,
  },
  label: {
    fontFamily: AppFonts.semibold,
    fontSize: 14,
  },
  modalInput: {
    borderRadius: 14,
    borderWidth: 1,
    fontFamily: AppFonts.medium,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 88,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontFamily: AppFonts.semibold,
    fontSize: 15,
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  primaryButtonDisabled: { opacity: 0.45 },
  primaryButtonText: {
    color: '#F8FAFC',
    fontFamily: AppFonts.semibold,
    fontSize: 15,
  },
});
