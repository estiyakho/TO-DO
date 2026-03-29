import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryFormModal } from '@/components/category-form-modal';
import { EmptyState } from '@/components/empty-state';
import { TaskItem } from '@/components/task-item';
import { AppFonts } from '@/constants/fonts';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTaskStore } from '@/store/use-task-store';
import { runListAnimation } from '@/utils/layout-animation';

export default function CategoryDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const colors = useAppTheme();
  const categories = useTaskStore((state) => state.categories);
  const tasks = useTaskStore((state) => state.tasks);
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const deleteCategory = useTaskStore((state) => state.deleteCategory);
  const timeFormat = useTaskStore((state) => state.settings.timeFormat);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'all' | 'todo' | 'done'>('all');

  const categoryId = Array.isArray(params.id) ? params.id[0] : params.id;
  const category = categories.find((item) => item.id === categoryId);

  const totalTasks = tasks.filter((task) => task.categoryId === categoryId).length;
  const completedTasks = tasks.filter((task) => task.categoryId === categoryId && task.status === 'done').length;
  const remainingTasks = totalTasks - completedTasks;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.categoryId !== categoryId) return false;
      if (taskFilter === 'all') return true;
      return task.status === taskFilter;
    });
  }, [categoryId, taskFilter, tasks]);

  useEffect(() => {
    runListAnimation();
  }, [taskFilter]);

  const handleDelete = useCallback(
    (id: string) => {
      runListAnimation();
      deleteTask(id);
    },
    [deleteTask]
  );

  const handleDeleteCategory = useCallback(() => {
    if (!categoryId) return;
    runListAnimation();
    deleteCategory(categoryId);
    router.back();
  }, [categoryId, deleteCategory, router]);

  if (!category) {
    return (
      <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: colors.background }]}> 
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.container, { backgroundColor: colors.background }]}> 
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="chevron-back" size={18} color={colors.text} />
            </Pressable>
          </View>
          <EmptyState title="Category not found" description="This category may have been removed." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="chevron-back" size={18} color={colors.text} />
          </Pressable>

          <Pressable
            onPress={() => setEditModalVisible(true)}
            style={[styles.editButton, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}> 
            <Ionicons name="create-outline" size={16} color={colors.text} />
            <Text style={[styles.editButtonText, { color: colors.text }]}>Edit</Text>
          </Pressable>
        </View>

        <View style={[styles.heroCard, { backgroundColor: `${category.color}16`, borderColor: `${category.color}40` }]}> 
          <View style={styles.heroTitleRow}>
            <View style={styles.heroTextWrap}>
              <Text style={[styles.heroTitle, { color: colors.text }]}>{category.name}</Text>
              <Text style={[styles.heroSubtitle, { color: colors.textMuted }]} numberOfLines={2}>
                {category.description || 'All tasks saved in this category appear here.'}
              </Text>
            </View>
            <Pressable onPress={handleDeleteCategory} style={[styles.deleteButton, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Ionicons name="trash-outline" size={18} color={colors.text} />
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
              <Text style={[styles.statValue, { color: colors.text }]}>{totalTasks}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
              <Text style={[styles.statValue, { color: colors.text }]}>{completedTasks}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Done</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
              <Text style={[styles.statValue, { color: colors.text }]}>{remainingTasks}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Left</Text>
            </View>
          </View>
        </View>

        <View style={styles.filterRow}>
          {[
            { label: 'All', value: 'all' as const },
            { label: 'Doing', value: 'todo' as const },
            { label: 'Done', value: 'done' as const },
          ].map((option) => {
            const active = taskFilter === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setTaskFilter(option.value)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? category.color : colors.surfaceMuted,
                    borderColor: active ? category.color : colors.border,
                  },
                ]}>
                <Text style={[styles.filterChipText, { color: active ? '#F8FAFC' : colors.text }]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.taskCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FlatList
            contentContainerStyle={styles.listContent}
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <EmptyState
                title="No tasks"
                description={`No ${taskFilter === 'all' ? '' : taskFilter === 'todo' ? 'doing' : 'done'} tasks in this category yet.`}
              />
            }
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                category={{ color: category.color, name: category.name }}
                timeFormat={timeFormat}
                onDelete={handleDelete}
                onToggle={(id) => {
                  runListAnimation();
                  toggleTaskStatus(id);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      <CategoryFormModal
        visible={editModalVisible}
        initialCategory={category}
        onClose={() => setEditModalVisible(false)}
        onSaved={() => setEditModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  editButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  editButtonText: {
    fontFamily: AppFonts.semibold,
    fontSize: 14,
  },
  heroCard: {
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroTitle: {
    fontFamily: AppFonts.bold,
    fontSize: 24,
  },
  heroTextWrap: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 4,
  },
  heroSubtitle: {
    fontFamily: AppFonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  deleteButton: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  statCard: {
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  statValue: {
    fontFamily: AppFonts.bold,
    fontSize: 18,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: AppFonts.medium,
    fontSize: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    borderRadius: 12,
    borderWidth: 1,
    height: 72,
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipText: {
    fontFamily: AppFonts.semibold,
    fontSize: 14,
  },
  taskCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  listContent: {
    paddingVertical: 6,
    gap: 10,
  },
});
