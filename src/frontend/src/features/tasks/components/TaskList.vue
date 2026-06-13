<template>
  <section class="task-list" aria-label="Aufgabenliste">
    <article v-for="task in tasks" :key="task.id" class="task-card">
      <div>
        <p class="task-status" :class="`task-status-${getTaskStatusClass(task)}`">
          {{ isDone(task) ? 'Erledigt' : 'Offen' }}
        </p>
        <h3>{{ getTaskTitle(task) }}</h3>
        <p v-if="getTaskDescription(task)">{{ getTaskDescription(task) }}</p>
        <p>Faellig am {{ formatDate(getTaskDueDate(task)) }}</p>
      </div>

      <button v-if="!isDone(task)" type="button" @click="$emit('markDone', task.id)">
        Erledigen
      </button>
    </article>
  </section>
</template>

<script setup>
defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

defineEmits(['markDone'])

function getTaskTitle(task) {
  return task.titel ?? task.title
}

function getTaskDescription(task) {
  return task.beschreibung ?? task.assigneeName
}

function getTaskDueDate(task) {
  return task.faelligkeitsdatum ?? task.dueDate
}

function isDone(task) {
  return task.status === 'ERLEDIGT' || task.status === 'done'
}

function getTaskStatusClass(task) {
  return isDone(task) ? 'done' : 'open'
}

function formatDate(value) {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}
</script>
