/**
 * UNIVERSAL MASTER JOB ROLE LIBRARY
 * Centralized, standardized taxonomy of 200+ industry job roles across 18 specialized sectors.
 * Includes fuzzy matching, abbreviation expansions, and persistence for recent, frequent, and custom roles.
 */

export type JobRoleCategory =
  | 'All'
  | 'Software Development'
  | 'AI / Machine Learning'
  | 'Data'
  | 'Cloud / DevOps'
  | 'Cyber Security'
  | 'QA & Testing'
  | 'Product & Agile'
  | 'Design & Creative'
  | 'Database'
  | 'Blockchain & Web3'
  | 'Hardware & Systems'
  | 'Management & Leadership'
  | 'Finance & Consulting'
  | 'Marketing & Growth'
  | 'Support & Solutions'
  | 'Research & Innovation'
  | 'Emerging Tech'
  | 'Student / Entry Level'

export interface CategoryMeta {
  id: JobRoleCategory
  label: string
  shortLabel: string
  iconName: string
  description: string
}

export const CATEGORY_DEFINITIONS: CategoryMeta[] = [
  { id: 'All', label: 'All Categories', shortLabel: 'All', iconName: 'Layers', description: 'Complete platform library' },
  { id: 'Software Development', label: 'Software Development', shortLabel: 'Software', iconName: 'Code', description: 'Frontend, backend, mobile & full stack engineering' },
  { id: 'AI / Machine Learning', label: 'AI / Machine Learning', shortLabel: 'AI & ML', iconName: 'Sparkles', description: 'Generative AI, LLMs, computer vision, NLP & data science' },
  { id: 'Data', label: 'Data & Analytics', shortLabel: 'Data', iconName: 'Database', description: 'Data pipelines, warehousing, ETL & business intelligence' },
  { id: 'Cloud / DevOps', label: 'Cloud / DevOps', shortLabel: 'Cloud/DevOps', iconName: 'Cloud', description: 'Infrastructure, CI/CD, Kubernetes, SRE & cloud platforms' },
  { id: 'Cyber Security', label: 'Cyber Security', shortLabel: 'Security', iconName: 'Shield', description: 'Penetration testing, SecOps, cloud security & incident triage' },
  { id: 'QA & Testing', label: 'QA & Testing', shortLabel: 'QA', iconName: 'CheckCircle2', description: 'Automation testing, manual verification & SDET' },
  { id: 'Product & Agile', label: 'Product & Project', shortLabel: 'Product', iconName: 'Briefcase', description: 'Product management, Scrum masters & business analysis' },
  { id: 'Design & Creative', label: 'UI / UX Design', shortLabel: 'Design', iconName: 'Palette', description: 'Product design, UX research & visual systems' },
  { id: 'Database', label: 'Database Engineering', shortLabel: 'Database', iconName: 'Server', description: 'SQL, NoSQL, DB administration & cache optimization' },
  { id: 'Blockchain & Web3', label: 'Blockchain & Web3', shortLabel: 'Web3', iconName: 'Boxes', description: 'Smart contracts, Solidity, DeFi & decentralized protocols' },
  { id: 'Hardware & Systems', label: 'Hardware & Systems', shortLabel: 'Hardware', iconName: 'Cpu', description: 'Embedded systems, VLSI, FPGA & mechanical design' },
  { id: 'Management & Leadership', label: 'Management & Leadership', shortLabel: 'Leadership', iconName: 'Crown', description: 'Engineering management, CTO, Tech Leads & Founders' },
  { id: 'Finance & Consulting', label: 'Finance & Consulting', shortLabel: 'Consulting', iconName: 'LineChart', description: 'Technology consultants, advisory & financial analytics' },
  { id: 'Marketing & Growth', label: 'Marketing & Technical Growth', shortLabel: 'Growth', iconName: 'TrendingUp', description: 'Growth engineering, technical writing & SEO' },
  { id: 'Support & Solutions', label: 'Support & Solutions', shortLabel: 'Support', iconName: 'Headphones', description: 'Solutions architecture, pre-sales & customer success' },
  { id: 'Research & Innovation', label: 'Research & Innovation', shortLabel: 'Research', iconName: 'Microscope', description: 'R&D, science, innovation & academic researchers' },
  { id: 'Emerging Tech', label: 'Emerging Technologies', shortLabel: 'Emerging', iconName: 'Zap', description: 'Quantum computing, spatial audio/XR, edge AI & biotech' },
  { id: 'Student / Entry Level', label: 'Student / Entry Level', shortLabel: 'Student/Fresher', iconName: 'GraduationCap', description: 'Internships, freshers, campus hires & graduate engineers' }
]

export interface JobRoleItem {
  id: string
  title: string
  category: JobRoleCategory
  aliases: string[]
  isCustom?: boolean
}

