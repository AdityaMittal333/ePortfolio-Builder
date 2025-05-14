import './App.css';
import React, { useEffect, useState } from 'react';
import Header from './default/Header';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from './default/HomePage';
import ProfileForm from './profile/ProfileForm';
import Profile from './profile/Profile';
import EditProfileForm from './profile/EditProfileForm';

import AllProjects from './project/AllProjects';
import ProjectForm from './project/ProjectForm';
import ProjectDetail from './project/ProjectDetail';
import EditProjectForm from './project/EditProjectForm';

import AllExperience from './experience/AllExperience.jsx';
import ExperienceForm from './experience/ExperienceForm';
import EditExperienceForm from './experience/EditExperienceForm.jsx';
import ExperienceDetail from './experience/ExperienceDetail.jsx';

import AllCertificates from './certificate/AllCertificate';
import CertificateForm from './certificate/CertificateForm';
import CertificateDetail from './certificate/CertificateDetail';
import EditCertificateForm from './certificate/EditCertificateForm';

import AllVideos from './video/Allvideo';
import VideoForm from './video/VideoForm';
import VideoDetail from './video/VideoDetail';
import EditVideoForm from './video/EditVideoForm';

import Footer from './default/Footer';

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Dummy login function – replace with your Google login later
  const handleLogin = () => {
    localStorage.setItem("user", JSON.stringify(dummyUser));
    setUser(dummyUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    
    <Router>
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:ownerId/profileForm" element={<ProfileForm />} />
        <Route path="/:ownerId/profile" element={<Profile />} />
        <Route path="/:ownerId/profile/edit" element={<EditProfileForm />} />

        <Route path="/:ownerId/projects" element={<AllProjects />} />
        <Route path="/:ownerId/projects/create" element={<ProjectForm />} />
        <Route path="/:ownerId/projects/:id" element={<ProjectDetail />} />
        <Route path="/:ownerId/projects/:id/edit" element={<EditProjectForm />} />

        <Route path="/:ownerId/experience" element={<AllExperience />} />
        <Route path="/:ownerId/experience/create" element={<ExperienceForm />} />
        <Route path="/:ownerId/experience/:id" element={<ExperienceDetail />} />
        <Route path="/:ownerId/experience/:id/edit" element={<EditExperienceForm />} />

        <Route path="/:ownerId/certificate" element={<AllCertificates />} />
        <Route path="/:ownerId/certificate/create" element={<CertificateForm />} />
        <Route path="/:ownerId/certificate/:id" element={<CertificateDetail />} />
        <Route path="/:ownerId/certificate/:id/edit" element={<EditCertificateForm />} />

        <Route path="/:ownerId/video" element={<AllVideos />} />
        <Route path="/:ownerId/video/create" element={<VideoForm />} />
        <Route path="/:ownerId/video/:id" element={<VideoDetail />} />
        <Route path="/:ownerId/video/:id/edit" element={<EditVideoForm />} />
      </Routes>
      <Footer />
    </Router>
    
  );
}

export default App;
