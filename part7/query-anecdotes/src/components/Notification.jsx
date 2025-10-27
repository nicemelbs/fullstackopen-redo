import { useQuery } from '@tanstack/react-query'
const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  const { data: message } = useQuery({
    queryKey: ['notification'],
    queryFn: () => null,
    enabled: false,
  })

  return message ? <div style={style}>{message}</div> : null
}

export default Notification
