import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import Api from '../api/todos'

export interface TodoType {
  id: string
  title: string
  completed: boolean
}

export function useTodos(filter: string) {
  const queryClient = useQueryClient()
  const { data: todos }: UseQueryResult<TodoType[]> = useQuery({
    queryKey: ['todos'],
    queryFn: Api.fetchTodos,
  })

  const { mutate: saveTodo } = useMutation({
    mutationFn: Api.createTodo,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const displayedTodos =
    todos?.filter((todo) => {
      switch (filter) {
        case 'active':
          return !todo.completed
        case 'completed':
          return todo.completed
        default:
          return true
      }
    }) || []

  const allTodosCompleted = displayedTodos?.every((todo) => todo.completed)

  const { mutate: removeTodo } = useMutation({
    mutationFn: Api.deleteTodo,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const { mutate: setTitle } = useMutation({
    mutationFn: Api.updatePartiallyTodo,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const { mutate: setCompleted } = useMutation({
    mutationFn: Api.updatePartiallyTodo,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const { mutate: clearCompleted } = useMutation({
    mutationFn: () => Api.deleteTodos(true),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const changeAllCompletedTodo = (bool: boolean) => {
    todos?.forEach((todo) => {
      if (todo.completed !== bool) setCompleted({ id: todo.id, completed: bool })
    })
  }

  return {
    todos: displayedTodos,
    count: {
      all: todos?.length || 0,
      completed: todos?.filter((todo) => todo.completed).length || 0,
      active: todos?.filter((todo) => !todo.completed).length || 0,
    },
    allTodosCompleted,
    saveTodo,
    removeTodo,
    setTitle,
    setCompleted,
    clearCompleted,
    changeAllCompletedTodo,
  }
}
