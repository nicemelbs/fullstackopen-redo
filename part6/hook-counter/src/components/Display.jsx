import CounterContext from '../CounterContext'
import { useContext } from 'react'
const Display = () => {
  const { counter } = useContext(CounterContext)
  return <div>{counter}</div>
}

export default Display
