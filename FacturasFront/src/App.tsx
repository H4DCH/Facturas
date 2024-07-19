import { BrowserRouter, Route, Routes } from 'react-router-dom'
import  Login  from './Pages/Login'
import Lista from './Components/Lista';
import  ListaProveedores  from './Components/Proveedor/ListaProveedores';
import RutasProtegidas from './RutasProtegidas';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          <Route element={<RutasProtegidas />}>
            <Route path="/facturas" element={<Lista />} />
            <Route path="/proveedores" element={<ListaProveedores />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
