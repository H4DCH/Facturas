import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Lista from './Components/Lista'
import Nav from './Components/Nav'
import  ListaProveedores  from './Components/Proveedor/ListaProveedores'

function App() {
  return (
    <>
    <BrowserRouter>
    <Nav/>
    <Routes>
      <Route path='/' element={<Lista/>}/>
      <Route path='proveedor' element={<ListaProveedores/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
