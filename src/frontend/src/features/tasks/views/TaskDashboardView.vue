<template>
  <section id="dashboard" class="dashboard">
    <header class="topbar">
      <div class="topbar-spacer" aria-hidden="true"></div>

      <div class="topbar-actions">
        <button
          class="avatar avatar-yellow avatar-button"
          type="button"
          aria-label="Einstellungen öffnen"
          @click="$emit('openSettings')"
        >
          AS
        </button>
      </div>
    </header>

    <div class="dashboard-grid" :class="{ 'dashboard-grid-wide': isStandaloneView }">
      <div class="dashboard-main">
        <div class="hero-row">
          <div>
            <h1>{{ pageTitle }}</h1>
            <p>{{ pageSubtitle }}</p>
          </div>
          <button
            v-if="showsHeaderCreateButton"
            class="primary-action"
            type="button"
            @click="$emit('openCreate')"
          >
            <span class="button-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </span>
            Aufgabe erstellen
          </button>
        </div>

        <div v-if="activeView === 'dashboard'" class="stats-grid" aria-label="Aufgaben-Statistik">
          <article class="stat-card">
            <span class="stat-label">Offene Aufgaben</span>
            <strong>{{ openTasks.length }}</strong>
            <span>{{ doneTasks.length }} erledigt</span>
          </article>
          <article class="stat-card">
            <span class="stat-label">Heute faellig</span>
            <strong>{{ dueTodayCount }}</strong>
            <span>aus offenen Aufgaben</span>
          </article>
          <article class="stat-card">
            <span class="stat-label">Heute erledigt</span>
            <strong>{{ doneTasks.length }}</strong>
            <span>Tolle Leistung!</span>
          </article>
          <article class="stat-card">
            <span class="stat-label">Mitbewohner online</span>
            <strong>{{ persons.length }}</strong>
            <span>von {{ persons.length }} gesamt</span>
          </article>
        </div>

        <section v-if="showsCreateForm" id="task-create" class="panel create-panel">
          <div class="section-heading">
            <div>
              <h2>Neue Aufgabe</h2>
              <p>Lege eine Aufgabe an und weise sie direkt einem Mitbewohner zu.</p>
            </div>
          </div>

          <TaskCreateForm
            :are-persons-loading="arePersonsLoading"
            :persons="persons"
            :persons-error-message="personsErrorMessage"
            @submit="handleCreateTask"
          />

          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </section>

        <section v-if="showsTaskBoard" id="task-board" class="board-section">
          <div class="board-header">
            <h2>Aufgaben-Board</h2>
            <div class="board-tools">
              <button type="button">
                <span class="tool-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 6h16" />
                    <path d="M7 12h10" />
                    <path d="M10 18h4" />
                  </svg>
                </span>
                Filter
              </button>
              <button type="button">
                <span class="tool-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14" />
                    <path d="m5 8 3-3 3 3" />
                    <path d="m5 16 3 3 3-3" />
                    <path d="M16 5h4" />
                    <path d="M14 12h6" />
                    <path d="M12 19h8" />
                  </svg>
                </span>
                Sortieren
              </button>
            </div>
          </div>

          <p v-if="isLoading" class="state-message">Aufgaben werden geladen...</p>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <p v-if="!isLoading && tasks.length === 0" class="state-message">
            Keine Aufgaben vorhanden.
          </p>

          <TaskList v-if="tasks.length > 0" :tasks="tasks" @mark-done="markTaskDone" />
        </section>

        <section v-if="isComingSoonView" class="panel coming-soon-page">
          <h2>{{ pageTitle }}</h2>
          <p>{{ comingSoonText }}</p>
        </section>
      </div>

      <aside v-if="!isStandaloneView" class="dashboard-side" aria-label="WG-Informationen">
        <section class="side-section">
          <h2>Mitbewohner</h2>
          <ul class="roommate-list">
            <li v-for="person in persons" :key="person.id">
              <div class="avatar" :class="avatarClass(person.id)">
                {{ getInitials(person) }}
              </div>
              <div>
                <strong>{{ person.vorname }} {{ person.name }}</strong>
                <span>Online</span>
              </div>
              <small>{{ taskCountForPerson(person.id) }} offen</small>
            </li>
          </ul>
          <p v-if="arePersonsLoading" class="state-message">Mitbewohner werden geladen...</p>
          <p v-if="personsErrorMessage" class="error">{{ personsErrorMessage }}</p>
        </section>

        <section id="coming-soon" class="side-section coming-soon">
          <h2>Kommende Termine</h2>
          <p>Coming soon: Kalender und Termine werden als naechstes eingebaut.</p>
        </section>

        <section class="side-section coming-soon">
          <div class="chat-heading">
            <h2>WG-Chat</h2>
          </div>
          <p>Coming soon: Nachrichten und Chat-Funktionen folgen spaeter.</p>
        </section>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

