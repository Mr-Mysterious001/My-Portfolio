export const portfolio = {
  nav: [
    ["home", "Home"],
    ["about", "About"],
    ["work", "Work"],
    ["skills", "Stack"],
    ["journey", "Journey"],
    ["contact", "Contact"]
  ],

  stats: [
    { value: "8.07", label: "Current CGPA" },
    { value: "2023—27", label: "B.Tech CSE" },
    { value: "AI/ML", label: "Current direction" }
  ],

  projects: [
    {
      number: "01",
      title: "Digital Twin for UAV",
      eyebrow: "Simulation / AI / Cybersecurity",
      description: "Simulation-first UAV telemetry and engine-monitoring concept for predictive maintenance, mission planning and cybersecurity dataset generation.",
      tags: ["Python", "FastAPI", "ArduPilot", "ML"],
      icon: "shield",
      tone: "cyan"
    },
    {
      number: "02",
      title: "TB Burden Country",
      eyebrow: "Data Visualization",
      description: "Interactive dashboard exploring tuberculosis burden across countries and years, combining cleaned datasets with analytical visualizations.",
      tags: ["Python", "Pandas", "Plotly", "Streamlit"],
      icon: "database",
      tone: "violet"
    },
    {
      number: "03",
      title: "Jarvis Assistant",
      eyebrow: "Open Source / AI",
      description: "An assistant concept for Linux and Hyprland workflows, designed around local/cloud LLMs and a contribution-friendly open-source structure.",
      tags: ["Python", "LLM", "Linux", "Open Source"],
      icon: "brain",
      tone: "green"
    },
    {
      number: "04",
      title: "California Housing",
      eyebrow: "Machine Learning",
      description: "End-to-end regression workflow covering exploration, preprocessing, feature engineering and model evaluation with scikit-learn.",
      tags: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
      icon: "layers",
      tone: "amber"
    }
  ],

  skills: [
    ["Python", "ML · Data Science"],
    ["Java", "DSA · OOP"],
    ["C", "Systems · DSA"],
    ["JavaScript", "Web · UI"],
    ["React", "Frontend"],
    ["Tailwind", "Design Systems"],
    ["Pandas", "Data Analysis"],
    ["Scikit-learn", "Machine Learning"],
    ["PyTorch", "Deep Learning"],
    ["SQL", "MySQL"],
    ["Git / GitHub", "Open Source"],
    ["Linux", "Arch · CLI"]
  ],

  milestones: [
    ["2020", "Started coding with Java during school."],
    ["2023", "Started B.Tech CSE at Netaji Subhash Engineering College."],
    ["2024", "Expanded into web development, hackathons and open source."],
    ["2025", "Moved deeper into Data Science, AI/ML and research-oriented work."],
    ["2026", "Building simulations, research systems and real client projects."]
  ]
};