export const MASTER_JOB_ROLES: JobRoleItem[] = [
  // === SOFTWARE DEVELOPMENT ===
  { id: 'swe', title: 'Software Engineer', category: 'Software Development', aliases: ['SWE', 'SDE', 'Software Developer', 'Programmer'] },
  { id: 'swd', title: 'Software Developer', category: 'Software Development', aliases: ['Application Developer', 'Developer', 'Coder'] },
  { id: 'fed', title: 'Frontend Developer', category: 'Software Development', aliases: ['FE', 'Frontend Engineer', 'UI Developer', 'Client Engineer'] },
  { id: 'bed', title: 'Backend Developer', category: 'Software Development', aliases: ['BE', 'Backend Engineer', 'Server Developer', 'API Developer'] },
  { id: 'fsd', title: 'Full Stack Developer', category: 'Software Development', aliases: ['Full Stack Engineer', 'Fullstack', 'Web Engineer'] },
  { id: 'wd', title: 'Web Developer', category: 'Software Development', aliases: ['Website Developer', 'Webmaster', 'Web Architect'] },
  { id: 'mad', title: 'Mobile App Developer', category: 'Software Development', aliases: ['Mobile Engineer', 'App Developer', 'iOS Android Developer'] },
  { id: 'and', title: 'Android Developer', category: 'Software Development', aliases: ['Android Engineer', 'Kotlin Developer', 'Java Android'] },
  { id: 'ios', title: 'iOS Developer', category: 'Software Development', aliases: ['iOS Engineer', 'Swift Developer', 'Apple Developer'] },
  { id: 'flt', title: 'Flutter Developer', category: 'Software Development', aliases: ['Flutter Engineer', 'Dart Developer', 'Cross Platform Mobile'] },
  { id: 'rct', title: 'React Developer', category: 'Software Development', aliases: ['React.js Developer', 'React Engineer', 'ReactJS'] },
  { id: 'rn', title: 'React Native Developer', category: 'Software Development', aliases: ['React Native Engineer', 'RN Developer', 'Mobile React'] },
  { id: 'ang', title: 'Angular Developer', category: 'Software Development', aliases: ['AngularJS Developer', 'Angular Engineer'] },
  { id: 'vue', title: 'Vue.js Developer', category: 'Software Development', aliases: ['Vue Developer', 'Nuxt Developer'] },
  { id: 'nxt', title: 'Next.js Developer', category: 'Software Development', aliases: ['NextJS Developer', 'React Next Engineer'] },
  { id: 'nde', title: 'Node.js Developer', category: 'Software Development', aliases: ['Node Developer', 'NodeJS Engineer', 'Express Developer'] },
  { id: 'jav', title: 'Java Developer', category: 'Software Development', aliases: ['Java Software Engineer', 'Core Java', 'Enterprise Java'] },
  { id: 'pyt', title: 'Python Developer', category: 'Software Development', aliases: ['Python Engineer', 'Django Flask Developer'] },
  { id: 'cpp', title: 'C++ Developer', category: 'Software Development', aliases: ['C++ Software Engineer', 'CPP Developer', 'Systems Programmer'] },
  { id: 'cdev', title: 'C Developer', category: 'Software Development', aliases: ['C Programmer', 'Embedded C Developer'] },
  { id: 'gol', title: 'Go Developer', category: 'Software Development', aliases: ['Golang Developer', 'Go Engineer'] },
  { id: 'rst', title: 'Rust Developer', category: 'Software Development', aliases: ['Rust Engineer', 'Rust Systems Programmer'] },
  { id: 'php', title: 'PHP Developer', category: 'Software Development', aliases: ['PHP Software Engineer', 'LAMP Developer'] },
  { id: 'net', title: '.NET Developer', category: 'Software Development', aliases: ['DotNet Developer', 'C# Developer', 'ASP.NET Core'] },
  { id: 'rub', title: 'Ruby Developer', category: 'Software Development', aliases: ['Ruby Programmer'] },
  { id: 'ror', title: 'Ruby on Rails Developer', category: 'Software Development', aliases: ['Rails Developer', 'RoR Engineer'] },
  { id: 'lar', title: 'Laravel Developer', category: 'Software Development', aliases: ['Laravel PHP Engineer'] },
  { id: 'djn', title: 'Django Developer', category: 'Software Development', aliases: ['Django Python Engineer'] },
  { id: 'spb', title: 'Spring Boot Developer', category: 'Software Development', aliases: ['Java Spring Boot Engineer', 'Spring Microservices'] },
  { id: 'asp', title: 'ASP.NET Developer', category: 'Software Development', aliases: ['ASP.NET Core Developer', 'C# ASP'] },
  { id: 'wpd', title: 'WordPress Developer', category: 'Software Development', aliases: ['WP Developer', 'WooCommerce Developer'] },
  { id: 'gam', title: 'Game Developer', category: 'Software Development', aliases: ['Game Programmer', 'Unity Developer', 'Unreal Engine Developer'] },
  { id: 'ard', title: 'AR Developer', category: 'Software Development', aliases: ['Augmented Reality Developer', 'ARKit ARCore'] },
  { id: 'vrd', title: 'VR Developer', category: 'Software Development', aliases: ['Virtual Reality Developer', 'Oculus Quest Developer'] },
  { id: 'xrd', title: 'XR Developer', category: 'Software Development', aliases: ['Extended Reality Developer', 'Spatial Computing Developer'] },
  { id: 'bcd', title: 'Blockchain Developer', category: 'Software Development', aliases: ['Blockchain Engineer', 'DApp Developer'] },
  { id: 'scd', title: 'Smart Contract Developer', category: 'Software Development', aliases: ['Solidity Developer', 'EVM Developer'] },
  { id: 'emb', title: 'Embedded Systems Engineer', category: 'Software Development', aliases: ['Embedded Software Engineer', 'RTOS Developer'] },
  { id: 'fmw', title: 'Firmware Engineer', category: 'Software Development', aliases: ['Microcontroller Engineer', 'Firmware Developer'] },
  { id: 'iot', title: 'IoT Developer', category: 'Software Development', aliases: ['Internet of Things Engineer', 'Connected Devices Engineer'] },
  { id: 'dsk', title: 'Desktop Application Developer', category: 'Software Development', aliases: ['Electron Developer', 'WPF Qt Developer'] },
  { id: 'ext', title: 'Chrome Extension Developer', category: 'Software Development', aliases: ['Extension Developer', 'Browser Addon'] },
  { id: 'bex', title: 'Browser Extension Developer', category: 'Software Development', aliases: ['WebExtensions Developer'] },
  { id: 'osd', title: 'Open Source Developer', category: 'Software Development', aliases: ['OSS Maintainer', 'Core Contributor'] },

  // === AI / MACHINE LEARNING ===
  { id: 'aie', title: 'AI Engineer', category: 'AI / Machine Learning', aliases: ['Artificial Intelligence Engineer', 'Applied AI Engineer'] },
  { id: 'mle', title: 'Machine Learning Engineer', category: 'AI / Machine Learning', aliases: ['ML Engineer', 'ML Specialist'] },
  { id: 'dle', title: 'Deep Learning Engineer', category: 'AI / Machine Learning', aliases: ['Neural Networks Engineer', 'PyTorch Specialist'] },
  { id: 'gae', title: 'Generative AI Engineer', category: 'AI / Machine Learning', aliases: ['GenAI Engineer', 'Foundation Model Engineer'] },
  { id: 'llm', title: 'LLM Engineer', category: 'AI / Machine Learning', aliases: ['Large Language Model Engineer', 'RAG Engineer'] },
  { id: 'prm', title: 'Prompt Engineer', category: 'AI / Machine Learning', aliases: ['AI Prompt Specialist', 'Context Architect'] },
  { id: 'are', title: 'AI Research Engineer', category: 'AI / Machine Learning', aliases: ['Applied AI Researcher', 'DeepMind OpenAI Researcher'] },
  { id: 'ars', title: 'AI Research Scientist', category: 'AI / Machine Learning', aliases: ['Machine Learning Scientist', 'AI Scientist'] },
  { id: 'cve', title: 'Computer Vision Engineer', category: 'AI / Machine Learning', aliases: ['CV Engineer', 'Image Processing Engineer'] },
  { id: 'nlp', title: 'NLP Engineer', category: 'AI / Machine Learning', aliases: ['Natural Language Processing Engineer', 'Text Analytics'] },
  { id: 'sai', title: 'Speech AI Engineer', category: 'AI / Machine Learning', aliases: ['Voice AI Developer', 'Audio Processing Engineer'] },
  { id: 'rec', title: 'Recommendation Systems Engineer', category: 'AI / Machine Learning', aliases: ['Recommender Systems', 'Personalization Engineer'] },
  { id: 'mlo', title: 'MLOps Engineer', category: 'AI / Machine Learning', aliases: ['Machine Learning Operations', 'Model Serving Engineer'] },
  { id: 'dsc', title: 'Data Scientist', category: 'AI / Machine Learning', aliases: ['Applied Data Scientist', 'Predictive Modeler'] },
  { id: 'dan', title: 'Data Analyst', category: 'AI / Machine Learning', aliases: ['Quantitative Analyst', 'Statistical Analyst'] },
  { id: 'bia', title: 'Business Intelligence Analyst', category: 'AI / Machine Learning', aliases: ['BI Analyst', 'Tableau PowerBI Specialist'] },
  { id: 'ape', title: 'AI Product Engineer', category: 'AI / Machine Learning', aliases: ['AI Application Developer', 'Copilot Engineer'] },
  { id: 'asa', title: 'AI Solutions Architect', category: 'AI / Machine Learning', aliases: ['Enterprise AI Architect', 'Cognitive Architect'] },
  { id: 'aic', title: 'AI Consultant', category: 'AI / Machine Learning', aliases: ['AI Strategy Advisor', 'Enterprise GenAI Consultant'] },
  { id: 'ait', title: 'AI Trainer', category: 'AI / Machine Learning', aliases: ['Model Fine-tuner', 'RLHF Specialist'] },
  { id: 'aau', title: 'AI Automation Engineer', category: 'AI / Machine Learning', aliases: ['Agentic Workflow Engineer', 'Autonomous Agent Builder'] },
  { id: 'rob', title: 'Robotics Engineer', category: 'AI / Machine Learning', aliases: ['ROS Developer', 'Motion Planning Engineer'] },
  { id: 'aut', title: 'Autonomous Systems Engineer', category: 'AI / Machine Learning', aliases: ['Self-Driving Engineer', 'Perception Engineer'] },
  { id: 'rai', title: 'Responsible AI Engineer', category: 'AI / Machine Learning', aliases: ['AI Safety Engineer', 'Model Alignment Specialist'] },
  { id: 'eth', title: 'AI Ethics Consultant', category: 'AI / Machine Learning', aliases: ['AI Governance Advisor', 'AI Compliance Officer'] },

  // === DATA ===
  { id: 'dte', title: 'Data Engineer', category: 'Data', aliases: ['DE', 'Pipeline Engineer', 'Spark Developer'] },
  { id: 'bde', title: 'Big Data Engineer', category: 'Data', aliases: ['Hadoop Spark Engineer', 'Data Lake Architect'] },
  { id: 'ane', title: 'Analytics Engineer', category: 'Data', aliases: ['dbt Specialist', 'Data Modeling Engineer'] },
  { id: 'dar', title: 'Data Architect', category: 'Data', aliases: ['Principal Data Architect', 'Enterprise Data Modeler'] },
  { id: 'dba', title: 'Database Administrator', category: 'Data', aliases: ['DBA', 'Database Admin', 'DB Ops'] },
  { id: 'dwe', title: 'Data Warehouse Engineer', category: 'Data', aliases: ['Snowflake Engineer', 'BigQuery Redshift Specialist'] },
  { id: 'etl', title: 'ETL Developer', category: 'Data', aliases: ['Extract Transform Load Engineer', 'Informatica Developer'] },
  { id: 'bid', title: 'BI Developer', category: 'Data', aliases: ['Business Intelligence Developer', 'Power BI Specialist'] },
  { id: 'rpa', title: 'Reporting Analyst', category: 'Data', aliases: ['MIS Executive', 'Data Reporter'] },

  // === CLOUD / DEVOPS ===
  { id: 'cle', title: 'Cloud Engineer', category: 'Cloud / DevOps', aliases: ['Cloud Systems Engineer', 'Multi-Cloud Engineer'] },
  { id: 'cla', title: 'Cloud Architect', category: 'Cloud / DevOps', aliases: ['Solutions Cloud Architect', 'Enterprise Cloud Architect'] },
  { id: 'aws', title: 'AWS Engineer', category: 'Cloud / DevOps', aliases: ['Amazon Web Services Engineer', 'AWS Cloud Specialist'] },
  { id: 'azu', title: 'Azure Engineer', category: 'Cloud / DevOps', aliases: ['Microsoft Azure Specialist', 'Azure Cloud Architect'] },
  { id: 'gcp', title: 'Google Cloud Engineer', category: 'Cloud / DevOps', aliases: ['GCP Cloud Specialist', 'Google Cloud Platform Engineer'] },
  { id: 'dvo', title: 'DevOps Engineer', category: 'Cloud / DevOps', aliases: ['Build and Release Engineer', 'DevSecOps'] },
  { id: 'ple', title: 'Platform Engineer', category: 'Cloud / DevOps', aliases: ['Internal Developer Platform Engineer', 'Developer Experience (DevEx)'] },
  { id: 'ife', title: 'Infrastructure Engineer', category: 'Cloud / DevOps', aliases: ['Infra Engineer', 'Terraform Specialist'] },
  { id: 'sre', title: 'Site Reliability Engineer', category: 'Cloud / DevOps', aliases: ['SRE', 'Reliability Architect'] },
  { id: 'srex', title: 'SRE', category: 'Cloud / DevOps', aliases: ['Site Reliability Engineer', 'Production Ops'] },
  { id: 'k8s', title: 'Kubernetes Engineer', category: 'Cloud / DevOps', aliases: ['K8s Administrator', 'Container Orchestration Engineer'] },
  { id: 'dck', title: 'Docker Engineer', category: 'Cloud / DevOps', aliases: ['Containerization Engineer'] },
  { id: 'cicd', title: 'CI/CD Engineer', category: 'Cloud / DevOps', aliases: ['Pipeline Automation Engineer', 'GitHub Actions Specialist'] },
  { id: 'sys', title: 'System Administrator', category: 'Cloud / DevOps', aliases: ['SysAdmin', 'Systems Engineer'] },
  { id: 'lnx', title: 'Linux Administrator', category: 'Cloud / DevOps', aliases: ['Linux Engineer', 'Red Hat Admin'] },
  { id: 'netw', title: 'Network Engineer', category: 'Cloud / DevOps', aliases: ['Cisco CCNA Engineer', 'Network Architect'] },

  // === CYBER SECURITY ===
  { id: 'cys', title: 'Cyber Security Engineer', category: 'Cyber Security', aliases: ['InfoSec Engineer', 'Security Engineer'] },
  { id: 'soc', title: 'SOC Analyst', category: 'Cyber Security', aliases: ['Security Operations Center Analyst', 'L1 L2 Security Analyst'] },
  { id: 'sec', title: 'Security Analyst', category: 'Cyber Security', aliases: ['Cyber Defense Analyst', 'Vulnerability Analyst'] },
  { id: 'sece', title: 'Security Engineer', category: 'Cyber Security', aliases: ['Systems Security Engineer'] },
  { id: 'ethk', title: 'Ethical Hacker', category: 'Cyber Security', aliases: ['White Hat Hacker', 'Bug Bounty Hunter'] },
  { id: 'pent', title: 'Penetration Tester', category: 'Cyber Security', aliases: ['Pen Tester', 'Red Team Specialist'] },
  { id: 'appsec', title: 'Application Security Engineer', category: 'Cyber Security', aliases: ['AppSec Engineer', 'DevSecOps Specialist'] },
  { id: 'cldsec', title: 'Cloud Security Engineer', category: 'Cyber Security', aliases: ['Cloud SecOps', 'Cloud IAM Specialist'] },
  { id: 'for', title: 'Digital Forensics Analyst', category: 'Cyber Security', aliases: ['DFIR Analyst', 'Computer Forensics Specialist'] },
  { id: 'inc', title: 'Incident Response Engineer', category: 'Cyber Security', aliases: ['Incident Responder', 'Blue Team Engineer'] },
  { id: 'thi', title: 'Threat Intelligence Analyst', category: 'Cyber Security', aliases: ['Cyber Threat Intel', 'CTI Specialist'] },
  { id: 'seca', title: 'Security Architect', category: 'Cyber Security', aliases: ['Enterprise Security Architect', 'Zero Trust Architect'] },

  // === QA & TESTING ===
  { id: 'qae', title: 'QA Engineer', category: 'QA & Testing', aliases: ['Quality Assurance Engineer', 'Test Engineer'] },
  { id: 'ate', title: 'Automation Test Engineer', category: 'QA & Testing', aliases: ['Selenium Playwright Engineer', 'Automation QA'] },
  { id: 'mnt', title: 'Manual Tester', category: 'QA & Testing', aliases: ['QA Tester', 'Manual QA Engineer'] },
  { id: 'pft', title: 'Performance Tester', category: 'QA & Testing', aliases: ['JMeter LoadRunner Tester', 'Load Test Engineer'] },
  { id: 'tsa', title: 'Test Architect', category: 'QA & Testing', aliases: ['Principal QA Architect', 'Test Automation Lead'] },
  { id: 'qal', title: 'QA Lead', category: 'QA & Testing', aliases: ['Quality Assurance Lead', 'Test Manager'] },
  { id: 'sdet', title: 'Software Development Engineer in Test (SDET)', category: 'QA & Testing', aliases: ['SDET', 'Core Test Engineer'] },

  // === PRODUCT & AGILE ===
  { id: 'pdm', title: 'Product Manager', category: 'Product & Agile', aliases: ['PM', 'Digital Product Manager'] },
  { id: 'apm', title: 'Associate Product Manager', category: 'Product & Agile', aliases: ['APM', 'Junior Product Manager'] },
  { id: 'tpm', title: 'Technical Product Manager', category: 'Product & Agile', aliases: ['Tech PM', 'Platform PM'] },
  { id: 'pdo', title: 'Product Owner', category: 'Product & Agile', aliases: ['PO', 'Agile Product Owner'] },
  { id: 'pgm', title: 'Program Manager', category: 'Product & Agile', aliases: ['PgM', 'Enterprise Program Manager'] },
  { id: 'tpgm', title: 'Technical Program Manager', category: 'Product & Agile', aliases: ['TPM', 'Technical Delivery Manager'] },
  { id: 'pjm', title: 'Project Manager', category: 'Product & Agile', aliases: ['PMP', 'Delivery Manager', 'Project Lead'] },
  { id: 'scm', title: 'Scrum Master', category: 'Product & Agile', aliases: ['Agile Scrum Master', 'CSM'] },
  { id: 'bua', title: 'Business Analyst', category: 'Product & Agile', aliases: ['BA', 'Functional Analyst'] },
  { id: 'agc', title: 'Agile Coach', category: 'Product & Agile', aliases: ['Enterprise Agile Transformation Coach', 'Kanban Coach'] },

  // === DESIGN & CREATIVE ===
  { id: 'uid', title: 'UI Designer', category: 'Design & Creative', aliases: ['User Interface Designer', 'Visual UI Designer'] },
  { id: 'uxd', title: 'UX Designer', category: 'Design & Creative', aliases: ['User Experience Designer', 'Information Architect'] },
  { id: 'uiux', title: 'UI/UX Designer', category: 'Design & Creative', aliases: ['Product UX Designer', 'Digital Product Designer'] },
  { id: 'itd', title: 'Interaction Designer', category: 'Design & Creative', aliases: ['IxD', 'Micro-interactions Designer'] },
  { id: 'prd', title: 'Product Designer', category: 'Design & Creative', aliases: ['Senior Product Designer', 'UX/UI Product Lead'] },
  { id: 'vsd', title: 'Visual Designer', category: 'Design & Creative', aliases: ['Brand Visual Designer', 'Graphic UI Artist'] },
  { id: 'gpd', title: 'Graphic Designer', category: 'Design & Creative', aliases: ['Brand Designer', 'Illustrator'] },
  { id: 'mod', title: 'Motion Designer', category: 'Design & Creative', aliases: ['Motion Graphics Artist', 'UI Animator'] },
  { id: 'uxr', title: 'UX Researcher', category: 'Design & Creative', aliases: ['User Researcher', 'Design Researcher'] },
  { id: 'dsd', title: 'Design Systems Designer', category: 'Design & Creative', aliases: ['Design Technologist', 'Figma Systems Lead'] },

  // === DATABASE ===
  { id: 'dbe', title: 'Database Engineer', category: 'Database', aliases: ['DB Engineer', 'Storage Systems Developer'] },
  { id: 'ora', title: 'Oracle DBA', category: 'Database', aliases: ['Oracle Database Administrator', 'Oracle Specialist'] },
  { id: 'sql', title: 'SQL Developer', category: 'Database', aliases: ['T-SQL PL/SQL Developer', 'Database Programmer'] },
  { id: 'mdb', title: 'MongoDB Engineer', category: 'Database', aliases: ['NoSQL MongoDB Specialist', 'Document DB Developer'] },
  { id: 'pgs', title: 'PostgreSQL DBA', category: 'Database', aliases: ['Postgres DBA', 'PostgreSQL Administrator'] },
  { id: 'red', title: 'Redis Engineer', category: 'Database', aliases: ['In-Memory Cache Specialist', 'Key-Value Store Developer'] },
  { id: 'nos', title: 'NoSQL Engineer', category: 'Database', aliases: ['Cassandra DynamoDB Specialist', 'Graph DB Developer'] },

  // === BLOCKCHAIN & WEB3 ===
  { id: 'bce', title: 'Blockchain Engineer', category: 'Blockchain & Web3', aliases: ['Core Blockchain Developer', 'Distributed Ledger Engineer'] },
  { id: 'w3d', title: 'Web3 Developer', category: 'Blockchain & Web3', aliases: ['Web3 Frontend Engineer', 'Decentralized App Developer'] },
  { id: 'cry', title: 'Crypto Engineer', category: 'Blockchain & Web3', aliases: ['Cryptography Engineer', 'Zero-Knowledge (ZK) Proof Specialist'] },
  { id: 'sca', title: 'Smart Contract Auditor', category: 'Blockchain & Web3', aliases: ['Web3 Security Auditor', 'Solidity Bug Hunter'] },
  { id: 'sol', title: 'Solidity Developer', category: 'Blockchain & Web3', aliases: ['Ethereum Developer', 'EVM Smart Contract Developer'] },

  // === HARDWARE & SYSTEMS ===
  { id: 'ele', title: 'Electronics Engineer', category: 'Hardware & Systems', aliases: ['Circuits Engineer', 'PCB Designer'] },
  { id: 'eln', title: 'Electrical Engineer', category: 'Hardware & Systems', aliases: ['Power Systems Engineer', 'Control Systems Engineer'] },
  { id: 'mch', title: 'Mechanical Engineer', category: 'Hardware & Systems', aliases: ['CAD Designer', 'Thermal Systems Engineer'] },
  { id: 'autm', title: 'Automotive Engineer', category: 'Hardware & Systems', aliases: ['EV Systems Engineer', 'CAN Bus Developer'] },
  { id: 'chp', title: 'Chip Design Engineer', category: 'Hardware & Systems', aliases: ['ASIC Designer', 'Semiconductor Engineer'] },
  { id: 'fpg', title: 'FPGA Engineer', category: 'Hardware & Systems', aliases: ['Verilog VHDL Engineer', 'Hardware Acceleration Specialist'] },
  { id: 'vls', title: 'VLSI Engineer', category: 'Hardware & Systems', aliases: ['Very Large Scale Integration', 'Silicon Design Engineer'] },
  { id: 'hwe', title: 'Hardware Engineer', category: 'Hardware & Systems', aliases: ['Hardware Systems Architect', 'Board Design Engineer'] },

  // === MANAGEMENT & LEADERSHIP ===
  { id: 'engm', title: 'Engineering Manager', category: 'Management & Leadership', aliases: ['EM', 'Software Engineering Manager'] },
  { id: 'tcl', title: 'Technical Lead', category: 'Management & Leadership', aliases: ['Tech Lead', 'Lead Software Engineer'] },
  { id: 'tml', title: 'Team Lead', category: 'Management & Leadership', aliases: ['Development Team Lead'] },
  { id: 'doe', title: 'Director of Engineering', category: 'Management & Leadership', aliases: ['VP of Software', 'Head of Engineering'] },
  { id: 'vpe', title: 'VP Engineering', category: 'Management & Leadership', aliases: ['Vice President of Engineering'] },
  { id: 'cto', title: 'CTO', category: 'Management & Leadership', aliases: ['Chief Technology Officer', 'Tech Executive'] },
  { id: 'fnd', title: 'Founder', category: 'Management & Leadership', aliases: ['Tech Founder', 'Startup Creator'] },
  { id: 'cof', title: 'Co-Founder', category: 'Management & Leadership', aliases: ['Co-Founder & CTO', 'Technical Co-Founder'] },
  { id: 'ceo', title: 'CEO', category: 'Management & Leadership', aliases: ['Chief Executive Officer', 'Managing Director'] },
  { id: 'ent', title: 'Entrepreneur', category: 'Management & Leadership', aliases: ['Startup Founder', 'Solopreneur'] },

  // === FINANCE & CONSULTING ===
  { id: 'cst', title: 'Consultant', category: 'Finance & Consulting', aliases: ['Management Consultant', 'Advisory Consultant'] },
  { id: 'tec', title: 'Technology Consultant', category: 'Finance & Consulting', aliases: ['IT Consultant', 'Digital Transformation Advisor'] },
  { id: 'slc', title: 'Solutions Consultant', category: 'Finance & Consulting', aliases: ['Technical Solutions Consultant', 'Implementation Consultant'] },
  { id: 'fna', title: 'Financial Analyst', category: 'Finance & Consulting', aliases: ['FinTech Analyst', 'Quantitative Financial Modeler'] },
  { id: 'iva', title: 'Investment Analyst', category: 'Finance & Consulting', aliases: ['Venture Capital Analyst', 'Private Equity Associate'] },
  { id: 'rka', title: 'Risk Analyst', category: 'Finance & Consulting', aliases: ['Credit Risk Analyst', 'Operational Risk Specialist'] },
  { id: 'opa', title: 'Operations Analyst', category: 'Finance & Consulting', aliases: ['Business Operations Specialist', 'BizOps Analyst'] },

  // === MARKETING & GROWTH ===
  { id: 'dms', title: 'Digital Marketing Specialist', category: 'Marketing & Growth', aliases: ['Performance Marketer', 'PPC Specialist'] },
  { id: 'seo', title: 'SEO Specialist', category: 'Marketing & Growth', aliases: ['Search Engine Optimization Specialist', 'Technical SEO Lead'] },
  { id: 'cnw', title: 'Content Writer', category: 'Marketing & Growth', aliases: ['Copywriter', 'Technical Content Strategist'] },
  { id: 'tcw', title: 'Technical Writer', category: 'Marketing & Growth', aliases: ['Documentation Engineer', 'API Writer'] },
  { id: 'gte', title: 'Growth Engineer', category: 'Marketing & Growth', aliases: ['Growth Hacker', 'Product Led Growth (PLG) Developer'] },
  { id: 'gpm', title: 'Growth Product Manager', category: 'Marketing & Growth', aliases: ['Conversion Optimization PM'] },
  { id: 'smm', title: 'Social Media Manager', category: 'Marketing & Growth', aliases: ['Community Lead', 'Brand Social Strategist'] },
  { id: 'bdm', title: 'Brand Manager', category: 'Marketing & Growth', aliases: ['Brand Strategist', 'Marketing Director'] },

  // === SUPPORT & SOLUTIONS ===
  { id: 'tse', title: 'Technical Support Engineer', category: 'Support & Solutions', aliases: ['Tier 2 Tier 3 Support', 'L3 Support Engineer'] },
  { id: 'cse', title: 'Customer Success Engineer', category: 'Support & Solutions', aliases: ['CS Engineer', 'Client Integration Specialist'] },
  { id: 'sle', title: 'Solutions Engineer', category: 'Support & Solutions', aliases: ['Field Solutions Architect', 'Enterprise Solutions Lead'] },
  { id: 'sae', title: 'Sales Engineer', category: 'Support & Solutions', aliases: ['Technical Sales Engineer', 'Demo Engineer'] },
  { id: 'pse', title: 'Pre-Sales Engineer', category: 'Support & Solutions', aliases: ['Pre-Sales Solution Consultant'] },
  { id: 'ime', title: 'Implementation Engineer', category: 'Support & Solutions', aliases: ['Client Onboarding Engineer', 'Deployment Specialist'] },

  // === RESEARCH & INNOVATION ===
  { id: 'rse', title: 'Research Engineer', category: 'Research & Innovation', aliases: ['Applied Research Engineer', 'Lab Scientist'] },
  { id: 'rss', title: 'Research Scientist', category: 'Research & Innovation', aliases: ['Principal Scientist', 'Postdoctoral Researcher'] },
  { id: 'ive', title: 'Innovation Engineer', category: 'Research & Innovation', aliases: ['Emerging Tech Prototyper', 'Skunkworks Engineer'] },
  { id: 'rde', title: 'R&D Engineer', category: 'Research & Innovation', aliases: ['Research and Development Specialist'] },
  { id: 'acr', title: 'Academic Researcher', category: 'Research & Innovation', aliases: ['PhD Candidate', 'University Fellow'] },

  // === EMERGING TECH ===
  { id: 'qse', title: 'Quantum Software Engineer', category: 'Emerging Tech', aliases: ['Qiskit Developer', 'Quantum Computing Specialist'] },
  { id: 'qsr', title: 'Quantum Researcher', category: 'Emerging Tech', aliases: ['Quantum Algorithms Scientist', 'Quantum Physicist'] },
  { id: 'mvd', title: 'Metaverse Developer', category: 'Emerging Tech', aliases: ['Virtual World Architect', '3D Web Developer'] },
  { id: 'spc', title: 'Spatial Computing Engineer', category: 'Emerging Tech', aliases: ['VisionOS Developer', 'Mixed Reality Engineer'] },
  { id: 'dtw', title: 'Digital Twin Engineer', category: 'Emerging Tech', aliases: ['Simulation Modeling Specialist', 'Industrial IoT Modeler'] },
  { id: 'eai', title: 'Edge AI Engineer', category: 'Emerging Tech', aliases: ['Embedded Machine Learning', 'TinyML Developer'] },
  { id: 'edg', title: 'Edge Computing Engineer', category: 'Emerging Tech', aliases: ['Fog Computing Specialist', 'Edge Gateway Developer'] },
  { id: 'grn', title: 'Green Computing Engineer', category: 'Emerging Tech', aliases: ['Sustainable Software Engineer', 'Carbon-Aware Architect'] },
  { id: 'clm', title: 'Climate Tech Engineer', category: 'Emerging Tech', aliases: ['CleanTech Developer', 'Energy Grid Software Engineer'] },
  { id: 'bio', title: 'Bioinformatics Engineer', category: 'Emerging Tech', aliases: ['Computational Biologist', 'Genomics Data Specialist'] },
  { id: 'sbi', title: 'Synthetic Biology Engineer', category: 'Emerging Tech', aliases: ['Bio-CAD Engineer', 'Genetic Circuits Modeler'] },

  // === STUDENT / ENTRY LEVEL ===
  { id: 'int', title: 'Intern', category: 'Student / Entry Level', aliases: ['Summer Intern', 'Winter Intern', 'Apprentice'] },
  { id: 'sei', title: 'Software Engineering Intern', category: 'Student / Entry Level', aliases: ['SWE Intern', 'Developer Intern', 'SDE Intern'] },
  { id: 'aii', title: 'AI Intern', category: 'Student / Entry Level', aliases: ['Artificial Intelligence Intern', 'Applied AI Intern'] },
  { id: 'mli', title: 'ML Intern', category: 'Student / Entry Level', aliases: ['Machine Learning Intern'] },
  { id: 'dsi', title: 'Data Science Intern', category: 'Student / Entry Level', aliases: ['Data Analyst Intern'] },
  { id: 'csi', title: 'Cyber Security Intern', category: 'Student / Entry Level', aliases: ['InfoSec Intern', 'SOC Intern'] },
  { id: 'cli', title: 'Cloud Intern', category: 'Student / Entry Level', aliases: ['DevOps Intern', 'AWS Cloud Intern'] },
  { id: 'fei', title: 'Frontend Intern', category: 'Student / Entry Level', aliases: ['Web Development Intern'] },
  { id: 'bei', title: 'Backend Intern', category: 'Student / Entry Level', aliases: ['Server Side Intern'] },
  { id: 'fsi', title: 'Full Stack Intern', category: 'Student / Entry Level', aliases: ['Fullstack Intern'] },
  { id: 'get', title: 'Graduate Engineer Trainee', category: 'Student / Entry Level', aliases: ['GET', 'Engineering Trainee', 'Graduate Trainee'] },
  { id: 'ase', title: 'Associate Software Engineer', category: 'Student / Entry Level', aliases: ['Junior Software Engineer', 'Junior Developer'] },
  { id: 'ads', title: 'Associate Data Scientist', category: 'Student / Entry Level', aliases: ['Junior Data Scientist'] },
  { id: 'ele_swe', title: 'Entry Level Software Engineer', category: 'Student / Entry Level', aliases: ['Entry Level Developer', 'Level 1 Engineer'] },
  { id: 'cph', title: 'Campus Hire', category: 'Student / Entry Level', aliases: ['College Graduate Hire', 'New Grad'] },
  { id: 'fsh', title: 'Fresher', category: 'Student / Entry Level', aliases: ['Entry Level Candidate', 'Recent Graduate'] }
]

