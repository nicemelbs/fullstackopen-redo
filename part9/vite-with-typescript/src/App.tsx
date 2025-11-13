const App = () => {
  const courseName = 'Half Stack application development';
  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
      description: 'This is an awesome course part',
      kind: 'basic',
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: 'group',
    },
    {
      name: 'Basics of type Narrowing',
      exerciseCount: 7,
      description: 'How to go from unknown to string',
      kind: 'basic',
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
      description: 'Confusing description',
      backgroundMaterial:
        'https://type-level-typescript.com/template-literal-types',
      kind: 'background',
    },
    {
      name: 'Backend development',
      exerciseCount: 21,
      description: 'Typing the backend',
      requirements: ['nodejs', 'jest'],
      kind: 'special',
    },
  ];

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total total={totalExercises} />
    </div>
  );
};

interface HeaderProps {
  name: string;
}

interface TotalProps {
  total: number;
}

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartWithDescription {
  kind: 'basic';
}

interface CoursePartSpecial extends CoursePartWithDescription {
  kind: 'special';
  requirements: string[];
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: 'group';
}

interface CoursePartBackground extends CoursePartWithDescription {
  backgroundMaterial: string;
  kind: 'background';
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

interface ContentProps {
  courseParts: CoursePart[];
}

interface PartProps {
  part: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = (props: PartProps) => {
  const part = props.part;
  let otherInfo = null;

  switch (part.kind) {
    case 'basic':
      otherInfo = (
        <div>
          <i>{part.description}</i>
        </div>
      );
      break;
    case 'background':
      otherInfo = (
        <div>
          <div>
            <i>{part.description}</i>
          </div>
          <div>submit to {part.backgroundMaterial}</div>
        </div>
      );
      break;
    case 'group':
      otherInfo = <div>project exercises {part.groupProjectCount}</div>;
      break;

    case 'special':
      otherInfo = (
        <div>
          <div>
            <i>{part.description}</i>
          </div>
          <div>required skills: {part.requirements.join(', ')}</div>
        </div>
      );
      break;
    default:
      assertNever(part);
  }

  return (
    <div>
      <strong>
        {part.name} {part.exerciseCount}
      </strong>
      <div>{otherInfo}</div>
    </div>
  );
};

const Header = (props: HeaderProps) => <h2>{props.name}</h2>;
const Content = (props: ContentProps) => {
  const courses = props.courseParts;
  return (
    <div>
      {courses.map((course, i) => (
        <Part part={course} key={i} />
      ))}
    </div>
  );
};
const Total = (props: TotalProps) => <p>Total exercises: {props.total}</p>;

export default App;
