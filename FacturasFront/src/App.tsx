import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import  Login  from './Pages/Login'
import Lista from './Components/Factura/Lista';
import  ListaProveedores  from './Components/Proveedor/ListaProveedores';
import RutasProtegidas from './RutasProtegidas';
import FacturasdeProveedor from './Components/Proveedor/FacturasdeProveedor';

function App() {
  const isAut = Boolean(sessionStorage.getItem('token'))
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          <Route element={<RutasProtegidas isAut={isAut}/>}>
            <Route path="/facturas" element={<Lista />} />
            <Route path="/proveedores" element={<ListaProveedores/>} />
            <Route path='/proveedor/:id' element={<FacturasdeProveedor/>}/>
          </Route>

          <Route path='*' element={<Navigate to="/" />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
