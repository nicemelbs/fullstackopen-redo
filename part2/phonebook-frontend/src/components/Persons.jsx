import Person from './Person'
const Persons = ({ persons, deleteById }) => {
  return (
    <ul>
      {persons.map((person, index) => (
        <Person
          key={index}
          person={person}
          handleDelete={() => deleteById(person.id)}
        />
      ))}
    </ul>
  )
}

export default Persons