import TaskCreateForm from '@/features/tasks/components/TaskCreateForm.vue'
import TaskList from '@/features/tasks/components/TaskList.vue'
import { usePersons } from '@/features/persons/composables/usePersons'
import { useTasks } from '@/features/tasks/composables/useTasks'

const props = defineProps({
  activeView: {
    type: String,
    default: 'dashboard',
  },
})

defineEmits(['openCreate', 'openSettings'])

const { tasks, isLoading, errorMessage, createTask, markTaskDone } = useTasks()
const { persons, arePersonsLoading, personsErrorMessage } = usePersons()

const openTasks = computed(() => tasks.value.filter((task) => task.status === 'open'))
const doneTasks = computed(() => tasks.value.filter((task) => task.status === 'done'))
const activeView = computed(() => props.activeView)
const showsCreateForm = computed(() => ['dashboard', 'create'].includes(activeView.value))
const showsTaskBoard = computed(() => ['dashboard', 'tasks'].includes(activeView.value))
const showsHeaderCreateButton = computed(() => ['dashboard', 'tasks'].includes(activeView.value))
const isComingSoonView = computed(() =>
  ['calendar', 'chat', 'stats', 'settings'].includes(activeView.value),
)
const isStandaloneView = computed(() => activeView.value !== 'dashboard')
const successMessage = ref('')
const dueTodayCount = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return openTasks.value.filter((task) => task.dueDate === today).length
})

const pageTitle = computed(() => {
  const titles = {
    dashboard: 'Guten Tag, Alex',
    tasks: 'Aufgabenliste',
    create: 'Aufgabe erstellen',
    calendar: 'Kalender',
    chat: 'WG-Chat',
    stats: 'Statistiken',
    settings: 'Einstellungen',
  }

  return titles[activeView.value] ?? 'TaskHive'
})

const pageSubtitle = computed(() => {
  if (activeView.value === 'dashboard') {
    return 'WG Sonnenstrasse'
  }

  if (activeView.value === 'tasks') {
    return 'Alle vorhandenen Aufgaben im Board.'
  }

  if (activeView.value === 'create') {
    return 'Lege eine neue Aufgabe an und weise sie einem Mitbewohner zu.'
  }

  return 'Dieser Bereich wird vorbereitet.'
})

const comingSoonText = computed(() => {
  const texts = {
    calendar: 'Coming soon: Kalender und Termine werden als naechstes eingebaut.',
    chat: 'Coming soon: Nachrichten und Chat-Funktionen folgen spaeter.',
    stats: 'Coming soon: Auswertungen und Statistiken werden spaeter ergaenzt.',
    settings: 'Coming soon: Einstellungen werden spaeter ergaenzt.',
  }

  return texts[activeView.value] ?? 'Coming soon.'
})

function getInitials(person) {
  return `${person.vorname?.[0] ?? ''}${person.name?.[0] ?? ''}`.toUpperCase()
}

function avatarClass(id) {
  return ['avatar-yellow', 'avatar-blue', 'avatar-red', 'avatar-green'][Number(id) % 4]
}

function taskCountForPerson(personId) {
  return openTasks.value.filter((task) => Number(task.personId) === Number(personId)).length
}

async function handleCreateTask(input) {
  await createTask(input)
  successMessage.value = 'Aufgabe wurde erstellt.'
  window.setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}
</script>
