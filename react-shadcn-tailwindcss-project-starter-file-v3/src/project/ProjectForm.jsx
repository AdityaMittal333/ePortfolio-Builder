import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

export default function ProjectForm() {
  const { ownerId } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    githubLink: "",
    deployLink: "",
    techStack: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // manage loading

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

    const formData = new FormData(); //used to send data in multipart/form-data format
    for (let key in form) {
      formData.append(key, form[key]);
    }

    if(ownerId){
      formData.append("ownerId",ownerId);
    }
    if (image) {
      formData.append("image", image);
    }

    const res = await fetch("http://localhost:3000/api/projects/create", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Project submitted:", data);

    setLoading(false); // Set loading to false when submission is done

    if (res.ok) {
      window.location.href = `/${ownerId}/projects`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl bg-white">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-blue-600">Add New Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="My Awesome App"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the project"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="githubLink">GitHub Link</Label>
              <Input
                id="githubLink"
                name="githubLink"
                placeholder="https://github.com/..."
                value={form.githubLink}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="deployLink">Deployed Link</Label>
              <Input
                id="deployLink"
                name="deployLink"
                placeholder="https://yourapp.netlify.app"
                value={form.deployLink}
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
              // disabled={loading} // Disable button when loading
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Submitting...
                </>
              ) : (
                "Submit Project"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
