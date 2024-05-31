import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Lista from './Components/Lista'

function App() {
  return (
    <div>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Lista/>}></Route>
    </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
