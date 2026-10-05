const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Company = require('../models/Company');
const Job = require('../models/Job');
const User = require('../models/User');

const jobsData = [
  {
    "jobId": "JOB1001",
    "jobTitle": "Software Engineer - Fresher",
    "jobCategory": "Software Engineering",
    "company": "TechNova Solutions",
    "companyLogoUrl": "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&h=128&fit=crop&crop=faces",
    "description": "We are looking for a motivated Software Engineer - Fresher to join our technology team and build reliable, scalable solutions for our customers.",
    "keyResponsibilities": [
      "Design and develop software applications",
      "Write clean and maintainable code",
      "Debug and resolve technical issues",
      "Collaborate with cross-functional teams"
    ],
    "candidateRequirements": [
      "Strong programming fundamentals",
      "Good problem-solving skills",
      "Knowledge of version control",
      "Ability to work in a team"
    ],
    "requiredSkills": "Java, Python, C++",
    "experienceLevel": "Fresher",
    "educationRequirement": "Any Degree",
    "salaryDisplay": "₹2.5 - ₹4 LPA",
    "location": "Chennai, Tamil Nadu",
    "jobType": "Internship",
    "workMode": "On-site",
    "numberOfVacancies": 1,
    "applicationDeadline": "2026-10-14",
    "jobStatus": "Active",
    "perksAndBenefits": "Health Insurance, Paid Leave, Learning Budget"
  },
  {
    "jobId": "JOB1002",
    "jobTitle": "Frontend Developer - Fresher",
    "jobCategory": "Frontend Development",
    "company": "CloudBridge Technologies",
    "companyLogoUrl": "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&h=128&fit=crop&crop=faces",
    "description": "Join our engineering team as a Frontend Developer - Fresher and work on modern products while collaborating with developers, designers, and business teams.",
    "keyResponsibilities": [
      "Build responsive user interfaces",
      "Develop reusable UI components",
      "Optimize application performance",
      "Collaborate with designers and backend developers"
    ],
    "candidateRequirements": [
      "Good understanding of web standards",
      "Responsive design knowledge",
      "JavaScript fundamentals",
      "Attention to UI details"
    ],
    "requiredSkills": "HTML, CSS, JavaScript, React.js",
    "experienceLevel": "Fresher",
    "educationRequirement": "B.E./B.Tech",
    "salaryDisplay": "₹3 - ₹5 LPA",
    "location": "Bengaluru, Karnataka",
    "jobType": "Full-time",
    "workMode": "Hybrid",
    "numberOfVacancies": 2,
    "applicationDeadline": "2026-10-15",
    "jobStatus": "Active",
    "perksAndBenefits": "Work From Home, Flexible Hours, Performance Bonus"
  },
  {
    "jobId": "JOB1003",
    "jobTitle": "Backend Developer - Fresher",
    "jobCategory": "Backend Development",
    "company": "NextGen Digital",
    "companyLogoUrl": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&h=128&fit=crop&crop=faces",
    "description": "We are hiring a Backend Developer - Fresher to develop high-quality applications, improve existing systems, and contribute to new product initiatives.",
    "keyResponsibilities": [
      "Develop RESTful APIs and backend services",
      "Design database interactions",
      "Implement authentication and authorization",
      "Monitor and improve API performance"
    ],
    "candidateRequirements": [
      "Understanding of server-side development",
      "Database knowledge",
      "API development experience",
      "Problem-solving skills"
    ],
    "requiredSkills": "Node.js, Express.js, Python, Java, REST API",
    "experienceLevel": "Fresher",
    "educationRequirement": "B.Sc./BCA",
    "salaryDisplay": "₹4 - ₹7 LPA",
    "location": "Hyderabad, Telangana",
    "jobType": "Full-time",
    "workMode": "Remote",
    "numberOfVacancies": 3,
    "applicationDeadline": "2026-10-16",
    "jobStatus": "Active",
    "perksAndBenefits": "Medical Insurance, Provident Fund, Annual Bonus"
  },
  {
    "jobId": "JOB1004",
    "jobTitle": "Full Stack Developer - Fresher",
    "jobCategory": "Full Stack Development",
    "company": "CodeCraft Labs",
    "companyLogoUrl": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&h=128&fit=crop&crop=faces",
    "description": "The selected candidate will work on real-world projects, follow engineering best practices, and help deliver secure and maintainable software.",
    "keyResponsibilities": [
      "Develop frontend and backend features",
      "Integrate APIs and databases",
      "Write reusable and testable code",
      "Participate in code reviews"
    ],
    "candidateRequirements": [
      "Understanding of frontend and backend development",
      "Database fundamentals",
      "REST API knowledge",
      "Good debugging skills"
    ],
    "requiredSkills": "React.js, Node.js, Express.js, MongoDB, JavaScript, REST API",
    "experienceLevel": "Fresher",
    "educationRequirement": "M.E./M.Tech",
    "salaryDisplay": "₹5 - ₹8 LPA",
    "location": "Pune, Maharashtra",
    "jobType": "Full-time",
    "workMode": "On-site",
    "numberOfVacancies": 4,
    "applicationDeadline": "2026-10-17",
    "jobStatus": "Active",
    "perksAndBenefits": "Flexible Working Hours, Training Programs, Team Outings"
  },
  {
    "jobId": "JOB1005",
    "jobTitle": "Data Scientist - Fresher",
    "jobCategory": "Data Science & AI",
    "company": "InnoSoft Systems",
    "companyLogoUrl": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&h=128&fit=crop&crop=faces",
    "description": "We are looking for a motivated Data Scientist - Fresher to join our technology team and build reliable, scalable solutions for our customers.",
    "keyResponsibilities": [
      "Analyze datasets and identify patterns",
      "Build and evaluate machine learning models",
      "Prepare data pipelines",
      "Communicate insights to stakeholders"
    ],
    "candidateRequirements": [
      "Strong Python fundamentals",
      "Basic statistics knowledge",
      "Understanding of data analysis",
      "Analytical thinking"
    ],
    "requiredSkills": "Python, Machine Learning, Pandas",
    "experienceLevel": "Fresher",
    "educationRequirement": "MCA",
    "salaryDisplay": "₹6 - ₹10 LPA",
    "location": "Mumbai, Maharashtra",
    "jobType": "Internship",
    "workMode": "Hybrid",
    "numberOfVacancies": 5,
    "applicationDeadline": "2026-10-18",
    "jobStatus": "Active",
    "perksAndBenefits": "Health Insurance, Internet Allowance, Paid Time Off"
  },
  {
    "jobId": "JOB1006",
    "jobTitle": "DevOps Engineer - Fresher",
    "jobCategory": "DevOps & Cloud",
    "company": "DataSphere Analytics",
    "companyLogoUrl": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=128&h=128&fit=crop&crop=faces",
    "description": "Join our engineering team as a DevOps Engineer - Fresher and work on modern products while collaborating with developers, designers, and business teams.",
    "keyResponsibilities": [
      "Maintain CI/CD pipelines",
      "Deploy applications to cloud environments",
      "Monitor infrastructure and services",
      "Automate deployment and operational tasks"
    ],
    "candidateRequirements": [
      "Linux fundamentals",
      "Cloud platform knowledge",
      "Networking basics",
      "Automation mindset"
    ],
    "requiredSkills": "AWS, Docker, Kubernetes, Linux",
    "experienceLevel": "Fresher",
    "educationRequirement": "Bachelor's Degree",
    "salaryDisplay": "₹8 - ₹12 LPA",
    "location": "Coimbatore, Tamil Nadu",
    "jobType": "Full-time",
    "workMode": "Remote",
    "numberOfVacancies": 6,
    "applicationDeadline": "2026-10-19",
    "jobStatus": "Active",
    "perksAndBenefits": "Certification Support, Mentorship, Career Growth"
  },
  {
    "jobId": "JOB1007",
    "jobTitle": "Android Developer - Fresher",
    "jobCategory": "Mobile App Development",
    "company": "PixelWave Technologies",
    "companyLogoUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop&crop=faces",
    "description": "We are hiring a Android Developer - Fresher to develop high-quality applications, improve existing systems, and contribute to new product initiatives.",
    "keyResponsibilities": [
      "Build and maintain mobile applications",
      "Integrate APIs and third-party services",
      "Optimize application performance",
      "Test applications across devices"
    ],
    "candidateRequirements": [
      "Mobile development fundamentals",
      "API integration knowledge",
      "UI implementation skills",
      "Debugging skills"
    ],
    "requiredSkills": "Flutter, Dart, Android, Kotlin, React Native",
    "experienceLevel": "Fresher",
    "educationRequirement": "Any Degree",
    "salaryDisplay": "₹10 - ₹15 LPA",
    "location": "Noida, Uttar Pradesh",
    "jobType": "Full-time",
    "workMode": "On-site",
    "numberOfVacancies": 7,
    "applicationDeadline": "2026-10-20",
    "jobStatus": "Active",
    "perksAndBenefits": "Meal Allowance, Transport Support, Paid Leave"
  },
  {
    "jobId": "JOB1008",
    "jobTitle": "UI/UX Designer - Fresher",
    "jobCategory": "UI/UX Design",
    "company": "BlueOrbit Solutions",
    "companyLogoUrl": "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=128&h=128&fit=crop&crop=faces",
    "description": "The selected candidate will work on real-world projects, follow engineering best practices, and help deliver secure and maintainable software.",
    "keyResponsibilities": [
      "Create wireframes and prototypes",
      "Conduct user research",
      "Design intuitive interfaces",
      "Maintain consistent design systems"
    ],
    "candidateRequirements": [
      "Strong visual design sense",
      "Portfolio of design work",
      "Proficiency in design tools",
      "Understanding of usability principles"
    ],
    "requiredSkills": "Figma, Wireframing, Prototyping, User Research, Design Systems, Adobe XD",
    "experienceLevel": "Fresher",
    "educationRequirement": "B.E./B.Tech",
    "salaryDisplay": "₹12 - ₹18 LPA",
    "location": "Gurugram, Haryana",
    "jobType": "Full-time",
    "workMode": "Hybrid",
    "numberOfVacancies": 8,
    "applicationDeadline": "2026-10-21",
    "jobStatus": "Active",
    "perksAndBenefits": "ESOPs, Health Insurance, Flexible Work Schedule"
  },
  {
    "jobId": "JOB1009",
    "jobTitle": "QA Engineer - Fresher",
    "jobCategory": "Quality Assurance & Testing",
    "company": "ApexByte Technologies",
    "companyLogoUrl": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&h=128&fit=crop&crop=faces",
    "description": "We are looking for a motivated QA Engineer - Fresher to join our technology team and build reliable, scalable solutions for our customers.",
    "keyResponsibilities": [
      "Create and execute test cases",
      "Perform functional and regression testing",
      "Automate repetitive test scenarios",
      "Report and track software defects"
    ],
    "candidateRequirements": [
      "Software testing fundamentals",
      "Attention to detail",
      "Bug reporting skills",
      "Basic automation knowledge"
    ],
    "requiredSkills": "Selenium, Cypress, Postman",
    "experienceLevel": "Fresher",
    "educationRequirement": "B.Sc./BCA",
    "salaryDisplay": "₹20,000 - ₹35,000/month",
    "location": "Kochi, Kerala",
    "jobType": "Internship",
    "workMode": "Remote",
    "numberOfVacancies": 1,
    "applicationDeadline": "2026-10-22",
    "jobStatus": "Active",
    "perksAndBenefits": "Health Insurance, Paid Leave, Learning Budget"
  },
  {
    "jobId": "JOB1010",
    "jobTitle": "Java Developer - Fresher",
    "jobCategory": "Software Engineering",
    "company": "Vertex Innovations",
    "companyLogoUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&h=128&fit=crop&crop=faces",
    "description": "Join our engineering team as a Java Developer - Fresher and work on modern products while collaborating with developers, designers, and business teams.",
    "keyResponsibilities": [
      "Design and develop software applications",
      "Write clean and maintainable code",
      "Debug and resolve technical issues",
      "Collaborate with cross-functional teams"
    ],
    "candidateRequirements": [
      "Strong programming fundamentals",
      "Good problem-solving skills",
      "Knowledge of version control",
      "Ability to work in a team"
    ],
    "requiredSkills": "Java, Python, C++, Git",
    "experienceLevel": "Fresher",
    "educationRequirement": "M.E./M.Tech",
    "salaryDisplay": "₹30,000 - ₹50,000/month",
    "location": "Madurai, Tamil Nadu",
    "jobType": "Full-time",
    "workMode": "On-site",
    "numberOfVacancies": 2,
    "applicationDeadline": "2026-10-23",
    "jobStatus": "Active",
    "perksAndBenefits": "Work From Home, Flexible Hours, Performance Bonus"
  },
  {
    "jobId": "JOB1011",
    "jobTitle": "React Developer - Fresher",
    "jobCategory": "Frontend Development",
    "company": "BrightStack Technologies",
    "companyLogoUrl": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=128&h=128&fit=crop&crop=faces",
    "description": "We are hiring a React Developer - Fresher to develop high-quality applications, improve existing systems, and contribute to new product initiatives.",
    "keyResponsibilities": [
      "Build responsive user interfaces",
      "Develop reusable UI components",
      "Optimize application performance",
      "Collaborate with designers and backend developers"
    ],
    "candidateRequirements": [
      "Good understanding of web standards",
      "Responsive design knowledge",
      "JavaScript fundamentals",
      "Attention to UI details"
    ],
    "requiredSkills": "HTML, CSS, JavaScript, React.js, TypeScript",
    "experienceLevel": "Fresher",
    "educationRequirement": "MCA",
    "salaryDisplay": "₹2.5 - ₹4 LPA",
    "location": "Trichy, Tamil Nadu",
    "jobType": "Full-time",
    "workMode": "Hybrid",
    "numberOfVacancies": 3,
    "applicationDeadline": "2026-10-24",
    "jobStatus": "Active",
    "perksAndBenefits": "Medical Insurance, Provident Fund, Annual Bonus"
  },
  {
    "jobId": "JOB1012",
    "jobTitle": "Node.js Developer - Fresher",
    "jobCategory": "Backend Development",
    "company": "DigitalCore Systems",
    "companyLogoUrl": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&h=128&fit=crop&crop=faces",
    "description": "The selected candidate will work on real-world projects, follow engineering best practices, and help deliver secure and maintainable software.",
    "keyResponsibilities": [
      "Develop RESTful APIs and backend services",
      "Design database interactions",
      "Implement authentication and authorization",
      "Monitor and improve API performance"
    ],
    "candidateRequirements": [
      "Understanding of server-side development",
      "Database knowledge",
      "API development experience",
      "Problem-solving skills"
    ],
    "requiredSkills": "Node.js, Express.js, Python, Java, REST API, MongoDB",
    "experienceLevel": "Fresher",
    "educationRequirement": "Bachelor's Degree",
    "salaryDisplay": "₹3 - ₹5 LPA",
    "location": "Delhi, India",
    "jobType": "Full-time",
    "workMode": "Remote",
    "numberOfVacancies": 4,
    "applicationDeadline": "2026-10-25",
    "jobStatus": "Active",
    "perksAndBenefits": "Flexible Working Hours, Training Programs, Team Outings"
  },
  {
    "jobId": "JOB1013",
    "jobTitle": "MERN Stack Developer - Fresher",
    "jobCategory": "Full Stack Development",
    "company": "SmartEdge Technologies",
    "companyLogoUrl": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&h=128&fit=crop&crop=faces",
    "description": "We are looking for a motivated MERN Stack Developer - Fresher to join our technology team and build reliable, scalable solutions for our customers.",
    "keyResponsibilities": [
      "Develop frontend and backend features",
      "Integrate APIs and databases",
      "Write reusable and testable code",
      "Participate in code reviews"
    ],
    "candidateRequirements": [
      "Understanding of frontend and backend development",
      "Database fundamentals",
      "REST API knowledge",
      "Good debugging skills"
    ],
    "requiredSkills": "React.js, Node.js, Express.js",
    "experienceLevel": "Fresher",
    "educationRequirement": "Any Degree",
    "salaryDisplay": "₹4 - ₹7 LPA",
    "location": "Ahmedabad, Gujarat",
    "jobType": "Internship",
    "workMode": "On-site",
    "numberOfVacancies": 5,
    "applicationDeadline": "2026-10-26",
    "jobStatus": "Active",
    "perksAndBenefits": "Health Insurance, Internet Allowance, Paid Time Off"
  },
  {
    "jobId": "JOB1014",
    "jobTitle": "Machine Learning Engineer - Fresher",
    "jobCategory": "Data Science & AI",
    "company": "FusionWorks India",
    "companyLogoUrl": "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=128&h=128&fit=crop&crop=faces",
    "description": "Join our engineering team as a Machine Learning Engineer - Fresher and work on modern products while collaborating with developers, designers, and business teams.",
    "keyResponsibilities": [
      "Analyze datasets and identify patterns",
      "Build and evaluate machine learning models",
      "Prepare data pipelines",
      "Communicate insights to stakeholders"
    ],
    "candidateRequirements": [
      "Strong Python fundamentals",
      "Basic statistics knowledge",
      "Understanding of data analysis",
      "Analytical thinking"
    ],
    "requiredSkills": "Python, Machine Learning, Pandas, NumPy",
    "experienceLevel": "Fresher",
    "educationRequirement": "B.E./B.Tech",
    "salaryDisplay": "₹5 - ₹8 LPA",
    "location": "Jaipur, Rajasthan",
    "jobType": "Full-time",
    "workMode": "Hybrid",
    "numberOfVacancies": 6,
    "applicationDeadline": "2026-10-27",
    "jobStatus": "Active",
    "perksAndBenefits": "Certification Support, Mentorship, Career Growth"
  },
  {
    "jobId": "JOB1015",
    "jobTitle": "Cloud Engineer - Fresher",
    "jobCategory": "DevOps & Cloud",
    "company": "QuantumSoft Labs",
    "companyLogoUrl": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=128&h=128&fit=crop&crop=faces",
    "description": "We are hiring a Cloud Engineer - Fresher to develop high-quality applications, improve existing systems, and contribute to new product initiatives.",
    "keyResponsibilities": [
      "Maintain CI/CD pipelines",
      "Deploy applications to cloud environments",
      "Monitor infrastructure and services",
      "Automate deployment and operational tasks"
    ],
    "candidateRequirements": [
      "Linux fundamentals",
      "Cloud platform knowledge",
      "Networking basics",
      "Automation mindset"
    ],
    "requiredSkills": "AWS, Docker, Kubernetes, Linux, CI/CD",
    "experienceLevel": "Fresher",
    "educationRequirement": "B.Sc./BCA",
    "salaryDisplay": "₹6 - ₹10 LPA",
    "location": "Remote - India",
    "jobType": "Full-time",
    "workMode": "Remote",
    "numberOfVacancies": 7,
    "applicationDeadline": "2026-10-28",
    "jobStatus": "Active",
    "perksAndBenefits": "Meal Allowance, Transport Support, Paid Leave"
  }
];

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobmate');
    console.log('MongoDB connected.');

    const admin = await User.findOne({ role: 'admin' }) || await User.findOne({});
    const adminId = admin ? admin._id : null;
    console.log('Using Admin User:', admin ? admin.email : 'None');

    const artifactJsonPath = 'C:\\Users\\vigne\\.gemini\\antigravity-ide\\brain\\ac42d71a-84f6-479a-8cc3-191499f69c25\\.user_uploaded\\media_1790664253346.json';
    let allJobs = [];

    if (fs.existsSync(artifactJsonPath)) {
      console.log('Reading from user uploaded artifact JSON...');
      const fileRaw = fs.readFileSync(artifactJsonPath, 'utf8');
      const parsed = JSON.parse(fileRaw);
      allJobs = Array.isArray(parsed) ? parsed : (parsed.jobs || [parsed]);
    } else {
      console.log('Artifact JSON not found, using base jobs list...');
      allJobs = jobsData;
    }

    console.log(`Processing ${allJobs.length} jobs...`);

    const companyMap = new Map();
    let companyCreated = 0;
    let jobCreated = 0;

    const companyLogos = {
      'TechNova Solutions': 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&h=128&fit=crop&crop=faces',
      'CloudBridge Technologies': 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&h=128&fit=crop&crop=faces',
      'NextGen Digital': 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&h=128&fit=crop&crop=faces',
      'CodeCraft Labs': 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&h=128&fit=crop&crop=faces',
      'InnoSoft Systems': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&h=128&fit=crop&crop=faces',
      'DataSphere Analytics': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=128&h=128&fit=crop&crop=faces',
      'PixelWave Technologies': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop&crop=faces',
      'BlueOrbit Solutions': 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=128&h=128&fit=crop&crop=faces',
      'ApexByte Technologies': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&h=128&fit=crop&crop=faces',
      'Vertex Innovations': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&h=128&fit=crop&crop=faces',
      'BrightStack Technologies': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=128&h=128&fit=crop&crop=faces',
      'DigitalCore Systems': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&h=128&fit=crop&crop=faces',
      'SmartEdge Technologies': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&h=128&fit=crop&crop=faces',
      'FusionWorks India': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=128&h=128&fit=crop&crop=faces',
      'QuantumSoft Labs': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=128&h=128&fit=crop&crop=faces'
    };

    const companyDescriptions = {
      'TechNova Solutions': 'TechNova Solutions is an industry-leading software and cloud engineering firm delivering transformative digital architectures worldwide.',
      'CloudBridge Technologies': 'CloudBridge Technologies specializes in hyperscale cloud architectures, modern DevOps pipelines, and enterprise frontend ecosystems.',
      'NextGen Digital': 'NextGen Digital powers scalable backend systems, microservice architectures, and modern cloud infrastructure for fast-growing companies.',
      'CodeCraft Labs': 'CodeCraft Labs is a high-growth product studio building next-generation web, mobile, and full-stack solutions with cutting-edge tech.',
      'InnoSoft Systems': 'InnoSoft Systems innovates at the intersection of AI, big data engineering, and modern enterprise software systems.',
      'DataSphere Analytics': 'DataSphere Analytics turns massive datasets into actionable enterprise intelligence with AI/ML, cloud data lakes, and analytics tools.',
      'PixelWave Technologies': 'PixelWave Technologies is a premier mobile and cross-platform application developer powering apps used by millions.',
      'BlueOrbit Solutions': 'BlueOrbit Solutions delivers human-centered UI/UX design, customer research, and world-class product interfaces.',
      'ApexByte Technologies': 'ApexByte Technologies is an elite software quality engineering, automated testing, and reliability assurance consultancy.',
      'Vertex Innovations': 'Vertex Innovations builds robust enterprise Java and cloud-native solutions for banking, fintech, and global logistics.',
      'BrightStack Technologies': 'BrightStack Technologies develops high-performance modern web applications with React, Next.js, and TypeScript.',
      'DigitalCore Systems': 'DigitalCore Systems provides foundational cloud-native backend infrastructure, API security, and high-availability database solutions.',
      'SmartEdge Technologies': 'SmartEdge Technologies creates edge-computing, IoT, and end-to-end full-stack web platforms for modern enterprises.',
      'FusionWorks India': 'FusionWorks India leads deep-tech AI engineering, predictive machine learning pipelines, and intelligent automation systems.',
      'QuantumSoft Labs': 'QuantumSoft Labs drives enterprise cloud migration, site reliability engineering, and zero-trust cloud infrastructure.'
    };

    const formatArray = (arr) => {
      if (Array.isArray(arr)) return arr;
      if (typeof arr === 'string') return arr.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
      return [];
    };

    for (const item of allJobs) {
      const compName = (item.companyName || item.company || 'TechCorp').trim();
      const cacheKey = compName.toLowerCase();

      let companyId;
      if (companyMap.has(cacheKey)) {
        companyId = companyMap.get(cacheKey);
      } else {
        let company = await Company.findOne({ name: new RegExp(`^${compName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
        const logo = companyLogos[compName] || item.companyLogoUrl || item.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&h=128&fit=crop&crop=faces';
        const description = companyDescriptions[compName] || item.companyDescription || `${compName} is a top employer empowering career growth and technical excellence.`;

        if (!company) {
          company = await Company.create({
            name: compName,
            logo: logo,
            industry: item.jobCategory || item.category || 'Information Technology',
            location: item.location || 'Bengaluru, India',
            website: `https://${compName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            employeeCount: '250-1000 employees',
            description: description,
            about: `${compName} is actively hiring passionate freshers and experienced professionals across India.`,
            foundedYear: 2017,
            createdBy: adminId
          });
          companyCreated++;
          console.log(`Created company: ${compName}`);
        } else {
          let updated = false;
          if (!company.logo || company.logo.includes('example.com')) {
            company.logo = logo;
            updated = true;
          }
          if (!company.description || company.description.length < 30) {
            company.description = description;
            updated = true;
          }
          if (updated) await company.save();
        }

        companyId = company._id;
        companyMap.set(cacheKey, companyId);
      }

      const title = item.jobTitle || item.title;
      const salaryDisplay = item.salaryDisplay || (typeof item.salary === 'string' ? item.salary : item.salary?.display) || 'Negotiable';
      const statusRaw = (item.jobStatus || item.status || 'active').toLowerCase();
      const status = ['active', 'inactive', 'closed'].includes(statusRaw) ? statusRaw : 'active';

      const existingJob = await Job.findOne({ title: title.trim(), company: companyId });
      if (!existingJob) {
        await Job.create({
          title: title.trim(),
          company: companyId,
          category: item.jobCategory || item.category || 'Software Engineering',
          description: item.description || `Exciting opportunity for ${title} at ${compName}.`,
          responsibilities: formatArray(item.keyResponsibilities || item.responsibilities || ['Develop and maintain software components', 'Collaborate with cross-functional teams']),
          requirements: formatArray(item.candidateRequirements || item.requirements || ['Degree in computer science or related field', 'Strong analytical mindset']),
          requiredSkills: formatArray(item.requiredSkills || item.skills || ['Problem Solving', 'Communication']),
          experience: item.experienceLevel || item.experience || 'Fresher',
          education: item.educationRequirement || item.education || 'Any Degree',
          salary: {
            display: salaryDisplay,
            min: 0,
            max: 0,
            currency: 'INR',
            period: 'per year',
            isNegotiable: true
          },
          location: item.location || 'Chennai, Tamil Nadu',
          jobType: item.jobType || 'Full-time',
          workMode: item.workMode || 'On-site',
          vacancies: Number(item.numberOfVacancies || item.vacancies) || 1,
          applicationDeadline: item.applicationDeadline ? new Date(item.applicationDeadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          companyLogo: companyLogos[compName] || item.companyLogoUrl || item.companyLogo || '',
          status: status,
          benefits: formatArray(item.perksAndBenefits || item.benefits || ['Health Insurance', 'Flexible Working Hours']),
          featured: Math.random() < 0.25,
          postedBy: adminId
        });
        jobCreated++;
      }
    }

    console.log(`\nDONE!`);
    console.log(`New Companies Created: ${companyCreated}`);
    console.log(`Total Companies in DB: ${await Company.countDocuments()}`);
    console.log(`New Jobs Created: ${jobCreated}`);
    console.log(`Total Jobs in DB: ${await Job.countDocuments()}`);

    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
}

runSeed();
