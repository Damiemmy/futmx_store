import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import RequestCard from "../../../components/ui/RequestCard";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const[requests,setRequest]=useState([])
    const getHostApproval=async()=>{
        try{
            const response=await API.get('user/admin-verify-user/?status=pending')
            console.log("HostRequest",response.data)
            setRequest(response.data)
        }catch(err){
            console.log(err.message)
        }
    }

    useEffect(()=>{
        getHostApproval()
    },[])
    useEffect(()=>{
      console.log("MyHostRequest",requests)
    },[requests])
  return (
    <div className="flex bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 min-h-screen overflow-hidden">
      <div className="p-8">

        {/* HERO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

          {[
            {
              title: "Total Users",
              value: "12,450",
            },
            {
              title: "Bookings",
              value: "4,210",
            },
            {
              title: "Revenue",
              value: "$92,000",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10, rotateY: 5 }}
              className="bg-white/70 backdrop-blur-2xl rounded-[35px] p-8 shadow-2xl border border-white/20"
            >
              <h2 className="text-gray-500 text-lg mb-4">
                {card.title}
              </h2>

              <h1 className="text-5xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                {card.value}
              </h1>
            </motion.div>
          ))}
        </div>

        {/* REQUESTS */}
        <div>
          <h1 className="text-4xl font-black mb-8">
            Host Requests
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                setRequest={setRequest}
              />
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}