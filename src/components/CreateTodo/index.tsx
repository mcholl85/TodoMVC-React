import { useState } from 'react'

type CreateTodoProps = {
  saveTodo: (title: string) => void
}

export default function CreateTodo({ saveTodo }: CreateTodoProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && inputValue !== '') {
      saveTodo(inputValue)
      setInputValue('')
    }
  }

  return (
    <input
      className='new-todo'
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder='What needs to be done?'
      autoFocus
    />
  )
}