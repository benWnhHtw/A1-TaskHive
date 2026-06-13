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
    </div>

    <p v-if="personsErrorMessage" class="error">{{ personsErrorMessage }}</p>

    <button type="submit" :disabled="arePersonsLoading || persons.length === 0">
      Aufgabe erstellen
    </button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

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

const form = reactive({
  title: '',
  description: '',
  personId: '',
  dueDate: new Date().toISOString().slice(0, 10),
})

function submitTask() {
  const selectedPerson = props.persons.find((person) => person.id === Number(form.personId))

  emit('submit', {
    ...form,
    personId: Number(form.personId),
    assigneeName: selectedPerson
      ? `${selectedPerson.vorname} ${selectedPerson.name}`
      : '',
  })
  form.title = ''
  form.description = ''
  form.personId = ''
}
</script>
