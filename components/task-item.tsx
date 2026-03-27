import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { useTaskStore } from '@/store/use-task-store';
import { Task } from '@/types/task';
import { formatTaskDate } from '@/utils/date';

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function TaskItemComponent({ task, onToggle, onDelete }: TaskItemProps) {
  const colors = useAppTheme();
  const category = useTaskStore((state) => state.categories.find((item) => item.id === task.categoryId));
  const timeFormat = useTaskStore((state) => state.settings.timeFormat);
  const done = task.status === 'done';

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}> 
      <Pressable onPress={() => onToggle(task.id)} style={styles.content}>
        <View style={[styles.checkbox, { borderColor: done ? colors.accent : colors.textMuted, backgroundColor: done ? colors.accent : 'transparent' }]}>
          {done ? <Ionicons name="checkmark" size={14} color="#F8FAFC" /> : null}
        </View>
        <View style={styles.textBlock}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.text }, done && { color: colors.textMuted, textDecorationLine: 'line-through' }]}>
            {task.title}
          </Text>
          <View style={styles.metaWrap}>
            {category ? (
              <View style={[styles.badge, { backgroundColor: `${category.color}22`, borderColor: `${category.color}44` }]}>
                <View style={[styles.badgeDot, { backgroundColor: category.color }]} />
                <Text style={[styles.badgeText, { color: category.color }]}>{category.name}</Text>
              </View>
            ) : null}
            <View style={styles.createdRow}>
              <Ionicons name="time-outline" size={12} color={colors.textMuted} />
              <Text style={[styles.timestamp, { color: colors.textMuted }]}>Created: {formatTaskDate(task.createdAt, timeFormat)}</Text>
            </View>
          </View>
        </View>
      </Pressable>

      <View style={styles.rightColumn}>
        <View style={[styles.countPill, { backgroundColor: colors.surfaceMuted }]}>
          <Text style={[styles.countText, { color: colors.textMuted }]}>{done ? '1/1' : '0/1'}</Text>
        </View>
        <Pressable hitSlop={8} onPress={() => onDelete(task.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

export const TaskItem = memo(TaskItemComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 92,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: 11,
    borderWidth: 2,
    height: 22,
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 6,
    width: 22,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  metaWrap: {
    gap: 8,
  },
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeDot: {
    borderRadius: 4,
    height: 8,
    marginRight: 6,
    width: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  createdRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 4,
  },
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  countPill: {
    borderRadius: 14,
    minWidth: 52,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  deleteButton: {
    padding: 4,
  },
});
