const mockPersons = [
  { id: 1, name: 'Mustermann', vorname: 'Mira' },
  { id: 2, name: 'Becker', vorname: 'Jonas' },
  { id: 3, name: 'Schulz', vorname: 'Lea' },
]

function waitForMockLatency() {
  return new Promise((resolve) => window.setTimeout(resolve, 250))
}

export function findMockPerson(personId) {
  return mockPersons.find((person) => person.id === Number(personId))
}

export function createMockPersonGateway() {
  return {
    async listPersons() {
      await waitForMockLatency()
      return mockPersons
    },
  }
}
