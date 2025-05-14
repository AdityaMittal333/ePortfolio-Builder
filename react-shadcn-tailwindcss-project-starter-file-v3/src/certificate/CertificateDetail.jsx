import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CertificateDetail() {
  const { ownerId,id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const navigate = useNavigate();
  const realowner = localStorage.getItem("ownerId");

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/certificate/${id}`);
        const data = await res.json();
        setCertificate(data);
      } catch (err) {
        console.error("❌ Error fetching certificate details:", err);
      }
    };
    fetchCertificate();
  }, [id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/certificate/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        navigate(`/${ownerId}/certificate`);
      }
    } catch (err) {
      console.error("❌ Error deleting certificate:", err);
    }
  };

  if (!certificate)
    return <div className="text-center text-xl text-blue-700 mt-20 animate-pulse">Loading certificate details...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 pt-28 pb-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {certificate.photo && (
          <img
            src={certificate.photo}
            alt={certificate.name}
            className="w-full h-72 object-fill"
          />
        )}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">{certificate.name}</h1>
          <p className="text-lg text-gray-700 leading-relaxed">{certificate.description}</p>

          <div className="mt-6 space-y-4">
            <p className="text-md">
              <span className="font-semibold text-blue-600">Certificate Link:</span>{" "}
              <a
                href={certificate.certificateLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                {certificate.certificateLink}
              </a>
            </p>
            <p className="text-md">
              <span className="font-semibold text-green-600">Tech Stack:</span> {certificate.techStack}
            </p>
            {ownerId === realowner && (
              <div>
                <Button
                  className=" bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => navigate(`/${ownerId}/certificate/${id}/edit`)}
                >
                  Edit Certificate
                </Button>
                <Button
                  className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-5"
                  onClick={handleDelete}
                >
                  Delete Certificate
                </Button>
              </div> 
            )}   
          </div>
        </div>
      </div>
    </div>
  );
}
