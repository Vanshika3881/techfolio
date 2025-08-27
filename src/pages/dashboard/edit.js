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
    socials: {
      linkedin: "",
      github: ""
    }
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
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPortfolio({
            name: data.name || "",
            bio: data.bio || "",
            skills: data.skills || [],
            projects: data.projects || [],
            socials: {
              linkedin: data.socials?.linkedin || "",
              github: data.socials?.github || ""
            }
          });
        }
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
      setPortfolio((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
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
    const { title, description, link } = newProject;
    if (title.trim()) {
      setPortfolio((prev) => ({
        ...prev,
        projects: [...prev.projects, newProject]
      }));
      setNewProject({ title: "", description: "", link: "" });
    }
  };

  const handleSave = async () => {
    if (!uid) return;
    const docRef = doc(db, "portfolios", uid);
    await setDoc(docRef, portfolio, { merge: true });
    alert("✅ Saved! View at /preview/" + uid);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Poppins, sans-serif", maxWidth: "800px", margin: "auto" }}>
      <h1>👋 Welcome, {auth.currentUser?.email}</h1>
      <button onClick={() => auth.signOut()}>Logout</button>

      <hr style={{ margin: "1.5rem 0" }} />

      <h2>🧍 About Me</h2>
      <label>Name</label>
      <input
        value={portfolio.name}
        onChange={(e) => handleChange("name", e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <label>Bio</label>
      <textarea
        value={portfolio.bio}
        onChange={(e) => handleChange("bio", e.target.value)}
        rows={3}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />

      <h2>💼 Skills</h2>
      <ul>
        {portfolio.skills.map((skill, index) => (
          <li key={index}>
            {skill} <button onClick={() => handleRemoveSkill(index)}>❌</button>
          </li>
        ))}
      </ul>
      <input
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
        placeholder="Add a skill"
        style={{ padding: "0.5rem", marginRight: "0.5rem" }}
      />
      <button onClick={handleAddSkill}>➕ Add Skill</button>

      <h2>📂 My Projects</h2>
      <label>Title</label>
      <input
        value={newProject.title}
        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <label>Description</label>
      <input
        value={newProject.description}
        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <label>Project Link</label>
      <input
        value={newProject.link}
        onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <button onClick={handleAddProject}>➕ Add Project</button>

      <ul>
        {portfolio.projects.map((proj, i) => (
          <li key={i}>
            <strong>{proj.title}</strong> — {proj.description} —
            <a href={proj.link} target="_blank">🔗</a>
          </li>
        ))}
      </ul>

      <h2>🔗 Social Links</h2>
      <label>LinkedIn</label>
      <input
        value={portfolio.socials.linkedin}
        onChange={(e) =>
          setPortfolio((prev) => ({
            ...prev,
            socials: { ...prev.socials, linkedin: e.target.value }
          }))
        }
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <label>GitHub</label>
      <input
        value={portfolio.socials.github}
        onChange={(e) =>
          setPortfolio((prev) => ({
            ...prev,
            socials: { ...prev.socials, github: e.target.value }
          }))
        }
        style={{ width: "100%", marginBottom: "1.5rem" }}
      />

      <button
        onClick={handleSave}
        style={{
          padding: "0.75rem 1.5rem",
          background: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        💾 Save
      </button>
    </div>
  );
}
