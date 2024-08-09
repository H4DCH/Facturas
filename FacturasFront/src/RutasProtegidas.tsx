import { Navigate, Outlet } from "react-router-dom";

type propsLogin = {
  isAut : boolean,
}

const RutasProtegidas:React.FC<propsLogin>= ({isAut}) => {
 

  if(!isAut) return  <Navigate to='/login' replace/>

  return (
    <>
    <Outlet/>
    </>
  )
}

export default RutasProtegidas
