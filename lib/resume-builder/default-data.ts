import { ResumeBuilderData } from '@/types/resume-builder'

export const defaultResumeData: ResumeBuilderData = {
  personalInfo: {
    firstName: 'Kavati John',
    lastName: 'Shreyan',
    professionalTitle: 'AI & Full Stack Software Engineer',
    email: 'johnshreyan83@gmail.com',
    phone: '+91 93924 93902',
    location: 'Andhra Pradesh, India',
    linkedin: 'https://linkedin.com/in/kavati-john-shreyan-956a35366',
    github: 'https://github.com/KAVATIJOHNSHREYAN',
    portfolio: 'https://kavatijohnshreyan-github-io.vercel.app',
    profilePhoto: ''
  },
  professionalSummary:
    'AI & Full Stack Software Engineer specializing in Python, FastAPI, React, TypeScript, RAG, LLM Applications, and scalable cloud architectures. Experienced in building production-ready multimodal platforms, intelligent document processing pipelines, and high-concurrency microservices with sub-second latency.',
  education: [
    {
      id: 'edu-1',
      degree: 'B.Tech in Computer Science and Engineering',
      university: 'K L University',
      college: 'Specialization in AI & Computational Intelligence',
      location: 'Andhra Pradesh, India',
      cgpa: '7.74',
      startDate: '2024',
      endDate: 'Present',
      current: true,
      description: 'Core coursework in Data Structures, Algorithms, AI Systems, Cloud Computing, and Database Management.'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Siemens',
      role: 'Data Science Intern',
      location: 'Remote / Virtual',
      employmentType: 'internship',
      startDate: 'Apr 2026',
      endDate: 'Jun 2026',
      current: false,
      responsibilities: [
        'Processed and cleaned analytical datasets using Python NumPy and Pandas to establish baseline data quality standards.',
        'Evaluated classification models and precision-recall metrics while automating ETL scripts for downstream model ingestion, reducing prep time by 35%.'
      ],
      achievements: [
        'Automated end-to-end data pipeline decreasing data processing latency by 40%.'
      ],
      technologiesUsed: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'ETL', 'Git']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'AetherMind Multi-Modal AI',
      description: 'Production-grade multimodal AI platform unifying workspace chat, OCR document intelligence, Vision AI, and voice interaction.',
      technologies: ['Python', 'FastAPI', 'Streamlit', 'Qdrant', 'Supabase', 'Amazon Bedrock'],
      githubUrl: 'https://github.com/KAVATIJOHNSHREYAN',
      liveUrl: 'https://aethercv-ai.vercel.app',
      duration: 'Jan 2026 - Present',
      role: 'Lead Architect',
      bulletPoints: [
        'Built an intelligent AI routing pipeline orchestrating multi-LLM execution across Amazon Bedrock, Google Gemini, and OpenAI GPT-4 with dynamic fallback.',
        'Implemented RAG architecture indexing 10,000+ document embeddings in Qdrant vector memory with sub-second semantic retrieval.'
      ]
    },
    {
      id: 'proj-2',
      name: 'KL University Attendance Calculator',
      description: 'Open-source student attendance tracking application featuring instant percentage calculations, forecasting, and 60 FPS mobile UI.',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel Edge'],
      githubUrl: 'https://github.com/KAVATIJOHNSHREYAN/AETHERCV_AI',
      liveUrl: 'https://attendance-calculator-sandy.vercel.app',
      duration: 'Apr 2026 - May 2026',
      role: 'Creator & Developer',
      bulletPoints: [
        'Engineered instant percentage calculator with LTPS breakdown and predictive condonation forecasting for university students.',
        'Deployed production web application on Vercel edge infrastructure, supporting high-concurrency student query sessions with zero downtime.'
      ]
    }
  ],
  skills: [
    {
      category: 'Programming Languages',
      skills: ['Python', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'HTML5', 'CSS3']
    },
    {
      category: 'Artificial Intelligence & ML',
      skills: ['Multimodal AI', 'LLMs', 'RAG', 'Qdrant Vector DB', 'Amazon Bedrock', 'Vision AI', 'Prompt Engineering']
    },
    {
      category: 'Web & Backend',
      skills: ['FastAPI', 'Next.js', 'React', 'Node.js', 'Express.js', 'REST APIs', 'JWT Auth']
    },
    {
      category: 'Databases & Cloud',
      skills: ['Qdrant', 'Supabase', 'Firebase Firestore', 'MySQL', 'SQLite', 'Microsoft Azure', 'Vercel']
    },
    {
      category: 'Engineering Practices',
      skills: ['Software Architecture', 'System Design', 'Git', 'CI/CD Pipelines', 'Agile/Scrum', 'Code Review']
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Microsoft Certified Azure Fundamentals',
      issuer: 'Microsoft',
      issueDate: 'June 2026',
      credentialUrl: ''
    },
    {
      id: 'cert-2',
      name: 'Data Science Virtual Internship Certificate',
      issuer: 'Siemens',
      issueDate: 'June 2026',
      credentialUrl: ''
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'AWS 18-Hour Hackathon (KL University)',
      description: 'Engineered a cloud-native prototype during an intensive 18-hour sprint at KL University, evaluated and scored by industry experts.',
      date: '2026'
    },
    {
      id: 'ach-2',
      title: 'Smart India Hackathon (SIH 2026)',
      description: 'Participated in an 18-hour continuous sprint in a 6-member team executing rapid problem solving and REST API integration.',
      date: '2026'
    }
  ],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Professional' },
    { id: 'lang-2', language: 'Telugu', proficiency: 'Native' },
    { id: 'lang-3', language: 'Hindi', proficiency: 'Intermediate' }
  ],
  interests: ['Generative AI', 'Cloud Infrastructure', 'Open Source Software', 'Autonomous Agents'],
  customization: {
    templateId: 'modern-ats',
    accentColor: '#2563EB',
    fontFamily: 'outfit',
    fontSize: 'md',
    lineHeight: 'normal',
    margins: 'normal',
    showIcons: true,
    showPhoto: false,
    headerStyle: 'left',
    sectionOrder: [
      'personal',
      'summary',
      'experience',
      'education',
      'projects',
      'skills',
      'certifications',
      'achievements',
      'languages',
      'interests'
    ]
  }
}
