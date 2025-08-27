import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaLinkedin, FaGithub, FaEnvelope, FaShareAlt } from "react-icons/fa";
import { getAuth } from "firebase/auth";

export default function PortfolioPreview() {
  const router = useRouter();
  const { uid } = router.query;

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [titleIndex, setTitleIndex] = useState(0);
  const [shareLink, setShareLink] = useState("");


  const auth = getAuth();

  // Fetch portfolio data from Firestore
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!uid) return;
      const docRef = doc(db, "portfolios", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPortfolio(docSnap.data());
      } else {
        console.error("No such document!");
      }
      setLoading(false);
    };
    fetchPortfolio();
  }, [uid]);

  


  // Cycle through multiple titles with interval
  useEffect(() => {
    if (portfolio?.titles?.length > 1) {
      const interval = setInterval(() => {
        setTitleIndex((prev) => (prev + 1) % portfolio.titles.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [portfolio]);

  if (loading) return <p>Loading...</p>;
  if (!portfolio) return <p>Portfolio not found.</p>;

   const userEmail =
    auth.currentUser?.email || portfolio.email || "you@example.com";

    // Share function
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/preview/${uid}`;
    if (navigator.share) {
      try {
        await navigator.share({
  title: `${portfolio.name}&apos;s Portfolio`,
  url: shareUrl,
});

      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Portfolio link copied to clipboard!");
    }
  };


  return (
   <div className="scroll-container">
      {/* NAVBAR */}
      <nav className="navbar flex items-center px-6 py-4 bg-[#1e293b]">
  {/* Left section */}
  <h1 className="logo text-2xl font-bold text-[#0ef] mr-8">Portfolio</h1>

  {/* Nav links */}
  <ul className="nav-links flex gap-6 text-white font-semibold mr-auto">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#projects">Projects</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>

  {/* Right buttons */}
  <div className="flex gap-3">
    <button
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0ef] text-black font-semibold shadow-md hover:scale-105 transition-transform"
      onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        alert("Portfolio link copied to clipboard!");
      }}
    >
      <span>🔗</span> Share
    </button>
    <button
      className="px-4 py-2 rounded-lg bg-[#0ef] text-black font-semibold shadow-md hover:scale-105 transition-transform"
      onClick={() => router.push(`/dashboard?uid=${uid}`)}
    >
      Edit Portfolio
    </button>
  </div>
</nav>




      {/* HOME */}
      <section className="section home" id="home">
        <div className="home-content">
          <div className="text">
            <p className="intro-text fade-in" style={{ animationDelay: "0.3s" }}>
              Hello, It's Me
            </p>
            <h1 className="main-name fade-in" style={{ animationDelay: "0.6s" }}>
              {portfolio.name || "Your Name"}
            </h1>
            <h2 className="animated-title fade-in" style={{ animationDelay: "0.9s" }}>
              {portfolio.titles?.[titleIndex] || "Your Title"}
            </h2>
            <p className="tagline fade-in" style={{ animationDelay: "1.2s" }}>
              Crafting modern, sleek websites & digital experiences.
            </p>
            <div className="button-wrapper fade-in" style={{ animationDelay: "1.5s" }}>
              <button
                className="cta-button"
                onClick={() => {
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View My Work
              </button>
            </div>
          </div>
          {portfolio.profilePicture && (
            <div className="image-container">
              <img src={portfolio.profilePicture} alt={`${portfolio.name} Profile`} />
              <div className="image-glow"></div>
            </div>
          )}
        </div>
      </section>

      

{/* SHARE BUTTON */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 200,
          zIndex: 1000,
          backgroundColor: "#0ef",
          padding: "10px 20px",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "15px",
          color: "#000",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
        }}
        onClick={handleShare}
      >
        <FaShareAlt /> Share
      </div>

      {/* ABOUT + SKILLS */}
      <section className="section about-full" id="about">
        <div className="about-full-wrapper">

          {/* About card */}
          <div className="about-text-container">
            <div className="about-bio">
              <h3>About Me</h3>
              <p>{portfolio.bio || "No bio available."}</p>
            </div>
          </div>

          {/* Skills card */}
          <div className="skills-text-container">
            <div className="skills-bio">
              <h3>Skills</h3>
              {portfolio.skills?.length ? (
                <ul className="skills-list">
                  {portfolio.skills.map((skill, idx) => (
                    <li key={idx} className="skill-item">
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No skills listed.</p>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* PROJECTS */}
      <section className="section" id="projects">
        <h2 className="projects-heading">Projects</h2>
        {portfolio.projects?.length ? (
          <div className="projects-grid">
            {portfolio.projects.map((project, idx) => (
              <div key={idx} className="project-card">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-image"
                  />
                )}
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-button"
                    >
                      🚀 Explore
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No projects added.</p>
        )}
      </section>


      {/* CONTACT */}
        <section className="section contact-section" id="contact">
      <h2 className="contact-heading">Contact</h2>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        
        {/* LinkedIn */}
        {portfolio?.socials?.linkedin && (
          <a
            href={portfolio.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 rounded-2xl bg-[#0f172a] border border-[#0A66C2] shadow-lg hover:shadow-[0_0_20px_#0A66C2] hover:scale-105 transition-transform"
          >
            <FaLinkedin className="text-3xl text-[#0A66C2]" />
            <span className="text-lg font-medium">LinkedIn</span>
          </a>
        )}

        {/* GitHub */}
        {portfolio?.socials?.github && (
          <a
            href={portfolio.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 rounded-2xl bg-[#0f172a] border border-[#333] shadow-lg hover:shadow-[0_0_20px_#333] hover:scale-105 transition-transform"
          >
            <FaGithub className="text-3xl text-[#fff]" />
            <span className="text-lg font-medium">GitHub</span>
          </a>
        )}

        {/* Email */}
        <a
          href={`mailto:${userEmail}`}
          className="flex items-center gap-4 p-6 rounded-2xl bg-[#0f172a] border border-[#0ef] shadow-lg hover:shadow-[0_0_20px_#0ef] hover:scale-105 transition-transform"
        >
          <FaEnvelope className="text-3xl text-[#0ef]" />
          <span className="text-lg font-medium">{userEmail}</span>
        </a>
      </div>

      {/* Footer */}
      <footer className="footer mt-10 text-center text-gray-400">
        &copy; {new Date().getFullYear()} {portfolio?.name || "Your Name"} | All rights reserved.
      </footer>
    </section>


      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        html {
          scroll-behavior: smooth;
        }

        body,
        .scroll-container {
          font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .scroll-container {
          scroll-snap-type: y mandatory;
          overflow-y: scroll;
          height: 100vh;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          color: #f8fafc;
        }

        .navbar {
          position: sticky;
          top: 0;
          background: rgba(30, 41, 59, 0.9);
          display: flex;
          justify-content: space-between;
          padding: 1rem 2rem;
          z-index: 1000;
          backdrop-filter: saturate(180%) blur(10px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .logo {
          font-size: 2.2rem;
          font-weight: 700;
          color: #00e6ff;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .nav-links li a {
          color: #fff;
          font-weight: 700;
          font-size: 1.3rem;
          text-decoration: none;
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-links li a::after {
          content: '';
          position: absolute;
          width: 0%;
          height: 2px;
          bottom: -4px;
          left: 0;
          background: #0ff;
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .nav-links li a:hover {
          color: #0ff;
        }

        .nav-links li a:hover::after {
          width: 100%;
        }

        .section {
          height: 100vh;
          scroll-snap-align: start;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 2rem;
        }

        /* HOME SECTION */
/* HOME SECTION */
.home {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0b1220, #1e293b); /* match about section */
  animation: gradientShift 15s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  min-height: 100vh;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.home-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  flex-wrap: wrap;
  max-width: 1200px;
  width: 100%;
}

/* TEXT */
.text {
  max-width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  flex: 1;
}

.fade-in {
  opacity: 0;
  animation: fadeSlideUp 0.8s ease-out forwards;
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.intro-text {
  font-size: 3rem;
  font-weight: 600;
  color: #3b82f6; /* blue */
  margin-bottom: 0.5rem;
  text-shadow: none; /* no glow */
}

h1.main-name {
  font-size: 6rem;
  font-weight: 800;
  color: #ec4899; /* pink */
  text-shadow: none; /* no glow */
  margin-bottom: 0.4rem;
}

h1.main-name::after {
  content: '';
  display: block;
  width: 80px;
  height: 5px;
  background: linear-gradient(90deg, #3b82f6, #ec4899);
  border-radius: 3px;
  margin-top: 10px;
  animation: underlinePulse 3s ease-in-out infinite;
}

@keyframes underlinePulse {
  0%, 100% { opacity: 1; width: 80px; }
  50% { opacity: 0.6; width: 50px; }
}

.animated-title {
  font-size: 3.5rem;
  font-weight: 600;
  color: #3b82f6;
  text-shadow: none; /* no glow */
  margin-bottom: 1.5rem;
  letter-spacing: 1.5px;
}

.tagline {
  font-size: 1.7rem;
  color: #94a3b8;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  font-style: italic;
  text-shadow: 0 0 3px #3b82f6;
}

.button-wrapper {
  display: flex;
  justify-content: flex-start;
}

.cta-button {
  padding: 0.85rem 2.5rem;
  background: linear-gradient(90deg, #3b82f6, #ec4899);
  border: none;
  border-radius: 30px;
  color: #0b1220;
  font-weight: 700;
  font-size: 1.3rem;
  cursor: pointer;
  transition: box-shadow 0.4s ease, transform 0.3s ease;
  box-shadow: 0 0 8px #3b82f6, 0 0 20px #ec4899;
  letter-spacing: 1.2px;
}

.cta-button:hover {
  box-shadow: 0 0 12px #3b82f6, 0 0 30px #ec4899;
  transform: scale(1.05);
}

/* IMAGE */
.image-container {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: floatUpDown 5s ease-in-out infinite;
}

@keyframes floatUpDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.image-container img {
  width: 580px;
  height: 580px;
  border-radius: 50%;
  border: 6px solid #3b82f6;
  box-shadow: 0 0 25px #3b82f6, 0 0 50px #ec4899;
  object-fit: cover;
  position: relative;
  z-index: 2;
  transition: box-shadow 0.3s ease;
}

.image-container img:hover {
  box-shadow: 0 0 35px #3b82f6, 0 0 70px #ec4899;
}

.image-glow {
  position: absolute;
  width: 580px;
  height: 580px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 40%, transparent 70%);
  filter: blur(25px);
  z-index: 1;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0.6;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .home-content {
    flex-direction: column-reverse;
    text-align: center;
    gap: 2rem;
  }
  .text {
    text-align: center;
  }
  .button-wrapper {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  h1.main-name {
    font-size: 3rem;
  }
  .animated-title {
    font-size: 1.5rem;
  }
  .image-container img {
    width: 250px;
    height: 250px;
  }
  .image-glow {
    width: 270px;
    height: 270px;
  }
}


 /* ABOUT & SKILLS - FULL SCREEN STYLE */
/* ABOUT & SKILLS - FULL SCREEN STYLE */
.about-full {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0b1220, #1e293b); /* darker navy */
  color: #f8fafc;
  padding: 4rem 2rem;
}

.about-full-wrapper {
  display: flex;
  gap: 3rem;
  max-width: 1200px;
  width: 100%;
  flex-wrap: wrap; /* Makes it stack on small screens */
  justify-content: center;
}

/* Reusable card style for both About & Skills */
.about-text-container, 
.skills-text-container {
  flex: 1 1 45%;
  max-width: 550px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid rgba(59, 130, 246, 0.25); /* subtle blue border */
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.25); /* soft blue glow */
  padding: 2rem;
  border-radius: 10px;
  backdrop-filter: blur(5px);
  animation: fadeIn 1s ease-in-out;
}

/* Smooth entrance animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.about-bio h3,
.skills-bio h3 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #3b82f6, #ec4899); /* blue → pink gradient */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.about-bio h3::after,
.skills-bio h3::after {
  content: '';
  display: block;
  width: 70px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #ec4899); /* gradient underline */
  border-radius: 3px;
  margin-top: 8px;
  animation: underlinePulse 3s ease-in-out infinite;
}

@keyframes underlinePulse {
  0%, 100% {
    opacity: 1;
    width: 70px;
  }
  50% {
    opacity: 0.6;
    width: 40px;
  }
}

.about-bio p, 
.skills-bio p {
  font-size: 1.4rem;
  color: #94a3b8; /* softer text */
  line-height: 1.7;
  white-space: pre-wrap;
}

/* SKILLS LIST STYLING */
.skills-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
  @keyframes softGlow {
  0%, 100% {
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
  }
}

.skills-list li {
  font-size: 1.3rem;
  font-weight: 500;
  color: #cbd5e1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.02); /* subtle block background */
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
  border-radius: 6px; /* matches hover */
}

/* Hover effect for interactivity */
.skills-list li:hover {
  background: rgba(59, 130, 246, 0.15);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
  border-radius: 6px;
}

/* Click pop animation */
@keyframes skillPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

.skills-list li:active {
  animation: skillPop 0.2s ease-in-out;
}




       /* Other sections */
.section {
  padding: 6rem 2rem 4rem;
  background-color: #0b1220; /* darker navy to match theme */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.projects-heading {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(90deg, #3b82f6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 3rem;
  text-align: center;
  text-shadow: none; /* removed glow for clean gradient look */
  animation: none;
  letter-spacing: 2px;
}

h2 {
  font-size: 3.2rem;
  margin-bottom: 2rem;
  font-weight: 900;
  background: linear-gradient(90deg, #3b82f6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
  text-shadow: none;
  animation: none;
}

ul {
  list-style: none;
  padding: 0;
  max-width: 600px;
  width: 100%;
}

li {
  margin: 0.6rem 0;
  font-size: 1.3rem;
  font-weight: 500;
  color: #94a3b8; /* softer text */
  border-bottom: 1px solid #1e293b;
  padding-bottom: 0.4rem;
}

.projects-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  justify-content: center;
  width: 100%;
}

.project-card {
  background: #1e293b;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  width: 380px;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 0 35px rgba(236, 72, 153, 0.6);
}

.project-image {
  width: 100%;
  height: auto;
  border-radius: 16px;
  margin-bottom: 1.2rem;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
  transition: box-shadow 0.3s ease;
}

.project-card:hover .project-image {
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  text-align: center;
}
  
.project-info h3 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #3b82f6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}

.project-info p {
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 1.2rem;
  color: #cbd5e1;
}

.project-link {
  align-self: start;
  color: #3b82f6;
  font-weight: 600;
  text-decoration: underline;
  margin-top: 0.5rem;
}

.project-button {
  align-self: center;
  background: linear-gradient(90deg, #06b6d4, #10b981);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 35px;
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.6);
  transition: all 0.3s ease;
  cursor: pointer;
  margin-top: 1rem;
}

.project-button:hover {
  background: linear-gradient(90deg, #10b981, #06b6d4);
  transform: scale(1.1);
  box-shadow: 0 0 25px rgba(16, 185, 129, 0.6);
}


       .footer {
  margin-top: 3rem;
  font-size: 1rem;
  color: #94a3b8; /* soft gray-blue */
  text-align: center;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(59, 130, 246, 0.3); /* subtle blue */
  max-width: 600px;
  width: 100%;
}

/* Edit button container */
.edit-button-container {
  position: absolute;
  top: 20px;
  right: 30px;
  z-index: 999;
}

/* Edit button */
.edit-button {
  background: linear-gradient(90deg, #3b82f6, #ec4899); /* blue → pink */
  color: #fff;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.edit-button:hover {
  background: linear-gradient(90deg, #2563eb, #db2777);
  transform: scale(1.05);
}



/* Contact section */
.contact-section {
  padding: 6rem 2rem 5rem;
  background: linear-gradient(135deg, #0b1220, #1e293b); /* matches theme */
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Contact heading with glow */
.contact-heading {
  font-size: 2.8rem;
  font-weight: 700;
  background: linear-gradient(90deg, #3b82f6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-shadow: 0 0 12px rgba(59, 130, 246, 0.3), 0 0 20px rgba(236, 72, 153, 0.3);
  animation: glowPulse 3s ease-in-out infinite;
}

/* Glow animation */
@keyframes glowPulse {
  0%, 100% {
    text-shadow: 0 0 12px rgba(59, 130, 246, 0.3), 0 0 20px rgba(236, 72, 153, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(236, 72, 153, 0.6);
  }
}

/* Contact links list */
.contact-links {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: center;
}

/* Contact icons with card-like feel */
.contact-icon {
  color: #cbd5e1;
  font-size: 1.3rem;
  font-weight: 600;
  text-decoration: none;
  padding: 0.8rem 1.8rem;
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease;
}

.contact-icon:hover {
  transform: translateY(-3px) scale(1.05);
  color: #fff;
  background: rgba(59, 130, 246, 0.15);
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.5), 0 0 25px rgba(59, 130, 246, 0.5);
  border-color: rgba(236, 72, 153, 0.5);
}
.contact-icon i {
  margin-right: 0.6rem;
  font-size: 1.4rem;
  vertical-align: middle;
}

.contact-icon svg {
  margin-right: 0.6rem;
  vertical-align: middle;
}

/* Email link */
.email-link {
  margin-top: 1.5rem;
  font-size: 1rem;
  color: #94a3b8;
}

.email-link a {
  color: #3b82f6;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.email-link a:hover {
  color: #ec4899;
}


/* Responsive adjustments */
@media (max-width: 900px) {
  .about-full-wrapper {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }
  .about-image-container,
  .about-text-container {
    max-width: 100%;
    flex: none;
  }
  .about-image {
    width: 280px;
    height: 280px;
  }
  .about-name {
    font-size: 3rem;
  }
  .about-title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .about-bio h3 {
    font-size: 2rem;
  }
  .about-bio p {
    font-size: 1.2rem;
  }
  .home-content {
    flex-direction: column;
  }
  .image-container img {
    width: 280px;
    height: 280px;
  }
  h1.main-name {
    font-size: 3rem;
  }
  .animated-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .project-card {
    width: 100%;
    max-width: 90vw;
  }
}



          
      `}</style>
    </div>
  );
}
