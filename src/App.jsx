import { useEffect, useRef, useState } from "react";
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

// Hyper-personalization: greet based on local time + returning-visitor detection.
function useGreeting() {
  const [greeting, setGreeting] = useState("Welcome");
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 5) setGreeting("Still up late?");
    else if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else if (hour < 21) setGreeting("Good evening");
    else setGreeting("Burning the midnight oil");

    try {
      const seen = localStorage.getItem("visited");
      if (seen) setReturning(true);
      localStorage.setItem("visited", "1");
    } catch {
      /* storage unavailable, skip personalization */
    }
  }, []);

  return { greeting, returning };
}

// Shared tilt handler for perspective cards — sets --rx / --ry / --mx / --my.
function useTilt(maxDeg = 8) {
  const onMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--ry", `${(px - 0.5) * maxDeg * 2}deg`);
    card.style.setProperty("--rx", `${(0.5 - py) * maxDeg * 2}deg`);
    card.style.setProperty("--mx", `${px * 100}%`);
    card.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = (event) => {
    const card = event.currentTarget;
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--rx", "0deg");
  };
  return { onPointerMove: onMove, onPointerLeave: onLeave };
}

// Magnetic pull toward the cursor for buttons — small, snappy offset.
function useMagnetic(strength = 0.35) {
  const onMove = (event) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const mx = (event.clientX - rect.left - rect.width / 2) * strength;
    const my = (event.clientY - rect.top - rect.height / 2) * strength;
    el.style.setProperty("--mx", `${mx}px`);
    el.style.setProperty("--my", `${my}px`);
  };
  const onLeave = (event) => {
    event.currentTarget.style.setProperty("--mx", "0px");
    event.currentTarget.style.setProperty("--my", "0px");
  };
  return { onPointerMove: onMove, onPointerLeave: onLeave };
}

