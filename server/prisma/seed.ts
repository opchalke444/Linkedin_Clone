import { PrismaClient, ProficiencyLevel, ReactionType, ConnectionStatus, NotificationType, OpportunityType, GroupRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database seeding for LinkedIn Clone (India Region Edition)...');

  // Clean existing data in reverse order of dependencies
  await prisma.opportunityApplication.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.report.deleteMany();
  await prisma.groupPost.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.post.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log('[Seed] Cleared existing data.');

  // Password hash for all demo users: "Password123!"
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  // 1. Create Skills
  const skillsData = [
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Python', category: 'Language' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Kubernetes', category: 'DevOps' },
    { name: 'AWS', category: 'Cloud' },
    { name: 'GraphQL', category: 'API' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Machine Learning', category: 'AI' },
    { name: 'UI/UX Design', category: 'Design' },
    { name: 'System Design', category: 'Architecture' },
    { name: 'Cybersecurity', category: 'Security' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Go', category: 'Backend' },
    { name: 'Rust', category: 'Systems' },
    { name: 'Kafka', category: 'Backend' },
    { name: 'Microservices', category: 'Architecture' },
    { name: 'CI/CD', category: 'DevOps' },
  ];

  const createdSkills: Record<string, any> = {};
  for (const s of skillsData) {
    createdSkills[s.name] = await prisma.skill.create({ data: s });
  }
  console.log(`[Seed] Created ${Object.keys(createdSkills).length} skills.`);

  // 2. Create 21 Users with Indian Profiles, Education, and Experience
  const rawUsers = [
    {
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      headline: 'Principal Software Architect | High-Scale Distributed Systems | ex-Flipkart, Swiggy',
      location: 'Bengaluru, Karnataka, India',
      avatarUrl: 'https://images.unsplash.com/photo-1549538281-a47acc208d37?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      about: 'Principal Architect with 8+ years designing high-throughput order management and payments infrastructure handling 100K+ requests/sec across Indian consumer platforms.',
      industry: 'Software Engineering',
      preferredRole: 'Principal Architect',
      portfolioUrl: 'https://aaravsharma.tech',
      githubUrl: 'https://github.com/aaravsharma',
      linkedinUrl: 'https://linkedin.com/in/aaravsharma',
      skills: ['System Design', 'Go', 'Node.js', 'PostgreSQL', 'Kafka', 'Docker', 'Kubernetes', 'Microservices'],
      educations: [
        { institution: 'IIT Bombay', degree: 'B.Tech', fieldOfStudy: 'Computer Science and Engineering', startYear: 2014, endYear: 2018, grade: '9.4 CGPA' }
      ],
      experiences: [
        { company: 'Swiggy', position: 'Principal Software Architect', location: 'Bengaluru, Karnataka', startDate: new Date('2022-04-01'), currentlyWorking: true, description: 'Architecting core checkout & real-time delivery tracking systems across 500+ Indian cities.' },
        { company: 'Flipkart', position: 'Staff Software Engineer', location: 'Bengaluru, Karnataka', startDate: new Date('2018-07-01'), endDate: new Date('2022-03-31'), currentlyWorking: false, description: 'Engineered Big Billion Days flash-sale inventory reservation engine.' }
      ]
    },
    {
      fullName: 'Priya Patel',
      email: 'priya.patel@example.com',
      headline: 'Staff Frontend Engineer & UX Architect | React, TypeScript & Design Systems | CRED',
      location: 'Mumbai, Maharashtra, India',
      avatarUrl: 'https://images.unsplash.com/photo-1758518729459-235dcaadc611?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      about: 'Crafting fluid, mathematically precise design systems and web experiences. Passionate about 60fps animations, accessible UI, and performance optimization on mobile.',
      industry: 'Internet & Web Technologies',
      preferredRole: 'Staff Frontend Engineer',
      githubUrl: 'https://github.com/priyapatel-dev',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'UI/UX Design', 'System Design'],
      educations: [
        { institution: 'IIT Delhi', degree: 'B.Tech', fieldOfStudy: 'Computer Science', startYear: 2016, endYear: 2020, grade: '9.1 CGPA' }
      ],
      experiences: [
        { company: 'CRED', position: 'Lead Frontend Engineer', location: 'Bengaluru / Mumbai', startDate: new Date('2021-08-01'), currentlyWorking: true, description: 'Leading web design system and credit rewards desktop portal.' },
        { company: 'Tata Digital', position: 'Senior UI Engineer', location: 'Mumbai, Maharashtra', startDate: new Date('2020-07-01'), endDate: new Date('2021-07-31'), currentlyWorking: false, description: 'Built super-app component primitives with TypeScript.' }
      ]
    },
    {
      fullName: 'Rohan Verma',
      email: 'rohan.verma@example.com',
      headline: 'Staff AI/ML Engineer | Generative AI, LLMs & Edge Inference | Microsoft IDC',
      location: 'Hyderabad, Telangana, India',
      avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&auto=format&fit=crop&q=80',
      about: 'Researcher and engineer building compact multilingual language models and low-latency inference runtimes for Indian languages at Microsoft India Development Centre.',
      industry: 'Artificial Intelligence',
      preferredRole: 'Principal Applied Scientist',
      skills: ['Python', 'Machine Learning', 'AWS', 'Docker', 'System Design'],
      educations: [
        { institution: 'IIIT Hyderabad', degree: 'B.Tech + M.S. by Research', fieldOfStudy: 'Computer Science & AI', startYear: 2015, endYear: 2020 }
      ],
      experiences: [
        { company: 'Microsoft India Development Centre (IDC)', position: 'Senior Applied Scientist', location: 'Hyderabad, Telangana', startDate: new Date('2021-06-01'), currentlyWorking: true, description: 'Developing multimodal reasoning and code generation models.' },
        { company: 'InMobi', position: 'Data Scientist II', location: 'Bengaluru, Karnataka', startDate: new Date('2020-01-01'), endDate: new Date('2021-05-31'), currentlyWorking: false, description: 'Engineered real-time ad bidding ML classifiers.' }
      ]
    },
    {
      fullName: 'Ananya Iyer',
      email: 'ananya.iyer@example.com',
      headline: 'Cloud Security Lead & DevSecOps Specialist | Kubernetes, AWS & FinTech Security | PhonePe',
      location: 'Pune, Maharashtra, India',
      avatarUrl: 'https://images.unsplash.com/photo-1758518729466-827cd8293992?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      about: 'Specializing in Zero-Trust cloud architectures, automated compliance, and payments security at scale for India’s top UPI provider.',
      industry: 'Information Security & FinTech',
      preferredRole: 'Lead Security Architect',
      skills: ['Cybersecurity', 'Kubernetes', 'Docker', 'AWS', 'Go', 'Python'],
      educations: [
        { institution: 'BITS Pilani', degree: 'B.E. (Hons)', fieldOfStudy: 'Computer Science', startYear: 2015, endYear: 2019 }
      ],
      experiences: [
        { company: 'PhonePe', position: 'Lead Security Engineer', location: 'Bengaluru / Pune', startDate: new Date('2021-09-01'), currentlyWorking: true, description: 'Securing multi-cloud microservices handling 250M+ daily UPI transactions.' },
        { company: 'Infosys Finacle', position: 'Information Security Consultant', location: 'Pune, Maharashtra', startDate: new Date('2019-07-01'), endDate: new Date('2021-08-31'), currentlyWorking: false, description: 'Vulnerability assessment and core banking penetration testing.' }
      ]
    },
    {
      fullName: 'Vikram Malhotra',
      email: 'vikram.malhotra@example.com',
      headline: 'VP of Engineering | Scaling Consumer Platforms & Technology Strategy | ex-Zomato',
      location: 'Gurugram, Haryana (Delhi NCR)',
      avatarUrl: 'https://images.unsplash.com/photo-1600878459138-e1123b37cb30?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      about: 'Engineering executive passionate about building high-performance tech cultures, scaling hyper-growth consumer platforms, and distributed systems resilience.',
      industry: 'Consumer Internet',
      preferredRole: 'VP of Engineering',
      skills: ['System Design', 'Microservices', 'Kafka', 'Go', 'PostgreSQL'],
      educations: [
        { institution: 'IIT Kanpur', degree: 'B.Tech', fieldOfStudy: 'Computer Science', startYear: 2011, endYear: 2015 }
      ],
      experiences: [
        { company: 'Zomato', position: 'VP of Engineering', location: 'Gurugram, Delhi NCR', startDate: new Date('2020-03-01'), currentlyWorking: true, description: 'Leading core engineering across food delivery, dining out, and rider dispatch.' }
      ]
    },
    {
      fullName: 'Neha Sundaram',
      email: 'neha.sundaram@example.com',
      headline: 'Director of Product Management | FinTech & Digital Payments (UPI / ONDC) | Razorpay',
      location: 'Bengaluru, Karnataka, India',
      avatarUrl: 'https://images.unsplash.com/photo-1726156619056-5de67024df67?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
      about: 'Driving FinTech product innovation across merchant payments, neo-banking, and cross-border settlement rails.',
      industry: 'Financial Technology',
      preferredRole: 'Director of Product',
      skills: ['System Design', 'UI/UX Design', 'Next.js'],
      educations: [
        { institution: 'IIM Bangalore', degree: 'MBA', fieldOfStudy: 'Strategy & Technology Management', startYear: 2017, endYear: 2019 },
        { institution: 'IIT Madras', degree: 'B.Tech', fieldOfStudy: 'Electrical Engineering', startYear: 2013, endYear: 2017 }
      ],
      experiences: [
        { company: 'Razorpay', position: 'Director of Product Management', location: 'Bengaluru, Karnataka', startDate: new Date('2021-05-01'), currentlyWorking: true, description: 'Scaling Razorpay Payment Gateway and UPI AutoPay suites.' }
      ]
    },
    {
      fullName: 'Karthik Raja',
      email: 'karthik.raja@example.com',
      headline: 'Senior Principal Architect | Go, PostgreSQL & Kafka | Freshworks',
      location: 'Chennai, Tamil Nadu, India',
      avatarUrl: 'https://images.unsplash.com/photo-1589386417686-0d34b5903d23?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
      about: 'SaaS architect building customer engagement platforms serving 60,000+ businesses globally from Chennai.',
      industry: 'Enterprise Software (SaaS)',
      preferredRole: 'Principal Architect',
      skills: ['Go', 'PostgreSQL', 'Kafka', 'System Design', 'Docker', 'Kubernetes'],
      educations: [
        { institution: 'NIT Trichy', degree: 'B.Tech', fieldOfStudy: 'Computer Science', startYear: 2013, endYear: 2017 }
      ],
      experiences: [
        { company: 'Freshworks', position: 'Senior Principal Architect', location: 'Chennai, Tamil Nadu', startDate: new Date('2021-02-01'), currentlyWorking: true, description: 'Omnichannel message queuing and multi-tenant database partitioning.' },
        { company: 'Zoho Corporation', position: 'Member Technical Staff', location: 'Chennai, Tamil Nadu', startDate: new Date('2017-06-01'), endDate: new Date('2021-01-31'), currentlyWorking: false, description: 'Distributed storage engine for Zoho CRM.' }
      ]
    },
    {
      fullName: 'Divya Nair',
      email: 'divya.nair@example.com',
      headline: 'Principal Data Scientist | Predictive Intelligence & Recommendation Engines | Jio',
      location: 'Bengaluru, Karnataka, India',
      avatarUrl: 'https://images.unsplash.com/photo-1547212371-eb5e6a4b590c?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop&q=80',
      about: 'Statistical modeler and data scientist designing hyper-personalized recommendation feeds for 450M+ telecom and digital consumers.',
      industry: 'Data Science & AI',
      preferredRole: 'Principal Data Scientist',
      skills: ['Python', 'Machine Learning', 'PostgreSQL', 'AWS'],
      educations: [
        { institution: 'Indian Statistical Institute (ISI) Kolkata', degree: 'M.Stat', fieldOfStudy: 'Mathematical Statistics', startYear: 2015, endYear: 2017 }
      ],
      experiences: [
        { company: 'Jio Platforms', position: 'Principal Data Scientist', location: 'Bengaluru / Navi Mumbai', startDate: new Date('2021-10-01'), currentlyWorking: true, description: 'Leading deep neural recommendation graph for JioCinema & JioCloud.' }
      ]
    },
    {
      fullName: 'Aditya Sen',
      email: 'aditya.sen@example.com',
      headline: 'Site Reliability & Infrastructure Lead | Terraform, Kubernetes & Chaos Engineering | Zerodha',
      location: 'Bengaluru, Karnataka, India',
      avatarUrl: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
      about: 'Keeping mission-critical stock trading infrastructure at 99.999% uptime with lean, self-hosted bare metal and private Kubernetes.',
      industry: 'Financial Technology & SRE',
      preferredRole: 'Lead SRE',
      skills: ['Kubernetes', 'Docker', 'AWS', 'Go', 'System Design', 'CI/CD'],
      educations: [
        { institution: 'Jadavpur University', degree: 'B.E.', fieldOfStudy: 'Computer Science', startYear: 2014, endYear: 2018 }
      ],
      experiences: [
        { company: 'Zerodha', position: 'Lead Infrastructure Engineer', location: 'Bengaluru, Karnataka', startDate: new Date('2020-04-01'), currentlyWorking: true, description: 'Managing Kite trading platform core gateways handling millions of orders on market open.' }
      ]
    },
    {
      fullName: 'Pooja Agarwal',
      email: 'pooja.agarwal@example.com',
      headline: 'Staff Product Designer | Design Systems, Micro-Interactions & Accessibility | Swiggy',
      location: 'Noida, Uttar Pradesh (Delhi NCR)',
      avatarUrl: 'https://images.unsplash.com/photo-1628726987013-db899232027c?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80',
      about: 'Passionate about Indian language accessibility, voice interfaces, and intuitive UX for Tier 2/3 city users.',
      industry: 'Design & User Experience',
      preferredRole: 'Staff Product Designer',
      skills: ['UI/UX Design', 'Tailwind CSS', 'React'],
      educations: [
        { institution: 'National Institute of Design (NID)', degree: 'M.Des', fieldOfStudy: 'Interaction Design', startYear: 2016, endYear: 2018 }
      ],
      experiences: [
        { company: 'Swiggy', position: 'Staff Product Designer', location: 'Gurugram / Bengaluru', startDate: new Date('2021-03-01'), currentlyWorking: true, description: 'Led design for Swiggy Instamart and One membership checkout.' }
      ]
    },
    {
      fullName: 'Siddharth Joshi',
      email: 'siddharth.joshi@example.com',
      headline: 'Senior Full-Stack Engineer | Next.js, TypeScript & GraphQL | Persistent',
      location: 'Pune, Maharashtra, India',
      avatarUrl: 'https://images.unsplash.com/photo-1752738372136-2602aaafdcb7?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
      about: 'Full-stack developer building enterprise web platforms with clean TypeScript, PostgreSQL, and modern React patterns.',
      industry: 'Information Technology',
      preferredRole: 'Senior Full-Stack Engineer',
      skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL'],
      educations: [
        { institution: 'COEP Technological University', degree: 'B.Tech', fieldOfStudy: 'Computer Engineering', startYear: 2017, endYear: 2021 }
      ],
      experiences: [
        { company: 'Persistent Systems', position: 'Senior Software Engineer', location: 'Pune, Maharashtra', startDate: new Date('2021-08-01'), currentlyWorking: true, description: 'Enterprise cloud migration for global healthcare customers.' }
      ]
    },
    {
      fullName: 'Meera Nambiar',
      email: 'meera.nambiar@example.com',
      headline: 'Engineering Manager | Developer Platforms & Cloud Tooling | InMobi',
      location: 'Kochi / Bengaluru, India',
      avatarUrl: 'https://images.unsplash.com/photo-1728141123512-87c415cecc9d?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      about: 'Leading distributed engineering teams building continuous deployment pipelines and developer productivity tooling.',
      industry: 'Advertising Technology',
      preferredRole: 'Engineering Manager',
      skills: ['CI/CD', 'Docker', 'Kubernetes', 'System Design'],
      educations: [
        { institution: 'NIT Calicut', degree: 'B.Tech', fieldOfStudy: 'Computer Science', startYear: 2012, endYear: 2016 }
      ],
      experiences: [
        { company: 'InMobi', position: 'Engineering Manager', location: 'Bengaluru, Karnataka', startDate: new Date('2022-01-01'), currentlyWorking: true, description: 'Managing 18 senior backend and platform engineers.' }
      ]
    },
    {
      fullName: 'Tanmay Kulkarni',
      email: 'tanmay.kulkarni@example.com',
      headline: 'Quantitative Developer & Algorithmic Systems Engineer | Low Latency C++ & Python',
      location: 'Mumbai, Maharashtra, India',
      avatarUrl: 'https://images.unsplash.com/photo-1756367245371-e96d12a55914?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80',
      about: 'Designing sub-microsecond algorithmic execution pipelines for NSE/BSE and global currency markets.',
      industry: 'Capital Markets & Quant Finance',
      preferredRole: 'Quantitative Developer',
      skills: ['Rust', 'Python', 'System Design', 'PostgreSQL'],
      educations: [
        { institution: 'IIT Bombay', degree: 'B.Tech', fieldOfStudy: 'Computer Science', startYear: 2016, endYear: 2020 }
      ],
      experiences: [
        { company: 'Tower Research Capital India', position: 'Quantitative Developer', location: 'Mumbai, Maharashtra', startDate: new Date('2020-08-01'), currentlyWorking: true, description: 'Optimizing low-latency order routing on national exchanges.' }
      ]
    },
    {
      fullName: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      headline: 'Application Security Specialist & Threat Hunter | Qualcomm India',
      location: 'Hyderabad, Telangana, India',
      avatarUrl: 'https://images.unsplash.com/photo-1742485244548-8f2ccab4b6b3?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
      about: 'AppSec engineer focused on firmware safety, embedded devices, and cryptographic protocol implementations.',
      industry: 'Semiconductors & Cybersecurity',
      preferredRole: 'Lead Security Engineer',
      skills: ['Cybersecurity', 'Python', 'Go', 'Docker'],
      educations: [
        { institution: 'Osmania University', degree: 'B.E.', fieldOfStudy: 'Information Technology', startYear: 2016, endYear: 2020 }
      ],
      experiences: [
        { company: 'Qualcomm India', position: 'Senior Security Specialist', location: 'Hyderabad, Telangana', startDate: new Date('2021-04-01'), currentlyWorking: true, description: 'Securing Snapdragon automotive and mobile software stacks.' }
      ]
    },
    {
      fullName: 'Arjun Kapoor',
      email: 'arjun.kapoor@example.com',
      headline: 'Head of Developer Ecosystems | Community & API Architecture | Postman India',
      location: 'Gurugram, Delhi NCR',
      avatarUrl: 'https://images.unsplash.com/photo-1741454851818-678e9d16b412?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
      about: 'Empowering millions of API developers across India and Southeast Asia to build robust REST and GraphQL services.',
      industry: 'Developer Tools',
      preferredRole: 'Head of Developer Relations',
      skills: ['GraphQL', 'Node.js', 'TypeScript', 'System Design'],
      educations: [
        { institution: 'Delhi University (SRCC)', degree: 'B.Com (Hons)', fieldOfStudy: 'Finance & Systems', startYear: 2014, endYear: 2017 }
      ],
      experiences: [
        { company: 'Postman', position: 'Lead Developer Advocate', location: 'Bengaluru / Gurugram', startDate: new Date('2020-02-01'), currentlyWorking: true, description: 'Building student developer communities and API certification curriculum.' }
      ]
    },
    {
      fullName: 'Shruti Deshmukh',
      email: 'shruti.deshmukh@example.com',
      headline: 'Senior DevOps & Kubernetes Engineer | Tata Consultancy Services (TCS Innovation Labs)',
      location: 'Pune, Maharashtra, India',
      avatarUrl: 'https://images.unsplash.com/photo-1758691737605-69a0e78bd193?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
      about: 'Automating multi-cloud CI/CD deployment pipelines and container security for enterprise customers.',
      industry: 'IT Services & Consulting',
      preferredRole: 'Senior Cloud Engineer',
      skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD'],
      educations: [
        { institution: 'Pune University (SPPU)', degree: 'B.E.', fieldOfStudy: 'Computer Engineering', startYear: 2017, endYear: 2021 }
      ],
      experiences: [
        { company: 'Tata Consultancy Services', position: 'DevOps Specialist', location: 'Pune, Maharashtra', startDate: new Date('2021-09-01'), currentlyWorking: true, description: 'Automating GitOps workflows with ArgoCD and Terraform.' }
      ]
    },
    {
      fullName: 'Nikhil Bansal',
      email: 'nikhil.bansal@example.com',
      headline: 'Tech Lead & Open Source Advocate | Distributed Caching & PostgreSQL | Flipkart',
      location: 'Chandigarh / Bengaluru, India',
      avatarUrl: 'https://images.unsplash.com/photo-1737574821698-862e77f044c1?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
      about: 'Leading search indexing and query optimization on Elasticsearch and PostgreSQL for Flipkart marketplace.',
      industry: 'E-Commerce',
      preferredRole: 'Tech Lead',
      skills: ['PostgreSQL', 'Node.js', 'System Design', 'Kafka'],
      educations: [
        { institution: 'Thapar Institute of Engineering & Technology', degree: 'B.Tech', fieldOfStudy: 'Computer Engineering', startYear: 2015, endYear: 2019 }
      ],
      experiences: [
        { company: 'Flipkart', position: 'Tech Lead (Search & Discovery)', location: 'Bengaluru, Karnataka', startDate: new Date('2021-01-01'), currentlyWorking: true, description: 'Architecting search ranking services indexing 200M+ catalog items.' }
      ]
    },
    {
      fullName: 'Ishita Roy',
      email: 'ishita.roy@example.com',
      headline: 'AI Researcher & NLP Engineer | Indian Multilingual Models & Speech AI | AI4Bharat',
      location: 'Kolkata, West Bengal, India',
      avatarUrl: 'https://images.unsplash.com/photo-1613943093160-3371121d7ed2?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      about: 'Building speech recognition and translation models for 22 scheduled Indian languages at AI4Bharat (IIT Madras Research Park).',
      industry: 'Artificial Intelligence & Research',
      preferredRole: 'AI Research Scientist',
      skills: ['Python', 'Machine Learning', 'Docker'],
      educations: [
        { institution: 'IIT Kharagpur', degree: 'B.Tech + M.Tech', fieldOfStudy: 'Computer Science', startYear: 2016, endYear: 2021 }
      ],
      experiences: [
        { company: 'AI4Bharat', position: 'Research Associate', location: 'Chennai / Kolkata', startDate: new Date('2021-08-01'), currentlyWorking: true, description: 'Leading IndicWav2Vec and multilingual speech datasets collection.' }
      ]
    },
    {
      fullName: 'Gaurav Mehta',
      email: 'gaurav.mehta@example.com',
      headline: 'Staff Mobile & Web Architect | React Native, Performance & Offline-First Apps | Paytm',
      location: 'Ahmedabad / Mumbai, India',
      avatarUrl: 'https://images.unsplash.com/photo-1782323709687-43675cbddd46?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      about: 'Building offline-first merchant payment soundbox and POS mobile apps with ultra-light memory footprints.',
      industry: 'Financial Technology',
      preferredRole: 'Mobile Architect',
      skills: ['React', 'TypeScript', 'Node.js', 'UI/UX Design'],
      educations: [
        { institution: 'DA-IICT Gandhinagar', degree: 'B.Tech', fieldOfStudy: 'Information and Communication Technology', startYear: 2015, endYear: 2019 }
      ],
      experiences: [
        { company: 'Paytm', position: 'Lead Mobile Architect', location: 'Noida / Ahmedabad', startDate: new Date('2021-06-01'), currentlyWorking: true, description: 'Optimized merchant app cold startup time to under 800ms.' }
      ]
    },
    {
      fullName: 'Rhea Chawla',
      email: 'rhea.chawla@example.com',
      headline: 'Director of Tech Talent Acquisition & Engineering Culture Specialist | MakeMyTrip',
      location: 'New Delhi, India',
      avatarUrl: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      about: 'Scaling engineering teams across India’s premier travel-tech and consumer platforms. Believer in merit-driven, diverse tech cultures.',
      industry: 'Human Resources & Tech Recruitment',
      preferredRole: 'Director of Talent',
      skills: ['System Design', 'UI/UX Design'],
      educations: [
        { institution: 'SIBM Pune', degree: 'MBA', fieldOfStudy: 'Human Resources', startYear: 2016, endYear: 2018 }
      ],
      experiences: [
        { company: 'MakeMyTrip', position: 'Director of Talent Acquisition', location: 'Gurugram, Delhi NCR', startDate: new Date('2021-04-01'), currentlyWorking: true, description: 'Heading campus hiring across top IITs/NITs and lateral senior engineering talent.' }
      ]
    },
    // Compatibility account for Alex Rivera
    {
      fullName: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      headline: 'VP of Engineering | Global Capability Centre (GCC) | Google India',
      location: 'Bengaluru, Karnataka, India',
      avatarUrl: 'https://images.unsplash.com/photo-1714328564923-d4826427c991?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      about: 'Engineering leader heading cloud platform solutions at Google India’s Bengaluru campus. Working closely with Indian tech startups.',
      industry: 'Software Engineering',
      preferredRole: 'VP of Engineering',
      portfolioUrl: 'https://alexrivera.dev',
      githubUrl: 'https://github.com/alexrivera',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Design', 'Docker', 'Kubernetes'],
      educations: [
        { institution: 'IIT Bombay', degree: 'B.Tech', fieldOfStudy: 'Computer Science', startYear: 2013, endYear: 2017 }
      ],
      experiences: [
        { company: 'Google India', position: 'VP of Engineering (Cloud Platform)', location: 'Bengaluru, Karnataka', startDate: new Date('2021-01-01'), currentlyWorking: true, description: 'Scaling enterprise cloud infrastructure and developer relations across India.' }
      ]
    }
  ];

  const createdUsers: Record<string, any> = {};

  for (const u of rawUsers) {
    const user = await prisma.user.create({
      data: {
        fullName: u.fullName,
        email: u.email,
        passwordHash,
        headline: u.headline,
        location: u.location,
        avatarUrl: u.avatarUrl,
        bannerUrl: u.bannerUrl,
        profile: {
          create: {
            about: u.about,
            industry: u.industry,
            preferredRole: u.preferredRole,
            portfolioUrl: (u as any).portfolioUrl || null,
            githubUrl: (u as any).githubUrl || null,
            linkedinUrl: (u as any).linkedinUrl || null,
            profileCompleteness: 90
          }
        },
        educations: {
          create: u.educations.map((e: any) => ({
            institution: e.institution,
            degree: e.degree,
            fieldOfStudy: e.fieldOfStudy,
            startYear: e.startYear,
            endYear: e.endYear || null,
            grade: e.grade || null
          }))
        },
        experiences: {
          create: u.experiences.map((exp: any) => ({
            company: exp.company,
            position: exp.position,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate || null,
            currentlyWorking: exp.currentlyWorking,
            description: exp.description
          }))
        }
      }
    });

    // Attach skills
    for (const skillName of u.skills) {
      const skillRecord = createdSkills[skillName];
      if (skillRecord) {
        await prisma.userSkill.create({
          data: {
            userId: user.id,
            skillId: skillRecord.id,
            proficiency: ProficiencyLevel.ADVANCED,
            endorsements: Math.floor(Math.random() * 12) + 2
          }
        });
      }
    }

    createdUsers[u.email] = user;
  }
  console.log(`[Seed] Created ${Object.keys(createdUsers).length} users with profiles, skills, and histories.`);

  // 3. Create realistic Indian connection relationships
  const aarav = createdUsers['aarav.sharma@example.com'];
  const userList = Object.values(createdUsers);
  let connectionCount = 0;

  // Accepted connections for Aarav
  for (let i = 1; i <= 10; i++) {
    const peer = userList[i];
    await prisma.connection.create({
      data: {
        senderId: aarav.id,
        receiverId: peer.id,
        status: ConnectionStatus.ACCEPTED
      }
    });
    connectionCount++;
  }

  // Pending incoming requests for Aarav
  for (let i = 11; i <= 13; i++) {
    const peer = userList[i];
    await prisma.connection.create({
      data: {
        senderId: peer.id,
        receiverId: aarav.id,
        status: ConnectionStatus.PENDING
      }
    });
    connectionCount++;
  }

  // Pending outgoing requests from Aarav
  for (let i = 14; i <= 15; i++) {
    const peer = userList[i];
    await prisma.connection.create({
      data: {
        senderId: aarav.id,
        receiverId: peer.id,
        status: ConnectionStatus.PENDING
      }
    });
    connectionCount++;
  }

  // Connections for Alex Rivera (for backward compatibility)
  const alex = createdUsers['alex.rivera@example.com'];
  if (alex) {
    for (let i = 1; i <= 8; i++) {
      try {
        await prisma.connection.create({
          data: {
            senderId: alex.id,
            receiverId: userList[i].id,
            status: ConnectionStatus.ACCEPTED
          }
        });
        connectionCount++;
      } catch (_) {}
    }
  }

  // Inter-peer connections among other users
  for (let i = 1; i < userList.length - 1; i++) {
    for (let j = i + 1; j < Math.min(i + 4, userList.length); j++) {
      try {
        await prisma.connection.create({
          data: {
            senderId: userList[i].id,
            receiverId: userList[j].id,
            status: ConnectionStatus.ACCEPTED
          }
        });
        connectionCount++;
      } catch (_) {}
    }
  }
  console.log(`[Seed] Created ${connectionCount} connection relationships.`);

  // 4. Create 30+ Realistic Indian Tech Posts with Comments and Reactions
  const postsData = [
    {
      authorEmail: 'aarav.sharma@example.com',
      content: '🚀 How we scaled Swiggy’s checkout pipeline during New Year’s Eve peak (over 12,000 orders per minute):\n\n1. Decoupled payment gateway webhooks using partitioned Kafka topics.\n2. Cached restaurant menu items in Redis clusters distributed across Bengaluru and Mumbai datacenters.\n3. Replaced synchronous inventory locking with optimistic reservation leases in PostgreSQL.\n\nResult: 99.998% success rate and P99 response time held steady under 85ms! Huge congratulations to the entire infra engineering team.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
      tags: '#highscale #systemdesign #distributedarchitecture #bengaluru #tech',
      reactions: ['priya.patel@example.com', 'rohan.verma@example.com', 'vikram.malhotra@example.com', 'neha.sundaram@example.com'],
      comments: [
        {
          authorEmail: 'priya.patel@example.com',
          content: '85ms P99 under 12k OPM is astonishing Aarav! Were you using Redis streams for webhook buffering?',
          reply: { authorEmail: 'aarav.sharma@example.com', content: 'Yes! Lightweight in-memory buffers in Go nodes with Redis cluster as the persistent backpressure tier.' }
        },
        {
          authorEmail: 'vikram.malhotra@example.com',
          content: 'Benchmark engineering at Indian consumer scale is truly world-class. Well done team!'
        }
      ]
    },
    {
      authorEmail: 'neha.sundaram@example.com',
      content: '🇮🇳 India’s digital payments milestone: UPI processed over 16.5 Billion transactions last month alone!\n\nWhat makes UPI truly fascinating from an engineering standpoint:\n• Zero chargeback disputes on real-time settlement rails.\n• Distributed NPCI switch operating with active-active disaster recovery across Hyderabad and Chennai.\n• Low-bandwidth resilience supporting feature phone UPI 123PAY in rural India.\n\nFinTech in India is setting the global gold standard.',
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1000&auto=format&fit=crop&q=80',
      tags: '#upi #fintech #digitalindia #razorpay #payments',
      reactions: ['aarav.sharma@example.com', 'ananya.iyer@example.com', 'tanmay.kulkarni@example.com'],
      comments: [
        {
          authorEmail: 'ananya.iyer@example.com',
          content: 'At PhonePe we are handling massive transaction surges every day. The low-latency cryptographic authentication layer is pure engineering art.'
        }
      ]
    },
    {
      authorEmail: 'rohan.verma@example.com',
      content: '🧠 Breakthrough in Multilingual Speech AI for India:\n\nOur latest experiments training 7B open weights on Indic speech datasets (Hindi, Tamil, Telugu, Marathi, and Bengali) achieved human parity in speech-to-intent classification at 1/10th the inference cost of proprietary cloud APIs.\n\nNext frontier: Real-time on-device voice assistance in Indian languages without needing a cloud roundtrip.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
      tags: '#ai #llms #indiclanguages #microsoft #hyderabad',
      reactions: ['ishita.roy@example.com', 'aarav.sharma@example.com', 'divya.nair@example.com'],
      comments: [
        {
          authorEmail: 'ishita.roy@example.com',
          content: 'Excited to see this Rohan! At AI4Bharat we are observing similar results with token-efficient acoustic encoders.'
        }
      ]
    },
    {
      authorEmail: 'priya.patel@example.com',
      content: '✨ Web Performance Tip for Indian Users on Mobile Networks:\n\nOver 65% of your mobile traffic in Tier-2/3 cities will experience intermittent 4G handoffs. If your bundle is 5MB of unoptimized JS, your bounce rate hits 40%.\n\n1. Lazy-load non-critical routes with React.lazy + Suspense.\n2. Serve responsive WebP/AVIF images through India-based CDN edge nodes (Mumbai, Chennai, Delhi).\n3. Keep First Contentful Paint (FCP) strictly under 1.2s.',
      imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80',
      tags: '#frontend #webperf #react #cred #ux',
      reactions: ['pooja.agarwal@example.com', 'gaurav.mehta@example.com', 'siddharth.joshi@example.com'],
      comments: [
        {
          authorEmail: 'pooja.agarwal@example.com',
          content: 'Speed is the ultimate UX feature. Users drop off immediately if checkout takes more than 2 seconds.'
        }
      ]
    },
    {
      authorEmail: 'karthik.raja@example.com',
      content: '💡 Engineering Lesson from Chennai SaaS ecosystem:\n\nBuilding profitable, resilient multi-tenant SaaS requires disciplined database architecture:\n• Logical tenant isolation with PostgreSQL Row-Level Security (RLS).\n• Asynchronous webhook queuing using Go worker pools and Kafka.\n• Zero downtime schema migrations with Prisma and expand-contract pattern.',
      tags: '#saas #freshworks #chennaitech #postgresql #golang',
      reactions: ['aarav.sharma@example.com', 'nikhil.bansal@example.com'],
      comments: []
    },
    {
      authorEmail: 'aditya.sen@example.com',
      content: '📈 What running Zerodha infrastructure taught me about simplicity:\n\nWe process millions of trades daily without bloated microservice sprawl. A clean Go backend + PostgreSQL + Redis on private bare metal in Mumbai delivers rock-solid stability and near-zero cloud wastage.\n\nDon’t adopt complex Kubernetes clusters until your business scale genuinely demands it.',
      tags: '#sre #zerodha #baremetal #systemarchitecture #bengaluru',
      reactions: ['aarav.sharma@example.com', 'tanmay.kulkarni@example.com', 'shruti.deshmukh@example.com'],
      comments: [
        {
          authorEmail: 'aarav.sharma@example.com',
          content: 'Huge respect for Zerodha’s lean tech philosophy Aditya! Boring technology that works consistently always beats overengineered hype.'
        }
      ]
    }
  ];

  const additionalTopics = [
    { authorEmail: 'ananya.iyer@example.com', content: '🔒 Always rotate your database credentials and verify SSL mTLS certificates before festival season sales in India. Prevention is always cheaper than mitigation.' },
    { authorEmail: 'vikram.malhotra@example.com', content: 'Hiring great engineers in Gurugram & Bengaluru: We value candidates who write clean, testable code and demonstrate genuine passion over candidates who memorized algorithm trivia.' },
    { authorEmail: 'divya.nair@example.com', content: 'Deploying recommendation graphs across 400M+ users requires strict feature store caching and low-dimensional vector embeddings.' },
    { authorEmail: 'pooja.agarwal@example.com', content: 'Designing for the next billion users in India means designing for one-thumb usage, multilingual typography, and high contrast under bright daylight.' },
    { authorEmail: 'tanmay.kulkarni@example.com', content: 'Low-latency C++ tip: Eliminate dynamic heap allocation inside your hot loops. Cache-friendly array structures will always outperform pointer chasing.' },
    { authorEmail: 'sneha.reddy@example.com', content: 'DevSecOps in Indian banking: Automated vulnerability scanning in GitLab/GitHub Actions before staging prevents 95% of security regressions.' },
    { authorEmail: 'arjun.kapoor@example.com', content: 'Bengaluru developer meetups are buzzing! Over 400 developers gathered this weekend for our Postman API architecture workshop.' },
    { authorEmail: 'shruti.deshmukh@example.com', content: 'Automated failover testing between AWS Mumbai (ap-south-1) and Hyderabad (ap-south-2) regions ensures total business continuity.' },
    { authorEmail: 'nikhil.bansal@example.com', content: 'PostgreSQL indexes: Always use composite indexes when filtering by tenantId + createdAt. Query execution drops from 400ms to 4ms.' },
    { authorEmail: 'ishita.roy@example.com', content: 'Speech recognition across diverse Indian dialects requires domain-specific acoustic model tuning. Open datasets are paving the way.' },
    { authorEmail: 'gaurav.mehta@example.com', content: 'React Native Hermes engine + Fabric architecture delivered 45% faster app startup for our merchant app across Tier 3 Android devices.' },
    { authorEmail: 'rhea.chawla@example.com', content: 'Campus hiring season 2026: Indian graduates from IITs, BITS, and NITs are displaying remarkable depth in cloud systems, LLMs, and open-source contributions.' },
    { authorEmail: 'aarav.sharma@example.com', content: 'To all engineering students: Build real projects that solve genuine local problems. Deploy them with PostgreSQL and React so recruiters can test them live.' }
  ];

  let postCount = 0;
  for (const p of [...postsData, ...additionalTopics]) {
    const author = createdUsers[p.authorEmail];
    if (!author) continue;

    const post = await prisma.post.create({
      data: {
        authorId: author.id,
        content: p.content,
        imageUrl: (p as any).imageUrl || null,
        tags: (p as any).tags || '#tech #career #india',
        likeCount: (p as any).reactions ? (p as any).reactions.length : Math.floor(Math.random() * 8) + 2,
        commentCount: (p as any).comments ? (p as any).comments.length : 0,
        shareCount: Math.floor(Math.random() * 6) + 1
      }
    });
    postCount++;

    // Add reactions
    if ((p as any).reactions) {
      for (const rxEmail of (p as any).reactions) {
        const u = createdUsers[rxEmail];
        if (u) {
          await prisma.reaction.create({
            data: {
              postId: post.id,
              userId: u.id,
              type: ReactionType.LIKE
            }
          });
        }
      }
    }

    // Add comments & replies
    if ((p as any).comments) {
      for (const c of (p as any).comments) {
        const commenter = createdUsers[c.authorEmail];
        if (commenter) {
          const comment = await prisma.comment.create({
            data: {
              postId: post.id,
              authorId: commenter.id,
              content: c.content
            }
          });

          if (c.reply) {
            const replier = createdUsers[c.reply.authorEmail];
            if (replier) {
              await prisma.comment.create({
                data: {
                  postId: post.id,
                  authorId: replier.id,
                  parentId: comment.id,
                  content: c.reply.content
                }
              });
            }
          }
        }
      }
    }
  }
  console.log(`[Seed] Created ${postCount} posts with reactions and comments.`);

  // 5. Create 5 Indian Professional Groups
  const groupsData = [
    {
      name: 'Bengaluru Tech Founders & Architects',
      slug: 'bengaluru-tech-founders',
      description: 'The premier network of technology founders, principal architects, and engineering leaders across Indiranagar, HSR Layout, Koramangala, and Outer Ring Road.',
      avatarUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      creatorEmail: 'aarav.sharma@example.com',
      members: ['aarav.sharma@example.com', 'priya.patel@example.com', 'neha.sundaram@example.com', 'aditya.sen@example.com', 'alex.rivera@example.com']
    },
    {
      name: 'India AI & Generative Intelligence Circle',
      slug: 'india-ai-circle',
      description: 'Discussing multimodal AI models, Indic language NLP, PyTorch runtimes, fine-tuning benchmarks, and synthetic datasets from Indian research labs.',
      avatarUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      creatorEmail: 'rohan.verma@example.com',
      members: ['rohan.verma@example.com', 'ishita.roy@example.com', 'divya.nair@example.com', 'aarav.sharma@example.com']
    },
    {
      name: 'FinTech & Payments India (UPI, ONDC & Digital Banking)',
      slug: 'fintech-payments-india',
      description: 'Dedicated to real-time payments engineering, UPI switch architecture, ONDC protocols, RBI regulatory frameworks, and fraud detection systems.',
      avatarUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
      creatorEmail: 'neha.sundaram@example.com',
      members: ['neha.sundaram@example.com', 'ananya.iyer@example.com', 'tanmay.kulkarni@example.com', 'aarav.sharma@example.com']
    },
    {
      name: 'React & Frontend India Engineering Guild',
      slug: 'react-frontend-india',
      description: 'Frontend performance on Indian mobile networks, design system tokens, Next.js App Router, micro-frontends, and accessible user experiences.',
      avatarUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&auto=format&fit=crop&q=80',
      creatorEmail: 'priya.patel@example.com',
      members: ['priya.patel@example.com', 'pooja.agarwal@example.com', 'siddharth.joshi@example.com', 'gaurav.mehta@example.com']
    },
    {
      name: 'Delhi NCR & Gurugram Startup Network',
      slug: 'delhi-ncr-startups',
      description: 'Connecting product leaders, engineering directors, and venture operators across Cyber City Gurugram, Noida, and New Delhi.',
      avatarUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
      creatorEmail: 'vikram.malhotra@example.com',
      members: ['vikram.malhotra@example.com', 'arjun.kapoor@example.com', 'rhea.chawla@example.com', 'pooja.agarwal@example.com']
    }
  ];

  for (const g of groupsData) {
    const creator = createdUsers[g.creatorEmail];
    const group = await prisma.group.create({
      data: {
        name: g.name,
        slug: g.slug,
        description: g.description,
        avatarUrl: g.avatarUrl,
        bannerUrl: g.bannerUrl,
        creatorId: creator.id,
        memberCount: g.members.length
      }
    });

    for (const memberEmail of g.members) {
      const u = createdUsers[memberEmail];
      if (u) {
        await prisma.groupMember.create({
          data: {
            groupId: group.id,
            userId: u.id,
            role: memberEmail === g.creatorEmail ? GroupRole.ADMIN : GroupRole.MEMBER
          }
        });
      }
    }

    // Add sample group post
    await prisma.groupPost.create({
      data: {
        groupId: group.id,
        authorId: creator.id,
        content: `Welcome to the official ${g.name} community! Introduce yourself, share what you are building, and discuss technology innovations in India.`
      }
    });
  }
  console.log(`[Seed] Created ${groupsData.length} professional Indian tech groups.`);

  // 6. Create Indian Conversations & Messages
  const priya = createdUsers['priya.patel@example.com'];
  const rohan = createdUsers['rohan.verma@example.com'];

  // Conversation 1: Aarav & Priya
  const conv1 = await prisma.conversation.create({
    data: {
      user1Id: aarav.id,
      user2Id: priya.id,
      lastMessageAt: new Date()
    }
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        senderId: priya.id,
        receiverId: aarav.id,
        content: 'Hi Aarav! Loved your writeup on Swiggy’s New Year order peak scaling. Truly inspiring.',
        createdAt: new Date(Date.now() - 3600000 * 3)
      },
      {
        conversationId: conv1.id,
        senderId: aarav.id,
        receiverId: priya.id,
        content: 'Thanks Priya! Appreciate it. How is the CRED web design system migration progressing?',
        createdAt: new Date(Date.now() - 3600000 * 2)
      },
      {
        conversationId: conv1.id,
        senderId: priya.id,
        receiverId: aarav.id,
        content: 'Going great! We just cut down our initial JavaScript bundle by 42% using dynamic route chunking. Would love to catch up in Bengaluru next week!',
        createdAt: new Date(Date.now() - 3600000 * 1)
      }
    ]
  });

  // Conversation 2: Aarav & Rohan
  const conv2 = await prisma.conversation.create({
    data: {
      user1Id: aarav.id,
      user2Id: rohan.id,
      lastMessageAt: new Date()
    }
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv2.id,
        senderId: rohan.id,
        receiverId: aarav.id,
        content: 'Hey Aarav, are you attending the Bengaluru Tech Summit keynote next month?',
        createdAt: new Date(Date.now() - 7200000)
      },
      {
        conversationId: conv2.id,
        senderId: aarav.id,
        receiverId: rohan.id,
        content: 'Yes! I will be participating in the panel on distributed systems and sovereign cloud infrastructure. Let us grab lunch there!',
        createdAt: new Date(Date.now() - 3600000)
      }
    ]
  });
  console.log('[Seed] Created active conversations and message histories.');

  // 7. Create Notifications for Aarav Sharma
  await prisma.notification.createMany({
    data: [
      {
        recipientId: aarav.id,
        actorId: priya.id,
        type: NotificationType.POST_REACTION,
        referenceId: 'post-1',
        isRead: false
      },
      {
        recipientId: aarav.id,
        actorId: rohan.id,
        type: NotificationType.POST_COMMENT,
        referenceId: 'post-1',
        isRead: false
      },
      {
        recipientId: aarav.id,
        actorId: createdUsers['neha.sundaram@example.com'].id,
        type: NotificationType.CONNECTION_REQUEST,
        referenceId: 'conn-1',
        isRead: false
      },
      {
        recipientId: aarav.id,
        actorId: createdUsers['vikram.malhotra@example.com'].id,
        type: NotificationType.CONNECTION_ACCEPTED,
        referenceId: 'conn-2',
        isRead: true
      },
      {
        recipientId: aarav.id,
        actorId: priya.id,
        type: NotificationType.MESSAGE_RECEIVED,
        referenceId: conv1.id,
        isRead: false
      }
    ]
  });
  console.log('[Seed] Created realistic notification feeds.');

  // 8. Create 6 High-Quality Opportunities for Indian Region (₹ Lakhs per Annum / Stipend)
  const opportunitiesData = [
    {
      title: 'Senior Backend Engineer (Payments & Core Banking)',
      company: 'Razorpay',
      location: 'Bengaluru, Karnataka (Hybrid)',
      type: OpportunityType.FULL_TIME,
      description: 'Join Razorpay’s Core Payments switch team. You will build high-concurrency microservices handling thousands of payment transactions per second with Node.js, Go, PostgreSQL, and Kafka.',
      requiredSkills: 'Node.js, PostgreSQL, Go, Docker, System Design',
      experienceLevel: 'Senior Level (4-7 Yrs)',
      stipend: '₹32,00,000 - ₹48,00,000 / year (32-48 LPA)'
    },
    {
      title: 'Staff Frontend Engineer (Consumer Platform)',
      company: 'CRED',
      location: 'Bengaluru, Karnataka (In-Office)',
      type: OpportunityType.FULL_TIME,
      description: 'Architect beautiful, responsive web experiences for CRED members. Work with React, TypeScript, Next.js, and design tokens to create frictionless financial journeys.',
      requiredSkills: 'React, TypeScript, Next.js, Tailwind CSS, UI/UX Design',
      experienceLevel: 'Staff Level (6+ Yrs)',
      stipend: '₹38,00,000 - ₹55,00,000 / year (38-55 LPA)'
    },
    {
      title: 'Generative AI Research Fellow',
      company: 'Microsoft India Development Centre (IDC)',
      location: 'Hyderabad, Telangana',
      type: OpportunityType.PROJECT,
      description: 'Collaborate with principal researchers in Hyderabad on multimodal AI, Indic language synthesis, and parameter-efficient fine-tuning (PEFT) pipelines.',
      requiredSkills: 'Python, Machine Learning, Docker, AWS',
      experienceLevel: 'Graduate / Fellow',
      stipend: '₹24,00,000 - ₹36,00,000 / year (24-36 LPA)'
    },
    {
      title: 'Cloud Infrastructure & SRE Architect',
      company: 'Swiggy',
      location: 'Bengaluru, Karnataka (Remote Friendly)',
      type: OpportunityType.FULL_TIME,
      description: 'Architect multi-region Kubernetes cloud infrastructure powering food delivery, grocery, and dining across 500+ Indian cities. Deep dive into Kafka, Terraform, and zero-downtime failover.',
      requiredSkills: 'Kubernetes, Docker, AWS, CI/CD, System Design',
      experienceLevel: 'Lead / Principal',
      stipend: '₹30,00,000 - ₹45,00,000 / year (30-45 LPA)'
    },
    {
      title: 'Full-Stack Developer Intern (Summer 2026)',
      company: 'Zerodha',
      location: 'Bengaluru, Karnataka (Hybrid)',
      type: OpportunityType.INTERNSHIP,
      description: 'Build fast, accessible web interfaces for India’s largest stock brokerage. Learn about low-latency websockets, financial compliance, and clean Go and PostgreSQL architecture.',
      requiredSkills: 'React, TypeScript, Go, PostgreSQL',
      experienceLevel: 'Pre-final / Final Year Intern',
      stipend: '₹65,000 - ₹90,000 / month (Internship + PPO)'
    },
    {
      title: 'Application Security Engineer',
      company: 'PhonePe',
      location: 'Pune / Bengaluru, India',
      type: OpportunityType.FULL_TIME,
      description: 'Audit critical UPI payments microservices, build automated security scanners, conduct red-team threat modeling, and enforce zero-trust authentication policies.',
      requiredSkills: 'Cybersecurity, Python, Docker, Go',
      experienceLevel: 'Mid-Level (3-5 Yrs)',
      stipend: '₹26,00,000 - ₹40,00,000 / year (26-40 LPA)'
    }
  ];

  for (const opp of opportunitiesData) {
    await prisma.opportunity.create({ data: opp });
  }
  console.log(`[Seed] Created ${opportunitiesData.length} opportunities for Opportunity Matching engine in India.`);

  console.log('[Seed] Database seeding completed successfully! All Indian region entities populated.');
}

main()
  .catch((e) => {
    console.error('[Seed] Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
