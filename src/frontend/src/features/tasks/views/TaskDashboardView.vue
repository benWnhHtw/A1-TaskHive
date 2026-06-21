<template>
  <section>
    <h1>TaskHive Walking Skeleton</h1>

    <TaskCreateForm
      :are-persons-loading="arePersonsLoading"
      :persons="persons"
      :persons-error-message="personsErrorMessage"
      @submit="createTask"
    />

    <p v-if="isLoading">Aufgaben werden geladen...</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="!isLoading && tasks.length === 0">Keine Aufgaben vorhanden.</p>

    <TaskListFilterControls
      v-if="tasks.length > 0"
      :date-direction="dateDirection"
      :persons="persons"
      :selected-person-ids="selectedPersonIds"
      @update:dateDirection="dateDirection = $event"
      @update:selectedPersonIds="selectedPersonIds = $event"
    />

    <TaskList
      v-if="tasks.length > 0"
      :tasks="visibleTasks"
      @mark-done="markTaskDone"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'

import TaskCreateForm from '@/features/tasks/components/TaskCreateForm.vue'
import TaskListFilterControls from '@/features/tasks/components/TaskListFilterControls.vue'
import TaskList from '@/features/tasks/components/TaskList.vue'
import { usePersons } from '@/features/persons/composables/usePersons'
import { useTasks } from '@/features/tasks/composables/useTasks'
import { useTaskListView } from '@/features/tasks/composables/useTaskListView'

const { tasks, isLoading, errorMessage, createTask, markTaskDone } = useTasks()
const { persons, arePersonsLoading, personsErrorMessage } = usePersons()

const dateDirection = ref('asc')
const selectedPersonIds = ref([])

const visibleTasks = useTaskListView(tasks, {
  dateDirection,
  selectedPersonIds,
  persons,
})
</script>
