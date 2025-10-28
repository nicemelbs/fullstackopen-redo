import CounterContext from '../CounterContext'
import { useContext } from 'react'

const Button = ({ type, label }) => {
  const { counterDispatch } = useContext(CounterContext)
  return <button onClick={() => counterDispatch({ type })}>{label}</button>
}
export default Button
