import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ExperienceDetail() {
  const { ownerId,id } = useParams();
  const [experience, setExperience] = useState(null);
  const navigate = useNavigate();
  const realowner = localStorage.getItem("ownerId");

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/experience/${id}`);
        if (!res.ok) throw new Error('Failed to fetch experience');
        const data = await res.json();
        setExperience(data);
      } catch (err) {
        console.error("❌ Error fetching experience details:", err);
      }
    };
    fetchExperience();
  }, [id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/experience/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        navigate(`/${ownerId}/experience`);
      } else {
        console.error("Failed to delete experience");
      }
    } catch (err) {
      console.error("❌ Error deleting experience:", err);
    }
  };

  if (!experience) {
    return <div className="text-center text-xl text-blue-700 mt-20 animate-pulse">Loading experience details...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 pt-28 pb-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <img
          src={experience.photo}
          alt={experience.name}
          className="w-full h-72 object-fill" // Fixed fit without hover
        />
        <div className="p-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">{experience.name}</h1>
          <p className="text-lg text-gray-700 leading-relaxed">{experience.description}</p>
          <p className="text-md mt-3">
              <span className="font-semibold text-green-600">Tech Stack:</span> {experience.techStack}
          </p>
          {ownerId === realowner && (
            <div className="mt-6 space-y-4">
              <Button
                className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => navigate(`/${ownerId}/experience/${id}/edit`)}
              >
                Edit Experience
              </Button>
              <Button
                className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-5"
                onClick={handleDelete}
              >
                Delete Experience
              </Button>
            </div>
          )}  
        </div>
      </div>
    </div>
  );
}
