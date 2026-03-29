import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { AppFonts } from '@/constants/fonts';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTaskStore } from '@/store/use-task-store';
import { runListAnimation } from '@/utils/layout-animation';

export default function AddTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId?: string | string[] }>();
  const colors = useAppTheme();
  const addTask = useTaskStore((state) => state.addTask);
  const categories = useTaskStore((state) => state.categories);

  const initialCategory = Array.isArray(params.categoryId) ? params.categoryId[0] : params.categoryId;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(initialCategory ?? categories[0]?.id);
  const hasCategories = categories.length > 0;

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategoryId(initialCategory);
    } else if (!selectedCategoryId && categories.length) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [initialCategory, categories, selectedCategoryId]);

  const trimmedTitle = title.trim();

  const handleSave = () => {
    if (!trimmedTitle || !selectedCategoryId) {
      return;
    }

    runListAnimation();
    addTask({ title: trimmedTitle, description, categoryId: selectedCategoryId });
    router.back();
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ presentation: 'modal', title: 'Add Task' }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: colors.text }]}>New task</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Capture the thought before it slips away.</Text>

          <View style={styles.form}>
            <View>
              <Text style={[styles.label, { color: colors.textSoft }]}>Title</Text>
              <TextInput
                autoFocus
                onChangeText={setTitle}
                placeholder="What needs to be done?"
                placeholderTextColor="#64748B"
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                value={title}
              />
            </View>

            <View>
              <Text style={[styles.label, { color: colors.textSoft }]}>Description</Text>
              <TextInput
                multiline
                numberOfLines={4}
                onChangeText={setDescription}
                placeholder="Optional details"
                placeholderTextColor="#64748B"
                style={[styles.input, styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                textAlignVertical="top"
                value={description}
              />
            </View>

            <View>
              <View style={styles.categoryHeader}>
                <Text style={[styles.label, { color: colors.textSoft }]}>Category</Text>
                <Pressable onPress={() => router.push('/add-category')}>
                  <Text style={[styles.newCategoryText, { color: colors.accent }]}>New Category</Text>
                </Pressable>
              </View>
              {hasCategories ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
                  {categories.map((category) => (
                    <Pressable
                      key={category.id}
                      onPress={() => setSelectedCategoryId(category.id)}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: selectedCategoryId === category.id ? category.color : colors.surface,
                        borderColor: selectedCategoryId === category.id ? category.color : colors.border,
                      },
                    ]}>
                    <Text style={styles.categoryChipText}>{category.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              ) : (
                <View style={[styles.noCategoryBox, { borderColor: colors.border }]}>
                  <Text style={[styles.noCategoryText, { color: colors.textMuted }]}>
                    Create a category before adding a task.
                  </Text>
                  <Pressable
                    onPress={() => router.push('/add-category')}
                    style={[styles.noCategoryButton, { backgroundColor: colors.accent }]}>
                    <Text style={styles.noCategoryButtonText}>Add Category</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable onPress={() => router.back()} style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.secondaryButtonText, { color: colors.textSoft }]}>Cancel</Text>
            </Pressable>

            <Pressable
              disabled={!trimmedTitle || !selectedCategoryId}
              onPress={handleSave}
              style={[
                styles.primaryButton,
                { backgroundColor: colors.accent },
                (!trimmedTitle || !selectedCategoryId) && styles.primaryButtonDisabled,
              ]}>
              <Text style={styles.primaryButtonText}>Save Task</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  container: { flexGrow: 1, paddingBottom: 20, paddingHorizontal: 16, paddingTop: 10 },
  title: { fontFamily: AppFonts.bold, fontSize: 30, marginBottom: 8 },
  subtitle: { fontFamily: AppFonts.medium, fontSize: 15, lineHeight: 22, marginBottom: 20 },
  form: { gap: 14 },
  label: { fontFamily: AppFonts.semibold, fontSize: 14, marginBottom: 8 },
  input: { borderRadius: 18, borderWidth: 1, fontFamily: AppFonts.medium, fontSize: 16, minHeight: 56, paddingHorizontal: 14, paddingVertical: 12 },
  textArea: { minHeight: 88 },
  categoryHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  newCategoryText: { fontFamily: AppFonts.semibold, fontSize: 13 },
  categoryList: { gap: 8, paddingRight: 8 },
  categoryChip: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
    minWidth: 80,
    alignItems: 'center',
  },
  categoryChipText: { color: '#F8FAFC', fontFamily: AppFonts.semibold, fontSize: 13 },
  noCategoryBox: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    padding: 14,
  },
  noCategoryText: {
    fontFamily: AppFonts.medium,
    fontSize: 14,
    textAlign: 'center',
  },
  noCategoryButton: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  noCategoryButtonText: {
    color: '#F8FAFC',
    fontFamily: AppFonts.semibold,
    fontSize: 14,
  },
  footer: { flexDirection: 'row', gap: 12, marginTop: 'auto', paddingTop: 20 },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  secondaryButtonText: { fontFamily: AppFonts.semibold, fontSize: 15 },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  primaryButtonDisabled: { opacity: 0.45 },
  primaryButtonText: { color: '#F8FAFC', fontFamily: AppFonts.semibold, fontSize: 15 },
});