// Common abbreviation dictionary for instant expansion
export const ROLE_ABBREVIATIONS: Record<string, string[]> = {
  'swe': ['Software Engineer', 'Software Developer'],
  'sde': ['Software Engineer', 'Software Developer'],
  'fe': ['Frontend Developer', 'Frontend Engineer'],
  'be': ['Backend Developer', 'Backend Engineer'],
  'fs': ['Full Stack Developer'],
  'ai': ['AI Engineer', 'Generative AI Engineer', 'AI Research Scientist', 'AI Product Engineer'],
  'ml': ['Machine Learning Engineer', 'MLOps Engineer'],
  'dl': ['Deep Learning Engineer'],
  'nlp': ['NLP Engineer'],
  'cv': ['Computer Vision Engineer'],
  'pm': ['Product Manager', 'Project Manager'],
  'apm': ['Associate Product Manager'],
  'tpm': ['Technical Product Manager', 'Technical Program Manager'],
  'po': ['Product Owner'],
  'sre': ['Site Reliability Engineer', 'SRE'],
  'qa': ['QA Engineer', 'Automation Test Engineer', 'QA Lead'],
  'sdet': ['Software Development Engineer in Test (SDET)'],
  'soc': ['SOC Analyst'],
  'dba': ['Database Administrator', 'Oracle DBA', 'PostgreSQL DBA'],
  'ui': ['UI Designer', 'UI/UX Designer'],
  'ux': ['UX Designer', 'UX Researcher', 'UI/UX Designer'],
  'get': ['Graduate Engineer Trainee'],
  'bi': ['BI Developer', 'Business Intelligence Analyst'],
  'etl': ['ETL Developer'],
  'devops': ['DevOps Engineer'],
  'sec': ['Cyber Security Engineer', 'Security Engineer', 'Application Security Engineer'],
  'cto': ['CTO'],
  'ceo': ['CEO'],
  'em': ['Engineering Manager'],
  'tl': ['Technical Lead', 'Team Lead'],
  'ar': ['AR Developer'],
  'vr': ['VR Developer'],
  'xr': ['XR Developer']
}

