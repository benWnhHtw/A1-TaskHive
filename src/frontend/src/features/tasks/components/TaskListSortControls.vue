<template>
  <div class="task-list-sort-controls" aria-label="Aufgaben sortieren">
    <label>
      Sortieren nach
      <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <option value="date">Datum</option>
        <option value="person">Person</option>
      </select>
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'date',
  },
})

defineEmits(['update:modelValue'])
</script>