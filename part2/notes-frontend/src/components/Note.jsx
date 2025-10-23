const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important'
  let classes = 'note' + (note.important ? ' important' : '')

  return (
    <li className={classes}>
      <span>{note.content}</span>
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note
