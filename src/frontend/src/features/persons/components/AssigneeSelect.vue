<template>
  <label class="field">
    Verantwortlich
    <select
      :value="modelValue"
      :disabled="disabled"
      required
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled>
        {{ disabled ? 'Mitbewohner werden geladen...' : 'Mitbewohner auswählen' }}
      </option>
      <option v-for="person in persons" :key="person.id" :value="person.id">
        {{ person.vorname }} {{ person.name }}
      </option>
    </select>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
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

defineEmits(['update:modelValue'])
</script>
