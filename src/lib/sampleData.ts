import { CVData, LetterData } from '../types/builder';

export const sampleCVData: CVData = {
  personal: {
    firstName: "Alexandra",
    lastName: "Johnson",
    email: "alexandra.johnson@email.com",
    phone: "+44 7700 900123",
    location: "London, UK",
    linkedin: "linkedin.com/in/alexandra-johnson",
    github: "github.com/alexjohnson",
    website: "alexandra-johnson.dev",
    summary: "Full-Stack Developer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and emerging technologies."
  },
  experience: [
    {
      id: "1",
      company: "TechCorp Limited",
      position: "Senior Full-Stack Developer",
      location: "London, UK",
      startDate: "January 2022",
      endDate: "",
      current: true,
      description: [
        "Led development of microservices architecture serving 1M+ users daily",
        "Improved application performance by 40% through React optimization",
        "Mentored 3 junior developers and established code review processes",
        "Implemented CI/CD pipelines reducing deployment time by 60%"
      ]
    },
    {
      id: "2",
      company: "StartupXYZ",
      position: "Full-Stack Developer",
      location: "Remote",
      startDate: "March 2020",
      endDate: "December 2021",
      current: false,
      description: [
        "Built responsive web applications using React, Node.js, and PostgreSQL",
        "Collaborated with design team to implement pixel-perfect UIs",
        "Developed RESTful APIs handling 100K+ requests per day",
        "Integrated third-party services including Stripe and SendGrid"
      ]
    },
    {
      id: "3",
      company: "Digital Agency Pro",
      position: "Junior Developer",
      location: "Manchester, UK",
      startDate: "June 2019",
      endDate: "February 2020",
      current: false,
      description: [
        "Developed custom WordPress themes and plugins for client projects",
        "Maintained and updated existing client websites",
        "Collaborated with designers to implement responsive layouts",
        "Learned modern JavaScript frameworks and best practices"
      ]
    }
  ],
  education: [
    {
      id: "1",
      institution: "University of Manchester",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2016",
      endDate: "2019",
      current: false,
      gpa: "First Class Honours",
      description: "Specialized in Software Engineering and Web Technologies"
    }
  ],
  skills: [
    { id: "1", name: "JavaScript", level: "Expert", category: "Technical" },
    { id: "2", name: "TypeScript", level: "Advanced", category: "Technical" },
    { id: "3", name: "React", level: "Expert", category: "Technical" },
    { id: "4", name: "Node.js", level: "Advanced", category: "Technical" },
    { id: "5", name: "Python", level: "Intermediate", category: "Technical" },
    { id: "6", name: "PostgreSQL", level: "Advanced", category: "Technical" },
    { id: "7", name: "MongoDB", level: "Intermediate", category: "Technical" },
    { id: "8", name: "AWS", level: "Intermediate", category: "Technical" },
    { id: "9", name: "Leadership", level: "Advanced", category: "Soft" },
    { id: "10", name: "Communication", level: "Expert", category: "Soft" },
    { id: "11", name: "Problem Solving", level: "Expert", category: "Soft" },
    { id: "12", name: "English", level: "Native", category: "Language" },
    { id: "13", name: "Spanish", level: "Conversational", category: "Language" },
    { id: "14", name: "Git", level: "Expert", category: "Tool" },
    { id: "15", name: "Docker", level: "Intermediate", category: "Tool" },
    { id: "16", name: "Figma", level: "Intermediate", category: "Tool" }
  ],
  projects: [
    {
      id: "1",
      name: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard. Built for scalability with microservices architecture.",
      technologies: ["React", "Node.js", "PostgreSQL", "Redis", "Stripe API"],
      url: "https://demo-ecommerce.com",
      github: "https://github.com/alexjohnson/ecommerce-platform",
      startDate: "2023",
      endDate: "2024"
    },
    {
      id: "2",
      name: "Task Management App",
      description: "Collaborative project management tool with real-time updates, file sharing, and team communication features. Supports teams of up to 100 members.",
      technologies: ["Next.js", "Socket.io", "MongoDB", "AWS S3"],
      url: "https://taskmaster-pro.com",
      github: "https://github.com/alexjohnson/taskmaster",
      startDate: "2022",
      endDate: "2023"
    },
    {
      id: "3",
      name: "Weather Analytics Dashboard",
      description: "Real-time weather data visualization dashboard with predictive analytics and historical data comparison. Integrates with multiple weather APIs.",
      technologies: ["Vue.js", "Python", "FastAPI", "Chart.js"],
      github: "https://github.com/alexjohnson/weather-dashboard",
      startDate: "2021",
      endDate: "2022"
    }
  ],
  languages: [
    { id: "1", name: "English", level: "Native" },
    { id: "2", name: "Spanish", level: "Conversational" },
    { id: "3", name: "French", level: "Basic" }
  ],
  certificates: [
    {
      id: "1",
      name: "AWS Certified Developer Associate",
      issuer: "Amazon Web Services",
      date: "2023",
      url: "https://aws.amazon.com/certification/"
    },
    {
      id: "2",
      name: "Certified Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      date: "2022"
    }
  ]
};

export const sampleLetterData: LetterData = {
  senderInfo: {
    name: "Alexandra Johnson",
    address: "123 Tech Street, London, UK SW1A 1AA",
    phone: "+44 7700 900123",
    email: "alexandra.johnson@email.com"
  },
  recipientInfo: {
    name: "Sarah Mitchell",
    title: "Senior Hiring Manager",
    company: "InnovaTech Solutions",
    address: "456 Innovation Drive, London, UK EC2A 2BB"
  },
  letterInfo: {
    date: "15th December 2024",
    subject: "Application for Senior Full-Stack Developer Position",
    salutation: "Dear Ms. Mitchell,",
    body: `I am writing to express my strong interest in the Senior Full-Stack Developer position at InnovaTech Solutions, as advertised on your company website. With over 5 years of experience in full-stack development and a proven track record of delivering scalable web applications, I am confident that my skills and passion for technology make me an ideal candidate for this role.

In my current position as Senior Full-Stack Developer at TechCorp Limited, I have led the development of microservices architecture serving over 1 million users daily. My expertise spans the entire technology stack, from React and TypeScript on the frontend to Node.js and PostgreSQL on the backend. I have consistently delivered high-quality solutions that improved application performance by 40% and reduced deployment time by 60% through implementing CI/CD pipelines.

What particularly excites me about InnovaTech Solutions is your commitment to innovation and cutting-edge technology solutions. Your recent work on AI-driven analytics platforms aligns perfectly with my interest in emerging technologies and my experience in building data-intensive applications. I am eager to contribute to your team's success and help drive the company's technological advancement.

I have attached my resume for your review and would welcome the opportunity to discuss how my experience and enthusiasm can contribute to InnovaTech Solutions' continued success. Thank you for considering my application, and I look forward to hearing from you soon.`,
    closing: "Sincerely,",
    signature: "Alexandra Johnson"
  }
};
