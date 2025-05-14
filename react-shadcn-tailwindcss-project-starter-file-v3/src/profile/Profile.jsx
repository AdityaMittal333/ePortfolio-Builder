import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ArrowUpRight, 
  Award, 
  Briefcase, 
  Film, 
  Layers, 
  ExternalLink,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SiGithub, SiLinkedin } from 'react-icons/si';

// Custom animations CSS
const customAnimations = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes blob {
    0% { transform: scale(1); }
    33% { transform: scale(1.1); }
    66% { transform: scale(0.9); }
    100% { transform: scale(1); }
  }

  @keyframes pulse-subtle {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 0.9; }
  }

  .animate-spin-slow {
    animation: spin-slow 6s linear infinite;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-blob {
    animation: blob 7s infinite;
  }

  .animate-pulse-subtle {
    animation: pulse-subtle 3s infinite;
  }
`;

// Menu items configuration
const menuItems = [
  {
    icon: <Layers size={28} className="text-blue-600" />,
    label: "Projects",
    href: "/projects",
    color: "from-blue-50 to-blue-100",
    borderColor: "from-blue-400 to-blue-600"
  },
  {
    icon: <Briefcase size={28} className="text-purple-600" />,
    label: "Experience",
    href: "/experience",
    color: "from-purple-50 to-purple-100",
    borderColor: "from-purple-400 to-purple-600"
  },
  {
    icon: <Award size={28} className="text-emerald-600" />,
    label: "Certificates",
    href: "/certificate",
    color: "from-emerald-50 to-emerald-100",
    borderColor: "from-emerald-400 to-emerald-600"
  },
  {
    icon: <Film size={28} className="text-amber-600" />,
    label: "Videos",
    href: "/video",
    color: "from-amber-50 to-amber-100",
    borderColor: "from-amber-400 to-amber-600"
  },
];

// Loading component
const LoadingProfile = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-opacity-20"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-blue-600 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-indigo-400 border-opacity-50"></div>
        <div className="absolute inset-2 rounded-full border-t-2 border-indigo-500 animate-spin-slow"></div>
      </div>
      <p className="text-lg text-gray-600 font-medium">Loading profile...</p>
    </div>
  </div>
);

// Error component
const ProfileNotFound = ({ onNavigateHome }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <motion.div 
      className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
      <p className="text-gray-600 mb-6">The profile you're looking for couldn't be loaded.</p>
      <button 
        onClick={onNavigateHome}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        aria-label="Return to homepage"
      >
        Return Home
      </button>
    </motion.div>
  </div>
);

// Background decoration component
const BackgroundDecoration = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-30">
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
      ></div>
      <div 
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
        style={{ animationDelay: "2s" }}
      ></div>
      <div 
        className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
        style={{ animationDelay: "4s" }}
      ></div>
      <div 
        className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"
        style={{ animationDelay: "6s" }}
      ></div>
    </div>
  </div>
);

// Profile hero section
const ProfileHero = () => (
  <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
    {/* Hero pattern background */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-0 left-0 w-full h-full" style={{ 
        backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CiAgICAgIDxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI0ZGRiIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPgo8L3N2Zz4=')`
      }}></div>
    </div>
    
    {/* Decorative floating elements */}
    <div className="relative h-64">
      <div className="absolute top-16 left-1/4 w-12 h-12 bg-white bg-opacity-10 rounded-lg transform rotate-45 animate-float"></div>
      <div 
        className="absolute top-24 right-1/4 w-8 h-8 bg-white bg-opacity-10 rounded-full animate-float" 
        style={{ animationDelay: "1s" }}
      ></div>
      <div 
        className="absolute bottom-16 left-1/3 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-float" 
        style={{ animationDelay: "2s" }}
      ></div>
      <div 
        className="absolute top-32 right-1/3 w-10 h-10 bg-white bg-opacity-10 transform rotate-12 rounded animate-float" 
        style={{ animationDelay: "3s" }}
      ></div>
    </div>
    
    {/* Wave bottom decoration */}
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="relative block w-full h-16 text-white"
        aria-hidden="true"
      >
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-current"></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-current"></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-current"></path>
      </svg>
    </div>
  </div>
);

