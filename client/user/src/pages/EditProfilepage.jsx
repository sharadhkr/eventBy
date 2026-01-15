import { useEffect, useState } from "react";
import { userAPI } from "../lib/api";
import EditProfile from "../components/Editprofile";

export default function EditProfilepage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userAPI.getProfile();
        setUser(res.data.data); // ✅ VERY IMPORTANT
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <EditProfile
      user={user}
      onUpdated={(updatedUser) => setUser(updatedUser)}
    />
  );
}
