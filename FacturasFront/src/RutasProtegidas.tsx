import { Navigate, Outlet } from "react-router-dom";

const RutasProtegidas= () => {
    
  const isAut = sessionStorage.getItem('token');

  if(!isAut) return  <Navigate to='/login' replace/>

  return (
    <>
    <Outlet/>
    </>
  )
}

export default RutasProtegidas
