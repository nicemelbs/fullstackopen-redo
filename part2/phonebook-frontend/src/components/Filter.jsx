const Filter = ({ onChange, value }) => {
  return (
    <div>
      search: <input onChange={onChange} value={value} />
    </div>
  )
}
export default Filter
