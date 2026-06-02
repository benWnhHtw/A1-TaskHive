<template>
  <form class="task-form" @submit.prevent="submitTask">
    <div class="form-grid">
      <label>
        Aufgabe
        <input v-model.trim="form.title" required placeholder="z. B. Kueche putzen" />
      </label>

      <label>
        Verantwortlich
        <input v-model.trim="form.assigneeName" required placeholder="z. B. Mira" />
      </label>

      <label>
        Faellig am
        <input v-model="form.dueDate" required type="date" />
      </label>
    </div>

    <button type="submit">Aufgabe erstellen</button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['submit'])

const form = reactive({
  title: '',
  assigneeName: '',
  dueDate: new Date().toISOString().slice(0, 10),
})

function submitTask() {
  emit('submit', { ...form })
  form.title = ''
  form.assigneeName = ''
}
</script>
