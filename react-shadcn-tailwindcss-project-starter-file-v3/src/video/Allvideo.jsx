import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function AllVideos() {
  const [videos, setVideos] = useState([]);
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const realowner = localStorage.getItem("ownerId");

  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/video",{
          method:"GET",
          headers:{
            "Content-Type": "application/json",
            "ownerId":ownerId,
          },
        });
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("❌ Error fetching videos:", err);
      }
    };
    fetchVideos();
  }, [ownerId]); // run only once

  const handleAddVideo = () => {
    navigate(`/${ownerId}/video/create`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 py-12 px-6 pt-28 pb-10">
      <div className="max-w-6xl mx-auto mb-10 px-2 text-center">
        <h1 className="text-4xl font-bold text-blue-800">All Videos</h1>
        <p className="text-gray-600 mt-2">Click on a video to view more details</p>
        
        {ownerId === realowner && (
          <button
            onClick={handleAddVideo}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300"
          >
            Add Video
          </button>
        )}  
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {videos.map((video) => (
          <Link to={`/${ownerId}/video/${video._id}`} key={video._id}>
            <Card className="rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl transform transition duration-300 hover:scale-105">
              {/* Display actual video */}
              <video
                controls
                className="w-full h-52 object-cover transition duration-300 hover:opacity-90"
              >
                <source src={video.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <CardContent className="p-5 text-center">
                <h2 className="text-xl font-semibold text-blue-700">
                  {video.name}
                </h2>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
