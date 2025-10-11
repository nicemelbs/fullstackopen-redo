const Total = ({ course }) => {
  const total = course.parts.reduce((acc, part) => acc + part.exercises, 0)
  return <div>Total exercises: {total}</div>
}
export default Total
