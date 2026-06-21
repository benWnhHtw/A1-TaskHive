<template>
  <div class="task-list-filter-controls" aria-label="Aufgaben filtern und sortieren">
    <section class="task-list-filter-controls__box">
      <label>
        Datum
        <select :value="dateDirection" @change="$emit('update:dateDirection', $event.target.value)">
          <option value="asc">Aufsteigend</option>
          <option value="desc">Absteigend</option>
        </select>
      </label>
    </section>

    <section class="task-list-filter-controls__box">
      <button
        type="button"
        class="task-list-filter-controls__toggle"
        :aria-expanded="isPersonFilterOpen"
        @click="isPersonFilterOpen = !isPersonFilterOpen"
      >
        Personen
        <span class="task-list-filter-controls__toggle-state">
          {{ isPersonFilterOpen ? 'Einklappen' : 'Ausklappen' }}
        </span>
      </button>

      <div v-if="isPersonFilterOpen" class="task-list-filter-controls__panel">
        <p class="hint">Wähle eine oder mehrere Personen. Ohne Auswahl werden alle Aufgaben angezeigt.</p>

        <label
          v-for="person in persons"
          :key="person.id"
          class="task-list-filter-controls__option"
        >
          <input
            :checked="selectedPersonIds.includes(Number(person.id))"
            type="checkbox"
            @change="togglePerson(person.id)"
          />
          <span>{{ person.vorname }} {{ person.name }}</span>
        </label>

        <button
          v-if="selectedPersonIds.length > 0"
          type="button"
          class="task-list-filter-controls__reset"
          @click="$emit('update:selectedPersonIds', [])"
        >
          Filter zurücksetzen
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  dateDirection: {
    type: String,
    default: 'asc',
  },
  selectedPersonIds: {
    type: Array,
    default: () => [],
  },
  persons: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:dateDirection', 'update:selectedPersonIds'])

const isPersonFilterOpen = ref(true)

function togglePerson(personId) {
  const normalizedPersonId = Number(personId)

  if (props.selectedPersonIds.map((value) => Number(value)).includes(normalizedPersonId)) {
    emit(
      'update:selectedPersonIds',
      props.selectedPersonIds.filter((value) => Number(value) !== normalizedPersonId),
    )
    return
  }

  emit('update:selectedPersonIds', [...props.selectedPersonIds, normalizedPersonId])
}
</script>