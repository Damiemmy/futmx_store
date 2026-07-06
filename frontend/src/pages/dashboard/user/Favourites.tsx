import { Heart } from "lucide-react";

export default function UserFavourites() {
  return (
    <div className="p-4 md:p-8 space-y-6">

      <div className="flex items-center gap-3">
        <Heart className="text-pink-500" />
        <h1 className="text-3xl font-bold">Your Saved Places</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <img
              src={`https://source.unsplash.com/400x300/?hotel,${i}`}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              <h2 className="font-bold">Luxury Stay #{i + 1}</h2>
              <p className="text-gray-500">Paris, France</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}