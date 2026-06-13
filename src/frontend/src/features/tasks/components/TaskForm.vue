<template>
  <form class="task-form" novalidate @submit.prevent="submitTask">
    <div class="form-grid">
      <label>
        Titel
        <input
          v-model.trim="form.titel"
          :disabled="isSaving"
          aria-describedby="titel-error"
          placeholder="z. B. Kueche putzen"
        />
        <span v-if="validationErrors.titel" id="titel-error" class="field-error">
          {{ validationErrors.titel }}
        </span>
      </label>

      <label>
        Beschreibung
        <textarea
          v-model.trim="form.beschreibung"
          :disabled="isSaving"
          aria-describedby="beschreibung-error"
          placeholder="Was muss erledigt werden?"
          rows="4"
        />
        <span v-if="validationErrors.beschreibung" id="beschreibung-error" class="field-error">
          {{ validationErrors.beschreibung }}
        </span>
      </label>

      <label>
        Faelligkeitsdatum
        <input
          v-model="form.faelligkeitsdatum"
          :disabled="isSaving"
          aria-describedby="faelligkeitsdatum-error"
          type="date"
        />
        <span
          v-if="validationErrors.faelligkeitsdatum"
          id="faelligkeitsdatum-error"
          class="field-error"
        >
          {{ validationErrors.faelligkeitsdatum }}
        </span>
      </label>
    </div>

    <button type="submit" :disabled="isSaving">
      {{ isSaving ? 'Aufgabe wird gespeichert...' : 'Aufgabe erstellen' }}
    </button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  isSaving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const form = reactive({
  titel: '',
  beschreibung: '',
  faelligkeitsdatum: new Date().toISOString().slice(0, 10),
})

const validationErrors = reactive({
  titel: '',
  beschreibung: '',
  faelligkeitsdatum: '',
})

function validateForm() {
  validationErrors.titel = form.titel ? '' : 'Bitte gib einen Titel ein.'
  validationErrors.beschreibung = form.beschreibung ? '' : 'Bitte gib eine Beschreibung ein.'
  validationErrors.faelligkeitsdatum = form.faelligkeitsdatum
    ? ''
    : 'Bitte waehle ein Faelligkeitsdatum aus.'

  return !validationErrors.titel && !validationErrors.beschreibung && !validationErrors.faelligkeitsdatum
}

function submitTask() {
  if (!validateForm()) {
    return
  }

  emit('submit', {
    titel: form.titel,
    beschreibung: form.beschreibung,
    faelligkeitsdatum: form.faelligkeitsdatum,
    status: 'OFFEN',
  })
}
</script>
