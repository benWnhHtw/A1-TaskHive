<template>
  <div ref="dropdownRoot" class="person-dropdown" @keydown.esc="closeDropdown">
    <button
      ref="triggerButton"
      type="button"
      class="person-dropdown-trigger"
      :class="{
        'person-dropdown-trigger-open': isOpen,
        'person-dropdown-trigger-active': selectedPersons.length > 0,
      }"
      :disabled="disabled || persons.length === 0"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      @click="toggleDropdown"
    >
      <span class="person-dropdown-summary">
        <template v-if="disabled">
          <span class="person-dropdown-placeholder">Mitbewohner werden geladen...</span>
        </template>

        <template v-else-if="persons.length === 0">
          <span class="person-dropdown-placeholder">Keine Mitbewohner verfügbar</span>
        </template>

        <template v-else-if="selectedPersons.length === 0">
          <span class="person-dropdown-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="9" cy="8" r="3.5" />
              <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
              <circle cx="17" cy="9" r="2.5" />
              <path d="M16 14.5c2.5 0 4.5 1.5 4.5 4" />
            </svg>
          </span>
          <span class="person-dropdown-placeholder">Alle Personen (Mehrfachauswahl)</span>
        </template>

        <template v-else-if="selectedPersons.length === 1">
          <span
            class="person-chip-avatar"
            :class="avatarClass(selectedPersons[0].id)"
            aria-hidden="true"
          >
            {{ getInitials(selectedPersons[0]) }}
          </span>
          <span class="person-dropdown-text">
            {{ selectedPersons[0].vorname }} {{ selectedPersons[0].name }}
          </span>
        </template>

        <template v-else>
          <span class="person-avatar-stack" aria-hidden="true">
            <span
              v-for="person in previewSelectedPersons"
              :key="person.id"
              class="person-chip-avatar person-stack-item"
              :class="avatarClass(person.id)"
            >
              {{ getInitials(person) }}
            </span>
            <span v-if="extraSelectedCount > 0" class="person-chip-avatar person-stack-more">
              +{{ extraSelectedCount }}
            </span>
          </span>
          <span class="person-dropdown-text">
            {{ selectedPersons.length }} Personen ausgewählt
          </span>
        </template>
      </span>

      <span class="person-dropdown-indicators">
        <span v-if="selectedPersons.length > 0" class="person-dropdown-badge">
          {{ selectedPersons.length }}
        </span>
        <span
          class="person-dropdown-chevron"
          :class="{ 'person-dropdown-chevron-open': isOpen }"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </span>
    </button>

    <div
      v-if="isOpen"
      :id="listboxId"
      class="person-dropdown-menu"
      role="group"
      aria-label="Personen auswählen"
    >
      <div class="person-dropdown-search">
        <input
          ref="searchInput"
          v-model.trim="searchQuery"
          type="search"
          placeholder="Person suchen..."
          aria-label="Person im Filter suchen"
        />
      </div>

      <div class="person-dropdown-actions">
        <span class="person-dropdown-count">
          {{ selectedPersonIds.length }} von {{ persons.length }} ausgewählt
        </span>
        <div class="person-dropdown-action-buttons">
          <button
            v-if="!areAllVisibleSelected && filteredPersons.length > 0"
            type="button"
            class="filter-link-button"
            @click="selectAllVisible"
          >
            Alle wählen
          </button>
          <button
            v-if="selectedPersonIds.length > 0"
            type="button"
            class="filter-link-button"
            @click="$emit('clear')"
          >
            Zurücksetzen
          </button>
        </div>
      </div>

      <p v-if="filteredPersons.length === 0" class="person-dropdown-empty">
        Keine Person für „{{ searchQuery }}“ gefunden.
      </p>

      <ul v-else class="person-dropdown-list" role="listbox" aria-multiselectable="true">
        <li
          v-for="person in filteredPersons"
          :key="person.id"
          role="option"
          :aria-selected="isSelected(person.id)"
        >
          <label
            class="person-dropdown-option"
            :class="{ 'person-dropdown-option-selected': isSelected(person.id) }"
          >
            <input
              type="checkbox"
              class="person-dropdown-checkbox"
              :checked="isSelected(person.id)"
              @change="$emit('toggle', person.id)"
            />
            <span class="person-custom-check" aria-hidden="true">
              <span v-if="isSelected(person.id)">✓</span>
            </span>
            <span class="person-chip-avatar" :class="avatarClass(person.id)" aria-hidden="true">
              {{ getInitials(person) }}
            </span>
            <span class="person-option-name">{{ person.vorname }} {{ person.name }}</span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  persons: {
    type: Array,
    required: true,
  },
  selectedPersonIds: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle', 'clear', 'set-persons'])

const listboxId = 'person-filter-dropdown-menu'
const dropdownRoot = ref(null)
const triggerButton = ref(null)
const searchInput = ref(null)
const isOpen = ref(false)
const searchQuery = ref('')

const selectedIdSet = computed(() => new Set(props.selectedPersonIds.map((id) => Number(id))))

const selectedPersons = computed(() =>
  props.persons.filter((person) => selectedIdSet.value.has(Number(person.id))),
)

const previewSelectedPersons = computed(() => selectedPersons.value.slice(0, 3))

const extraSelectedCount = computed(() => Math.max(0, selectedPersons.value.length - 3))

const filteredPersons = computed(() => {
  const query = searchQuery.value.toLowerCase()

  if (!query) {
    return props.persons
  }

  return props.persons.filter((person) => {
    const fullName = `${person.vorname ?? ''} ${person.name ?? ''}`.toLowerCase()
    return fullName.includes(query)
  })
})

const areAllVisibleSelected = computed(
  () =>
    filteredPersons.value.length > 0 &&
    filteredPersons.value.every((person) => selectedIdSet.value.has(Number(person.id))),
)

function isSelected(personId) {
  return selectedIdSet.value.has(Number(personId))
}

async function toggleDropdown() {
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    await nextTick()
    searchInput.value?.focus()
  } else {
    searchQuery.value = ''
  }
}

function closeDropdown(restoreFocus = true) {
  if (!isOpen.value) {
    return
  }

  isOpen.value = false
  searchQuery.value = ''

  if (restoreFocus) {
    triggerButton.value?.focus()
  }
}

function selectAllVisible() {
  const merged = new Set([
    ...props.selectedPersonIds.map((id) => Number(id)),
    ...filteredPersons.value.map((person) => Number(person.id)),
  ])
  emit('set-persons', [...merged])
}

function handlePointerDownOutside(event) {
  if (!isOpen.value || !dropdownRoot.value) {
    return
  }

  if (!dropdownRoot.value.contains(event.target)) {
    closeDropdown(false)
  }
}

function getInitials(person) {
  return `${person.vorname?.[0] ?? ''}${person.name?.[0] ?? ''}`.toUpperCase()
}

function avatarClass(id) {
  return ['avatar-yellow', 'avatar-blue', 'avatar-red', 'avatar-green'][Number(id) % 4]
}

onMounted(() => {
  document.addEventListener('pointerdown', handlePointerDownOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handlePointerDownOutside)
})
</script>
