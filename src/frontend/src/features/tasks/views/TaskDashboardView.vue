<template>
  <section>
    <h1>Aufgabenuebersicht</h1>

    <TaskForm :is-saving="isSaving" @submit="createTask" />

    <p v-if="isLoading">Aufgaben werden geladen...</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="!isLoading && tasks.length === 0">Keine Aufgaben vorhanden.</p>

    <TaskList v-if="tasks.length > 0" :tasks="tasks" @mark-done="markTaskDone" />
  </section>
</template>

<script setup>
import TaskForm from '@/features/tasks/components/TaskForm.vue'
import TaskList from '@/features/tasks/components/TaskList.vue'
import { useTasks } from '@/features/tasks/composables/useTasks'

const { tasks, isLoading, isSaving, errorMessage, createTask, markTaskDone } = useTasks()
</script>
