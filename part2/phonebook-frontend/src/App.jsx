import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

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
      id: Math.floor(Math.random() * 50093),
    }

    if (persons.map((person) => person.name).includes(newPersonObject.name))
      alert(`${newPersonObject.name} is already added.`)
    else setPersons(persons.concat(newPersonObject))
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
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

      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App
