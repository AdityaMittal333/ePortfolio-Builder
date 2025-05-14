import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function VideoDetail() {
  const { ownerId,id } = useParams();
  const [video, setVideo] = useState(null);
  const navigate = useNavigate();
  const realowner = localStorage.getItem("ownerId");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/video/${id}`);
        const data = await res.json();
        setVideo(data);
      } catch (err) {
        console.error("❌ Error fetching video details:", err);
      }
    };
    fetchVideo();
  }, [id]);

  const handleDelete = async (req,res) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/video/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        navigate(`/${ownerId}/video`);
      }
    } catch (err) {
      console.error("❌ Error deleting video:", err);
    }
  };

  if (!video)
    return (
      <div className="text-center text-xl text-blue-700 mt-20 animate-pulse">
        Loading video details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 pt-28 pb-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative w-full h-72 bg-gray-200">
          <video
            src={video.video}
            controls
            className="w-full h-full object-cover"
            alt={video.name}
          />
        </div>
        <div className="p-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">{video.name}</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">{video.description}</p>
          
          {ownerId === realowner && (
            <div className="mt-6 space-y-4">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-5"
                onClick={() => navigate(`/${ownerId}/video/${id}/edit`)}
              >
                Edit Video
              </Button>

              <Button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Delete Video
              </Button>
            </div>
           )}  
        </div>
      </div>
    </div>
  );
}
