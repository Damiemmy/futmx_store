import { motion } from "framer-motion";
import API from "../../services/Api";

export default function RequestCard({ request,setRequest }) {
  const handleApprove=async(id)=>{
    try{
      const response=await API.post(`user/admin-verify-user/${id}/approved/`)
      console.log("messages","approved")
      setRequest(prev=>prev.filter(item=>item.id !== request.id)
      )
      alert(response.data.message)
      
    }catch(err){
      console.log(err.message)
    }
  }

  const handleReject=async(id)=>{
    try{
      const response=await API.post(`user/admin-verify-user/${id}/rejected/`)
      console.log("Message",response.data)
      setRequest(prev=>prev.filter(item=>item.id !== request.id)
      )
      alert(response.data.message)
    }catch(err){
      console.log(err.message)
    }

  }
  return (
    <motion.div
      whileHover={{ y: -10, rotateX: 5 }}
      className="bg-white/70 backdrop-blur-2xl rounded-[30px] p-6 shadow-2xl border border-white/20"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold">
            {request.username}
          </h2>

          <p className="text-gray-500">
            {request.email}
          </p>
        </div>

        <img
          src="https://i.pravatar.cc/150?img=32"
          className="w-16 h-16 rounded-full"
        />
      </div>

      <p className="text-gray-600 leading-relaxed mb-6">
        Wants to become a verified host on BookMe.
      </p>

      <div className="flex gap-4">
        <button onClick={()=>handleApprove(request.id)} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-2xl font-bold shadow-xl hover:scale-105 transition">
          Approve
        </button>

        <button onClick={()=>handleReject(request.id)} className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-2xl font-bold shadow-xl hover:scale-105 transition">
          Reject
        </button>
      </div>
    </motion.div>
  );
}