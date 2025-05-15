import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaCogs, FaMagic, FaRocket } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "./Header";
import {
  signInWithGoogle,
  onAuthStateChangedListener,
  signOutUser,
} from "../firebase.js";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        setUser(user);
        localStorage.setItem("ownerId", user.uid);
        fetchProfile(user.uid); // Fetch profile if user is logged in
      } else {
        setUser(null);
        setProfileData([]);
        localStorage.removeItem("ownerId");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      setUser(user);
      localStorage.setItem("ownerId", user.uid);
      await fetchProfile(user.uid);
      console.log("User UID:", user.uid);
    } catch (error) {
      console.log("Error signing in with Google: ", error);
    }
  };

  const handleSignOut = () => {
    signOutUser();
    setUser(null);
    setProfileData([]);
    localStorage.removeItem("ownerId");
  };

  const fetchProfile = async (uid) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ownerId": uid,
        },
      });
      const data = await res.json();
      setProfileData(data || []);
    } catch (err) {
      console.log("Error fetching profile:", err);
    }
  };

  const ownerId = localStorage.getItem("ownerId");
  console.log(profileData);
  

  const handleRedirect = async () => {
    if (!user) {
      await handleGoogleLogin();
    } else {
      const path =
        profileData.length > 1
          ? `/${ownerId}/profile`
          : `/${ownerId}/projects`;
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 px-6 pt-36 pb-10 text-center text-gray-900 transition-colors duration-500">
      <Header user={user} onLogin={handleGoogleLogin} onLogout={handleSignOut} />

      {/* Hero Section */}
      <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            Create Your <span className="text-blue-600">ePortfolio</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Build and customize your online portfolio with ease.
          </p>
          <Button
            onClick={handleRedirect}
            className="bg-gradient-to-r from-blue-600 to-pink-500 text-white px-8 py-4 rounded-xl shadow-lg hover:from-blue-700 hover:to-pink-600 text-lg transition-all"
          >
            {profileData.length > 1 ? "My Portfolio" : "Get Started"}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex-1 max-w-sm w-full p-6 bg-white rounded-2xl shadow-xl border border-blue-200"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/150?img=47" alt="Jane Doe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-800">Jane Doe</h2>
              <p className="text-gray-500">Web Developer</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="flex space-x-2 mt-4">
              <div className="h-10 w-1/3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-md"></div>
              <div className="h-10 w-1/3 bg-gradient-to-r from-blue-400 to-teal-400 rounded-md"></div>
              <div className="h-10 w-1/3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-md"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {[
          {
            icon: <FaCogs className="text-purple-500 text-5xl mb-4" />,
            title: "Easy to Use",
            desc: "Our intuitive interface lets you build your portfolio quickly.",
          },
          {
            icon: <FaMagic className="text-purple-500 text-5xl mb-4" />,
            title: "AI-Powered Design",
            desc: "Let our AI assist you in creating a stunning portfolio.",
          },
          {
            icon: <FaRocket className="text-purple-500 text-5xl mb-4" />,
            title: "Responsive Design",
            desc: "Ensure your portfolio looks great on any device.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center border border-blue-100 hover:border-blue-300 transition"
          >
            {feature.icon}
            <h3 className="text-2xl font-semibold">{feature.title}</h3>
            <p className="text-gray-600 mt-3 text-center">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
