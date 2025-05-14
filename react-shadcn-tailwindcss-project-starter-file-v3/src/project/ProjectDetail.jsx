import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ProjectDetail() {
  const { ownerId, id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();
  const realowner = localStorage.getItem("ownerId");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/projects/${id}`);
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("❌ Error fetching project details:", err);
      }
    };
    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        navigate(`/${ownerId}/projects`);
      }
    } catch (err) {
      console.error("❌ Error deleting project:", err);
    }
  };

  if (!project)
    return (
      <div className="text-center text-xl text-blue-700 mt-20 animate-pulse">
        Loading project details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 pt-28 pb-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <img
          src={project.photo}
          alt={project.name}
          className="w-full h-72 object-fill"
        />
        <div className="p-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">{project.name}</h1>
          <p className="text-lg text-gray-700 leading-relaxed">{project.description}</p>

          <div className="mt-6 space-y-4">
            <p className="text-md">
              <span className="font-semibold text-blue-600">GitHub:</span>{" "}
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                {project.githubLink}
              </a>
            </p>
            <p className="text-md">
              <span className="font-semibold text-purple-600">Deployed Link:</span>{" "}
              <a
                href={project.deployLink}
                target="_blank"
                rel="noreferrer"
                className="text-purple-500 underline hover:text-purple-700"
              >
                {project.deployLink}
              </a>
            </p>
            <p className="text-md">
              <span className="font-semibold text-green-600">Tech Stack:</span>{" "}
              {project.techStack}
            </p>

            {/* Show Edit/Delete buttons only if user is the owner */}
            {ownerId === realowner && (
              <div className="pt-4">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => navigate(`/${ownerId}/projects/${id}/edit`)}
                >
                  Edit Project
                </Button>
                <Button
                  className="ml-5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={handleDelete}
                >
                  Delete Project
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
