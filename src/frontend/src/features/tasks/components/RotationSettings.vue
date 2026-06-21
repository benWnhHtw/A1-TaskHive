<template>
  <section class="rotation-settings">
    <h3>Rotationseinstellungen</h3>

    <label>
      Wiederholungsintervall
      <select
        :disabled="disabled"
        :value="wiederholungsIntervall"
        @change="$emit('update:wiederholungsIntervall', $event.target.value)"
      >
        <option value="TAEGLICH">Taeglich</option>
        <option value="WOECHENTLICH">Woechentlich</option>
        <option value="MONATLICH">Monatlich</option>
      </select>
    </label>

    <MultiPersonSelect
      :disabled="disabled"
      :model-value="rotationsPersonIds"
      :persons="persons"
      @update:modelValue="$emit('update:rotationsPersonIds', $event)"
    />
  </section>
</template>

<script setup>
import MultiPersonSelect from '@/features/persons/components/MultiPersonSelect.vue'

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  persons: {
    type: Array,
    required: true,
  },
  rotationsPersonIds: {
    type: Array,
    default: () => [],
  },
  wiederholungsIntervall: {
    type: String,
    default: 'WOECHENTLICH',
  },
})

defineEmits(['update:wiederholungsIntervall', 'update:rotationsPersonIds'])
</script>