export interface TriviaQuestion {
  id: number | string;
  category: 'Pioneer Era' | 'National Projects' | 'Digital Identity & Future' | 'Dzongkha Tech';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  yearMilestone?: string;
  culturalContext?: string;
  status?: 'published' | 'draft';
}

export interface DigitalMilestone {
  year: string;
  title: string;
  description: string;
  significance: string;
  icon: string;
}

export const DEFAULT_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 1,
    category: 'Pioneer Era',
    yearMilestone: 'June 2, 1999',
    question: 'In which historic year was the Internet and Television officially launched in Bhutan?',
    options: ['1995', '1999', '2003', '2008'],
    correctAnswer: 1,
    explanation: 'Internet and TV were officially launched on June 2, 1999, during the Silver Jubilee Celebrations of His Majesty the Fourth Druk Gyalpo Jigme Singye Wangchuck.',
    culturalContext: 'Bhutan was one of the last countries in the world to introduce TV and Internet, approaching technology deliberately to preserve cultural harmony.'
  },
  {
    id: 2,
    category: 'Pioneer Era',
    yearMilestone: '1999',
    question: 'What was the name of Bhutan’s first Internet Service Provider (ISP) launched by Bhutan Telecom?',
    options: ['DrukNet', 'TashiCell', 'DragonWiFi', 'ThimphuNet'],
    correctAnswer: 0,
    explanation: 'DrukNet was launched by Bhutan Telecom in 1999 as the nation’s sole ISP, bringing dial-up internet access across the country.',
    culturalContext: 'DrukNet initially operated at speeds of 56 kbps, bridging Bhutanese scholars and students with global information.'
  },
  {
    id: 3,
    category: 'Dzongkha Tech',
    yearMilestone: '2006',
    question: 'Who standardized the official Dzongkha Unicode fonts and computer keyboard layout in Bhutan?',
    options: ['Dzongkha Development Commission (DDC)', 'Bhutan Council for School Examinations', 'Royal University of Bhutan', 'Thimphu TechPark'],
    correctAnswer: 0,
    explanation: 'The Dzongkha Development Commission (DDC) in collaboration with international font engineers created official Dzongkha Unicode fonts (Joyig) and keyboard layouts.',
    culturalContext: 'Dzongkha computing allowed government offices and schools across Bhutan to write official documents in Dzongkha script digitally.'
  },
  {
    id: 4,
    category: 'National Projects',
    yearMilestone: '2010 - 2015',
    question: 'Which nationwide ICT project aimed to train over 150,000 Bhutanese citizens and equip schools with computer labs across 20 Dzongkhags?',
    options: ['Chiphen Rigpel Project', 'DrukRen Network', 'GovTech Digital Class', 'Silicon Thimphu Initiative'],
    correctAnswer: 0,
    explanation: 'The Chiphen Rigpel ("Empowering Society through ICT") Project was a joint initiative by the Royal Government of Bhutan and India to build digital literacy across the kingdom.',
    culturalContext: 'Chiphen Rigpel installed e-learning labs in remote schools from Trashigang to Gasa, empowering thousands of teachers and Class 10 students.'
  },
  {
    id: 5,
    category: 'Digital Identity & Future',
    yearMilestone: '2023',
    question: 'Bhutan launched "Bhutan NDI", making history as the world’s first national digital identity system based on which technology?',
    options: ['Self-Sovereign Identity (SSI) on Blockchain', 'Fingerprint Central Server', 'SMS OTP Verification', 'Retinal Cloud Scanning'],
    correctAnswer: 0,
    explanation: 'Bhutan NDI is the world’s first national Self-Sovereign Identity (SSI) system powered by decentralized blockchain technology, giving citizens full control over personal data.',
    culturalContext: 'His Royal Highness the Gyalsung became Bhutan NDI’s first digital citizen, pioneering secure, privacy-preserving digital government services.'
  },
  {
    id: 6,
    category: 'Digital Identity & Future',
    yearMilestone: '2022',
    question: 'Which government agency in Bhutan is responsible for leading the nation’s digital transformation, cybersecurity, and e-governance?',
    options: ['GovTech Agency', 'Department of Roads', 'Ministry of Agriculture', 'Druk Holding & Investments'],
    correctAnswer: 0,
    explanation: 'The GovTech Agency of Bhutan was established under civil service reforms to streamline digital infrastructure, cybersecurity, and public online services.',
    culturalContext: 'GovTech ensures citizen-centric digital services with high uptime even across rugged Himalayan terrain.'
  },
  {
    id: 7,
    category: 'Pioneer Era',
    yearMilestone: '2012',
    question: 'What is the name of Bhutan’s first IT Park located in Babesa, Thimphu?',
    options: ['Thimphu TechPark', 'Druk CyberHub', 'Himalayan Innovation Lab', 'Jigme Singye Tech City'],
    correctAnswer: 0,
    explanation: 'Thimphu TechPark (opened in 2012) is Bhutan’s flagship IT park housing software development firms, data centers, and the Bhutan Innovation & Incubation Centre.',
    culturalContext: 'Thimphu TechPark created hundreds of tech jobs for young Bhutanese programmers and engineers.'
  },
  {
    id: 8,
    category: 'National Projects',
    yearMilestone: '2018',
    question: 'What is DrukREN in Bhutan’s ICT ecosystem?',
    options: ['Bhutan Research and Education Network connecting colleges and hospitals', 'A solar-powered router system', 'A mobile video game app', 'An offline television broadcast satellite'],
    correctAnswer: 0,
    explanation: 'DrukREN (Druk Research and Education Network) provides high-speed optical fiber connectivity between universities, research institutions, and hospitals across Bhutan.',
    culturalContext: 'DrukREN allows students in Sherubtse College (Kanglung) or JNEC (Samdrup Jongkhar) to collaborate seamlessly with international universities.'
  },
  {
    id: 9,
    category: 'Dzongkha Tech',
    yearMilestone: '2021',
    question: 'What specialized AI research is currently being developed for the Dzongkha language in Bhutan?',
    options: ['Dzongkha Text-To-Speech (TTS) and Optical Character Recognition (OCR)', '3D Holographic Translators', 'Automated Quantum Decryptors', 'Braille Printing Machines'],
    correctAnswer: 0,
    explanation: 'Researchers at DHI InnoTech and RUB are building open-source Dzongkha speech synthesis (TTS), voice recognition, and OCR tools to preserve language heritage.',
    culturalContext: 'Combining AI with Dzongkha ensures the national language thrives in smartphones, smart speakers, and automated translation apps.'
  },
  {
    id: 10,
    category: 'Digital Identity & Future',
    yearMilestone: '2024',
    question: 'Which satellite technology is being trialed in remote gewogs (like Laya and Lunana) to deliver high-speed connectivity where fiber optics cannot reach?',
    options: ['Low Earth Orbit (LEO) Satellite Systems like Starlink', 'Dial-up Copper Lines', 'Submarine Fiber Cables', 'Radio Telegraphy'],
    correctAnswer: 0,
    explanation: 'Bhutan is trialing LEO (Low Earth Orbit) satellite broadband to connect high-altitude remote gewogs, healthcare outposts, and schools in mountainous terrain.',
    culturalContext: 'This ensures students in the highest Himalayan villages have equal access to online education and Class 10 ICT learning tools.'
  }
];

