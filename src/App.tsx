import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import Home from './pages/Home'

const HomeWithParams = () => {
  const { selected } = useParams()

  return <Home filter={selected as 'all' | 'active' | 'completed'} />
}

export default function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home filter='all' />} />
          <Route path='/:selected' element={<HomeWithParams />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
