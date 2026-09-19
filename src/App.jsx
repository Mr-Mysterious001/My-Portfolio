import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, BrainCircuit, ChevronDown, Code2, Github, GraduationCap,
  Linkedin, Mail, Menu, Moon, Sparkles, Terminal, X, Sun, ExternalLink,
  Database, Cpu, ShieldCheck, Layers3
} from "lucide-react";

const socials = {
  github: "https://github.com/Mr-Mysterious001",
  linkedin: "https://in.linkedin.com/in/akshay-chandra-309449283",
  leetcode: "https://www.leetcode.com/chandrakshay13"
};

const projects = [
  {
    title: "Digital Twin for UAV",
    label: "AI / Simulation / Cybersecurity",
    description: "A simulation-first digital twin concept for UAV engine and flight telemetry, designed to generate realistic tabular and visual data for monitoring and security research.",
    tags: ["Python", "FastAPI", "ArduPilot", "ML"],
    icon: <Cpu size={22}/>,
    accent: "from-cyan-400/30 to-blue-500/5"
  },
  {
    title: "TB Burden Country",
    label: "Data Visualization",
    description: "An interactive Streamlit dashboard exploring global tuberculosis burden across countries and years, with cleaned data, Plotly visualizations and uncertainty bounds.",
    tags: ["Python", "Pandas", "Plotly", "Streamlit"],
    icon: <Database size={22}/>,
    accent: "from-violet-400/30 to-fuchsia-500/5"
  },
  {
    title: "Jarvis Assistant",
    label: "Open Source / AI",
    description: "An open-source assistant for Arch + Hyprland setups that can work with local or cloud LLMs and is structured for community contributions.",
    tags: ["Python", "LLM", "Linux", "Open Source"],
    icon: <BrainCircuit size={22}/>,
    accent: "from-emerald-400/30 to-cyan-500/5"
  },
  {
    title: "California House Prediction",
    label: "Machine Learning",
    description: "A complete beginner-to-model ML workflow covering EDA, feature engineering and regression with scikit-learn and pandas.",
    tags: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
    icon: <Layers3 size={22}/>,
    accent: "from-amber-300/25 to-orange-500/5"
  }
];

const skills = [
  ["Python","ML • Data Science"],["Java","DSA • OOP"],["C","Systems • DSA"],
  ["JavaScript","Web • UI"],["React","Frontend"],["Tailwind","Design Systems"],
  ["Pandas","Data Analysis"],["Scikit-learn","Machine Learning"],
  ["PyTorch","Deep Learning"],["Git / GitHub","Open Source"],["Linux","Arch • CLI"],["SQL","MySQL"]
];

function Glass({children, className=""}) {
  return <div className={`glass rounded-3xl ${className}`}>{children}</div>;
}

