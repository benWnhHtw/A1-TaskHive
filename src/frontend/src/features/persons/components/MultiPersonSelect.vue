<template>
  <div class="multi-person-select">
    <div class="multi-person-select__header">
      <label>Mitbewohner fuer Rotation</label>
      <p class="hint">Waehle Personen per Checkbox und sortiere die Reihenfolge unten.</p>
    </div>

    <div class="multi-person-select__layout">
      <fieldset class="multi-person-select__available" :disabled="disabled">
        <legend>Auswahl</legend>

        <label v-for="person in persons" :key="person.id" class="multi-person-select__option">
          <input
            :checked="selectedIds.includes(person.id)"
            type="checkbox"
            @change="togglePerson(person.id)"
          />
          <span>{{ person.vorname }} {{ person.name }}</span>
        </label>
      </fieldset>

      <div class="multi-person-select__order">
        <div class="multi-person-select__order-header">
          <strong>Reihenfolge</strong>
          <span class="hint">Oben ist zuerst in der Rotation.</span>
        </div>

        <p v-if="orderedSelectedPersons.length === 0" class="hint">
          Noch keine Mitbewohner ausgewaehlt.
        </p>

        <ol v-else class="multi-person-select__order-list">
          <li
            v-for="(person, index) in orderedSelectedPersons"
            :key="person.id"
            class="multi-person-select__order-item"
          >
            <span>{{ person.vorname }} {{ person.name }}</span>

            <div class="multi-person-select__actions">
              <button type="button" :disabled="disabled || index === 0" @click="moveUp(index)">
                Hoch
              </button>
              <button
                type="button"
                :disabled="disabled || index === orderedSelectedPersons.length - 1"
                @click="moveDown(index)"
              >
                Runter
              </button>
              <button type="button" :disabled="disabled" @click="removePerson(person.id)">
                Entfernen
              </button>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  persons: {
    type: Array,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const selectedIds = computed(() => props.modelValue.map((personId) => Number(personId)))
const personsById = computed(() => new Map(props.persons.map((person) => [Number(person.id), person])))
const orderedSelectedPersons = computed(() =>
  selectedIds.value
    .map((personId) => personsById.value.get(personId))
    .filter(Boolean),
)

function updateSelection(nextIds) {
  emit('update:modelValue', nextIds)
}

function togglePerson(personId) {
  if (props.disabled) {
    return
  }

  const normalizedPersonId = Number(personId)

  if (selectedIds.value.includes(normalizedPersonId)) {
    updateSelection(selectedIds.value.filter((currentId) => currentId !== normalizedPersonId))
    return
  }

  updateSelection([...selectedIds.value, normalizedPersonId])
}

function moveUp(index) {
  if (index <= 0 || props.disabled) {
    return
  }

  const nextIds = [...selectedIds.value]
  ;[nextIds[index - 1], nextIds[index]] = [nextIds[index], nextIds[index - 1]]
  updateSelection(nextIds)
}

function moveDown(index) {
  if (index >= selectedIds.value.length - 1 || props.disabled) {
    return
  }

  const nextIds = [...selectedIds.value]
  ;[nextIds[index + 1], nextIds[index]] = [nextIds[index], nextIds[index + 1]]
  updateSelection(nextIds)
}

function removePerson(personId) {
  if (props.disabled) {
    return
  }

  updateSelection(selectedIds.value.filter((currentId) => currentId !== Number(personId)))
}
</script>