import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Display = ({ text }) => <div>{text}</div>

const App = () => {
  const [counter, setCounter] = useState(0)

  const incrementCounter = () => setCounter(counter + 1)
  const decrementCounter = () => setCounter(counter - 1)
  const resetCounter = () => setCounter(0)

  return (
    <div>
      <Display text={counter} />
      <Button text="-1" onClick={decrementCounter} />
      <Button text="reset" onClick={resetCounter} />
      <Button text="+1" onClick={incrementCounter} />
    </div>
  )
}
export default App
