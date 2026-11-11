import { computed, ref } from 'vue'

export const DUE_DATE_MODES = [
  { value: 'all', label: 'Alle' },
  { value: 'overdue', label: 'Überfällig' },
  { value: 'today', label: 'Heute' },
  { value: 'next7days', label: 'Nächste 7 Tage' },
  { value: 'exact', label: 'Am Datum' },
  { value: 'range', label: 'Zeitraum' },
]

export function getTodayIsoDate(referenceDate = new Date()) {
  const year = referenceDate.getFullYear()
  const month = String(referenceDate.getMonth() + 1).padStart(2, '0')
  const day = String(referenceDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function normalizeIsoDate(value) {
  if (typeof value !== 'string') {
    return ''
  }

  const trimmed = value.trim()
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed)

  if (!match) {
    return ''
  }

  return `${match[1]}-${match[2]}-${match[3]}`
}

export function addDaysToIsoDate(isoDate, days) {
  const normalized = normalizeIsoDate(isoDate)

  if (!normalized) {
    return ''
  }

  const [year, month, day] = normalized.split('-').map(Number)
  const target = new Date(year, month - 1, day + days)
  return getTodayIsoDate(target)
}

export function formatIsoDateDe(value) {
  const normalized = normalizeIsoDate(value)

  if (!normalized) {
    return 'Kein Datum'
  }

  const [year, month, day] = normalized.split('-')
  return `${day}.${month}.${year}`
}

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

export function matchesPersonFilter(task, selectedPersonIds = [], persons = []) {
  if (!Array.isArray(selectedPersonIds) || selectedPersonIds.length === 0) {
    return true
  }

  const selectedSet = new Set(
    selectedPersonIds.map((id) => Number(id)).filter((id) => !Number.isNaN(id)),
  )

  if (selectedSet.size === 0) {
    return true
  }

  const candidateIds = []

  if (task.personId != null && task.personId !== '') {
    candidateIds.push(Number(task.personId))
  }

  if (Array.isArray(task.personIds)) {
    candidateIds.push(...task.personIds.map((id) => Number(id)))
  }

  if (Array.isArray(task.rotationsPersonIds)) {
    candidateIds.push(...task.rotationsPersonIds.map((id) => Number(id)))
  }

  const validCandidateIds = candidateIds.filter((id) => !Number.isNaN(id))

  if (validCandidateIds.some((id) => selectedSet.has(id))) {
    return true
  }

  if (validCandidateIds.length > 0) {
    return false
  }

  const assigneeText = normalizeText(task.assigneeName)

  if (!assigneeText) {
    return false
  }

  return persons
    .filter((person) => selectedSet.has(Number(person.id)))
    .some((person) => {
      const fullName = normalizeText(`${person.vorname} ${person.name}`)
      const firstName = normalizeText(person.vorname)
      return assigneeText === fullName || assigneeText === firstName
    })
}

export function isDueDateFilterConstraintActive(dateFilter = {}) {
  const mode = dateFilter.dueDateMode ?? 'all'

  if (mode === 'all') {
    return false
  }

  if (mode === 'exact') {
    return Boolean(normalizeIsoDate(dateFilter.exactDate))
  }

  if (mode === 'range') {
    return Boolean(
      normalizeIsoDate(dateFilter.dateFrom) || normalizeIsoDate(dateFilter.dateTo),
    )
  }

  return ['overdue', 'today', 'next7days'].includes(mode)
}

export function matchesDueDateFilter(task, dateFilter = {}, todayIso = getTodayIsoDate()) {
  if (!isDueDateFilterConstraintActive(dateFilter)) {
    return true
  }

  const mode = dateFilter.dueDateMode ?? 'all'
  const taskDueDate = normalizeIsoDate(task.dueDate)

  if (!taskDueDate) {
    return false
  }

  if (mode === 'overdue') {
    return taskDueDate < todayIso && task.status !== 'done'
  }

  if (mode === 'today') {
    return taskDueDate === todayIso
  }

  if (mode === 'next7days') {
    const endIso = addDaysToIsoDate(todayIso, 7)
    return taskDueDate >= todayIso && taskDueDate <= endIso
  }

  if (mode === 'exact') {
    return taskDueDate === normalizeIsoDate(dateFilter.exactDate)
  }

  if (mode === 'range') {
    const from = normalizeIsoDate(dateFilter.dateFrom)
    const to = normalizeIsoDate(dateFilter.dateTo)

    if (from && to) {
      const [minDate, maxDate] = from <= to ? [from, to] : [to, from]
      return taskDueDate >= minDate && taskDueDate <= maxDate
    }

    if (from) {
      return taskDueDate >= from
    }

    if (to) {
      return taskDueDate <= to
    }
  }

  return true
}

export function filterTasks(tasks = [], filterState = {}, persons = [], todayIso = getTodayIsoDate()) {
  return tasks.filter(
    (task) =>
      matchesPersonFilter(task, filterState.selectedPersonIds, persons) &&
      matchesDueDateFilter(task, filterState, todayIso),
  )
}

export function buildDueDateFilterLabel(dateFilter = {}) {
  const mode = dateFilter.dueDateMode ?? 'all'

  if (mode === 'overdue') {
    return 'Überfällig'
  }

  if (mode === 'today') {
    return 'Heute'
  }

  if (mode === 'next7days') {
    return 'Nächste 7 Tage'
  }

  if (mode === 'exact') {
    const exact = normalizeIsoDate(dateFilter.exactDate)
    return exact ? `Am ${formatIsoDateDe(exact)}` : ''
  }

  if (mode === 'range') {
    const from = normalizeIsoDate(dateFilter.dateFrom)
    const to = normalizeIsoDate(dateFilter.dateTo)

    if (from && to) {
      const [minDate, maxDate] = from <= to ? [from, to] : [to, from]
      return `${formatIsoDateDe(minDate)} – ${formatIsoDateDe(maxDate)}`
    }

    if (from) {
      return `Ab ${formatIsoDateDe(from)}`
    }

    if (to) {
      return `Bis ${formatIsoDateDe(to)}`
    }
  }

  return ''
}

export function useTaskFilter(tasks, persons) {
  const selectedPersonIds = ref([])
  const dueDateMode = ref('all')
  const exactDate = ref('')
  const dateFrom = ref('')
  const dateTo = ref('')

  const filterState = computed(() => ({
    selectedPersonIds: selectedPersonIds.value,
    dueDateMode: dueDateMode.value,
    exactDate: exactDate.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
  }))

  const isPersonFilterActive = computed(() => selectedPersonIds.value.length > 0)

  const isDueDateFilterActive = computed(() =>
    isDueDateFilterConstraintActive(filterState.value),
  )

  const hasActiveFilters = computed(
    () => isPersonFilterActive.value || isDueDateFilterActive.value,
  )

  const activeFilterCount = computed(
    () => selectedPersonIds.value.length + (isDueDateFilterActive.value ? 1 : 0),
  )

  const selectedPersons = computed(() => {
    const selectedSet = new Set(selectedPersonIds.value.map(Number))
    return persons.value.filter((person) => selectedSet.has(Number(person.id)))
  })

  const dueDateFilterLabel = computed(() => buildDueDateFilterLabel(filterState.value))

  const filteredTasks = computed(() =>
    filterTasks(tasks.value, filterState.value, persons.value),
  )

  function togglePerson(personId) {
    const normalizedId = Number(personId)

    if (Number.isNaN(normalizedId)) {
      return
    }

    if (selectedPersonIds.value.includes(normalizedId)) {
      selectedPersonIds.value = selectedPersonIds.value.filter((id) => id !== normalizedId)
      return
    }

    selectedPersonIds.value = [...selectedPersonIds.value, normalizedId]
  }

  function clearPersonFilter() {
    selectedPersonIds.value = []
  }

  function setSelectedPersonIds(personIds = []) {
    const uniqueIds = [
      ...new Set(personIds.map((id) => Number(id)).filter((id) => !Number.isNaN(id))),
    ]
    selectedPersonIds.value = uniqueIds
  }

  function setDueDateMode(mode) {
    dueDateMode.value = mode
  }

  function clearDueDateFilter() {
    dueDateMode.value = 'all'
    exactDate.value = ''
    dateFrom.value = ''
    dateTo.value = ''
  }

  function resetAllFilters() {
    clearPersonFilter()
    clearDueDateFilter()
  }

  return {
    selectedPersonIds,
    dueDateMode,
    exactDate,
    dateFrom,
    dateTo,
    isPersonFilterActive,
    isDueDateFilterActive,
    hasActiveFilters,
    activeFilterCount,
    selectedPersons,
    dueDateFilterLabel,
    filteredTasks,
    togglePerson,
    clearPersonFilter,
    setSelectedPersonIds,
    setDueDateMode,
    clearDueDateFilter,
    resetAllFilters,
  }
}
