import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; 

export default function EditProjectForm() {
  const { ownerId,id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    githubLink: "",
    deployLink: "",
    techStack: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchProject = async () => {
      const res = await fetch(`http://localhost:3000/api/projects/${id}`);
      const data = await res.json();
      setForm(data);
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }
    if (image) formData.append("image", image);
    if(ownerId) formData.append("ownerId",ownerId);

    const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
      method: "PUT",
      body: formData,
      headers:{
        "ownerId":ownerId,
      },
    });

    setLoading(false);

    if (res.ok) {
      navigate(`/${ownerId}/projects/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-blue-600">Edit Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="githubLink">GitHub Link</Label>
              <Input id="githubLink" name="githubLink" value={form.githubLink} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="deployLink">Deploy Link</Label>
              <Input id="deployLink" name="deployLink" value={form.deployLink} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="techStack">Tech Stack</Label>
              <Input id="techStack" name="techStack" value={form.techStack} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="image">Update Project Image</Label>
              <Input type="file" id="image" onChange={handleImageChange} />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-semibold rounded-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Updating...
                </div>
              ) : (
                "Update Project"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
