import { useEffect, useState } from "react";
import {
  ArrowUpRight, BrainCircuit, ChevronLeft, ChevronRight, ChevronDown, Code2,
  Database, Menu, Moon, Sparkles, Sun, Terminal, X, ShieldCheck, Layers3
} from "lucide-react";
import { portfolio } from "./data";

function LogoMark() {
  return <span className="logo-mark" aria-hidden="true">AC</span>;
}

const iconMap = {
  shield: <ShieldCheck size={21} />,
  database: <Database size={21} />,
  brain: <BrainCircuit size={21} />,
  layers: <Layers3 size={21} />
};

function HorizontalSlider({ items, className = "", renderItem, label }) {
  const [index, setIndex] = useState(0);
  const visible = Math.max(1, Math.min(3, Math.floor(items.length / 2)));
  const maxIndex = Math.max(0, items.length - visible);

  const move = (direction) => {
    setIndex((current) => Math.max(0, Math.min(maxIndex, current + direction)));
  };

  return (
    <div className={`slider-shell ${className}`}>
      <div className="slider-controls">
        <span>{label}</span>
        <div>
          <button onClick={() => move(-1)} disabled={index === 0} aria-label="Previous">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => move(1)} disabled={index === maxIndex} aria-label="Next">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="slider-viewport">
        <div className="slider-track" style={{ transform: `translateX(calc(-${index} * (var(--slide-width) + var(--slide-gap)))` }}>
          {items.map((item, itemIndex) => renderItem(item, itemIndex))}
        </div>
      </div>
      <div className="slider-dots">
        {items.map((_, dotIndex) => (
          <button
            key={dotIndex}
            className={dotIndex === index ? "active" : ""}
            onClick={() => setIndex(Math.min(dotIndex, maxIndex))}
            aria-label={`Go to slide ${dotIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("home");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi. I’m Akshay’s portfolio assistant. Ask about his work, stack, journey or research direction."
    }
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const sections = portfolio.nav.map(([id]) => id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }
    );
    sections.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.querySelectorAll(".project-card").forEach((card) => {
      const move = (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      };
      card.addEventListener("pointermove", move);
      return () => card.removeEventListener("pointermove", move);
    });
  }, []);


  const sendChat = async (event) => {
    event?.preventDefault();
    const question = chatInput.trim();
    if (!question) return;
    setMessages((items) => [...items, { role: "user", text: question }]);
    setChatInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question })
      });
      const data = await response.json();
      setMessages((items) => [
        ...items,
        {
          role: "bot",
          text: data.answer || "I couldn’t answer that right now."
        }
      ]);
    } catch {
      setMessages((items) => [
        ...items,
        {
          role: "bot",
          text: "The assistant backend is unavailable right now."
        }
      ]);
    }
  };

  return (
    <div className="app">
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />
      <div className="ambient ambient-3" />
      <div className="grain" />

      <header className="topbar">
        <nav className="nav-shell">
          <a href="#home" className="brand" aria-label="Akshay Chandra home">
            <LogoMark />
            <span>akshay<span className="muted-cyan">.dev</span></span>
          </a>

          <div className="desktop-nav">
            {portfolio.nav.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={active === id ? "nav-link active" : "nav-link"}>
                {label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <button
              className="icon-button"
              aria-label="Toggle theme"
              onClick={() => setDark((value) => !value)}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <a className="nav-cta" href="#contact">Let’s talk <ArrowUpRight size={15} /></a>
            <button
              className="icon-button mobile-only"
              aria-label="Toggle navigation"
              onClick={() => setMenu((value) => !value)}
            >
              {menu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {menu && (
          <div className="mobile-menu">
            {portfolio.nav.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      <main>
        <section id="home" className="hero section">
          <div className="hero-copy">
            <div className="status-pill">
              <span className="status-dot" />
              Building at the intersection of AI, data & software
            </div>

            <p className="hero-overline">Computer Science · Data Science · AI/ML</p>

            <h1 className="hero-title">
              I build
              <br />
              <span className="gradient-word">things that</span>
              <br />
              think<span className="period">.</span>
            </h1>

            <p className="hero-description">
              A CSE student who learns by shipping — ML pipelines, data products,
              simulations, open-source tools and the occasional late-night experiment.
            </p>

            <div className="hero-actions">
              <a href="#work" className="primary-button">
                Explore work <ArrowUpRight size={17} />
              </a>
            </div>

            <div className="hero-meta">
              <span>2023—27 · B.Tech CSE</span>
              <span>Open source</span>
              <span>Research minded</span>
            </div>
          </div>

          <div className="hero-stage" aria-label="Interactive portfolio profile card">
            <div className="hero-card glass-card">
              <div className="hero-card-top">
                <span>AKSHAY.EXE</span>
                <span className="online"><i /> ONLINE</span>
              </div>

              <div className="orbital-scene">
                <div className="orbit orbit-a" />
                <div className="orbit orbit-b" />
                <div className="orbit orbit-c" />
                <div className="avatar-ring">
                  <img src="/self.png" alt="Akshay Chandra" />
                </div>
              </div>

              <div className="hero-card-bottom">
                <div>
                  <div className="card-name">Akshay Chandra</div>
                  <div className="card-role">CSE · Data Science · AI/ML</div>
                </div>
                <div className="mini-grid">
                  <div><strong>8.07</strong><span>CGPA*</span></div>
                  <div><strong>2027</strong><span>GRAD</span></div>
                  <div><strong>∞</strong><span>CURIOSITY</span></div>
                </div>
              </div>
            </div>

            <div className="floating-chip chip-research">
              <Sparkles size={14} /> ML Research
            </div>
            <div className="floating-chip chip-linux">
              <Terminal size={14} /> Arch Linux
            </div>
          </div>

          <a href="#about" className="scroll-cue" aria-label="Scroll to about">
            <span>SCROLL TO EXPLORE</span>
            <ChevronDown size={17} />
          </a>
        </section>

        <section id="about" className="section split-section reveal">
          <div>
            <p className="section-label">01 / ABOUT</p>
            <h2 className="display-title">More than<br /><span>just code.</span></h2>
          </div>

          <div className="section-content">
            <p className="lead">
              I’m a B.Tech CSE student at Netaji Subhash Engineering College,
              exploring how software, data and machine learning can become useful systems.
            </p>
            <p className="body-copy">
              I learn fastest by building. That has meant data dashboards, ML workflows,
              web interfaces, Linux tooling, simulation concepts and collaborative projects.
              The common thread is simple: understand the problem, build the smallest useful
              version, then iterate.
            </p>

            <HorizontalSlider
              items={portfolio.stats}
              label="At a glance"
              className="stats-carousel"
              renderItem={(stat) => (
                <div className="stat glass-card slide-card" key={stat.label}>
                  <strong>{stat.value}</strong><span>{stat.label}</span>
                </div>
              )}
            />
          </div>
        </section>

        <section id="work" className="section reveal">
          <div className="section-heading">
            <div>
              <p className="section-label">02 / SELECTED WORK</p>
              <h2 className="display-title">Built, tested,<br /><span>iterated.</span></h2>
            </div>
            <p className="heading-note">A few things I’ve been building lately.</p>
          </div>

          <div className="project-slider-grid">
            {portfolio.projects.map((project) => (
              <article key={project.title} className={`project-card tone-${project.tone}`}>
                <div className="project-glow" />
                <div className="project-top">
                  <div className="project-icon">{iconMap[project.icon]}</div>
                  <span>{project.number}</span>
                </div>
                <div className="project-content">
                  <p>{project.eyebrow}</p>
                  <h3>{project.title}</h3>
                  <div className="project-line" />
                  <span className="project-arrow"><ArrowUpRight size={18} /></span>
                  <p className="project-description">{project.description}</p>
                  <div className="chip-row">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section split-section reveal">
          <div>
            <p className="section-label">03 / TOOLKIT</p>
            <h2 className="display-title">My<br /><span>stack.</span></h2>
            <p className="body-copy max-copy">
              A practical toolkit spanning software fundamentals, modern frontend work
              and machine learning.
            </p>
          </div>

          <div className="skill-slider-grid">
            {portfolio.skills.map(([name, description], index) => (
              <div className="skill-card glass-card" key={name} style={{ "--delay": `${index * 40}ms` }}>
                <div className="skill-index">0{index + 1}</div>
                <Code2 size={17} />
                <strong>{name}</strong>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="journey" className="section split-section reveal">
          <div>
            <p className="section-label">04 / JOURNEY</p>
            <h2 className="display-title">Still<br /><span>becoming.</span></h2>
          </div>

          <div className="timeline-slider">
            <HorizontalSlider
              items={portfolio.milestones}
              label="Timeline"
              className="timeline-carousel"
              renderItem={([year, text]) => (
                <div className="timeline-card glass-card slide-card" key={year}>
                  <span>{year}</span>
                  <p>{text}</p>
                </div>
              )}
            />
          </div>
        </section>

        <section id="contact" className="section reveal contact-section">
          <div className="contact-card glass-card">
            <div className="contact-light" />
            <div className="contact-copy">
              <p className="section-label">05 / CONTACT</p>
              <h2 className="display-title">Have a problem<br />worth <span>building?</span></h2>
              <p className="body-copy">
                I’m open to interesting projects, research conversations, collaborations
                and opportunities to make useful things.
              </p>
            </div>

            <div className="contact-actions">
              <button className="primary-button" onClick={() => setChatOpen(true)}>
                Ask Akshay AI <BrainCircuit size={17} />
              </button>
            </div>
          </div>

          <footer className="footer">
            <span>© 2026 Akshay Chandra</span>
            <span>React · Tailwind · CSS · Node.js</span>
          </footer>
        </section>
      </main>

      <button className="chat-launcher" onClick={() => setChatOpen(true)}>
        <BrainCircuit size={19} />
        <span>Ask about me</span>
      </button>

      {chatOpen && (
        <div className="chat-overlay">
          <button className="chat-backdrop" aria-label="Close assistant" onClick={() => setChatOpen(false)} />
          <div className="chat-window">
            <div className="chat-header">
              <div>
                <strong>Akshay AI</strong>
                <span>Portfolio assistant</span>
              </div>
              <button className="icon-button" onClick={() => setChatOpen(false)} aria-label="Close">
                <X size={17} />
              </button>
            </div>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={message.role === "bot" ? "bubble bot" : "bubble user"}>
                  {message.text}
                </div>
              ))}
            </div>
            <form className="chat-form" onSubmit={sendChat}>
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Ask about projects, skills..."
                aria-label="Ask the assistant"
              />
              <button aria-label="Send"><ArrowUpRight size={17} /></button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
