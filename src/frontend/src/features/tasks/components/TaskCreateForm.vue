<template>
  <form class="task-form" @submit.prevent="submitTask">
    <div class="form-grid">
      <label>
        Aufgabe
        <input v-model.trim="form.title" required placeholder="z. B. Kueche putzen" />
      </label>

      <label>
        Beschreibung
        <textarea
          v-model.trim="form.description"
          required
          placeholder="z. B. Arbeitsflaechen reinigen und Muell rausbringen"
        ></textarea>
      </label>

      <AssigneeSelect
        v-model="form.personId"
        :disabled="arePersonsLoading || persons.length === 0"
        :persons="persons"
      />

      <label>
        Faellig am
        <input v-model="form.dueDate" required type="date" />
      </label>

      <label class="rotation-toggle">
        <input v-model="form.rotationAktiv" type="checkbox" />
        <span>Wiederkehrende Aufgabe</span>
      </label>
    </div>

    <RotationSettings
      v-if="form.rotationAktiv"
      v-model:rotationsPersonIds="form.rotationsPersonIds"
      v-model:wiederholungsIntervall="form.wiederholungsIntervall"
      :disabled="arePersonsLoading || persons.length === 0"
      :persons="persons"
    />

    <p v-if="rotationValidationMessage" class="error">{{ rotationValidationMessage }}</p>
    <p v-if="personsErrorMessage" class="error">{{ personsErrorMessage }}</p>

    <button type="submit" :disabled="arePersonsLoading || persons.length === 0">
      Aufgabe erstellen
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'

import RotationSettings from '@/features/tasks/components/RotationSettings.vue'
import AssigneeSelect from '@/features/persons/components/AssigneeSelect.vue'

const props = defineProps({
  persons: {
    type: Array,
    required: true,
  },
  arePersonsLoading: {
    type: Boolean,
    default: false,
  },
  personsErrorMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['submit'])

const defaultFormState = () => ({
  title: '',
  description: '',
  personId: '',
  dueDate: new Date().toISOString().slice(0, 10),
  rotationAktiv: false,
  wiederholungsIntervall: 'WOECHENTLICH',
  rotationsPersonIds: [],
})

const form = reactive(defaultFormState())
const rotationValidationMessage = ref('')

function resetForm() {
  Object.assign(form, defaultFormState())
  rotationValidationMessage.value = ''
}

function submitTask() {
  rotationValidationMessage.value = ''
  const selectedPerson = props.persons.find((person) => person.id === Number(form.personId))
  const selectedRotationPersonIds = form.rotationsPersonIds.map((personId) => Number(personId))

  if (form.rotationAktiv && selectedRotationPersonIds.length < 2) {
    rotationValidationMessage.value = 'Bei aktiver Rotation muessen mindestens zwei Mitbewohner ausgewaehlt sein.'
    return
  }

  emit('submit', {
    ...form,
    personId: Number(form.personId),
    rotationAktiv: form.rotationAktiv,
    wiederholungsIntervall: form.rotationAktiv ? form.wiederholungsIntervall : undefined,
    rotationsPersonIds: form.rotationAktiv ? selectedRotationPersonIds : [],
    assigneeName: selectedPerson
      ? `${selectedPerson.vorname} ${selectedPerson.name}`
      : '',
  })
  resetForm()
}
</script>