function App() {
  const [dark, setDark] = useState(true);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("home");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {role:"bot", text:"Hi. I’m Akshay’s portfolio assistant. Ask me about his projects, skills, research, or journey."}
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
    const sections = ["home","about","work","skills","journey","contact"];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, {rootMargin:"-30% 0px -55% 0px", threshold:[0,.2,.5,1]});
    sections.forEach(id => document.getElementById(id) && observer.observe(document.getElementById(id)));
    return () => observer.disconnect();
  }, []);

  const sendChat = async (e) => {
    e?.preventDefault();
    const q = chatInput.trim();
    if (!q) return;
    setMessages(m => [...m, {role:"user", text:q}]);
    setChatInput("");
    try {
      const response = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({message:q})
      });
      const data = await response.json();
      setMessages(m => [...m, {role:"bot", text:data.answer || "I couldn't answer that right now."}]);
    } catch {
      setMessages(m => [...m, {role:"bot", text:"The assistant backend is unavailable. Please try again in a moment."}]);
    }
  };

  const nav = useMemo(()=>[
    ["home","Home"],["about","About"],["work","Work"],["skills","Stack"],["journey","Journey"],["contact","Contact"]
  ],[]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050507] text-white transition-colors duration-500">
      <div className="noise"/>
      <div className="orb orb-a"/><div className="orb orb-b"/><div className="orb orb-c"/>

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-black/45 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <a href="#home" className="group flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-sm font-black text-black">AC</span>
            <span className="hidden font-semibold tracking-tight sm:block">Akshay Chandra<span className="text-cyan-300">.</span></span>
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {nav.map(([id,label])=><a key={id} href={`#${id}`} className={`nav-link ${active===id?"active":""}`}>{label}</a>)}
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Toggle theme" onClick={()=>setDark(v=>!v)} className="icon-btn">{dark?<Sun size={17}/>:<Moon size={17}/>}</button>
            <button aria-label="Open menu" onClick={()=>setMenu(v=>!v)} className="icon-btn md:hidden">{menu?<X size={18}/>:<Menu size={18}/>}</button>
            <a href="#contact" className="hidden rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.03] sm:block">Let’s talk</a>
          </div>
        </nav>
        {menu && <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/10 bg-black/80 p-3 backdrop-blur-2xl md:hidden">
          {nav.map(([id,label])=><a onClick={()=>setMenu(false)} key={id} href={`#${id}`} className="block rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/10 hover:text-white">{label}</a>)}
        </div>}
      </header>

      <main>
        <section id="home" className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-20 pt-32 md:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.25fr_.75fr]">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-xs font-medium text-cyan-200">
                <span className="pulse-dot"/> Building at the intersection of AI, data & software
              </div>
              <h1 className="max-w-5xl text-6xl font-black leading-[.88] tracking-[-.07em] sm:text-7xl lg:text-[7.8rem]">
                I build<br/><span className="gradient-text">things that</span><br/>think.
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
                Computer Science student focused on Data Science & AI/ML — turning messy problems into useful systems, experiments and interfaces.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#work" className="magnetic-btn">Explore my work <ArrowUpRight size={17}/></a>
                <a href={socials.github} target="_blank" rel="noreferrer" className="glass-btn"><GithubIcon size={17}/> GitHub</a>
              </div>
              <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-xs text-white/40">
                <span>03+ years learning by building</span><span>AI / ML focused</span><span>Open-source contributor</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[430px]">
              <div className="hero-card glass rounded-[2rem] p-3">
                <div className="relative overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-white/10 to-white/[.02] p-5">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[.25em] text-white/35"><span>akshay.exe</span><span>online</span></div>
                  <div className="mt-8 flex justify-center">
                    <div className="avatar-wrap">
                      <img src="/self.png" alt="Akshay Chandra" className="relative z-10 h-56 w-56 rounded-full object-cover grayscale-[15%]"/>
                    </div>
                  </div>
                  <div className="mt-7">
                    <div className="text-2xl font-bold tracking-tight">Akshay Chandra</div>
                    <div className="mt-1 text-sm text-white/45">CSE · Data Science · AI/ML</div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {[["8.07","CGPA*"],["2027","Grad"],["∞","Curiosity"]].map(([a,b])=><div key={b} className="rounded-2xl border border-white/8 bg-white/[.03] p-3"><div className="font-bold">{a}</div><div className="mt-1 text-[10px] text-white/35">{b}</div></div>)}
                  </div>
                </div>
              </div>
              <div className="float-tag tag-one"><Sparkles size={13}/> ML Research</div>
              <div className="float-tag tag-two"><Terminal size={13}/> Linux</div>
            </div>
          </div>
          <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/25 transition hover:text-white/60"><ChevronDown className="animate-bounce"/></a>
        </section>

        <section id="about" className="section-shell">
          <div className="section-kicker">01 / About</div>
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div><h2 className="display-title">More than<br/><span className="gradient-text">just code.</span></h2></div>
            <div className="max-w-3xl">
              <p className="text-xl leading-9 text-white/70 md:text-2xl">I’m a B.Tech CSE student at Netaji Subhash Engineering College, exploring how software, data and machine learning can become real products.</p>
              <p className="mt-7 leading-7 text-white/45">I learn fastest by building: dashboards, ML pipelines, open-source tools, simulations and web experiences. Along the way I’ve worked with student communities, hackathons and collaborative projects.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[["2023—27","B.Tech CSE"],["8.07","5th sem CGPA*"],["Top 50","SIH’24 qualifier"]].map(([a,b])=><Glass key={b} className="p-5"><div className="text-2xl font-bold">{a}</div><div className="mt-1 text-xs text-white/35">{b}</div></Glass>)}
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="section-shell">
          <div className="mb-12 flex items-end justify-between gap-5"><div><div className="section-kicker">02 / Selected work</div><h2 className="display-title">Built, tested,<br/><span className="gradient-text">iterated.</span></h2></div><span className="hidden text-xs text-white/30 sm:block">Hover a card</span></div>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p,i)=><article key={p.title} className={`project-card group bg-gradient-to-br ${p.accent}`}>
              <div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/20 text-cyan-200">{p.icon}</span><span className="text-xs text-white/25">0{i+1}</span></div>
              <div className="mt-20"><div className="mb-3 text-xs uppercase tracking-[.18em] text-white/35">{p.label}</div><h3 className="text-2xl font-bold tracking-tight">{p.title}</h3><p className="mt-3 max-w-lg text-sm leading-6 text-white/45">{p.description}</p></div>
              <div className="mt-7 flex flex-wrap gap-2">{p.tags.map(t=><span key={t} className="chip">{t}</span>)}</div>
              <div className="absolute right-7 top-7 opacity-0 transition duration-300 group-hover:opacity-100"><ArrowUpRight/></div>
            </article>)}
          </div>
        </section>

        <section id="skills" className="section-shell">
          <div className="section-kicker">03 / Toolkit</div>
          <div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr]">
            <div><h2 className="display-title">My<br/><span className="gradient-text">stack.</span></h2><p className="mt-6 max-w-sm leading-7 text-white/40">A practical toolkit that keeps growing — from low-level programming to data pipelines and modern interfaces.</p></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {skills.map(([name,sub],i)=><div key={name} className="skill-card" style={{"--d":`${i*35}ms`}}><div className="text-lg font-semibold">{name}</div><div className="mt-1 text-[11px] text-white/30">{sub}</div></div>)}
            </div>
          </div>
        </section>

        <section id="journey" className="section-shell">
          <div className="section-kicker">04 / Journey</div>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
            <div><h2 className="display-title">Still<br/><span className="gradient-text">becoming.</span></h2></div>
            <div className="timeline">
              {[["2020","Started coding with Java during school."],["2023","Started B.Tech CSE at NSEC, Kolkata."],["2024","Hacktoberfest, hackathons and deeper web development."],["2025","Moved deeper into Data Science, AI/ML and open source."],["2026","Building research-oriented systems, simulations and real client projects."]].map(([year,text])=><div className="timeline-row" key={year}><div className="timeline-year">{year}</div><div className="timeline-dot"/><p>{text}</p></div>)}
            </div>
          </div>
        </section>

        <section id="contact" className="section-shell pb-28">
          <Glass className="relative overflow-hidden p-7 md:p-12">
            <div className="contact-glow"/>
            <div className="relative z-10 grid items-end gap-10 md:grid-cols-[1fr_auto]">
              <div><div className="section-kicker">05 / Contact</div><h2 className="display-title max-w-3xl">Have a problem<br/>worth <span className="gradient-text">building?</span></h2><p className="mt-6 max-w-xl text-white/45">I’m open to interesting projects, research conversations, collaborations and opportunities to build something useful.</p></div>
              <div className="flex flex-wrap gap-2">
                <a className="glass-btn" href={socials.linkedin} target="_blank" rel="noreferrer"><LinkedinIcon size={17}/> LinkedIn</a>
                <a className="glass-btn" href={socials.github} target="_blank" rel="noreferrer"><Github size={17}/> GitHub</a>
              </div>
            </div>
          </Glass>
          <footer className="mt-10 flex flex-col justify-between gap-3 text-xs text-white/25 sm:flex-row"><span>© 2026 Akshay Chandra</span><span>Designed + built with React, Tailwind & CSS.</span></footer>
        </section>
      </main>

      <button onClick={()=>setChatOpen(true)} className="chat-launcher" aria-label="Open AI portfolio assistant"><BrainCircuit size={21}/><span>Ask about me</span></button>

      {chatOpen && <div className="fixed inset-0 z-[80] grid place-items-end p-4 sm:place-items-center sm:p-8">
        <button aria-label="Close assistant" onClick={()=>setChatOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>
        <div className="relative flex h-[min(650px,85vh)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0e] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/8 p-5"><div><div className="font-semibold">Akshay AI</div><div className="mt-1 text-xs text-cyan-300/60">portfolio assistant · instant answers</div></div><button onClick={()=>setChatOpen(false)} className="icon-btn"><X size={17}/></button></div>
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {messages.map((m,i)=><div key={i} className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${m.role==="bot"?"bg-white/5 text-white/70":"ml-auto bg-cyan-300 text-black"}`}>{m.text}</div>)}
          </div>
          <form onSubmit={sendChat} className="border-t border-white/8 p-4"><div className="flex gap-2 rounded-2xl border border-white/10 bg-white/[.03] p-2"><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ask something..." className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-white/25"/><button className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black"><ArrowUpRight size={17}/></button></div></form>
        </div>
      </div>}
    </div>
  );
}

export default App;