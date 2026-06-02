import { onMounted, ref } from 'vue'

import { apiGateway } from '@/core/api/apiGateway'

export function useTasks() {
  const tasks = ref([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  async function loadTasks() {
    isLoading.value = true
    errorMessage.value = ''

    try {
      tasks.value = await apiGateway.tasks.listTasks()
    } catch {
      errorMessage.value = 'Aufgaben konnten nicht geladen werden. Pruefe API-Gateway oder Mock-Konfiguration.'
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(input) {
    errorMessage.value = ''

    try {
      const createdTask = await apiGateway.tasks.createTask(input)
      tasks.value = [createdTask, ...tasks.value]
    } catch {
      errorMessage.value = 'Aufgabe konnte nicht erstellt werden.'
    }
  }

  async function markTaskDone(taskId) {
    errorMessage.value = ''

    try {
      const updatedTask = await apiGateway.tasks.updateTask(taskId, { status: 'done' })
      tasks.value = tasks.value.map((task) => (task.id === taskId ? updatedTask : task))
    } catch {
      errorMessage.value = 'Aufgabe konnte nicht aktualisiert werden.'
    }
  }

  onMounted(loadTasks)

  return {
    tasks,
    isLoading,
    errorMessage,
    createTask,
    markTaskDone,
  }
}
