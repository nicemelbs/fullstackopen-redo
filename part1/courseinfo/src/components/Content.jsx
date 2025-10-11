import Part from './Part'

const Content = ({ course }) => {
  return (
    <ul>
      {course.parts.map((part) => {
        return <Part key={part.id} part={part} />
      })}
    </ul>
  )
}
export default Content
