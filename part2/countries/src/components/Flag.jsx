const Flag = ({ country }) => {
  return (
    <div>
      <img src={country.flags.png} alt={country.flags.alt} />
      <div>{country.flags.alt}</div>
    </div>
  )
}
export default Flag
