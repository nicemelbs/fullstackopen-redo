import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  const hook = () => {
    personsService.getAll().then((initialPersons) => setPersons(initialPersons))
  }
  useEffect(hook, [])

  const filteredPersons =
    search === ''
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(search.toLowerCase())
        )

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const newPersonObject = {
      name: newName.trim(),
      number: newNumber.trim(),
    }

    if (persons.map((person) => person.name).includes(newPersonObject.name)) {
      const existingPerson = persons.find(
        (p) => p.name === newPersonObject.name
      )
      if (
        window.confirm(
          `${existingPerson.name} already exists in the phonebook. Do you want to replace the old number ${existingPerson.number} with ${newPersonObject.number}?`
        )
      ) {
        personsService
          .update(existingPerson.id, {
            ...existingPerson,
            number: newPersonObject.number,
          })
          .then((returnedPerson) =>
            setPersons(
              persons.map((p) =>
                p.id === existingPerson.id ? returnedPerson : p
              )
            )
          )
      }
    } else {
      personsService
        .create(newPersonObject)
        .then((returnedPerson) => setPersons(persons.concat(returnedPerson)))
    }
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const deleteById = (id) => {
    const personToDelete = persons.find((p) => p.id === id)
    const message = `Are you sure you want to delete ${personToDelete.name} from the phonebook?`

    if (window.confirm(message)) {
      personsService
        .remove(id)
        .then((returnedPerson) =>
          setPersons(persons.filter((p) => p.id !== returnedPerson.id))
        )
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter onChange={handleSearchChange} value={search} />

      <h3>Add entry</h3>

      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleAdd={handleAdd}
      />
      <h2>Numbers</h2>

      <Persons deleteById={deleteById} persons={filteredPersons} />
    </div>
  )
}

export default App
