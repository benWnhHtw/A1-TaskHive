<template>
  <section class="task-list" aria-label="Aufgabenliste">
    <article v-for="task in tasks" :key="task.id" class="task-card">
      <div>
        <p class="task-status" :class="`task-status-${task.status}`">
          {{ task.status === 'done' ? 'Erledigt' : 'Offen' }}
        </p>
        <h3>{{ task.title }}</h3>
        <p>{{ task.assigneeName }} - faellig am {{ formatDate(task.dueDate) }}</p>
      </div>

      <button v-if="task.status === 'open'" type="button" @click="$emit('markDone', task.id)">
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

function formatDate(value) {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}
</script>
