import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function EditProfileForm() {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const [profileId, setProfileId] = useState("");


  const [form, setForm] = useState({
    name: "",
    description: "",
    skills: "",
    linkedInLink: "",
    githubLink: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`http://localhost:3000/api/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ownerId: ownerId,
        },
      });

      const data = await res.json();
      const profile = data[0]; // assuming only one profile

      if (profile) {
        setForm({
          name: profile.name || "",
          description: profile.description || "",
          skills: profile.skills || "",
          linkedInLink: profile.linkedInLink || "",
          githubLink: profile.githubLink || "",
        });
        setProfileId(profile._id);
      }
    };

    fetchProfile();
  }, [ownerId]);

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
    if (ownerId) formData.append("ownerId", ownerId);

    const res = await fetch(`http://localhost:3000/api/profile/${profileId}`, {
      method: "PUT",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      navigate(`/${ownerId}/profile`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-green-600">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="description">Bio</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="skills">Skills</Label>
              <Input id="skills" name="skills" value={form.skills} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="linkedInLink">LinkedIn</Label>
              <Input
                id="linkedInLink"
                name="linkedInLink"
                placeholder="https://linkedin.com/in/yourprofile"
                value={form.linkedInLink}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="githubLink">GitHub</Label>
              <Input
                id="githubLink"
                name="githubLink"
                placeholder="https://github.com/yourprofile"
                value={form.githubLink}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="image">Update Profile Image</Label>
              <Input type="file" id="image" onChange={handleImageChange} />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-semibold rounded-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Updating...
                </div>
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
