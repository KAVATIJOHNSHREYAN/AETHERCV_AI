import { GitHubProfileData, GitHubReadmeStyle } from '@/types/github'

/**
 * Generates an automated, recruiter-friendly GitHub Profile README.md based on candidate data and chosen style.
 */
export function generateProfileReadme(
  data: GitHubProfileData,
  style: GitHubReadmeStyle = 'neon-developer'
): string {
  const name = data.name || data.username || 'Developer'
  const role = data.targetRole || 'Software Engineer'
  const bio = data.bio || 'Building scalable applications and exploring new technologies.'
  const username = data.username || 'developer'
  const website = data.website || `https://${username}.dev`
  const linkedin = data.socialLinks?.linkedin || ''
  const twitter = data.socialLinks?.twitter || data.twitterUsername || ''
  const email = data.socialLinks?.email || ''

  // Format tech stack badges
  const allLanguages = data.techStack?.languages || ['Python', 'JavaScript', 'TypeScript']
  const allFrameworks = data.techStack?.frameworks || ['React', 'Next.js', 'Node.js']
  const allCloud = data.techStack?.cloudDevOps || ['AWS', 'Docker']
  const allDbs = data.techStack?.databases || ['PostgreSQL', 'Redis']
  const allAi = data.techStack?.aiMl || []

  // Top pinned repos
  const pinnedRepos = (data.repositories || []).filter((r) => r.isPinned)
  const reposToDisplay = pinnedRepos.length > 0 ? pinnedRepos : (data.repositories || []).slice(0, 4)

  if (style === 'minimalist') {
    return `# ${name}

> ${role} • ${data.location || 'Remote'}

${bio}

---

### Skills
- **Languages:** ${allLanguages.join(', ')}
- **Frameworks & Libraries:** ${allFrameworks.join(', ')}
- **Databases & Storage:** ${allDbs.join(', ')}
- **Cloud & DevOps:** ${allCloud.join(', ')}

---

### Key Repositories
${reposToDisplay
  .map(
    (r) =>
      `- **[${r.name}](${r.githubUrl || `https://github.com/${username}/${r.name}`})** — ${r.description} *(${r.language})*`
  )
  .join('\n')}

---

### Contact
- 🌐 [Portfolio](${website})
${linkedin ? `- 💼 [LinkedIn](https://${linkedin.replace(/^https?:\/\//, '')})\n` : ''}${twitter ? `- 🐦 [Twitter / X](https://x.com/${twitter.replace(/^@/, '')})\n` : ''}${email ? `- 📧 Email: ${email}\n` : ''}
`
  }

  if (style === 'corporate-engineer') {
    return `<div align="center">

# ${name}
### ${role} | Enterprise Systems & Scalable Cloud Solutions

<p align="center">
  <a href="${website}">🌐 Portfolio</a> •
  <a href="https://${linkedin.replace(/^https?:\/\//, '')}">💼 LinkedIn</a> •
  <a href="mailto:${email}">📧 Email</a>
</p>

</div>

---

### 👨‍💼 Executive Summary
${bio}

### 💼 Technical Competencies & Architecture
| Category | Technologies & Tools |
| :--- | :--- |
| **Languages** | ${allLanguages.join(', ')} |
| **Frameworks** | ${allFrameworks.join(', ')} |
| **Cloud & Infrastructure** | ${allCloud.join(', ')} |
| **Databases** | ${allDbs.join(', ')} |
${allAi.length > 0 ? `| **AI / Machine Learning** | ${allAi.join(', ')} |\n` : ''}

---

### 🏆 Enterprise & Production Projects
${reposToDisplay
  .map(
    (r) => `
#### 🔹 [${r.name}](${r.githubUrl || `https://github.com/${username}/${r.name}`})
- **Overview:** ${r.description}
- **Stack:** \`${r.language}\` ${r.topics?.length ? `• Topics: ${r.topics.slice(0, 4).join(', ')}` : ''}
${r.demoUrl ? `- **Live Demo:** [View Application](${r.demoUrl})` : ''}
`
  )
  .join('\n')}

---

<div align="center">
  <sub>Open to high-impact software engineering opportunities. Contact: ${email || website}</sub>
</div>
`
  }

  if (style === 'faang-sde') {
    return `# Hi, I'm ${name} ⚡

\`\`\`yaml
name: ${name}
role: ${role}
experience: ${data.yearsOfExperience || '3+ Years'}
focus_areas:
  - High-Concurrency Distributed Systems
  - Asynchronous Message Streaming
  - Zero-Downtime Cloud Deployments
status: ${data.openToWork ? 'Actively Interviewing' : 'Open to Opportunities'}
\`\`\`

---

### 🚀 Production System Highlights
${reposToDisplay
  .map(
    (r) => `
### ⚡ [${r.name}](${r.githubUrl || `https://github.com/${username}/${r.name}`})
> **Metric Impact:** Processes high-throughput operations with sub-50ms latency.
- ${r.description}
- **Language / Core Tech:** \`${r.language}\`
${r.demoUrl ? `- **Live Production URL:** [${r.demoUrl}](${r.demoUrl})` : ''}
`
  )
  .join('\n')}

---

### 🛠️ Core Stack Matrix
- **Languages:** ${allLanguages.map((l) => `\`${l}\``).join(' ')}
- **Frameworks:** ${allFrameworks.map((f) => `\`${f}\``).join(' ')}
- **Databases:** ${allDbs.map((d) => `\`${d}\``).join(' ')}
- **Cloud / DevOps:** ${allCloud.map((c) => `\`${c}\``).join(' ')}

---

### 📈 Verified GitHub Engineering Metrics
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight&hide_border=true" alt="GitHub stats" height="150" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=tokyonight&hide_border=true" alt="Top Langs" height="150" />
</p>

---

### 📬 Connect
[LinkedIn](https://${linkedin.replace(/^https?:\/\//, '')}) • [Portfolio](${website}) • [Email](mailto:${email})
`
  }

  if (style === 'open-source-hero') {
    return `<div align="center">

# 🌟 Hello Open Source Community, I'm ${name}!

[![GitHub Followers](https://img.shields.io/github/followers/${username}?label=Follow&style=social)](https://github.com/${username})
[![Stars](https://img.shields.io/github/stars/${username}?style=social)](https://github.com/${username})

> ${bio}

</div>

---

### 🤝 Open Source Projects & Developer Tools

${reposToDisplay
  .map(
    (r) => `
### 📦 [${r.name}](${r.githubUrl || `https://github.com/${username}/${r.name}`})
${r.description}

\`\`\`bash
# Clone and explore
git clone https://github.com/${username}/${r.name}.git
\`\`\`

- **Primary Tech:** \`${r.language}\`
- **License:** \`${r.license || 'MIT'}\`
${r.demoUrl ? `- **Demo:** [${r.demoUrl}](${r.demoUrl})` : ''}
`
  )
  .join('\n')}

---

### 🛠️ Languages & Libraries I Build With
${allLanguages.map((l) => `\`${l}\``).join(' • ')} • ${allFrameworks.map((f) => `\`${f}\``).join(' • ')}

---

### 💬 Let's Build Together
Pull requests, issues, and discussions are always welcome across my repositories!
`
  }

  if (style === 'student-fresher') {
    return `# 👋 Hi, I'm ${name}!
### 🎓 Aspiring ${role} & Computer Science Builder

${bio}

---

### 🚀 Capstone & Portfolio Projects
${reposToDisplay
  .map(
    (r) => `
- **[${r.name}](${r.githubUrl || `https://github.com/${username}/${r.name}`})**
  - ${r.description}
  - **Tech Stack:** \`${r.language}\` ${r.topics?.length ? `(${r.topics.slice(0, 3).join(', ')})` : ''}
  ${r.demoUrl ? `- [Live Demo Link](${r.demoUrl})` : ''}
`
  )
  .join('\n')}

---

### 📚 Tech Stack Learned & Practiced
- **Languages:** ${allLanguages.join(', ')}
- **Web & Backend:** ${allFrameworks.join(', ')}
- **Databases:** ${allDbs.join(', ')}
- **Tools:** Git, GitHub, VS Code, Linux, Docker

---

### 🎯 What I'm Looking For
Actively seeking full-time opportunities or internships where I can contribute clean code, learn from mentors, and ship real product features.

- 💼 [LinkedIn](https://${linkedin.replace(/^https?:\/\//, '')})
- 🌐 [Portfolio](${website})
- 📧 [Email Me](mailto:${email})
`
  }

  // Default: 'neon-developer' (Vibrant, Animated, Shields badges, Stats)
  return `<h1 align="center">Hi there, I'm ${name} 👋</h1>
<h3 align="center">🚀 ${role} • Building Modern Cloud Software</h3>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=20&duration=3000&pause=1000&color=38BDF8&center=true&vCenter=true&width=500&lines=${encodeURIComponent(
    role
  )};Distributed+Systems+Enthusiast;Open+Source+Contributor" alt="Typing SVG" />
</p>

<p align="center">
  ${bio}
</p>

<p align="center">
  <a href="${website}"><img src="https://img.shields.io/badge/Portfolio-2662EB?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Portfolio" /></a>
  ${linkedin ? `<a href="https://${linkedin.replace(/^https?:\/\//, '')}"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>` : ''}
  ${twitter ? `<a href="https://x.com/${twitter.replace(/^@/, '')}"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" /></a>` : ''}
  ${email ? `<a href="mailto:${email}"><img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>` : ''}
</p>

---

### 🛠️ Languages & Technologies

<p align="left">
  ${allLanguages.map((l) => `<img src="https://img.shields.io/badge/-${encodeURIComponent(l)}-1E293B?style=flat-square" alt="${l}" />`).join(' ')}
  ${allFrameworks.map((f) => `<img src="https://img.shields.io/badge/-${encodeURIComponent(f)}-2563EB?style=flat-square" alt="${f}" />`).join(' ')}
  ${allCloud.map((c) => `<img src="https://img.shields.io/badge/-${encodeURIComponent(c)}-0284C7?style=flat-square" alt="${c}" />`).join(' ')}
  ${allDbs.map((d) => `<img src="https://img.shields.io/badge/-${encodeURIComponent(d)}-334155?style=flat-square" alt="${d}" />`).join(' ')}
</p>

---

### 🌟 Featured Repositories

${reposToDisplay
  .map(
    (r) => `
#### 📌 [${r.name}](${r.githubUrl || `https://github.com/${username}/${r.name}`})
${r.description}

- **Built with:** \`${r.language}\` ${r.license ? `• License: \`${r.license}\`` : ''}
${r.demoUrl ? `- **Live Preview:** [${r.demoUrl}](${r.demoUrl})` : ''}
`
  )
  .join('\n')}

---

### 📊 GitHub Activity

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=radical&hide_border=true" alt="${username}'s GitHub stats" height="155" />
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=radical&hide_border=true" alt="Streak" height="155" />
</p>

---

<p align="center">
  <i>⭐️ Thanks for stopping by my GitHub profile! Feel free to star any repos you find helpful.</i>
</p>
`
}
