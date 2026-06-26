export default function AdminSettings() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>

      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4">
        <input className="w-full p-3 border rounded-xl" placeholder="Platform Name" />
        <input className="w-full p-3 border rounded-xl" placeholder="Support Email" />
        <button className="bg-black text-white px-6 py-3 rounded-xl">
          Save Changes
        </button>
      </div>
    </div>
  );
}