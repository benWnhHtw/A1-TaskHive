<template>
  <div class="task-filter-wrapper">
    <div
      v-if="isOpen"
      id="task-filter-panel"
      class="panel filter-panel"
      role="region"
      aria-label="Aufgaben filtern"
    >
      <div class="filter-grid">
        <div class="filter-group">
          <div class="filter-group-header">
            <div class="filter-group-title">
              <span>Personen</span>
              <small class="filter-mode-tag">Mehrfachauswahl</small>
            </div>
            <button
              v-if="selectedPersonIds.length > 0"
              type="button"
              class="filter-link-button"
              @click="$emit('clear-persons')"
            >
              Auswahl aufheben
            </button>
          </div>

          <PersonMultiSelectDropdown
            :disabled="arePersonsLoading"
            :persons="persons"
            :selected-person-ids="selectedPersonIds"
            @clear="$emit('clear-persons')"
            @set-persons="$emit('set-persons', $event)"
            @toggle="$emit('toggle-person', $event)"
          />
        </div>

        <div class="filter-group">
          <div class="filter-group-header">
            <div class="filter-group-title">
              <span>Fälligkeitsdatum</span>
            </div>
            <button
              v-if="dueDateMode !== 'all'"
              type="button"
              class="filter-link-button"
              @click="$emit('clear-due-date')"
            >
              Zurücksetzen
            </button>
          </div>

          <div class="date-mode-list" role="group" aria-label="Nach Fälligkeitsdatum filtern">
            <button
              v-for="mode in DUE_DATE_MODES"
              :key="mode.value"
              type="button"
              class="filter-chip"
              :class="{ 'filter-chip-active': dueDateMode === mode.value }"
              :aria-pressed="dueDateMode === mode.value"
              @click="$emit('update:dueDateMode', mode.value)"
            >
              {{ mode.label }}
            </button>
          </div>

          <p v-if="dueDateMode === 'overdue'" class="filter-hint">
            Zeigt offene Aufgaben mit Fälligkeitsdatum vor heute.
          </p>

          <div v-if="dueDateMode === 'exact'" class="filter-date-inputs">
            <label class="filter-date-field">
              <span>Fällig am</span>
              <input
                :value="exactDate"
                type="date"
                @input="$emit('update:exactDate', $event.target.value)"
              />
            </label>
          </div>

          <div v-if="dueDateMode === 'range'" class="filter-date-inputs filter-date-inputs-range">
            <label class="filter-date-field">
              <span>Von</span>
              <input
                :value="dateFrom"
                :max="dateTo || undefined"
                type="date"
                @input="$emit('update:dateFrom', $event.target.value)"
              />
            </label>
            <label class="filter-date-field">
              <span>Bis</span>
              <input
                :value="dateTo"
                :min="dateFrom || undefined"
                type="date"
                @input="$emit('update:dateTo', $event.target.value)"
              />
            </label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasActiveFilters" class="active-filters-bar" aria-live="polite">
      <span class="filter-result-summary">
        <strong>{{ filteredCount }}</strong> von {{ totalCount }} Aufgaben
      </span>

      <div class="active-filter-tags">
        <button
          v-for="person in selectedPersons"
          :key="person.id"
          type="button"
          class="active-filter-tag"
          :aria-label="`Personenfilter ${person.vorname} ${person.name} entfernen`"
          @click="$emit('toggle-person', person.id)"
        >
          <span>{{ person.vorname }} {{ person.name }}</span>
          <span aria-hidden="true">×</span>
        </button>

        <button
          v-if="isDueDateFilterActive"
          type="button"
          class="active-filter-tag"
          aria-label="Fälligkeitsdatumsfilter entfernen"
          @click="$emit('clear-due-date')"
        >
          <span>Fälligkeit: {{ dueDateFilterLabel }}</span>
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <button type="button" class="filter-reset-all" @click="$emit('reset-all')">
        Alle Filter zurücksetzen
      </button>
    </div>
  </div>
</template>

<script setup>
import PersonMultiSelectDropdown from '@/features/persons/components/PersonMultiSelectDropdown.vue'
import { DUE_DATE_MODES } from '@/features/tasks/composables/useTaskFilter'

defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
  persons: {
    type: Array,
    required: true,
  },
  arePersonsLoading: {
    type: Boolean,
    default: false,
  },
  selectedPersonIds: {
    type: Array,
    default: () => [],
  },
  selectedPersons: {
    type: Array,
    default: () => [],
  },
  dueDateMode: {
    type: String,
    default: 'all',
  },
  exactDate: {
    type: String,
    default: '',
  },
  dateFrom: {
    type: String,
    default: '',
  },
  dateTo: {
    type: String,
    default: '',
  },
  isDueDateFilterActive: {
    type: Boolean,
    default: false,
  },
  dueDateFilterLabel: {
    type: String,
    default: '',
  },
  hasActiveFilters: {
    type: Boolean,
    default: false,
  },
  filteredCount: {
    type: Number,
    default: 0,
  },
  totalCount: {
    type: Number,
    default: 0,
  },
})

defineEmits([
  'toggle-person',
  'clear-persons',
  'set-persons',
  'update:dueDateMode',
  'update:exactDate',
  'update:dateFrom',
  'update:dateTo',
  'clear-due-date',
  'reset-all',
])
</script>
