import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

export default function VideoForm() {
  const { ownerId } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [video, setVideo] = useState(null); // For storing video file
  const [loading, setLoading] = useState(false); // Manage loading state
  const [error, setError] = useState(null); // For storing error messages

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset errors

    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }
    if(ownerId){
      formData.append("ownerId",ownerId);
    }
    if (video) {
      formData.append("video", video);
    }

    
    const res = await fetch("http://localhost:3000/api/video/create", {
      method: "POST",
      body: formData,
    });  
    

    const data = await res.json();
    console.log("Video submitted:", data);
    setLoading(false);
    if(res.ok){
      window.location.href = `/${ownerId}/video`; 
    }

  //  // Redirect on success
  //   } catch (err) {
  //     console.error("Submission error:", err);
  //     setError("There was an error submitting your video.");
  //   } finally {
  //     setLoading(false);
  //   }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl bg-white">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-blue-600">Add New Video</h2>
          {error && <div className="text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Video Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="My Awesome Video"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the video"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="video">Upload Video</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
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
                "Submit Video"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
