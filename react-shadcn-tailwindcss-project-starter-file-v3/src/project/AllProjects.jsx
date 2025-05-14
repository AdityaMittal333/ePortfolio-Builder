import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const { ownerId } = useParams();
  const navigate = useNavigate();

  const realowner = localStorage.getItem("ownerId");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ownerId": ownerId,
          },
        });
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("❌ Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, [ownerId]);

  const handleAddProject = () => {
    navigate(`/${ownerId}/projects/create`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 py-12 px-6 pt-28 pb-10">
      <div className="max-w-6xl mx-auto mb-10 px-2 text-center">
        <h1 className="text-4xl font-bold text-blue-800">All Projects</h1>
        <p className="text-gray-600 mt-2">Click on a project to view more details</p>

        {ownerId === realowner && (
          <button
            onClick={handleAddProject}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300"
          >
            Add Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {projects.map((project) => (
          <Link to={`/${ownerId}/projects/${project._id}`} key={project._id}>
            <Card className="rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl transform transition duration-300 hover:scale-105">
              <img
                src={project.photo}
                alt={project.name}
                className="w-full h-52 object-cover transition duration-300 hover:opacity-90"
              />
              <CardContent className="p-5 text-center">
                <h2 className="text-xl font-semibold text-blue-700">
                  {project.name}
                </h2>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
