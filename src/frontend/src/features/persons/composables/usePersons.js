import { onMounted, ref } from 'vue'

import { apiGateway } from '@/core/api/apiGateway'

export function usePersons() {
  const persons = ref([])
  const arePersonsLoading = ref(false)
  const personsErrorMessage = ref('')

  async function loadPersons() {
    arePersonsLoading.value = true
    personsErrorMessage.value = ''

    try {
      persons.value = await apiGateway.persons.listPersons()
    } catch {
      personsErrorMessage.value = 'Mitbewohner konnten nicht geladen werden.'
    } finally {
      arePersonsLoading.value = false
    }
  }

  onMounted(loadPersons)

  return {
    persons,
    arePersonsLoading,
    personsErrorMessage,
    loadPersons,
  }
}
