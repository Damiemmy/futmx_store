import AdminDashboard from "../admin/DashboardHome";
import HostDashboard from "../host/DashboardHome";
import UserDashboard from "../user/DashboardHome";
import { useAuth } from "../../../context/AuthContext";

const DashboardRedirect = () => {
    const{user}=useAuth()
    console.log({"CURRENT USER":user?.role,"data":user})
  return (
    <div>
        {user?.role === 'admin' && <AdminDashboard/>}
        
        {user?.role === 'host' && <HostDashboard/>}
        {user?.role === 'user' && <UserDashboard/>}
      
    </div>
  )
}

export default DashboardRedirect