// Default Fallback Roles (Popular / High-Demand)
export const DEFAULT_POPULAR_ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'AI Engineer',
  'Machine Learning Engineer',
  'Data Scientist',
  'Data Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Site Reliability Engineer (SRE)',
  'Cyber Security Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Graduate Engineer Trainee / Fresher'
]

export const POPULAR_PROFESSIONAL_TITLES = DEFAULT_POPULAR_ROLES

/* =========================================================================
   LOCAL STORAGE PERSISTENCE HELPERS
   ========================================================================= */

const STORAGE_KEYS = {
  RECENTS: 'aethercv_universal_recent_roles',
  FAVORITES: 'aethercv_universal_favorite_roles',
  CUSTOM: 'aethercv_universal_custom_roles',
  FREQUENT: 'aethercv_universal_role_frequencies'
}

export function getStoredRecentRoles(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENTS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveRecentRole(role: string): void {
  if (typeof window === 'undefined' || !role.trim()) return
  try {
    const list = getStoredRecentRoles().filter((r) => r.toLowerCase() !== role.trim().toLowerCase())
    list.unshift(role.trim())
    localStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(list.slice(0, 8)))
    incrementRoleFrequency(role.trim())
  } catch {
    // ignore
  }
}

export function getStoredFavoriteRoles(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function toggleFavoriteRole(role: string): boolean {
  if (typeof window === 'undefined' || !role.trim()) return false
  try {
    const favorites = getStoredFavoriteRoles()
    const clean = role.trim()
    const index = favorites.findIndex((f) => f.toLowerCase() === clean.toLowerCase())
    let next: string[]
    let isFav = false
    if (index >= 0) {
      next = favorites.filter((_, idx) => idx !== index)
      isFav = false
    } else {
      next = [clean, ...favorites]
      isFav = true
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next))
    return isFav
  } catch {
    return false
  }
}

