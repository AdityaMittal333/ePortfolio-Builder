import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

export default function CertificateForm() {
  const { ownerId } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    certificateLink: "", // Renamed "Link" to "certificateLink"
    techStack: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); // For error handling

  const handleChange = (e) => {
    setForm({
      ...form, // Spread operator to keep the rest of the form values intact
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setLoading(true); // Set loading to true when form is being submitted
    setError(""); // Reset any previous error

    // if (!form.name || !form.description || !form.techStack || !form.certificateLink) {
    //   setError("Please fill all the fields.");
    //   setLoading(false);
    //   return;
    // }

    const formData = new FormData(); // Used to send data in multipart/form-data format
    for (let key in form) {
      formData.append(key, form[key]);
    }
    if(ownerId){
      formData.append("ownerId",ownerId);
    }
    if (image) {
      formData.append("image", image);
    }

    
    const res = await fetch("http://localhost:3000/api/certificate/create", {
    method: "POST",
    body: formData,
    });
    

    const data = await res.json();
    console.log("Certificate submitted:", data);

    setLoading(false);

    if (res.ok) {
      window.location.href = `/${ownerId}/certificate`; // Redirect on success
    }
   
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl bg-white">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-blue-600">Add New Certificate</h2>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>} {/* Display error message */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Certificate Name</Label>
              <Input
                id="name"
                name="name"
                placeholder=""
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the certificate"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="techStack">Tech Stack</Label>
              <Input
                id="techStack"
                name="techStack"
                placeholder="React, Node.js, MongoDB"
                value={form.techStack}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="certificateLink">Certificate Link</Label> {/* Renamed to certificateLink */}
              <Input
                id="certificateLink"
                name="certificateLink"
                placeholder="https://certificate.com/..."
                value={form.certificateLink} // Use certificateLink here
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="image">Project Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Submitting...
                </>
              ) : (
                "Submit Certificate"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
