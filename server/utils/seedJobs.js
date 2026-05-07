const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Job = require('../models/Job');

dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const jobs = [
  {
    title: 'Frontend Engineer, React Platform',
    company: 'NovaStack Labs',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salaryRange: '$135,000 - $175,000',
    description: 'Build polished candidate-facing workflows for a hiring intelligence platform used by thousands of recruiters. You will own React components, state management, performance budgets, and accessibility improvements. The team ships weekly and pairs closely with design and data science.',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Accessibility'],
    experienceLevel: 'Mid'
  },
  {
    title: 'Backend Engineer, Node Services',
    company: 'RelayWorks',
    location: 'Austin, TX',
    type: 'Full-time',
    salaryRange: '$125,000 - $165,000',
    description: 'Design and scale Express and MongoDB services powering workflow automation for remote teams. You will build secure APIs, optimize data access patterns, and improve observability across production workloads. Strong ownership and pragmatic architecture are valued.',
    requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'Docker'],
    experienceLevel: 'Mid'
  },
  {
    title: 'Full Stack Developer',
    company: 'BrightPath Health',
    location: 'Remote',
    type: 'Remote',
    salaryRange: '$110,000 - $150,000',
    description: 'Create patient engagement tools used by care teams and members. The role spans React dashboards, Node APIs, database modeling, and production support. You will collaborate with product managers to turn complex clinical workflows into reliable software.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express.js', 'HTML', 'CSS', 'Testing'],
    experienceLevel: 'Mid'
  },
  {
    title: 'Senior Software Engineer, Python',
    company: 'QuantForge Analytics',
    location: 'New York, NY',
    type: 'Full-time',
    salaryRange: '$160,000 - $215,000',
    description: 'Lead backend development for financial analytics products with demanding data workloads. You will build Python services, model market data, and guide system design for resilient APIs. The team values clear technical writing and measured delivery.',
    requiredSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'System Design', 'AWS'],
    experienceLevel: 'Senior'
  },
  {
    title: 'Go Backend Engineer',
    company: 'TraceGrid',
    location: 'Seattle, WA',
    type: 'Full-time',
    salaryRange: '$145,000 - $190,000',
    description: 'Develop high-throughput event processing systems for infrastructure telemetry. You will write Go services, tune Kafka consumers, and build APIs that help engineers diagnose incidents quickly. This role has a strong emphasis on reliability and clean interfaces.',
    requiredSkills: ['Go', 'Kafka', 'Kubernetes', 'PostgreSQL', 'Microservices', 'Observability'],
    experienceLevel: 'Senior'
  },
  {
    title: 'Junior React Developer',
    company: 'MarketMuse Studio',
    location: 'Chicago, IL',
    type: 'Full-time',
    salaryRange: '$78,000 - $98,000',
    description: 'Support the development of campaign planning tools for marketing teams. You will implement React views, fix UI bugs, and learn production practices from senior engineers. This is a strong role for someone with excellent fundamentals and curiosity.',
    requiredSkills: ['React', 'JavaScript', 'CSS', 'Git', 'REST APIs'],
    experienceLevel: 'Entry'
  },
  {
    title: 'Machine Learning Engineer',
    company: 'SignalNest AI',
    location: 'Boston, MA',
    type: 'Full-time',
    salaryRange: '$150,000 - $205,000',
    description: 'Build ranking and recommendation systems for enterprise search. You will train models, evaluate retrieval quality, and deploy inference services to production. The role sits at the intersection of applied ML and distributed backend engineering.',
    requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'NLP', 'Vector Search', 'AWS'],
    experienceLevel: 'Senior'
  },
  {
    title: 'Data Scientist',
    company: 'CivicPulse',
    location: 'Washington, DC',
    type: 'Full-time',
    salaryRange: '$115,000 - $155,000',
    description: 'Turn public policy and engagement data into decision-ready insights. You will define metrics, build predictive models, and communicate results to cross-functional stakeholders. The work requires rigor, empathy, and a sharp eye for data quality.',
    requiredSkills: ['Python', 'SQL', 'Statistics', 'Pandas', 'Machine Learning', 'Tableau'],
    experienceLevel: 'Mid'
  },
  {
    title: 'ML Research Engineer',
    company: 'LumenMind',
    location: 'Palo Alto, CA',
    type: 'Full-time',
    salaryRange: '$180,000 - $250,000',
    description: 'Prototype and evaluate generative AI systems for technical knowledge work. You will design experiments, improve model evaluation pipelines, and translate research papers into production-grade ideas. Strong coding and experimental discipline are essential.',
    requiredSkills: ['Python', 'Deep Learning', 'Transformers', 'LLMs', 'PyTorch', 'Evaluation'],
    experienceLevel: 'Senior'
  },
  {
    title: 'DevOps Engineer',
    company: 'Northstar Commerce',
    location: 'Denver, CO',
    type: 'Full-time',
    salaryRange: '$120,000 - $160,000',
    description: 'Improve delivery pipelines and cloud reliability for a fast-growing commerce platform. You will manage Kubernetes clusters, infrastructure as code, monitoring, and release automation. The team looks for practical automation and calm incident response.',
    requiredSkills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'Linux'],
    experienceLevel: 'Mid'
  },
  {
    title: 'Cloud Platform Engineer',
    company: 'BlueHarbor FinTech',
    location: 'Remote',
    type: 'Remote',
    salaryRange: '$140,000 - $185,000',
    description: 'Create secure cloud foundations for regulated financial products. You will build reusable infrastructure modules, harden networking, and partner with application teams on deployment patterns. Compliance awareness and clear documentation matter here.',
    requiredSkills: ['AWS', 'Terraform', 'Security', 'Kubernetes', 'Networking', 'Python'],
    experienceLevel: 'Senior'
  },
  {
    title: 'Product Manager, Growth',
    company: 'SkillBridge',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    salaryRange: '$125,000 - $170,000',
    description: 'Own activation and retention for a career learning marketplace. You will define experiments, work with design and engineering, and use analytics to prioritize roadmap decisions. This role rewards strong product judgment and crisp communication.',
    requiredSkills: ['Product Strategy', 'Analytics', 'SQL', 'A/B Testing', 'Roadmapping', 'User Research'],
    experienceLevel: 'Mid'
  },
  {
    title: 'Senior Product Manager, AI Tools',
    company: 'HelioWorks',
    location: 'New York, NY',
    type: 'Full-time',
    salaryRange: '$155,000 - $210,000',
    description: 'Lead an AI productivity product from discovery through launch. You will shape the product vision, define evaluation metrics, and partner with ML and platform teams. Successful candidates balance ambition with strong execution habits.',
    requiredSkills: ['Product Strategy', 'AI Products', 'User Research', 'Analytics', 'Roadmapping', 'Stakeholder Management'],
    experienceLevel: 'Senior'
  },
  {
    title: 'UI/UX Designer',
    company: 'Craftline Systems',
    location: 'Portland, OR',
    type: 'Full-time',
    salaryRange: '$95,000 - $130,000',
    description: 'Design interfaces for operations teams managing complex supply chains. You will conduct user research, build prototypes, and refine design systems with engineers. The product needs calm, efficient workflows rather than flashy marketing screens.',
    requiredSkills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Accessibility', 'Interaction Design'],
    experienceLevel: 'Mid'
  },
  {
    title: 'UX Researcher',
    company: 'CareRoute',
    location: 'Remote',
    type: 'Remote',
    salaryRange: '$100,000 - $135,000',
    description: 'Plan and conduct research for digital care coordination products. You will synthesize interviews, usability studies, and behavioral data into actionable product recommendations. Clear storytelling and ethical research practices are central to this role.',
    requiredSkills: ['User Research', 'Usability Testing', 'Survey Design', 'Figma', 'Analytics', 'Stakeholder Management'],
    experienceLevel: 'Mid'
  },
  {
    title: 'Java Backend Engineer',
    company: 'Atlas Retail Group',
    location: 'Dallas, TX',
    type: 'Full-time',
    salaryRange: '$118,000 - $158,000',
    description: 'Build inventory and fulfillment services for a national retail platform. You will work on Java APIs, event-driven services, and database performance. The team is modernizing legacy systems while keeping business-critical flows stable.',
    requiredSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'REST APIs', 'Microservices'],
    experienceLevel: 'Mid'
  },
  {
    title: 'Entry Level Data Analyst',
    company: 'GreenLeaf Energy',
    location: 'Nashville, TN',
    type: 'Full-time',
    salaryRange: '$68,000 - $85,000',
    description: 'Analyze operational and customer data for a renewable energy provider. You will prepare dashboards, validate data sources, and help teams understand performance trends. This role is ideal for someone with strong SQL and careful analytical habits.',
    requiredSkills: ['SQL', 'Excel', 'Tableau', 'Statistics', 'Data Cleaning'],
    experienceLevel: 'Entry'
  },
  {
    title: 'React Native Engineer',
    company: 'StrideFit',
    location: 'Remote',
    type: 'Remote',
    salaryRange: '$115,000 - $155,000',
    description: 'Create mobile fitness experiences used by coaches and athletes. You will build React Native features, integrate APIs, and improve app performance. The role requires empathy for mobile UX and disciplined release practices.',
    requiredSkills: ['React Native', 'JavaScript', 'TypeScript', 'REST APIs', 'Mobile Performance', 'Testing'],
    experienceLevel: 'Mid'
  },
  {
    title: 'Security Engineer',
    company: 'VaultSpan',
    location: 'Atlanta, GA',
    type: 'Full-time',
    salaryRange: '$135,000 - $180,000',
    description: 'Protect cloud applications serving enterprise customers. You will conduct threat modeling, improve identity controls, and automate security checks in CI/CD. The team partners closely with engineering and customer trust.',
    requiredSkills: ['Security', 'AWS', 'Threat Modeling', 'Python', 'CI/CD', 'SIEM'],
    experienceLevel: 'Senior'
  },
  {
    title: 'QA Automation Engineer',
    company: 'OrbitDesk',
    location: 'Phoenix, AZ',
    type: 'Full-time',
    salaryRange: '$88,000 - $118,000',
    description: 'Build automated test coverage for a customer support platform. You will create end-to-end suites, API tests, and release quality dashboards. The work helps engineers ship confidently without slowing delivery.',
    requiredSkills: ['JavaScript', 'Playwright', 'API Testing', 'CI/CD', 'Test Strategy', 'Git'],
    experienceLevel: 'Mid'
  },
  {
    title: 'AI Solutions Engineer',
    company: 'PromptWorks Consulting',
    location: 'Remote',
    type: 'Contract',
    salaryRange: '$90 - $130/hour',
    description: 'Implement AI-assisted workflows for enterprise clients. You will prototype LLM applications, integrate APIs, and translate business goals into useful automation. Strong communication and rapid iteration are essential.',
    requiredSkills: ['Node.js', 'Python', 'LLMs', 'Prompt Engineering', 'REST APIs', 'Vector Search'],
    experienceLevel: 'Mid'
  },
  {
    title: 'Software Engineering Intern',
    company: 'Maple Labs',
    location: 'Boston, MA',
    type: 'Internship',
    salaryRange: '$35 - $45/hour',
    description: 'Join a product engineering team for a summer internship focused on internal tools. You will build small React features, write tests, and learn code review practices. Mentorship and curiosity are built into the program.',
    requiredSkills: ['JavaScript', 'React', 'Git', 'HTML', 'CSS'],
    experienceLevel: 'Entry'
  },
  {
    title: 'Platform Reliability Engineer',
    company: 'Copperline Cloud',
    location: 'Salt Lake City, UT',
    type: 'Full-time',
    salaryRange: '$130,000 - $175,000',
    description: 'Own reliability improvements for multi-tenant SaaS infrastructure. You will build alerts, incident tooling, and automated remediation across cloud services. The role blends software engineering with operational excellence.',
    requiredSkills: ['Kubernetes', 'Go', 'AWS', 'Observability', 'Terraform', 'Incident Response'],
    experienceLevel: 'Senior'
  },
  {
    title: 'Angular Frontend Engineer',
    company: 'HarborMed',
    location: 'Minneapolis, MN',
    type: 'Full-time',
    salaryRange: '$105,000 - $140,000',
    description: 'Modernize clinical scheduling interfaces used by providers and operations teams. You will develop Angular components, improve form workflows, and collaborate on accessibility. Experience with complex data-entry tools is helpful.',
    requiredSkills: ['Angular', 'TypeScript', 'RxJS', 'CSS', 'REST APIs', 'Accessibility'],
    experienceLevel: 'Mid'
  },
  {
    title: 'Data Engineer',
    company: 'MetroMetrics',
    location: 'New York, NY',
    type: 'Full-time',
    salaryRange: '$125,000 - $170,000',
    description: 'Build data pipelines for urban mobility analytics. You will model data, orchestrate transformations, and improve warehouse performance. The work supports product analytics and public-sector reporting.',
    requiredSkills: ['Python', 'SQL', 'Airflow', 'dbt', 'Snowflake', 'Data Modeling'],
    experienceLevel: 'Mid'
  },
  {
    title: 'Senior Full Stack Engineer',
    company: 'Keystone Learning',
    location: 'Remote',
    type: 'Remote',
    salaryRange: '$150,000 - $200,000',
    description: 'Lead development of educator tools for adaptive learning. You will architect React and Node features, mentor engineers, and improve product quality across the stack. The team values thoughtful tradeoffs and durable systems.',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'System Design', 'Testing'],
    experienceLevel: 'Senior'
  },
  {
    title: 'Computer Vision Engineer',
    company: 'FieldSight Robotics',
    location: 'Pittsburgh, PA',
    type: 'Full-time',
    salaryRange: '$140,000 - $190,000',
    description: 'Develop perception systems for inspection robots operating in industrial environments. You will train vision models, optimize inference, and collaborate with robotics engineers on field validation. Production ML experience is important.',
    requiredSkills: ['Python', 'Computer Vision', 'PyTorch', 'OpenCV', 'Robotics', 'Docker'],
    experienceLevel: 'Senior'
  },
  {
    title: 'Technical Program Manager',
    company: 'SummitScale',
    location: 'San Jose, CA',
    type: 'Full-time',
    salaryRange: '$135,000 - $180,000',
    description: 'Coordinate cross-functional platform initiatives across engineering, product, and customer success. You will manage milestones, risks, and communication for complex technical programs. Strong systems thinking and execution discipline are required.',
    requiredSkills: ['Program Management', 'Agile', 'Stakeholder Management', 'Risk Management', 'Technical Writing', 'Analytics'],
    experienceLevel: 'Senior'
  },
  {
    title: 'Database Administrator',
    company: 'Heritage Bank',
    location: 'Charlotte, NC',
    type: 'Full-time',
    salaryRange: '$105,000 - $145,000',
    description: 'Manage database reliability for banking systems with strict availability requirements. You will optimize queries, plan backups, and support migrations. The role requires careful change management and strong SQL expertise.',
    requiredSkills: ['PostgreSQL', 'SQL', 'Backup Strategy', 'Performance Tuning', 'Linux', 'Security'],
    experienceLevel: 'Mid'
  },
  {
    title: 'Part-time Web Developer',
    company: 'LocalArts Collective',
    location: 'Remote',
    type: 'Part-time',
    salaryRange: '$45 - $65/hour',
    description: 'Maintain and improve websites for arts organizations and community programs. You will implement responsive pages, improve accessibility, and integrate content APIs. The schedule is flexible and best suited to a self-directed developer.',
    requiredSkills: ['React', 'HTML', 'CSS', 'JavaScript', 'Accessibility', 'CMS'],
    experienceLevel: 'Entry'
  },
  {
    title: 'Contract API Engineer',
    company: 'FleetOps Now',
    location: 'Remote',
    type: 'Contract',
    salaryRange: '$85 - $115/hour',
    description: 'Build partner API integrations for a logistics platform. You will implement authentication flows, normalize third-party data, and add monitoring around integration health. Clear boundaries and documentation are key to success.',
    requiredSkills: ['Node.js', 'Express.js', 'REST APIs', 'OAuth', 'MongoDB', 'Testing'],
    experienceLevel: 'Mid'
  },
  {
    title: 'AI/ML Research Engineer, Retrieval',
    company: 'DeepIndex',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salaryRange: '$175,000 - $240,000',
    description: 'Advance retrieval-augmented generation systems for enterprise knowledge bases. You will improve embeddings, evaluation datasets, and ranking pipelines. The team cares about practical research that measurably improves user outcomes.',
    requiredSkills: ['Python', 'LLMs', 'Vector Search', 'NLP', 'Evaluation', 'Machine Learning'],
    experienceLevel: 'Senior'
  },
  {
    title: 'Junior DevOps Associate',
    company: 'CloudSprout',
    location: 'Raleigh, NC',
    type: 'Full-time',
    salaryRange: '$72,000 - $92,000',
    description: 'Support cloud operations and deployment automation for SaaS customers. You will learn infrastructure as code, monitor services, and help troubleshoot incidents. The role is structured for growth with strong mentorship.',
    requiredSkills: ['Linux', 'Docker', 'AWS', 'CI/CD', 'Git', 'Scripting'],
    experienceLevel: 'Entry'
  }
];

async function seedJobs() {
  await Job.deleteMany({});
  return Job.insertMany(jobs);
}

if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      const inserted = await seedJobs();
      console.log(`Seeded ${inserted.length} jobs`);
      process.exit(0);
    } catch (err) {
      console.error(`Seed failed: ${err.message}`);
      process.exit(1);
    }
  })();
}

module.exports = seedJobs;
