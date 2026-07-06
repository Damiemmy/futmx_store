import { motion } from "framer-motion";
import { ShieldCheck, Home, BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { authApi } from "../api/endpoints";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function BecomeHostPage() {
    const navigate=useNavigate()
    const [formData, setFormData] = useState({
        full_name: "",
        phone_number: "",
        faculty: "",
        department: "",
        reason: "",
        requested_role:"",
        id_document: "null",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
useEffect(()=>{
  console.log(formData)
},[formData])
/* const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/user/roles/become_host/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc4MTQ1ODczLCJpYXQiOjE3NzgxNDIyNzMsImp0aSI6IjNkNTNlMzY4YmE5MDRmYjE4Y2U5NWNkMDI2MTk5ZGZkIiwidXNlcl9pZCI6IjEifQ.1Noarr8RjEMC574b4LnjpBTEN_MVhb3zWZQzFKa_1mA`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        alert("Host request submitted successfully!");
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
*/

  // const handleSubmit=async(e)=>{
  //   e.preventDefault();
  //   try{
  //     const response=await API.post("user/roles/become_host/",formData)
  //     console.log({"data":response.data,"message":"request sent"})
  //     alert(response.data.message)
  //     navigate('/')

  //   }catch(err){
  //     console.log(err.message)
  //     alert()    }
  // }

  // useEffect(()=>{
  //   console.log(formData)
  // },[formData])



  /*
  const handleSubmit = async (e) => {
  e.preventDefault();

  const submitData = new FormData();

 submitData.append("full_name", formData.full_name);
  submitData.append("phone_number", formData.phone_number);
  submitData.append("department", formData.department);
  submitData.append("faculty", formData.faculty);
  submitData.append("role", formData.role);
  submitData.append("host_reasons", formData.host_reasons);
  submitData.append("id_document", formData.id_document); 

  try {
    const response = await API.post(
      "user/roles/become_host/",
      submitData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log({
      data: response.data,
      message: "request sent",
    });

    alert(response.data.message);

    navigate("/");
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};*/


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!formData.id_document) {
      return alert("Please upload your ID document");
    }

    const response = await authApi.roles({
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      department: formData.department,
      faculty: formData.faculty,
      requested_role: formData.requested_role,
      reason: formData.reason,
      id_document: formData.id_document,
    });

    console.log(response.data);
    toast.success(response.data.message);
    await new Promise(resolve => setTimeout(resolve, 1200));
    navigate("/");
  } catch (err: any) {
    console.log(err.response?.data);
    toast.error(
        err.response?.data?.message || "Something went wrong"
    );
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="become-host.jfif"
          alt="Host"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Become a Host
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
            Share your space, earn extra income, and publish Relevant Materials For users Needs
          </p>
        </motion.div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            <div className="bg-pink-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
              <Home className="text-pink-500" size={32} />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Share Your Space
            </h3>

            <p className="text-gray-600">
              publish and sell out material, past-questions, books, or repackaged information for users.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            <div className="bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
              <BadgeCheck className="text-green-500" size={32} />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Verified Approval
            </h3>

            <p className="text-gray-600">
              We carefully review every host application to ensure quality and
              trust.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            <div className="bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
              <ShieldCheck className="text-blue-500" size={32} />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Secure Platform
            </h3>

            <p className="text-gray-600">
              Your books and earnings are protected with our secure system.
            </p>
          </motion.div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
        >
          <h2 className="text-4xl font-bold mb-3 text-center">
            Host Application
          </h2>

          <p className="text-gray-600 text-center mb-10">
            Fill in your details for admin approval.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block mb-2 font-semibold">
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
                <label className="block mb-2 font-semibold">I am</label>

                <select
                    name="requested_role"
                    value={formData.requested_role}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-pink-500"
                >
                    <option value="">Select your role</option>
                    <option value="lecturer">Lecturer</option>
                    <option value="course_rep">Student (Course Rep)</option>
                    <option value="vendor">Vendor</option>
                </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Phone Number
              </label>

              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Department
              </label>

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Your Department"
                className="w-full border border-gray-300 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Faculty
              </label>
              <input
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                placeholder="Tell us the Faculty you are from"
                className="w-full border border-gray-300 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Why do you want to become a host?
              </label>

              <textarea
                rows={4}
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Tell us why you want to join"
                className="w-full border border-gray-300 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-pink-500"
              ></textarea>
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                National / Student ID
              </label>

              <label className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition bg-gray-50">
                
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-700">
                    Upload Your Verification ID
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Click to browse or drag and drop
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    PNG, JPG, PDF accepted
                  </p>

                  {formData.id_document && (
                    <p className="mt-4 text-sm font-medium text-pink-600">
                      {formData.id_document.name}
                    </p>
                  )}
                </div>

                <input
                  type="file"
                  name="id_document"
                  className="hidden"
                  // onChange={(e) =>
                  //   setFormData({
                  //     ...formData,
                  //     id_document: e.target.files?.[0] || null,
                  //   })
                  // }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_document: e.target.files[0]
                    })
                  }
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-gold text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition"
            >
              Submit Application
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}