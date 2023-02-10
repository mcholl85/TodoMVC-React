import { useEffect, useRef, useState } from 'react'

type TodoProps = {
  id: string
  title: string
  completed: boolean
  setCompleted: (params: { id: string; completed: boolean }) => void
  setTitle: (params: { id: string; title: string }) => void
  isEditing: string
  setIsEditing: (completed: string) => void
  removeTodo: (id: string) => void
}

export default function Todo({
  id,
  title,
  completed,
  setCompleted,
  setTitle,
  removeTodo,
  isEditing,
  setIsEditing,
}: TodoProps) {
  const [editedTitle, setEditedTitle] = useState(title)
  const inputEditTitle = useRef<HTMLInputElement>(null)

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      setEditedTitle(editedTitle.trim())

      if (editedTitle !== title) {
        setTitle({ id: id, title: editedTitle })
      }
      if (editedTitle === '') removeTodo(id)
      setIsEditing('')
    }
    if (e.key === 'Escape') {
      setEditedTitle(title)
      setIsEditing('')
    }
  }

  useEffect(() => {
    inputEditTitle.current?.focus()
  }, [isEditing])

  return (
    <>
      <div className='view'>
        <input
          className='toggle'
          checked={completed}
          type='checkbox'
          onChange={(e) => setCompleted({ id: id, completed: e.target.checked })}
        />
        <label>{title}</label>
        <button className='destroy' onClick={() => removeTodo(id)}></button>
      </div>
      <input
        className='edit'
        type='text'
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setIsEditing('')}
        ref={inputEditTitle}
      />
    </>
  )
}
