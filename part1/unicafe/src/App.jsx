import { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const plusGood = () => {
    setGood(good + 1)
  }

  const plusNeutral = () => {
    setNeutral(neutral + 1)
  }
  const plusBad = () => {
    setBad(bad + 1)
  }
  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={plusGood} text="good" />
      <Button onClick={plusNeutral} text="neutral" />
      <Button onClick={plusBad} text="bad" />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ label, value }) => (
  <tr>
    <td>{label}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = good / all

  if (all === 0)
    return (
      <div>
        <h1>statistics</h1>
        <div>No feedback given</div>
      </div>
    )
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine label="good" value={good} />
          <StatisticLine label="neutral" value={neutral} />
          <StatisticLine label="bad" value={bad} />
          <StatisticLine label="all" value={all} />
          <StatisticLine label="average" value={average} />
          <StatisticLine
            label="positive"
            value={(positive * 100).toString() + ' %'}
          />
        </tbody>
      </table>
    </div>
  )
}
export default App
