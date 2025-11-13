const App = () => {
  const courseName = 'Half Stack application development';
  const courseParts = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
    },
  ];

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );

  return (
    <div>
      <Header name={courseName} />
      <Content courses={courseParts} />
      <Total total={totalExercises} />
    </div>
  );
};

interface HeaderProps {
  name: string;
}

interface Course {
  name: string;
  exerciseCount: number;
}
interface ContentProps {
  courses: Course[];
}
interface TotalProps {
  total: number;
}
const Header = (props: HeaderProps) => <h2>{props.name}</h2>;
const Content = (props: ContentProps) => {
  const { courses } = props;
  return (
    <div>
      {courses.map((course) => {
        return (
          <p key={course.name}>
            {course.name} {course.exerciseCount}
          </p>
        );
      })}
    </div>
  );
};
const Total = (props: TotalProps) => <p>Total exercises: {props.total}</p>;

export default App;