export const DIGITAL_MILESTONES: DigitalMilestone[] = [
  {
    year: '1999',
    title: 'Internet & Television Launch',
    description: 'His Majesty the 4th Druk Gyalpo introduced TV and Internet (DrukNet) during Silver Jubilee celebrations.',
    significance: 'Connected the Himalayan kingdom with the global information highway.',
    icon: '📡'
  },
  {
    year: '2006',
    title: 'Dzongkha Unicode Standardization',
    description: 'Dzongkha Development Commission released standard Dzongkha fonts and keyboard layout.',
    significance: 'Enabled digital writing, government e-docs, and school curriculum in Dzongkha.',
    icon: '⌨️'
  },
  {
    year: '2010',
    title: 'Chiphen Rigpel ICT Project',
    description: 'Nationwide digital literacy initiative equipping 20 Dzongkhags with school computer labs.',
    significance: 'Trained over 150,000 students and educators in computer fundamentals.',
    icon: '🎓'
  },
  {
    year: '2012',
    title: 'Thimphu TechPark Opened',
    description: 'Bhutan’s first IT Park established in Babesa, Thimphu.',
    significance: 'Fostered Bhutanese software startups, data centers, and tech employment.',
    icon: '🏢'
  },
  {
    year: '2018',
    title: 'DrukREN Fiber Backbone',
    description: 'High-speed dedicated research and education fiber network launched for colleges.',
    significance: 'Facilitated online research, tele-education, and digital medical consultations.',
    icon: '🌐'
  },
  {
    year: '2023',
    title: 'Bhutan NDI Launch',
    description: 'World’s first national Self-Sovereign Identity on decentralized blockchain.',
    significance: 'Empowered Bhutanese citizens with secure, passwordless digital identity.',
    icon: '🛡️'
  },
  {
    year: '2024+',
    title: 'Class 10 Python & AI Curriculum',
    description: 'Modernized BCSEA ICT curriculum featuring Python coding, Excel analytics, and AI tutoring.',
    significance: 'Preparing the next generation of Bhutanese innovators for Gelephu Mindfulness City (GMC).',
    icon: '🚀'
  }
];
