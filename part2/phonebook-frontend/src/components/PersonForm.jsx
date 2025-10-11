const PersonForm = ({
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
  handleAdd,
}) => {
  return (
    <form>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button
          disabled={!newName || !newNumber}
          onClick={handleAdd}
          type="submit"
        >
          add
        </button>
      </div>
    </form>
  )
}
export default PersonForm