export function getStoredCustomRoles(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCustomRole(role: string): void {
  if (typeof window === 'undefined' || !role.trim()) return
  try {
    const clean = role.trim()
    const current = getStoredCustomRoles().filter((r) => r.toLowerCase() !== clean.toLowerCase())
    current.unshift(clean)
    localStorage.setItem(STORAGE_KEYS.CUSTOM, JSON.stringify(current.slice(0, 30)))
    saveRecentRole(clean)
  } catch {
    // ignore
  }
}

export function getStoredFrequentRoles(): { role: string; count: number }[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FREQUENT)
    const map: Record<string, number> = raw ? JSON.parse(raw) : {}
    return Object.entries(map)
      .map(([role, count]) => ({ role, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  } catch {
    return []
  }
}

export function incrementRoleFrequency(role: string): void {
  if (typeof window === 'undefined' || !role.trim()) return
  try {
    const clean = role.trim()
    const raw = localStorage.getItem(STORAGE_KEYS.FREQUENT)
    const map: Record<string, number> = raw ? JSON.parse(raw) : {}
    map[clean] = (map[clean] || 0) + 1
    localStorage.setItem(STORAGE_KEYS.FREQUENT, JSON.stringify(map))
  } catch {
    // ignore
  }
}

/* =========================================================================
   FUZZY SEARCH & TYPO-TOLERANT ENGINE
   ========================================================================= */

/**
 * Calculates a match score between 0 and 100 for a candidate string given a query.
 * Handles exact matches, word starts, acronyms, and character subsequences with typo leniency.
 */
export function calculateMatchScore(candidate: string, query: string, aliases: string[] = []): number {
  const normCandidate = candidate.toLowerCase().trim()
  const normQuery = query.toLowerCase().trim()

  if (!normQuery) return 100
  if (normCandidate === normQuery) return 100
  if (normCandidate.startsWith(normQuery)) return 95

  // Word boundary match (e.g. "Dev" matches "Software Developer")
  const words = normCandidate.split(/\s+/)
  if (words.some((w) => w.startsWith(normQuery))) return 90

  // Check alias exact matches (e.g. "SRE" for "Site Reliability Engineer")
  for (const alias of aliases) {
    const normAlias = alias.toLowerCase()
    if (normAlias === normQuery) return 92
    if (normAlias.startsWith(normQuery)) return 88
    if (normAlias.includes(normQuery)) return 82
  }

  // Check abbreviation dictionary
  const expanded = ROLE_ABBREVIATIONS[normQuery]
  if (expanded && expanded.some((ex) => normCandidate.includes(ex.toLowerCase()))) {
    return 91
  }

  // Substring inclusion
  if (normCandidate.includes(normQuery)) return 75

  // Subsequence matching (fuzzy letters)
  let qIdx = 0
  let matchedChars = 0
  for (let cIdx = 0; cIdx < normCandidate.length && qIdx < normQuery.length; cIdx++) {
    if (normCandidate[cIdx] === normQuery[qIdx]) {
      qIdx++
      matchedChars++
    }
  }

  if (qIdx === normQuery.length) {
    const coverage = matchedChars / normCandidate.length
    return Math.round(50 + coverage * 20)
  }

  // Simple 1-char typo tolerance for queries >= 4 chars
  if (normQuery.length >= 4) {
    let diff = 0
    let minLen = Math.min(normCandidate.length, normQuery.length)
    for (let i = 0; i < minLen; i++) {
      if (normCandidate[i] !== normQuery[i]) diff++
    }
    if (diff <= 1) return 60
  }

  return 0
}

/**
 * Searches and returns sorted roles matching a query, category, and custom user additions.
 */
export function searchMasterRoles(
  query: string,
  category: JobRoleCategory = 'All',
  customRoles: string[] = []
): Array<{ item: JobRoleItem; score: number }> {
  // Combine preset roles and custom roles into unified list without duplicates
  const seenTitles = new Set<string>()
  const combined: JobRoleItem[] = []

  // Add custom roles first
  customRoles.forEach((customTitle, idx) => {
    const clean = customTitle.trim()
    if (clean && !seenTitles.has(clean.toLowerCase())) {
      seenTitles.add(clean.toLowerCase())
      combined.push({
        id: `custom-${idx}`,
        title: clean,
        category: 'All',
        aliases: ['Custom', 'User Added'],
        isCustom: true
      })
    }
  })

  // Add master roles
  MASTER_JOB_ROLES.forEach((item) => {
    if (!seenTitles.has(item.title.toLowerCase())) {
      seenTitles.add(item.title.toLowerCase())
      combined.push(item)
    }
  })

  // Filter by category
  const categoryFiltered = category === 'All'
    ? combined
    : combined.filter((r) => r.category === category || r.isCustom)

  if (!query.trim()) {
    // Alphabetical sort when no query
    return categoryFiltered
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((item) => ({ item, score: 100 }))
  }

  // Score and sort by relevance
  const scored = categoryFiltered
    .map((item) => ({
      item,
      score: calculateMatchScore(item.title, query, item.aliases)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.item.title.localeCompare(b.item.title)
    })

  return scored
}
