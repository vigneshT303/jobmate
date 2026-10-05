const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const Resume = require('../models/Resume');

dotenv.config();

const companiesData = [
  {
    name: 'Google Cloud India',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80',
    industry: 'Cloud Computing & AI',
    location: 'Bangalore, Karnataka',
    website: 'https://cloud.google.com',
    employeeCount: '10,000+ employees',
    description: 'Google Cloud provides organizations with leading infrastructure, platform capabilities and industry solutions.',
    about: 'Google is a global technology leader focused on improving the ways people connect with information.',
    foundedYear: 1998,
    email: 'careers@google.com'
  },
  {
    name: 'Microsoft IDC',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    industry: 'Software & Cloud Solutions',
    location: 'Hyderabad, Telangana',
    website: 'https://microsoft.com',
    employeeCount: '10,000+ employees',
    description: 'Microsoft India Development Center (IDC) is one of Microsoft’s largest R&D centers outside Redmond.',
    about: 'Empowering every person and organization on the planet to achieve more.',
    foundedYear: 1975,
    email: 'careers@microsoft.com'
  },
  {
    name: 'Amazon Web Services',
    logo: 'https://images.unsplash.com/photo-1523474253246-64e03d526a6b?w=200&auto=format&fit=crop&q=80',
    industry: 'E-commerce & Cloud Services',
    location: 'Hyderabad, Telangana',
    website: 'https://aws.amazon.com',
    employeeCount: '10,000+ employees',
    description: 'Amazon Web Services offers reliable, scalable, and inexpensive cloud computing services.',
    about: 'Earth’s most customer-centric company and best employer.',
    foundedYear: 1994,
    email: 'aws-jobs@amazon.com'
  },
  {
    name: 'Razorpay',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80',
    industry: 'Fintech & Payments',
    location: 'Bangalore, Karnataka',
    website: 'https://razorpay.com',
    employeeCount: '2,000-5,000 employees',
    description: 'Razorpay is the only payments solution in India that allows businesses to accept, process and disburse payments.',
    about: 'Powering financial experiences for digital business across India and Southeast Asia.',
    foundedYear: 2014,
    email: 'talent@razorpay.com'
  },
  {
    name: 'Zomato',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80',
    industry: 'FoodTech & Logistics',
    location: 'Gurugram, Haryana',
    website: 'https://zomato.com',
    employeeCount: '5,000-10,000 employees',
    description: 'Zomato connects customers, restaurant partners, and delivery partners with seamless food ordering and logistics.',
    about: 'Better food for more people.',
    foundedYear: 2008,
    email: 'careers@zomato.com'
  },
  {
    name: 'Infosys Innovation Lab',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80',
    industry: 'IT Services & Consulting',
    location: 'Pune, Maharashtra',
    website: 'https://infosys.com',
    employeeCount: '10,000+ employees',
    description: 'Infosys is a global leader in next-generation digital services and consulting.',
    about: 'Navigating your next with digital transformation, automation, and AI.',
    foundedYear: 1981,
    email: 'freshers@infosys.com'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobmate');
    console.log('[Seed] Connected to MongoDB');

    await User.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await SavedJob.deleteMany();
    await Resume.deleteMany();
    console.log('[Seed] Database collections cleaned');

    const adminUser = await User.create({
      name: process.env.ADMIN_NAME || 'JobMate Administrator',
      email: (process.env.ADMIN_EMAIL || 'admin@jobmate.com').toLowerCase(),
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'admin',
      candidateType: 'experienced',
      phone: '+91 9876543210',
      location: 'Bangalore, India',
      bio: 'Platform Administrator managing job listings, applications, and system users.'
    });
    console.log(`[Seed] Admin created: ${adminUser.email} / ${process.env.ADMIN_PASSWORD || 'Admin@12345'}`);

    const fresherUser = await User.create({
      name: 'Rahul Sharma',
      email: 'fresher@jobmate.com',
      password: 'User@12345',
      role: 'user',
      candidateType: 'fresher',
      phone: '+91 9123456780',
      location: 'Bangalore, India',
      preferredLocation: ['Bangalore', 'Hyderabad', 'Remote'],
      skills: ['JavaScript', 'React.js', 'HTML5', 'CSS3', 'Node.js', 'Git', 'MongoDB'],
      bio: 'Enthusiastic Computer Science graduate passionate about modern Full Stack Web Development and cloud architectures.',
      education: [
        {
          degree: 'B.Tech in Computer Science',
          institution: 'National Institute of Technology',
          fieldOfStudy: 'Computer Science',
          startYear: '2022',
          endYear: '2026',
          grade: '8.8 CGPA'
        }
      ],
      projects: [
        {
          title: 'Campus Placement Portal',
          description: 'Built a MERN application for managing student applications and campus interview drives.',
          link: 'https://github.com/rahul/placement-portal',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB']
        }
      ]
    });

    const experiencedUser = await User.create({
      name: 'Priya Patel',
      email: 'experienced@jobmate.com',
      password: 'User@12345',
      role: 'user',
      candidateType: 'experienced',
      phone: '+91 9988776655',
      location: 'Hyderabad, India',
      preferredLocation: ['Hyderabad', 'Bangalore', 'Remote'],
      skills: ['React.js', 'Node.js', 'TypeScript', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL', 'TailwindCSS'],
      bio: 'Senior Full Stack Software Engineer with 4 years experience building scalable enterprise SaaS systems.',
      experience: [
        {
          title: 'Software Development Engineer II',
          company: 'Fintech Solutions Ltd',
          location: 'Hyderabad',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          description: 'Architected high throughput payment microservices processing over 5M transactions monthly.'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Engineering',
          institution: 'Osmania University',
          fieldOfStudy: 'Information Technology',
          startYear: '2018',
          endYear: '2022',
          grade: '9.1 CGPA'
        }
      ]
    });

    console.log('[Seed] Demo candidate accounts created:');
    console.log(`  - Fresher: fresher@jobmate.com / User@12345`);
    console.log(`  - Experienced: experienced@jobmate.com / User@12345`);

    const createdCompanies = [];
    for (const cData of companiesData) {
      const comp = await Company.create({
        ...cData,
        createdBy: adminUser._id
      });
      createdCompanies.push(comp);
    }
    console.log(`[Seed] Created ${createdCompanies.length} companies`);

    const compMap = {};
    createdCompanies.forEach((c) => {
      compMap[c.name] = c._id;
    });

    const jobsList = [
      {
        title: 'Associate Software Engineer (Fresher 2025/2026 Batch)',
        company: compMap['Infosys Innovation Lab'],
        category: 'Software Engineering',
        description: 'Exciting entry-level position for enthusiastic graduates ready to engineer resilient digital systems, write clean code, and collaborate in agile sprints.',
        responsibilities: [
          'Design, develop, and test modular software components using JavaScript, Node.js and SQL/NoSQL databases.',
          'Participate in code reviews, bug fixes, and continuous integration workflows.',
          'Collaborate with senior technical architects and QA engineers to meet project milestones.'
        ],
        requirements: [
          'Degree in Computer Science, IT, or related engineering discipline (2025 or 2026 graduating).',
          'Solid understanding of Data Structures, Algorithms, and Object-Oriented Programming.',
          'Eagerness to learn new frameworks and modern web stacks.'
        ],
        requiredSkills: ['JavaScript', 'HTML5', 'CSS3', 'Data Structures', 'Git', 'SQL', 'React'],
        experience: 'Fresher (0-1 years)',
        education: "B.Tech / B.E. / BCA / MCA",
        salary: { min: 450000, max: 700000, currency: 'INR', display: '₹4.5 - 7.0 LPA' },
        location: 'Pune, Maharashtra',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        vacancies: 15,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        featured: true,
        benefits: ['Health Insurance', 'Annual Learning Allowance', 'Hybrid Work Flexibility', 'Mentorship Program'],
        postedBy: adminUser._id
      },
      {
        title: 'Full Stack MERN Developer',
        company: compMap['Razorpay'],
        category: 'Software Engineering',
        description: 'Join Razorpay to architect mission-critical payment gateways, merchant dashboards, and high-performance financial microservices.',
        responsibilities: [
          'Build responsive, intuitive client interfaces using React.js and modern state management.',
          'Develop robust RESTful APIs in Node.js and Express with optimized MongoDB queries.',
          'Ensure high availability, low latency, and zero-defect code deployment.'
        ],
        requirements: [
          'Proven hands-on experience building web applications with the MERN stack.',
          'Deep knowledge of asynchronous programming, JWT auth, and database indexing.',
          'Experience with Docker and automated testing is a plus.'
        ],
        requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'REST API', 'TailwindCSS'],
        experience: '1-3 years',
        education: "Bachelor's Degree in Computer Science or equivalent",
        salary: { min: 900000, max: 1600000, currency: 'INR', display: '₹9.0 - 16.0 LPA' },
        location: 'Bangalore, Karnataka',
        jobType: 'Full-time',
        workMode: 'On-site',
        vacancies: 4,
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'active',
        featured: true,
        benefits: ['ESOPs', 'Comprehensive Medical Cover', 'Gym Reimbursement', 'Free Catered Meals'],
        postedBy: adminUser._id
      },
      {
        title: 'Cloud Infrastructure & DevOps Engineer',
        company: compMap['Amazon Web Services'],
        category: 'DevOps & Cloud',
        description: 'Design and automate global cloud environments, build CI/CD pipelines, and guarantee 99.99% uptime for cloud services.',
        responsibilities: [
          'Manage infrastructure as code using Terraform and CloudFormation.',
          'Monitor distributed systems, latency spikes, and incident remediation.',
          'Optimize AWS cloud costs and implement security compliance policies.'
        ],
        requirements: [
          'Knowledge of AWS core services (EC2, S3, ECS, Lambda, VPC).',
          'Proficiency with Docker, Kubernetes, and Linux scripting.',
          'Strong diagnostic and troubleshooting mindset.'
        ],
        requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Terraform', 'CI/CD', 'Python'],
        experience: '2-5 years',
        education: "Bachelor's Degree in Engineering",
        salary: { min: 1400000, max: 2400000, currency: 'INR', display: '₹14.0 - 24.0 LPA' },
        location: 'Hyderabad, Telangana',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        vacancies: 3,
        applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'active',
        featured: true,
        benefits: ['Sign-on Bonus', 'AWS Certification Sponsorship', 'Wellness Allowance'],
        postedBy: adminUser._id
      },
      {
        title: 'Frontend React.js Engineer',
        company: compMap['Zomato'],
        category: 'Frontend Development',
        description: 'Craft buttery-smooth consumer interfaces for millions of daily active diners and food delivery lovers.',
        responsibilities: [
          'Implement pixel-perfect, accessible, and responsive user interfaces in React and Tailwind CSS.',
          'Optimize bundle size, Web Vitals, and client-side rendering performance.',
          'Collaborate closely with UI/UX designers and product managers.'
        ],
        requirements: [
          'Strong grasp of React hooks, context, state management, and modern CSS.',
          'Experience building mobile-first responsive web apps.',
          'Passion for clean design aesthetics and delightful user interactions.'
        ],
        requiredSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'TailwindCSS', 'Redux', 'UI/UX'],
        experience: 'Fresher to 2 years',
        education: "Any Graduate with good coding skills",
        salary: { min: 700000, max: 1200000, currency: 'INR', display: '₹7.0 - 12.0 LPA' },
        location: 'Gurugram, Haryana',
        jobType: 'Full-time',
        workMode: 'Remote',
        vacancies: 5,
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'active',
        featured: false,
        benefits: ['Work from Anywhere', 'Food Allowance', 'Home Office Stipend'],
        postedBy: adminUser._id
      },
      {
        title: 'AI / Machine Learning Engineer',
        company: compMap['Google Cloud India'],
        category: 'Data Science & AI',
        description: 'Drive innovations in Generative AI, Large Language Models (LLMs), and intelligent enterprise search pipelines.',
        responsibilities: [
          'Fine-tune generative models, build RAG (Retrieval Augmented Generation) architectures, and integrate AI APIs.',
          'Deploy ML models as resilient low-latency REST and gRPC microservices.',
          'Evaluate model performance, hallucinations, and safety guardrails.'
        ],
        requirements: [
          'Strong background in Python, PyTorch/TensorFlow, and Vector Databases.',
          'Experience working with Gemini API, OpenAI API, or open-source LLMs.',
          'Solid mathematical foundation in linear algebra and statistics.'
        ],
        requiredSkills: ['Python', 'Machine Learning', 'Gemini API', 'PyTorch', 'NLP', 'Docker'],
        experience: '2-4 years',
        education: "Master's or Bachelor's in CS, AI, or Data Science",
        salary: { min: 1800000, max: 3200000, currency: 'INR', display: '₹18.0 - 32.0 LPA' },
        location: 'Bangalore, Karnataka',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        vacancies: 2,
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'active',
        featured: true,
        benefits: ['Stock Options (RSUs)', 'Top Tier Healthcare', 'Annual Conference Travel'],
        postedBy: adminUser._id
      },
      {
        title: 'Junior Backend Developer (Node.js & MongoDB)',
        company: compMap['Microsoft IDC'],
        category: 'Backend Development',
        description: 'Join Microsoft’s developer tools team to build robust backend microservices, write clean APIs, and optimize query latency.',
        responsibilities: [
          'Develop scalable backend APIs in Node.js and TypeScript.',
          'Write automated unit and integration tests.',
          'Participate in design discussions and architectural planning.'
        ],
        requirements: [
          'Familiarity with Node.js, Express, and MongoDB or SQL databases.',
          'Knowledge of Git version control and asynchronous programming.',
          'Good problem-solving abilities and clear communication.'
        ],
        requiredSkills: ['Node.js', 'Express', 'MongoDB', 'TypeScript', 'Git', 'REST API'],
        experience: 'Fresher (0-2 years)',
        education: "Bachelor's Degree in Engineering or Computer Applications",
        salary: { min: 800000, max: 1400000, currency: 'INR', display: '₹8.0 - 14.0 LPA' },
        location: 'Hyderabad, Telangana',
        jobType: 'Full-time',
        workMode: 'On-site',
        vacancies: 6,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        featured: false,
        benefits: ['Health Benefits', 'Cab Facility', 'Subsidized Food', 'Education Reimbursement'],
        postedBy: adminUser._id
      }
    ];

    const createdJobs = await Job.insertMany(jobsList);
    console.log(`[Seed] Created ${createdJobs.length} active jobs`);

    const sampleJob = createdJobs[0];
    await Application.create({
      job: sampleJob._id,
      company: sampleJob.company,
      user: fresherUser._id,
      fullName: fresherUser.name,
      email: fresherUser.email,
      phone: fresherUser.phone,
      education: 'B.Tech in Computer Science',
      experience: 'Fresher (2026 Batch)',
      skills: fresherUser.skills,
      resumeUrl: '/uploads/resumes/sample-resume.pdf',
      resumeOriginalName: 'Rahul_Sharma_Resume.pdf',
      coverLetter: 'I am excited to apply for this entry-level position at Infosys. My background in full stack development makes me an ideal fit.',
      status: 'Under Review',
      statusHistory: [
        { status: 'Applied', changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), comment: 'Application submitted' },
        { status: 'Under Review', changedAt: new Date(), comment: 'Profile forwarded to technical hiring team' }
      ]
    });
    sampleJob.applicationsCount = 1;
    await sampleJob.save();

    console.log('[Seed] Sample job application created');

    await SavedJob.create({
      user: fresherUser._id,
      job: createdJobs[1]._id
    });
    console.log('[Seed] Sample saved job created');

    console.log('--------------------------------------------------');
    console.log('✅ JobMate Database seeded successfully!');
    console.log('--------------------------------------------------');
    console.log('Admin Credentials:');
    console.log(`  Email:    ${adminUser.email}`);
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Admin@12345'}`);
    console.log('--------------------------------------------------');
    console.log('Candidate Credentials:');
    console.log(`  Fresher:     fresher@jobmate.com / User@12345`);
    console.log(`  Experienced: experienced@jobmate.com / User@12345`);
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
