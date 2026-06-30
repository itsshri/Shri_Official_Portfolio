import { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext(null);

const defaultData = {
  about: {
    name: 'Shrijith R',
    role: 'Full Stack Developer',
    tagline: 'Building Digital Experiences That Matter',
    bio: "I'm a passionate Full Stack Developer with a strong foundation in both frontend and backend development. I thrive at the intersection of engineering and problem-solving — turning complex requirements into elegant, performant solutions.",
    bio2: "My approach is rooted in deeply understanding the business problem first, then crafting data-driven architectures that scale. I've worked across the entire stack — from Spring Boot APIs and relational databases to React UIs and cloud deployments.",
    location: 'Coimbatore, India',
    email: 'shrijithr2004@gmail.com',
    phone: '+91 6380368540',
    github: 'https://github.com/itsshri',
    linkedin: 'https://www.linkedin.com/in/shri-jith-920a06245/',
    leetcode: 'https://leetcode.com/u/shrijithr2004/',
    availability: 'Available for Opportunities',
    photo: null,
    education: 'B.E. Computer Science & Engineering',
    college: 'Sri Krishna College of Technology',
    eduYear: '2022 – 2026',
    highlights: ['Full Stack Development', 'Machine Learning', 'Data Analysis & Viz', 'Cloud Computing', 'REST API Design', 'Generative AI'],
    stats: [
      { number: '3+', label: 'Projects Shipped' },
      { number: '5+', label: 'Technologies' },
      { number: '2+', label: 'Years Learning' },
      { number: '100+', label: 'LeetCode Solved' },
    ],
  },
  skills: [
    {
      id: 1,
      category: 'Languages',
      icon: 'Code2',
      color: 'from-blue-500 to-cyan-500',
      skills: ['Java', 'Python', 'C++', 'JavaScript', 'SQL', 'TypeScript'],
    },
    {
      id: 2,
      category: 'Frontend',
      icon: 'Layout',
      color: 'from-violet-500 to-purple-500',
      skills: ['React.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Next.js'],
    },
    {
      id: 3,
      category: 'Backend',
      icon: 'Server',
      color: 'from-green-500 to-emerald-500',
      skills: ['Spring Boot', 'Spring Security', 'REST APIs', 'Node.js', 'Microservices', 'JWT'],
    },
    {
      id: 4,
      category: 'Databases',
      icon: 'Database',
      color: 'from-orange-500 to-amber-500',
      skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Hibernate'],
    },
    {
      id: 5,
      category: 'AI / Data Science',
      icon: 'Brain',
      color: 'from-pink-500 to-rose-500',
      skills: ['Machine Learning', 'Pandas', 'Scikit-learn', 'Gen AI', 'Data Viz', 'NumPy'],
    },
    {
      id: 6,
      category: 'DevOps & Tools',
      icon: 'Terminal',
      color: 'from-yellow-500 to-orange-500',
      skills: ['Git', 'Docker', 'AWS', 'Postman', 'Linux', 'CI/CD'],
    },
  ],
  projects: [
    {
      id: 1,
      number: '01',
      badge: 'Featured',
      title: 'Interactive Storybook Reading Webapp',
      description: 'A rich web application for children\'s book reading featuring a dynamic library, audio narration, animations, and customizable reading modes. Implemented secure user authentication and role-based authorization using Spring Security, with a fully responsive UI across all devices.',
      tech: ['React', 'Spring Boot', 'Spring Security', 'MySQL', 'REST API'],
      github: 'https://github.com/itsshri',
      live: '',
      image: null,
      video: null,
      featured: true,
    },
    {
      id: 2,
      number: '02',
      badge: 'Full Stack',
      title: 'Trip Planning Web Application',
      description: 'An end-to-end interactive trip planning platform enabling users to search destinations, build custom itineraries, and receive personalized travel recommendations. Built with a real-time, responsive React frontend and a robust Spring Boot backend for secure data management.',
      tech: ['React', 'Spring Boot', 'REST API', 'MySQL'],
      github: 'https://github.com/itsshri',
      live: '',
      image: null,
      video: null,
      featured: false,
    },
    {
      id: 3,
      number: '03',
      badge: 'Frontend',
      title: 'SoundTrax — Music Web App',
      description: 'A sleek, responsive music web app offering an intuitive interface to explore and listen to tracks. Features include music controls, playlist management, and visually engaging UI elements — showcasing a strong focus on user experience and design aesthetics.',
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      github: 'https://github.com/itsshri',
      live: '',
      image: null,
      video: null,
      featured: false,
    },
  ],
  experience: [
    {
      id: 1,
      company: 'Full Stack Developer Projects',
      logo: null,
      role: 'Personal & Academic Projects',
      duration: '2023 – Present',
      location: 'Remote',
      type: 'work',
      bullets: [
        'Architected and shipped 3+ full-stack applications from end to end',
        'Implemented Spring Security for JWT-based authentication across multiple apps',
        'Integrated RESTful APIs with React frontends using Axios and Context API',
        'Practiced data structures & algorithms on LeetCode (100+ problems solved)',
      ],
    },
    {
      id: 2,
      company: 'Sri Krishna College of Technology',
      logo: null,
      role: 'B.E. Computer Science & Engineering',
      duration: '2022 – 2026',
      location: 'Coimbatore, India',
      type: 'education',
      bullets: [
        'Studying core CS fundamentals: algorithms, OS, DBMS, networking, and software engineering',
        'Coursework in machine learning, data structures, and cloud computing',
        'Led team projects applying Agile methodology and version control with Git',
      ],
    },
    {
      id: 3,
      company: 'Certifications & Learning',
      logo: null,
      role: 'Self-directed Learning',
      duration: 'Ongoing',
      location: 'Online',
      type: 'cert',
      bullets: [
        'Java Full Stack — Spring Boot & React ecosystem',
        'Machine Learning & Statistical Analysis — Python stack',
        'Cloud fundamentals — AWS core services',
        'Generative AI applications and prompt engineering',
      ],
    },
  ],
  leads: [],
  interactions: {},
  // interactions key format: "project_1" | "skill_2" | "experience_3"
  // value: { likes: 0, title: '...', section: '...', comments: [{id, author, text, time}] }
};

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      // Load photo separately (large base64 stored apart from main data)
      const savedPhoto = localStorage.getItem('portfolio_photo') || '';
      const saved = localStorage.getItem('portfolio_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultData,
          ...parsed,
          leads: parsed.leads || [],
          interactions: parsed.interactions || {},
          about: { ...defaultData.about, ...parsed.about, photo: savedPhoto || parsed.about?.photo || defaultData.about.photo },
        };
      }
      return { ...defaultData, about: { ...defaultData.about, photo: savedPhoto || defaultData.about.photo } };
    } catch {
      return defaultData;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('creator_logged_in') === 'true';
  });

  useEffect(() => {
    try {
      // Save photo separately to avoid quota issues with large base64 strings
      const photo = data.about?.photo || '';
      if (photo && photo.startsWith('data:')) {
        localStorage.setItem('portfolio_photo', photo);
      }
      // Save main data WITHOUT the photo blob to keep it small
      const dataToSave = {
        ...data,
        about: { ...data.about, photo: '' }, // strip photo from main payload
      };
      localStorage.setItem('portfolio_data', JSON.stringify(dataToSave));
    } catch (e) {
      // If quota exceeded even without photo, try saving just critical data
      try {
        const minimal = { about: { ...data.about, photo: '' }, leads: data.leads, interactions: data.interactions };
        localStorage.setItem('portfolio_data', JSON.stringify(minimal));
      } catch {
        console.warn('localStorage quota exceeded — some data may not persist');
      }
    }
  }, [data]);

  const login = (email, password) => {
    if (email === 'shrijithr2004@gmail.com' && password === 'shri2004') {
      setIsLoggedIn(true);
      sessionStorage.setItem('creator_logged_in', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('creator_logged_in');
  };

  // About
  const updateAbout = (updates) => {
    // Immediately persist photo to its own key if provided
    if (updates.photo && updates.photo.startsWith('data:')) {
      try {
        localStorage.setItem('portfolio_photo', updates.photo);
      } catch (e) {
        console.warn('Photo save failed (may be too large):', e);
      }
    }
    setData(prev => ({ ...prev, about: { ...prev.about, ...updates } }));
  };

  // Skills
  const addSkillCategory = (cat) => {
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, { id: Date.now(), ...cat }],
    }));
  };

  const updateSkillCategory = (id, updates) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  };

  const deleteSkillCategory = (id) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));
  };

  // Projects
  const addProject = (project) => {
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, { id: Date.now(), ...project }],
    }));
  };

  const updateProject = (id, updates) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
  };

  const deleteProject = (id) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  };

  // Experience
  const addExperience = (exp) => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now(), ...exp }],
    }));
  };

  const updateExperience = (id, updates) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  };

  const deleteExperience = (id) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id),
    }));
  };

  const resetToDefault = () => {
    setData(defaultData);
  };

  // Leads
  const addLead = (lead) => {
    setData(prev => ({
      ...prev,
      leads: [{ id: Date.now(), receivedAt: new Date().toISOString(), ...lead }, ...prev.leads],
    }));
  };

  const deleteLead = (id) => {
    setData(prev => ({
      ...prev,
      leads: prev.leads.filter(l => l.id !== id),
    }));
  };

  // ── Interactions (likes + comments) ──────────────────────────
  const getInteraction = (type, id) => {
    const key = `${type}_${id}`;
    return data.interactions[key] || { likes: 0, comments: [] };
  };

  const addLike = (type, id, title, section) => {
    const key = `${type}_${id}`;
    setData(prev => {
      const existing = prev.interactions[key] || { likes: 0, comments: [], title, section };
      return {
        ...prev,
        interactions: {
          ...prev.interactions,
          [key]: { ...existing, likes: existing.likes + 1, title, section },
        },
      };
    });
  };

  // Reset ALL likes to zero (keep comments intact)
  const resetLikes = () => {
    setData(prev => {
      const clearedInteractions = {};
      Object.entries(prev.interactions).forEach(([key, val]) => {
        clearedInteractions[key] = { ...val, likes: 0, likedBy: [] };
      });
      return { ...prev, interactions: clearedInteractions };
    });
  };

  const addComment = (type, id, title, section, author, text) => {
    const key = `${type}_${id}`;
    setData(prev => {
      const existing = prev.interactions[key] || { likes: 0, comments: [], title, section };
      return {
        ...prev,
        interactions: {
          ...prev.interactions,
          [key]: {
            ...existing,
            title,
            section,
            comments: [
              ...existing.comments,
              { id: Date.now(), author, text, time: new Date().toISOString() },
            ],
          },
        },
      };
    });
  };

  const deleteComment = (type, id, commentId) => {
    const key = `${type}_${id}`;
    setData(prev => {
      const existing = prev.interactions[key];
      if (!existing) return prev;
      return {
        ...prev,
        interactions: {
          ...prev.interactions,
          [key]: { ...existing, comments: existing.comments.filter(c => c.id !== commentId) },
        },
      };
    });
  };

  return (
    <PortfolioContext.Provider value={{
      data,
      isLoggedIn,
      login,
      logout,
      updateAbout,
      addSkillCategory,
      updateSkillCategory,
      deleteSkillCategory,
      addProject,
      updateProject,
      deleteProject,
      addExperience,
      updateExperience,
      deleteExperience,
      addLead,
      deleteLead,
      getInteraction,
      addLike,
      addComment,
      deleteComment,
      resetLikes,
      resetToDefault,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider');
  return ctx;
};
