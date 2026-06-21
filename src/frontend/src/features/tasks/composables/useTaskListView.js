import { computed } from 'vue'

function compareDateStrings(leftDate, rightDate) {
  const leftTime = new Date(leftDate ?? '').getTime()
  const rightTime = new Date(rightDate ?? '').getTime()

  if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) {
    return 0
  }

  if (Number.isNaN(leftTime)) {
    return 1
  }

  if (Number.isNaN(rightTime)) {
    return -1
  }

  return leftTime - rightTime
}

function comparePersons(leftTask, rightTask) {
  const leftName = leftTask.assigneeName ?? ''
  const rightName = rightTask.assigneeName ?? ''

  return leftName.localeCompare(rightName, 'de', { sensitivity: 'base' })
}

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

function taskMatchesSelectedPersonIds(task, selectedPersonIds, persons) {
  if (!selectedPersonIds.length) {
    return true
  }

  const selectedIds = new Set(selectedPersonIds.map((personId) => Number(personId)))
  const involvedPersonIds = new Set([
    Number(task.personId),
    ...(task.rotationsPersonIds ?? []).map((personId) => Number(personId)),
  ])

  if ([...involvedPersonIds].some((personId) => selectedIds.has(personId))) {
    return true
  }

  const matchedPersons = persons.filter((person) => selectedIds.has(Number(person.id)))
  const taskName = normalizeText(task.assigneeName)

  return matchedPersons.some((person) => {
    const fullName = normalizeText(`${person.vorname} ${person.name}`)
    return taskName === fullName || taskName === normalizeText(person.vorname)
  })
}

export function getVisibleTasks(tasks, options) {
  const filteredTasks = tasks.filter((task) =>
    taskMatchesSelectedPersonIds(task, options.selectedPersonIds ?? [], options.persons ?? []),
  )

  return [...filteredTasks].sort((leftTask, rightTask) => {
    const dateCompare = compareDateStrings(leftTask.dueDate, rightTask.dueDate)

    if (dateCompare !== 0) {
      return options.dateDirection === 'desc' ? -dateCompare : dateCompare
    }

    return comparePersons(leftTask, rightTask)
  })
}

export function useTaskListView(tasks, options) {
  return computed(() =>
    getVisibleTasks(tasks.value, {
      dateDirection: options.dateDirection.value,
      selectedPersonIds: options.selectedPersonIds.value,
      persons: options.persons.value,
    }),
  )
}