// Profile Card Component
const ProfileCard = ({ profile, isOwner, ownerId }) => (
  <motion.div 
    className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 overflow-hidden"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    <div className="md:flex">
      {/* Profile Photo Section */}
      <div className="md:w-1/3 flex justify-center pt-12 pb-6 md:pb-12 md:pt-16 bg-gradient-to-b from-blue-50/80 to-indigo-50/80 backdrop-blur">
        <motion.div
          className="relative group"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Background glow effect */}
          <div 
            className="absolute left-0 right-0 top-1/4 h-1/3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500 animate-pulse-subtle"
          ></div>
          
          {/* Profile image with circular frame */}
          <div className="relative z-10 rounded-full overflow-hidden h-48 w-48">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-1 bg-white rounded-full"></div>
            <div className="absolute inset-2 rounded-full overflow-hidden">
              <img
                src={profile.photo}
                alt={`Profile photo of ${profile.name}`}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Profile Information Section */}
      <div className="md:w-2/3 p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Name with decorative gradient lines */}
          <div className="mb-6">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full mb-2"
            ></motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {profile.name}
            </motion.h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full"
            ></motion.div>
          </div>
          
          {/* Description */}
          <motion.p
            className="text-gray-600 text-lg leading-relaxed mb-8 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {profile.description}
          </motion.p>

          {/* Skills */}
          <motion.p
            className="text-gray-700 text-lg sm:text-xl leading-relaxed mb-10 font-light tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          >
            <span className="font-semibold text-gray-800">Tech Skills:</span>{' '}
            <span className="text-gray-600">{profile.skills}</span>
          </motion.p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href={profile.githubLink}
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              aria-label="Visit GitHub profile"
            >
              <SiGithub size={18} aria-hidden="true" />
              <span className="text-sm font-medium">GitHub</span>
            </a>

            <a
              href={profile.linkedInLink}
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              aria-label="Visit LinkedIn profile"
            >
              <SiLinkedin size={18} aria-hidden="true" />
              <span className="text-sm font-medium">LinkedIn</span>
            </a>
            
            {isOwner && (
              <Link
                to={`/${ownerId}/profile/edit`}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                aria-label="Edit profile"
              >
                <span className="text-sm font-medium">Edit Profile</span>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

// Portfolio Menu Component
const PortfolioMenu = ({ ownerId }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="w-full"
  >
    {/* Section Title */}
    <div className="flex justify-center mb-12">
      <h2 className="inline-block text-3xl font-bold text-gray-800 relative">
        <span className="relative z-10">Explore My Portfolio</span>
        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full"></div>
      </h2>
    </div>
    
    {/* Menu Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {menuItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.6 }}
          whileHover={{ y: -8 }}
        >
          <Link to={`/${ownerId}${item.href}`} className="block h-full">
            <Card className="h-full relative overflow-visible bg-white/80 backdrop-blur-sm shadow-lg border border-white/50 group hover:shadow-2xl transition-all duration-500 hover:bg-white/90">
              {/* Gradient border effect on hover */}
              <div className="absolute inset-0 rounded-2xl">
                <div 
                  className="absolute inset-0 rounded-2xl p-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` }}
                ></div>
              </div>
              
              <CardContent className="p-0 relative z-10">
                <div 
                  className={`pt-10 pb-6 px-8 rounded-t-2xl bg-gradient-to-br overflow-hidden relative ${item.color}`}
                >
                  {/* Icon container */}
                  <div className="relative z-10 flex justify-center">
                    <motion.div 
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                      }}
                      className="p-4 rounded-full bg-white/80 backdrop-blur-sm"
                    >
                      {item.icon}
                    </motion.div>
                  </div>
                  
                  {/* Decorative background elements */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-30" aria-hidden="true">
                    <div className="absolute top-1/4 left-1/4 w-10 h-10 border-2 border-current border-opacity-20 rounded-full"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-6 h-6 border border-current border-opacity-20 rounded-full"></div>
                    <div className="absolute top-3/4 left-3/4 w-4 h-4 border border-current border-opacity-20 rounded-full"></div>
                  </div>
                </div>
                
                {/* Card footer with title and arrow */}
                <div className="p-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
                  <div className="p-2 rounded-full bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-300">
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ownerId } = useParams();
  const navigate = useNavigate();
  
  // Get logged-in user ID from localStorage
  const loggedInUserId = localStorage.getItem("ownerId");
  const isOwner = ownerId === loggedInUserId;

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch("http://localhost:3000/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ownerId": ownerId,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          setProfile(data[0]);
        } else {
          setError("Profile not found");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (ownerId) {
      fetchProfileData();
    }
  }, [ownerId]);

  // Handle navigation back to home
  const handleNavigateHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // Render loading state
  if (isLoading) {
    return <LoadingProfile />;
  }

  // Render error state
  if (error || !profile) {
    return <ProfileNotFound onNavigateHome={handleNavigateHome} />;
  }

  // Render profile page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 pb-16 overflow-hidden">
      <style>{customAnimations}</style>
      
      {/* Background decoration */}
      <BackgroundDecoration />
      
      {/* Hero Section */}
      <ProfileHero />

      {/* Profile Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 mb-10">
        <ProfileCard 
          profile={profile} 
          isOwner={isOwner} 
          ownerId={ownerId} 
        />
      </div>

      {/* Portfolio Menu Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <PortfolioMenu ownerId={ownerId} />
      </div>
    </div>
  );
}