import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom"; // <-- added useNavigate
import { useParams } from "react-router-dom";

export default function AllCertificates() {
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate(); // <-- for programmatic navigation
  const { ownerId } = useParams();
  const realowner = localStorage.getItem("ownerId");

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/certificate`,{
          method:"GET",
          headers:{
            "Content-Type":"application/json",
            "ownerId":ownerId,
          },
        });
        const data = await res.json();
        setCertificates(data);
      } catch (err) {
        console.error("❌ Error fetching certificates:", err);
      }
    };
    fetchCertificates();
  }, [ownerId]);

  const handleAddProject = () => {
    navigate(`/${ownerId}/certificate/create`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 py-12 px-6 pt-28 pb-10">
      <div className="max-w-6xl mx-auto mb-10 px-2 text-center">
        <h1 className="text-4xl font-bold text-blue-800">All Certificates</h1>
        <p className="text-gray-600 mt-2">Click on a certificate to view more details</p>

        {/* ➡️ Add Project Button */}
        {ownerId === realowner && (
          <button
            onClick={handleAddProject}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300"
          >
            Add Certificate
          </button>
         )}  
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {certificates.map((certificate) => (
          <Link to={`/${ownerId}/certificate/${certificate._id}`} key={certificate._id}>
            <Card className="rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl transform transition duration-300 hover:scale-105">
              {certificate.photo && (
                <img
                  src={certificate.photo}
                  alt={certificate.name}
                  className="w-full h-52 object-cover transition duration-300 hover:opacity-90"
                />
              )}
              <CardContent className="p-5 text-center">
                <h2 className="text-xl font-semibold text-blue-700">
                  {certificate.name}
                </h2>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
