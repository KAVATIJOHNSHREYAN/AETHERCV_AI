import { ResumeBuilderData } from '@/types/resume-builder'

/**
 * Fictional demo prototype data for ATS Resume Builder.
 * Contains purely synthetic placeholder information.
 */
export const defaultResumeData: ResumeBuilderData = {
  personalInfo: {
    firstName: 'Alex',
    lastName: 'Johnson',
    professionalTitle: 'Software Engineer',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    github: 'https://github.com/alexjohnson',
    portfolio: 'https://alexjohnson.dev',
    profilePhoto: ''
  },
  professionalSummary:
    'Results-driven Software Engineer with 3+ years of experience designing scalable microservices, RESTful APIs, and distributed data pipelines. Proven expertise in Python, TypeScript, React, and cloud architecture, delivering high-concurrency systems with 99.9% uptime and measurable latency reduction.',
  education: [
    {
      id: 'edu-demo-1',
      degree: 'B.S. in Computer Science',
      university: 'State University of California',
      college: 'College of Engineering & Computer Science',
      location: 'San Francisco, CA',
      cgpa: '3.85 / 4.0',
      startDate: '2020',
      endDate: '2024',
      current: false,
      description: 'Coursework: Distributed Systems, Database Architecture, Data Structures, Algorithms, Cloud Computing.'
    }
  ],
  experience: [
    {
      id: 'exp-demo-1',
      company: 'Acme Cloud Systems',
      role: 'Software Engineer',
      location: 'San Francisco, CA',
      employmentType: 'full-time',
      startDate: 'Jul 2024',
      endDate: 'Present',
      current: true,
      responsibilities: [
        'Architected asynchronous message processing pipeline using Python and Redis, reducing queue latency by 42%.',
        'Engineered 12+ RESTful microservice endpoints with automated OpenAPI schemas, handling 250,000+ daily API requests.',
        'Spearheaded CI/CD automated test suite optimization, reducing deployment cycle times from 35 minutes to 8 minutes.'
      ],
      achievements: [
        'Recognized with Engineering Excellence Award for zero-downtime database migration across 2M+ customer records.'
      ],
      technologiesUsed: ['Python', 'FastAPI', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS']
    },
    {
      id: 'exp-demo-2',
      company: 'TechFlow Labs',
      role: 'Software Engineering Intern',
      location: 'San Jose, CA',
      employmentType: 'internship',
      startDate: 'Jun 2023',
      endDate: 'Aug 2023',
      current: false,
      responsibilities: [
        'Built real-time telemetry dashboard using React and TypeScript, accelerating customer issue triage by 30%.',
        'Optimized SQL queries and database indexes, improving report generation throughput by 25%.'
      ],
      achievements: [
        'Delivered production-ready telemetry analytics component adopted across all enterprise client accounts.'
      ],
      technologiesUsed: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git']
    }
  ],
  projects: [
    {
      id: 'proj-demo-1',
      name: 'Distributed Task Queue Engine',
      description: 'High-throughput distributed task scheduling framework supporting prioritization and retry backoff.',
      technologies: ['Python', 'Redis', 'Docker', 'FastAPI'],
      githubUrl: 'https://github.com/alexjohnson/distributed-task-queue',
      liveUrl: 'https://task-queue-demo.example.com',
      duration: '3 Months',
      role: 'Lead Developer',
      bulletPoints: [
        'Engineered distributed task worker system processing 5,000+ tasks/second with sub-50ms execution delay.',
        'Implemented exponential backoff retry algorithms with dead-letter queue routing, achieving 99.98% delivery rate.'
      ]
    },
    {
      id: 'proj-demo-2',
      name: 'Enterprise Cloud Metrics Monitor',
      description: 'Full-stack infrastructure observability platform monitoring server health and resource bottlenecks.',
      technologies: ['TypeScript', 'Next.js', 'PostgreSQL', 'Tailwind CSS'],
      githubUrl: 'https://github.com/alexjohnson/cloud-metrics-monitor',
      liveUrl: 'https://metrics-monitor.example.com',
      duration: '2 Months',
      role: 'Full Stack Creator',
      bulletPoints: [
        'Built responsive metrics dashboard visualizing server CPU, memory, and disk I/O metrics in real time.',
        'Integrated automated webhook alerts notifying DevOps engineers via Slack when error thresholds exceed 1%.'
      ]
    }
  ],
  skills: [
    {
      category: 'Programming Languages',
      skills: ['Python', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'C++']
    },
    {
      category: 'Frameworks & Libraries',
      skills: ['React', 'Next.js', 'FastAPI', 'Node.js', 'Express', 'Tailwind CSS']
    },
    {
      category: 'Databases & Storage',
      skills: ['PostgreSQL', 'Redis', 'MongoDB', 'MySQL', 'SQLite']
    },
    {
      category: 'Cloud & Developer Tools',
      skills: ['Docker', 'AWS (EC2, S3, RDS)', 'Git', 'Linux', 'CI/CD Pipelines', 'REST APIs']
    }
  ],
  certifications: [
    {
      id: 'cert-demo-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2024',
      credentialUrl: 'https://aws.amazon.com/certification'
    }
  ],
  achievements: [
    {
      id: 'ach-demo-1',
      title: 'State Hackathon 1st Place Winner',
      description: 'Built autonomous disaster-relief logistics optimizer in 24 hours out of 85 participating engineering teams.',
      date: '2023'
    }
  ],
  languages: [
    { id: 'lang-demo-1', language: 'English', proficiency: 'Native' },
    { id: 'lang-demo-2', language: 'Spanish', proficiency: 'Professional' }
  ],
  interests: ['Distributed Systems', 'Cloud Native Architecture', 'Open Source Tooling'],
  customization: {
    templateId: 'modern-ats',
    accentColor: '#111827',
    fontFamily: 'inter',
    fontSize: 'sm',
    lineHeight: 'tight',
    margins: 'compact',
    showIcons: false,
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
      'achievements'
    ]
  }
}
