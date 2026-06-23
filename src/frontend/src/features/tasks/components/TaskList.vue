<template>
  <section class="task-board" aria-label="Aufgabenliste">
    <div class="board-column">
      <div class="column-heading">
        <span><i class="status-dot status-open"></i>Offen</span>
        <strong>{{ openTasks.length }}</strong>
      </div>

      <article v-for="task in openTasks" :key="task.id" class="task-card">
        <span class="task-icon" aria-hidden="true">✦</span>
        <h3>{{ task.title }}</h3>
        <p v-if="task.description" class="task-description">{{ task.description }}</p>
        <div class="task-meta">
          <span class="task-status task-status-open">Offen</span>
          <span>◷ {{ formatDate(task.dueDate) }}</span>
        </div>
        <div class="task-footer">
          <span class="assignee-chip">{{ getInitials(task.assigneeName) }}</span>
          <span>{{ task.assigneeName }}</span>
        </div>
        <button type="button" @click="$emit('markDone', task.id)">Erledigen</button>
      </article>
    </div>

    <div class="board-column">
      <div class="column-heading">
        <span><i class="status-dot status-progress"></i>In Bearbeitung</span>
        <strong>0</strong>
      </div>
      <p class="empty-column">Noch keine Aufgaben in Bearbeitung.</p>
    </div>

    <div class="board-column">
      <div class="column-heading">
        <span><i class="status-dot status-done"></i>Erledigt</span>
        <strong>{{ doneTasks.length }}</strong>
      </div>

      <article v-for="task in doneTasks" :key="task.id" class="task-card task-card-done">
        <span class="task-icon" aria-hidden="true">◎</span>
        <h3>{{ task.title }}</h3>
        <p v-if="task.description" class="task-description">{{ task.description }}</p>
        <div class="task-meta">
          <span class="task-status task-status-done">Erledigt</span>
          <span>◷ {{ formatDate(task.dueDate) }}</span>
        </div>
        <div class="task-footer">
          <span class="assignee-chip">{{ getInitials(task.assigneeName) }}</span>
          <span>{{ task.assigneeName }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

defineEmits(['markDone'])

const openTasks = computed(() => props.tasks.filter((task) => task.status === 'open'))
const doneTasks = computed(() => props.tasks.filter((task) => task.status === 'done'))

function formatDate(value) {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
</script>
