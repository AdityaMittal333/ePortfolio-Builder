import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

export default function ProfileForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    skills: "",
    linkedin: "",
    github: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { ownerId } = useParams();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

    if (ownerId) {
      formData.append("ownerId", ownerId);
    }
    if (image) {
      formData.append("image", image);
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/profile/create`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Profile submitted:", data);

    setLoading(false);

    if (res.ok) {
      window.location.href = `/${ownerId}/profile`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl bg-white">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-blue-600">Add Your Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of yourself"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                name="skills"
                placeholder="React, Node.js, MongoDB"
                value={form.skills}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                placeholder="https://linkedin.com/in/yourprofile"
                value={form.linkedin}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                name="github"
                placeholder="https://github.com/yourusername"
                value={form.github}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="image">Profile Photo</Label>
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
                "Submit Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
