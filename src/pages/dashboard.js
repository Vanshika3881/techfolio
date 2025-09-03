import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState({
    name: '',
    titles: [],
    bio: '',
    skills: [],
    socials: { linkedin: '', github: '' },
    projects: [],
    profilePicture: '',
  });
  const [titleInput, setTitleInput] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '' });
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, 'portfolios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPortfolio({
            name: data.name || '',
            titles: data.titles || [],
            bio: data.bio || '',
            skills: data.skills || [],
            socials: data.socials || { linkedin: '', github: '' },
            projects: data.projects || [],
            profilePicture: data.profilePicture || '',
          });
          setTitleInput((data.titles || []).join(', '));
        }
      } else {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const saveData = async () => {
    if (!user) return;
    setSaving(true);
    const titlesArray = titleInput.split(',').map(t => t.trim()).filter(Boolean);
    const docRef = doc(db, 'portfolios', user.uid);
    try {
      await setDoc(docRef, { ...portfolio, titles: titlesArray }, { merge: true });
      alert('Saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save data.');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setPortfolio((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const deleteSkill = (index) => {
    const updated = [...portfolio.skills];
    updated.splice(index, 1);
    setPortfolio({ ...portfolio, skills: updated });
  };

  const addProject = () => {
    if (newProject.title || newProject.description || newProject.link) {
      setPortfolio((prev) => ({
        ...prev,
        projects: [...prev.projects, newProject],
      }));
      setNewProject({ title: '', description: '', link: '' });
    }
  };

  const deleteProject = (index) => {
    const updated = [...portfolio.projects];
    updated.splice(index, 1);
    setPortfolio({ ...portfolio, projects: updated });
  };

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      compressImage(reader.result, 0.6, (compressedDataUrl) => {
        setPortfolio((prev) => ({
          ...prev,
          profilePicture: compressedDataUrl,
        }));
      });
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (dataUrl, quality, callback) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 300;
      const scaleSize = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(compressedDataUrl);
    };
    img.src = dataUrl;
  };

  const handlePublish = async () => {
    if (!user) return;
    try {
      await saveData();
      alert(`Portfolio published! You can now view it at /preview/${user.uid}`);
    } catch (error) {
      console.error('Publish failed:', error);
      alert('Failed to publish portfolio.');
    }
  };

  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div
          key={s}
          className={`w-10 h-10 rounded-full mx-3 flex items-center justify-center text-white font-bold text-lg cursor-pointer
            ${step === s ? 'bg-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.8)] animate-pulse' : 'bg-gray-600 hover:bg-gray-500 transition'}`}
          onClick={() => setStep(s)}
        >
          {s}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
              Profile Info
            </h2>
            {portfolio.profilePicture && (
              <img
                src={portfolio.profilePicture}
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover mb-4 mx-auto border-4 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.7)]"
              />
            )}
            <input type="file" accept="image/*" onChange={handleProfileImage} className="mb-6 w-full" />
            <input
              type="text"
              placeholder="Your Name"
              className="w-full mb-6 p-4 border border-gray-700 rounded bg-[#0f172a] text-white text-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              value={portfolio.name}
              onChange={(e) => setPortfolio({ ...portfolio, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Titles (e.g. Web Developer, Designer)"
              className="w-full p-4 border border-gray-700 rounded bg-[#0f172a] text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
            />
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
              📝 About & Skills
            </h2>
            <textarea
              rows={5}
              placeholder="Bio"
              className="w-full mb-6 p-4 border border-gray-700 rounded bg-[#0f172a] text-white text-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              value={portfolio.bio}
              onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })}
            />
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 p-4 border border-gray-700 rounded bg-[#0f172a] text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                placeholder="Add a skill"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button
                onClick={addSkill}
                className="bg-cyan-400 px-6 py-3 rounded text-black text-lg font-semibold hover:bg-cyan-500 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {portfolio.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-cyan-200 text-cyan-900 px-4 py-2 rounded-full flex items-center gap-2 shadow-md"
                >
                  {skill}
                  <button
                    onClick={() => deleteSkill(idx)}
                    className="text-red-600 font-bold hover:text-red-800 transition"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
              📂 Projects
            </h2>
            {portfolio.projects.map((project, idx) => (
              <div
                key={idx}
                className="border border-gray-700 p-4 mb-4 rounded bg-[#0f172a] text-white shadow-md"
              >
                <h3 className="font-semibold text-xl">{project.title}</h3>
                <p className="text-sm mb-2">{project.description}</p>
                <a href={project.link} className="text-cyan-400 underline" target="_blank" rel="noreferrer">
                  {project.link}
                </a>
                <button
                  onClick={() => deleteProject(idx)}
                  className="ml-3 text-red-500 text-sm hover:text-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))}
            <input
              type="text"
              placeholder="Title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="w-full mb-3 p-4 border border-gray-700 rounded bg-[#0f172a] text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
            <textarea
              placeholder="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full mb-3 p-4 border border-gray-700 rounded bg-[#0f172a] text-white text-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              rows={3}
            />
            <input
              type="url"
              placeholder="Project Link"
              value={newProject.link}
              onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
              className="w-full mb-4 p-4 border border-gray-700 rounded bg-[#0f172a] text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
            <button
              onClick={addProject}
              className="bg-purple-500 text-white px-8 py-3 rounded font-semibold hover:bg-purple-600 transition"
            >
              ➕ Add Project
            </button>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
              🔗 Social Links & Publish
            </h2>
            <input
              type="url"
              placeholder="LinkedIn"
              className="w-full p-4 mb-6 border border-gray-700 rounded bg-[#0f172a] text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              value={portfolio.socials.linkedin}
              onChange={(e) =>
                setPortfolio((prev) => ({
                  ...prev,
                  socials: { ...prev.socials, linkedin: e.target.value },
                }))
              }
            />
            <input
              type="url"
              placeholder="GitHub"
              className="w-full p-4 mb-6 border border-gray-700 rounded bg-[#0f172a] text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              value={portfolio.socials.github}
              onChange={(e) =>
                setPortfolio((prev) => ({
                  ...prev,
                  socials: { ...prev.socials, github: e.target.value },
                }))
              }
            />
            <div className="flex flex-wrap gap-6">
              <button
                onClick={saveData}
                disabled={saving}
                className="bg-blue-600 px-8 py-3 rounded font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : '💾 Save'}
              </button>
              <button
                onClick={handlePublish}
                className="bg-green-500 px-8 py-3 rounded font-semibold text-white hover:bg-green-600 transition"
              >
                🌐 Publish Portfolio
              </button>
              <button
                onClick={() => window.open(`/preview/${user?.uid}`, '_blank')}
                className="bg-cyan-400 px-8 py-3 rounded font-semibold text-black hover:bg-cyan-500 transition"
              >
                👁 Preview Portfolio
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 🔹 Animations for background + float */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center p-6 text-white font-[Poppins]"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a, #1e293b)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 15s ease infinite"
        }}
      >
        <div className="w-full max-w-4xl bg-[#0f172a] p-10 rounded-3xl border border-cyan-400 shadow-[0_0_40px_#00e6ff] animate-float">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Welcome, {portfolio.name || user?.email}
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-6 py-3 rounded font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
          <StepIndicator />
          {renderStep()}
          <div className="flex justify-between mt-10">
            {step > 1 && (
              <button
                onClick={() => setStep((prev) => prev - 1)}
                className="bg-gray-600 px-8 py-3 rounded font-semibold hover:bg-gray-500 transition"
              >
                ⬅ Back
              </button>
            )}
            {step < 4 && (
              <button
                onClick={() => setStep((prev) => prev + 1)}
                className="bg-cyan-400 px-8 py-3 rounded font-semibold text-black hover:bg-cyan-500 transition ml-auto"
              >
                Next ➡
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