function HorizontalSlider({ items, className = "", renderItem, label }) {
  const [index, setIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef(null);
  const drag = useRef({ startX: 0, active: false, width: 1 });
  const visible = Math.max(1, Math.min(3, Math.floor(items.length / 2)));
  const maxIndex = Math.max(0, items.length - visible);

  const move = (direction) => {
    setIndex((current) => Math.max(0, Math.min(maxIndex, current + direction)));
  };

  const slideSpan = () => {
    const viewport = viewportRef.current;
    if (!viewport) return 1;
    const track = viewport.firstElementChild;
    const firstSlide = track?.firstElementChild;
    if (!firstSlide) return viewport.clientWidth || 1;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    return firstSlide.getBoundingClientRect().width + gap;
  };

  const onDragStart = (event) => {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    drag.current = { startX: clientX, active: true, width: slideSpan() };
    setDragging(true);
  };

  const onDragMove = (event) => {
    if (!drag.current.active) return;
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    let delta = clientX - drag.current.startX;
    // resist dragging past the ends instead of overshooting
    if ((index === 0 && delta > 0) || (index === maxIndex && delta < 0)) delta *= 0.35;
    setDragPx(delta);
  };

  const onDragEnd = () => {
    if (!drag.current.active) return;
    const span = drag.current.width || 1;
    const threshold = span * 0.18;
    if (dragPx <= -threshold) move(1);
    else if (dragPx >= threshold) move(-1);
    drag.current.active = false;
    setDragging(false);
    setDragPx(0);
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
      <div
        className={`slider-viewport${dragging ? " dragging" : ""}`}
        ref={viewportRef}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
      >
        <div
          className="slider-track"
          style={{
            transform: `translateX(calc(-${index} * (var(--slide-width) + var(--slide-gap)) + ${dragPx}px))`,
            transition: dragging ? "none" : undefined
          }}
        >
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
  const [typing, setTyping] = useState(false);
  const { greeting, returning } = useGreeting();
  const heroTilt = useTilt(5);
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi. I'm Akshay's portfolio assistant. Ask about his work, stack, journey or research direction."
    }
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Liquid cursor glow — tracks pointer position across the whole page.
  useEffect(() => {
    const glow = document.querySelector(".cursor-glow");
    const app = document.querySelector(".app");
    if (!glow || !app) return;
    let raf = null;
    const onMove = (event) => {
      glow.classList.add("active");
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.style.setProperty("--px", `${event.clientX}px`);
        glow.style.setProperty("--py", `${event.clientY}px`);
        app.style.setProperty("--cx", `${(event.clientX / window.innerWidth) * 100}%`);
        app.style.setProperty("--cy", `${(event.clientY / window.innerHeight) * 100}%`);
      });
    };
    const onLeave = () => glow.classList.remove("active");
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll storytelling — reveal sections (and their children, staggered) as they enter view.
  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            entry.target.querySelectorAll(".reveal-item").forEach((child, index) => {
              child.style.setProperty("--stagger", `${index * 0.08}s`);
            });
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

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
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typing, chatOpen]);

  const projectTilt = useTilt(6);
  const ctaMagnet = useMagnetic(0.3);

  const sendChat = async (event) => {
    event?.preventDefault();
    const question = chatInput.trim();
    if (!question) return;
    setMessages((items) => [...items, { role: "user", text: question }]);
    setChatInput("");
    setTyping(true);

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
          text: data.answer || "I couldn't answer that right now."
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
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="app">
      <div className="cursor-glow" aria-hidden="true" />
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
            <a className="nav-cta" href="#contact" {...ctaMagnet}>Let's talk <ArrowUpRight size={15} /></a>
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
              {returning ? "Welcome back — " : `${greeting} — `}building at the intersection of AI, data & software
            </div>

            <p className="hero-overline">Computer Science · Data Science · AI/ML</p>

            <div className="hero-title-wrap">
              <p className="hero-title-ghost" aria-hidden="true">I build<br />things that<br />think.</p>
              <h1 className="hero-title">
                I build
                <br />
                <span className="gradient-word">things that</span>
                <br />
                think<span className="period">.</span>
              </h1>
            </div>

            <p className="hero-description">
              A CSE student who learns by shipping — ML pipelines, data products,
              simulations, open-source tools and the occasional late-night experiment.
            </p>

            <div className="hero-actions">
              <a href="#work" className="primary-button" {...ctaMagnet}>
                Explore work <ArrowUpRight size={17} />
              </a>
            </div>

            <div className="hero-meta">
              <span>Kolkata, India</span>
              <span>Research minded</span>
            </div>
          </div>

          <div className="hero-stage" aria-label="Interactive portfolio profile card">
            <div className="hero-card glass-card" onPointerMove={heroTilt.onPointerMove} onPointerLeave={heroTilt.onPointerLeave}>
              <div className="hero-card-top">
                <span>AKSHAY.EXE</span>
                <span className="online"><i /> ONLINE</span>
              </div>

              <div className="orbital-scene">
                <div className="orbit orbit-a" />
                <div className="orbit orbit-b" />
                <div className="orbit orbit-c" />
                <div className="avatar-ring">
                  <img src="/public/self.png" alt="Akshay Chandra" />
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
          <div className="reveal-item">
            <p className="section-label">01 / ABOUT</p>
            <h2 className="display-title">More than<br /><span>just code.</span></h2>
          </div>

          <div className="section-content">
            <p className="lead reveal-item">
              I'm a B.Tech CSE student at Netaji Subhash Engineering College,
              exploring how software, data and machine learning can become useful systems.
            </p>
            <p className="body-copy reveal-item">
              I learn fastest by building. That has meant data dashboards, ML workflows,
              web interfaces, Linux tooling, simulation concepts and collaborative projects.
              The common thread is simple: understand the problem, build the smallest useful
              version, then iterate.
            </p>

            <div className="reveal-item">
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
          </div>
        </section>

        <section id="work" className="section reveal">
          <div className="section-heading reveal-item">
            <div>
              <p className="section-label">02 / SELECTED WORK</p>
              <h2 className="display-title">Built, tested,<br /><span>iterated.</span></h2>
            </div>
            <p className="heading-note">A few things I've been building lately.</p>
          </div>

          <div className="reveal-item">
            <HorizontalSlider
              items={portfolio.projects}
              label="Projects"
              className="projects-carousel"
              renderItem={(project) => (
                <article
                  key={project.title}
                  className={`project-card slide-card tone-${project.tone}`}
                  onPointerMove={projectTilt.onPointerMove}
                  onPointerLeave={projectTilt.onPointerLeave}
                >
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
                    <div className="chip-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </div>
                </article>
              )}
            />
          </div>
        </section>

        <section id="skills" className="section split-section reveal">
          <div className="reveal-item">
            <p className="section-label">03 / TOOLKIT</p>
            <h2 className="display-title">My<br /><span>stack.</span></h2>
            <p className="body-copy max-copy">
              A practical toolkit spanning software fundamentals, modern frontend work
              and machine learning.
            </p>
          </div>

          <div className="reveal-item">
            <HorizontalSlider
              items={portfolio.skills}
              label="Skills"
              className="skills-carousel"
              renderItem={([name, description], index) => (
                <div className="skill-card glass-card slide-card" key={name} style={{ "--delay": `${index * 0.05}s` }}>
                  <div className="skill-index">{String(index + 1).padStart(2, "0")}</div>
                  <Code2 size={17} />
                  <strong>{name}</strong>
                  <span>{description}</span>
                </div>
              )}
            />
          </div>
        </section>

        <section id="journey" className="section split-section reveal">
          <div className="reveal-item">
            <p className="section-label">04 / JOURNEY</p>
            <h2 className="display-title">Still<br /><span>becoming.</span></h2>
          </div>

          <div className="timeline-slider reveal-item">
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
          <div className="contact-card glass-card reveal-item">
            <div className="contact-light" />
            <div className="contact-copy">
              <p className="section-label">05 / CONTACT</p>
              <h2 className="display-title">Have a problem<br />worth <span>building?</span></h2>
              <p className="body-copy">
                I'm open to interesting projects, research conversations, collaborations
                and opportunities to make useful things.
              </p>
            </div>

            <div className="contact-actions">
              <button className="primary-button" onClick={() => setChatOpen(true)} {...ctaMagnet}>
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
        <span className="pulse-ring"><BrainCircuit size={19} /></span>
        <span>Ask about me</span>
      </button>

      {chatOpen && (
        <div className="chat-overlay">
          <button className="chat-backdrop" aria-label="Close assistant" onClick={() => setChatOpen(false)} />
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-avatar"><BrainCircuit size={16} /></div>
              <div className="chat-header-text">
                <strong>Akshay AI</strong>
                <span>Portfolio assistant · usually replies instantly</span>
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
              {typing && (
                <div className="typing-dots" aria-label="Assistant is typing">
                  <span /><span /><span />
                </div>
              )}
              <div ref={chatEndRef} />
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
