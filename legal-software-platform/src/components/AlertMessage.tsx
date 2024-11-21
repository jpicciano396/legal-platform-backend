interface AlertMessageProps {
  message: string
  type: 'success' | 'error' | 'info'
}

export default function AlertMessage({ message, type }: AlertMessageProps) {
  const bgColor = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  }

  return (
    <div className={`p-4 rounded-md ${bgColor[type]} mb-4`}>
      {message}
    </div>
  )
}

