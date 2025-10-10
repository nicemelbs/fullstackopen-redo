import { useState } from 'react'

const History = ({ clicks }) => {
  if (clicks.length === 0) {
    return <div>Press the buttons to see your press history.</div>
  }

  return <div>{clicks.join(' ')}</div>
}

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>
const App = () => {
  // const [left, setLeft] = useState(0)
  // const [right, setRight] = useState(0)
  const [clicks, setClicks] = useState([])
  const left = clicks.filter((click) => click === 'L').length
  const right = clicks.filter((click) => click === 'R').length

  const handleLeftClick = () => {
    setClicks([...clicks, 'L'])
    // setLeft(left + 1)
  }
  const handleRightClick = () => {
    setClicks([...clicks, 'R'])
    // setRight(right + 1)
  }

  return (
    <div>
      <div>
        <span>
          {left}
          <Button onClick={handleLeftClick} text={'left'} />
        </span>
        <span>
          {right}
          <Button onClick={handleRightClick} text={'right'} />
        </span>
      </div>
      <History clicks={clicks} />
    </div>
  )
}

export default App
