import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

export default function EditPortfolio() {
  const [uid, setUid] = useState(null);
  const [portfolio, setPortfolio] = useState({
    name: "",
    bio: "",
    skills: [],
    projects: [],
    socials: { linkedin: "", github: "" }
  });

  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "" });
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "portfolios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setPortfolio({ ...portfolio, ...docSnap.data() });
      } else {
        router.push("/signup");
      }
    });
  }, []);

  const handleChange = (field, value) => {
    setPortfolio((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setPortfolio((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    setPortfolio((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleAddProject = () => {
    if (newProject.title.trim()) {
      setPortfolio((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
      setNewProject({ title: "", description: "", link: "" });
    }
  };

  const handleSave = async () => {
    if (!uid) return;
    await setDoc(doc(db, "portfolios", uid), portfolio, { merge: true });
    alert("✅ Saved! View at /preview/" + uid);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background:
            "linear-gradient(135deg, #0f172a, #1e293b, #0f172a, #1e293b)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 15s ease infinite"
        }}
      >
        <div className="bg-[#0f172a] bg-opacity-90 p-6 sm:p-10 md:p-14 rounded-2xl shadow-[0_0_40px_#00e6ff] border border-[#00e6ff] w-full max-w-4xl text-white space-y-8 animate-float">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            ✏️ Edit Your Portfolio
          </h1>

          <p className="text-center text-gray-300">
            Logged in as <span className="font-semibold">{auth.currentUser?.email}</span>
          </p>
          <button
            onClick={() => auth.signOut()}
            className="block mx-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold"
          >
            Logout
          </button>

          {/* About Me */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">🧍 About Me</h2>
            <input
              value={portfolio.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your Name"
              className="w-full p-3 mb-3 rounded-lg border border-gray-600 bg-[#1e293b] text-white placeholder-gray-400"
            />
            <textarea
              value={portfolio.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Write a short bio..."
              rows={3}
              className="w-full p-3 rounded-lg border border-gray-600 bg-[#1e293b] text-white placeholder-gray-400"
            />
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">💼 Skills</h2>
            <div className="flex gap-2 mb-3">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 p-3 rounded-lg border border-gray-600 bg-[#1e293b] text-white placeholder-gray-400"
              />
              <button
                onClick={handleAddSkill}
                type="button"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold"
              >
                ➕
              </button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill, index) => (
                <li
                  key={index}
                  className="bg-blue-600 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button onClick={() => handleRemoveSkill(index)}>❌</button>
                </li>
              ))}
            </ul>
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">📂 My Projects</h2>
            <input
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="Project Title"
              className="w-full p-3 mb-2 rounded-lg border border-gray-600 bg-[#1e293b]"
            />
            <input
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Project Description"
              className="w-full p-3 mb-2 rounded-lg border border-gray-600 bg-[#1e293b]"
            />
            <input
              value={newProject.link}
              onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
              placeholder="Project Link"
              className="w-full p-3 mb-3 rounded-lg border border-gray-600 bg-[#1e293b]"
            />
            <button
              onClick={handleAddProject}
              type="button"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold"
            >
              ➕ Add Project
            </button>
            <ul className="mt-4 space-y-2">
              {portfolio.projects.map((proj, i) => (
                <li key={i} className="bg-[#1e293b] p-3 rounded-lg">
                  <strong>{proj.title}</strong> — {proj.description} —{" "}
                  <a href={proj.link} target="_blank" className="text-blue-400 underline">
                    🔗
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Socials */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">🔗 Social Links</h2>
            <input
              value={portfolio.socials.linkedin}
              onChange={(e) =>
                setPortfolio((prev) => ({ ...prev, socials: { ...prev.socials, linkedin: e.target.value } }))
              }
              placeholder="LinkedIn Profile"
              className="w-full p-3 mb-3 rounded-lg border border-gray-600 bg-[#1e293b]"
            />
            <input
              value={portfolio.socials.github}
              onChange={(e) =>
                setPortfolio((prev) => ({ ...prev, socials: { ...prev.socials, github: e.target.value } }))
              }
              placeholder="GitHub Profile"
              className="w-full p-3 rounded-lg border border-gray-600 bg-[#1e293b]"
            />
          </section>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 rounded-lg font-bold text-xl"
          >
            💾 Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
