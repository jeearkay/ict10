import { QuestModule, Badge } from '../types';

export const SYLLABUS_MODULES: QuestModule[] = [
  {
    id: 'cloud-services',
    chapterNumber: 1,
    title: 'Cloud Services & Deployment Models',
    icon: '☁️',
    description: 'Explore IaaS, PaaS, SaaS, Public, Private, and Hybrid clouds using Bhutanese school and hospital scenarios.',
    bhutanRegion: 'Paro Valley & International Airport',
    levels: [
      {
        id: 'cloud-types',
        levelNumber: 1,
        title: 'Types of Cloud Services (IaaS, PaaS, SaaS)',
        pageNo: 3,
        summary: 'Cloud Computing delivers computing services (servers, storage, networking, software) over the internet.',
        keyConcepts: [
          'IaaS (Infrastructure as a Service): Renting raw servers, storage, and virtual networking over the internet from providers like AWS or Google Cloud. Instead of buying physical computer hardware, IT administrators configure virtual servers and operating systems remotely. For example, a Bhutanese tech startup rents a cloud server to host their mobile app without purchasing expensive physical server racks.',
          'PaaS (Platform as a Service): Provides software developers with a complete pre-configured hardware and software framework to build, test, and deploy applications. Coders focus entirely on writing application code without worrying about managing underlying operating systems or database servers. For example, student developers at Karma Academy use Google App Engine to test Python web apps instantly.',
          'SaaS (Software as a Service): Delivers fully functioning software applications directly through a web browser on a subscription or free basis. Users manage nothing; the cloud provider handles all maintenance, software updates, data backups, and security patches. For example, teachers and students use Gmail, Google Docs, and Zoom daily without installing heavy software programs locally.'
        ],
        bhutanAnalogy: 'Think of IaaS as renting a raw parcel of land in Paro where you build your own house; PaaS as renting a fully equipped workshop at Karma Academy; and SaaS as staying in a luxury hotel room where everything is prepared for you!',
        exerciseQuestion: 'Charro Bakery in Paro town wants to take custom cake orders online. They have no IT department and want a ready-to-use program. Which Cloud Service Model (IaaS, PaaS, or SaaS) should they use and why?',
        sampleCodeOrFormula: 'SaaS: User manages Nothing! Provider manages Code, Servers, Security & Updates.',
        mermaidDiagram: `graph TD
    Cloud[Cloud Services] --> IaaS[1. IaaS - Infrastructure]
    Cloud --> PaaS[2. PaaS - Platform]
    Cloud --> SaaS[3. SaaS - Software]
    
    IaaS --> |Rents Servers & OS| ITAdmin[IT Administrators]
    PaaS --> |Provides Dev Tools| Devs[Software Coders]
    SaaS --> |Ready Apps| Everyday[Students & Teachers]`,
        xpReward: 50,
      },
      {
        id: 'cloud-deployment',
        levelNumber: 2,
        title: 'Cloud Deployment Models & Trade-offs',
        pageNo: 4,
        summary: 'Cloud deployment models define who can access the resources: Public Cloud, Private Cloud, and Hybrid Cloud.',
        keyConcepts: [
          'Public Cloud: Cloud infrastructure owned and operated by a third-party provider, shared across multiple organizations like a public transport bus. It offers rapid deployment, low cost, and high scalability for everyday tasks. For example, storing school club photos on Google Drive or sending emails via Gmail.',
          'Private Cloud: Cloud infrastructure dedicated exclusively to a single organization, operated on-premise or hosted remotely like a private VIP vehicle. It provides maximum data security, strict access control, and regulatory compliance. For example, JDWNRH Hospital stores confidential patient medical histories in a secure private health server.',
          'Hybrid Cloud: Combines public and private clouds, allowing sensitive data to remain secure on private servers while utilizing public cloud scalability for public-facing web traffic. For example, a government ministry keeps citizen tax records on a private cloud while hosting their public information website on a public cloud.'
        ],
        bhutanAnalogy: 'Public Cloud is like taking the Bhutan Postal Bus where everyone shares seats; Private Cloud is like the Gyalpoi Zimpon’s official vehicle; Hybrid Cloud is using your family car for sensitive trips and the public bus for daily errands.',
        exerciseQuestion: 'JDWNRH Hospital in Thimphu needs to store confidential patient records safely while having a public website for doctor directories. How can they use a Hybrid Cloud model?',
        mermaidDiagram: `flowchart LR
    subgraph PrivateCloud[Private Cloud - Hospital Internal]
        MedicalRecords[Confidential Patient Medical Records]
    end
    subgraph PublicCloud[Public Cloud - Google Drive / Web]
        DoctorList[Public Visiting Hours & Doctor Directories]
    end
    Hybrid[Hybrid Cloud Bridge] --> PrivateCloud
    Hybrid --> PublicCloud`,
        xpReward: 50,
      },
      {
        id: 'cloud-benefits-drawbacks',
        levelNumber: 3,
        title: 'Cloud Benefits & Drawbacks (Vendor Lock-in)',
        pageNo: 5,
        summary: 'Understand Scalability, Cost Efficiency (Pay-as-you-go), Disaster Recovery, versus risks like Internet Dependency and Vendor Lock-in.',
        keyConcepts: [
          'Scalability & Elasticity: The ability to instantly increase or decrease cloud computing resources, storage capacity, and bandwidth based on real-time traffic demands. For example, a school portal automatically scales up server power during board exam result announcement days and scales down during holidays.',
          'Cost Efficiency (Pay-as-you-go): A financial model where organizations only pay for the exact computing resources, storage gigabytes, and network bandwidth they consume, much like a municipal water meter. This eliminates large upfront capital investments in idle hardware.',
          'Disaster Recovery & Redundancy: Automated remote backups that mirror critical data across multiple geographic server locations to protect against hardware failures or local disasters. For example, if a server room experiences a power outage, cloud backups ensure data is never lost.',
          'Internet Dependency & Vendor Lock-in: Major drawbacks including the absolute requirement for a stable internet connection to access data, potential service outages, and difficulty migrating data between different cloud providers (vendor lock-in). For example, if internet connectivity in Paro drops, cloud-dependent classrooms cannot load assignments.'
        ],
        bhutanAnalogy: 'Vendor Lock-in is like storing all your traditional Kira weavers patterns on Apple iCloud; moving 5 years of high-res photos to a Google Android phone requires migrating all format files!',
        exerciseQuestion: 'Karma Academy moves 100% of exams and study materials to a cloud platform. Based on drawbacks of cloud computing, what is the biggest risk they face if internet breaks in Paro?',
        mermaidDiagram: `graph LR
    Pros[Cloud Benefits] --> S[Scalability]
    Pros --> C[Cost Efficiency]
    Pros --> DR[Disaster Recovery]
    Cons[Cloud Risks] --> ID[Internet Dependency]
    Cons --> VL[Vendor Lock-in]
    Cons --> DT[Downtime]`,
        xpReward: 50,
      },
      {
        id: 'cloud-security-sovereignty',
        levelNumber: 4,
        title: 'Cloud Data Sovereignty & Security in Bhutan',
        pageNo: 6,
        summary: 'Data Sovereignty requires compliance with national laws (GovTech / DITT Bhutan) regarding where sensitive citizen data is physically stored.',
        keyConcepts: [
          'Data Sovereignty: The legal principle that digital data is subject to the privacy laws, regulations, and governance frameworks of the country where it is physically stored. For example, Bhutanese citizen civil registration records must be stored within approved national data centers to comply with GovTech privacy policies.',
          'Encryption at Rest and in Transit: Security mechanism that scrambles readable data into unreadable ciphertext using cryptographic keys when stored on servers (at rest) and when transmitted across networks (in transit). For example, online banking transactions in Bhutan use SSL/TLS encryption to protect passwords from hackers.',
          'Access Controls & Multi-Factor Authentication: Security measures that restrict system access based on user roles and require multiple verification steps before granting entry. For example, logging into the Bhutan Government Employee portal requires both a password and an SMS One-Time Password (OTP).'
        ],
        bhutanAnalogy: 'Data sovereignty is like keeping Bhutan national heritage archives inside the Royal Dzong walls of Punakha rather than in a foreign library warehouse abroad!',
        exerciseQuestion: 'Why must official Bhutanese civil registration data be hosted in local government data centers or encrypted sovereign cloud regions?',
        mermaidDiagram: `graph TD
    Gov[Bhutan Citizen Data] --> Encrypt[AES-256 Encryption]
    Encrypt --> Laws[GovTech Data Protection Policy]
    Laws --> LocalDC[Local Bhutan Data Center / Sovereign Cloud]`,
        xpReward: 50,
      },
      {
        id: 'cloud-virtualization-storage',
        levelNumber: 5,
        title: 'Virtualization & Cloud Storage Fundamentals',
        pageNo: 7,
        summary: 'Virtualization creates virtual instances of physical hardware using Hypervisors, enabling efficient resource sharing.',
        keyConcepts: [
          'Hypervisor (Type 1 & Type 2): Specialized virtualization software that creates and runs virtual machines (VMs) by abstracting physical server hardware resources. A Type 1 hypervisor runs directly on bare-metal hardware, while a Type 2 runs on top of a standard host operating system. For example, a single physical server at a Thimphu data center runs three separate virtual machines simultaneously.',
          'Object Storage vs Block Storage: Object storage organizes unorganized files and metadata into flat buckets ideal for documents and media, while block storage divides data into raw volumes formatted for databases. For example, storing 10,000 scanned student essay PDFs uses object storage, while running a transactional database uses block storage.',
          'Redundancy & RAID: Technology that duplicates data across multiple hard disk drives to ensure continuous availability if one physical disk fails. For example, RAID mirroring ensures that if a server hard drive crashes, data can be instantly recovered without interruption.'
        ],
        bhutanAnalogy: 'Virtualization is like dividing a large traditional Bhutanese farmhouse into 4 separate cozy apartments using partition walls, allowing 4 families to share one roof efficiently!',
        exerciseQuestion: 'What is the main role of a Hypervisor software layer in cloud computing virtual servers?',
        mermaidDiagram: `graph TD
    Hardware[Physical Server Hardware] --> Hypervisor[Hypervisor Engine]
    Hypervisor --> VM1[Virtual Machine 1 - Windows]
    Hypervisor --> VM2[Virtual Machine 2 - Linux]
    Hypervisor --> VM3[Virtual Machine 3 - App Server]`,
        xpReward: 50,
      },
      {
        id: 'cloud-cost-roi',
        levelNumber: 6,
        title: 'Cloud Infrastructure Decision Matrix & Cost ROI',
        pageNo: 8,
        summary: 'Organizations compare Capital Expenditure (CapEx) for buying physical servers vs Operational Expenditure (OpEx) for cloud subscriptions.',
        keyConcepts: [
          'CapEx (Capital Expenditure): Upfront, one-time capital investment required to purchase physical computer hardware, server racks, network cables, and dedicated server room infrastructure. For example, buying 50 desktop computers for a school computer lab requires a large initial CapEx budget.',
          'OpEx (Operational Expenditure): Ongoing, recurring operational expenses paid periodically (monthly or yearly) for cloud subscriptions, utility bills, and services. For example, paying a monthly cloud hosting fee for a school website is an OpEx expense that scales with actual usage.',
          'Cloud Decision Matrix: A structured evaluation framework comparing cost, data privacy requirements, internet reliability, and technical expertise when deciding between local physical servers and cloud hosting. For example, rural schools with intermittent internet choose local servers, while urban colleges choose cloud PaaS.'
        ],
        bhutanAnalogy: 'CapEx is buying a bus outright for 3,000,000 Nu; OpEx is paying 500 Nu taxi fare only on days you actually travel to Thimphu!',
        exerciseQuestion: 'A small startup school in Haa valley has a limited initial budget. Should they choose CapEx (buying physical servers) or OpEx (cloud subscription)? Explain.',
        mermaidDiagram: `graph LR
    Budget[School Budget Choice] --> CapEx[CapEx: High Upfront Server Cost]
    Budget --> OpEx[OpEx: Monthly Cloud Subscription]
    OpEx -->|Best for Low Initial Capital| Startup[Startup School in Haa]`,
        xpReward: 50,
      }
    ]
  },
  {
    id: 'google-workspace',
    chapterNumber: 2,
    title: 'Google Workspace & Ecosystem',
    icon: '💼',
    description: 'Master cloud productivity, real-time collaboration, Workspace for Education, and Google AI ecosystem tools.',
    bhutanRegion: 'Karma Academy & Capital Thimphu',
    levels: [
      {
        id: 'workspace-evolution',
        levelNumber: 1,
        title: 'Evolution & Education Workspace',
        pageNo: 9,
        summary: 'Google Workspace evolved from Google Apps for Your Domain (2006) to G Suite (2016) and Google Workspace (2020).',
        keyConcepts: [
          '2006 Google Apps for Your Domain: Launched initially as a business communication suite allowing custom domain emails, calendar sharing, and early web documents. It laid the foundation for modern cloud-based office productivity. For example, early schools started using custom domain email addresses for teachers.',
          '2016 G Suite Rebrand: Google unified its cloud productivity apps (Gmail, Drive, Docs, Calendar) under the unified brand name G Suite, introducing advanced enterprise security controls and real-time co-authoring tools. For example, administrative offices collaborated on spreadsheets simultaneously.',
          '2020 Google Workspace Rebrand: Rebranded as Google Workspace to reflect deeply integrated communication apps where users can launch a video call directly from a chat or collaborate on a document inside an email thread. For example, modern teams switch seamlessly between Meet, Chat, and Docs.',
          'Workspace for Education: A specialized, secure digital ecosystem tailored for schools and universities, offering free or low-cost tools like Google Classroom, Forms, and Assignments. For example, Karma Academy uses Google Workspace for Education to manage paperless assignments and digital attendance.'
        ],
        bhutanAnalogy: 'Just like Bhutan moved from paper postage to high-speed fiber internet, Google rebranded from single isolated "Apps" into an interconnected digital "Workspace" for real-time teamwork.',
        exerciseQuestion: 'Karma, a Class 10 teacher, wants a paperless classroom and digital assignment tracking. Which Workspace features solve her problem?',
        mermaidDiagram: `timeline
    title Evolution of Google Workspace
    2006 : Google Apps for Your Domain
    2016 : Rebranded as G Suite
    2020 : Rebranded as Google Workspace`,
        xpReward: 50,
      },
      {
        id: 'google-ecosystem',
        levelNumber: 2,
        title: 'Google Ecosystem: AI, OS, & Research Tools',
        pageNo: 10,
        summary: 'Explore Google suite categorizations: Communication, Information, Advanced Tech (Gemini, Google Lens, TensorFlow), and OS (Android, Chrome OS).',
        keyConcepts: [
          'Communication Apps: Real-time collaboration tools including Google Meet for video conferencing, Google Calendar for scheduling, and Google Chat for team messaging. For example, teachers schedule virtual parent-teacher conferences using Calendar invites that auto-generate Meet links.',
          'Information & Research Tools: Search engines, Google Scholar for academic papers, Google Maps & Earth for geographical exploration, and Google Translate supporting 100+ languages. For example, geography students in Thimphu explore 3D satellite models of Himalayan glaciers using Google Earth.',
          'Advanced Tech & AI: Cutting-edge artificial intelligence tools including Gemini conversational AI assistant, Google Lens for visual search, and TensorFlow for machine learning development. For example, students use Gemini to brainstorm coding logic and Google Lens to identify plant species.',
          'Operating Systems: Lightweight and powerful OS platforms including Android for mobile devices and Chrome OS for fast, secure Chromebook laptops. For example, students complete online quizzes using secure Chrome OS educational laptops.'
        ],
        bhutanAnalogy: 'Imagine taking a photo of a rare medicinal Himalayan flower in Bumthang with Google Lens, translating a Dzongkha manuscript with Translate, and brainstorming python code with Gemini!',
        exerciseQuestion: 'You have a foreign language reference document and need to brainstorm a computer science project. Which 2 tools from Advanced Tech & AI or Information categories help you?',
        mermaidDiagram: `graph TD
    Eco[Google Ecosystem] --> AI[Advanced Tech & AI]
    Eco --> Info[Information & Research]
    Eco --> OS[Operating Systems]
    
    AI --> Gemini[Gemini AI Assistant]
    AI --> Lens[Google Lens Camera]
    Info --> Maps[Google Maps & Earth]
    Info --> Trans[Google Translate]
    OS --> Android[Android Mobile OS]`,
        xpReward: 50,
      },
      {
        id: 'workspace-docs-slides',
        levelNumber: 3,
        title: 'Real-time Co-authoring in Docs & Slides',
        pageNo: 11,
        summary: 'Google Docs and Slides enable simultaneous multi-user co-authoring with version tracking and comment tags.',
        keyConcepts: [
          'Real-time Co-authoring: Allows multiple users to edit the same Google Document or Presentation simultaneously while displaying color-coded cursor positions in real time. For example, four Class 10 students collaborating on a history report write different paragraphs at the same time without merge conflicts.',
          'Version History & Revision Tracking: Automatically records every change made to a document with exact timestamps and author names, allowing users to restore previous revisions or inspect editing progress. For example, a teacher reviews document version history to see which student contributed specific sections of a group project.',
          'Comments & Action Items: Interactive collaboration features where users highlight specific text to add feedback or use the \'@\' symbol to assign specific tasks to teammates. For example, writing \'@Karma please check this calculation\' sends an email notification and assigns the task directly.'
        ],
        bhutanAnalogy: 'Four Class 10 students writing a group report on Bhutan hydro-power simultaneously in Google Docs is like 4 artists painting a single wall mural together in Thimphu!',
        exerciseQuestion: 'How does @mentioning a classmate in a Google Docs comment help assign project responsibilities?',
        mermaidDiagram: `graph LR
    Doc[Shared Google Doc] --> UserA[Student A: Writing Text]
    Doc --> UserB[Student B: Adding Photos]
    Doc --> Comment["@Pema: Check calculation!"]
    Comment --> EmailNotification[Email Alert Sent to Pema]`,
        xpReward: 50,
      },
      {
        id: 'workspace-drive-permissions',
        levelNumber: 4,
        title: 'Google Drive Storage & Access Permissions',
        pageNo: 12,
        summary: 'Google Drive organizes files in cloud storage with granular access levels: Viewer, Commenter, and Editor.',
        keyConcepts: [
          'Viewer Access Level: Grants users permission to view and download files in Google Drive, but strictly prohibits editing, deleting, or adding comments. For example, a teacher shares syllabus PDF files with students as Viewers so the original file remains unmodified.',
          'Commenter Access Level: Allows users to read documents and add feedback comments or text suggestions, while preventing direct modification of the underlying source text. For example, a peer reviewer adds improvement suggestions on a draft essay without altering the author\'s original words.',
          'Editor Access Level: Grants full permissions to modify document content, add or delete files, and manage sharing permissions with other users. For example, co-authors of a research report are given Editor access to jointly build the final project.',
          'Restricted vs Link Sharing: Access control settings that limit file visibility either to specifically invited email addresses or anyone on the internet possessing the sharing URL. For example, confidential exam answer keys are restricted to authorized teachers only.'
        ],
        bhutanAnalogy: 'A Viewer is like a visitor looking at relics in a Dzong museum; a Commenter is a teacher making notes on a draft; an Editor is the Dzong archivist updating records!',
        exerciseQuestion: 'A teacher wants students to view exam guidelines without editing them. Which Google Drive sharing permission should she grant?',
        mermaidDiagram: `graph TD
    Drive[Drive File Sharing] --> Viewer[1. Viewer - Read Only]
    Drive --> Commenter[2. Commenter - Add Notes]
    Drive --> Editor[3. Editor - Full Changes]`,
        xpReward: 50,
      },
      {
        id: 'workspace-classroom-forms',
        levelNumber: 5,
        title: 'Digital Classroom & Auto-graded Forms',
        pageNo: 13,
        summary: 'Google Classroom streamlines assignment creation while Google Forms provides auto-graded quizzes and feedback surveys.',
        keyConcepts: [
          'Classroom Stream & Classwork: Central digital hubs for teachers to post announcements, distribute assignments, organize topics, and track student submissions. For example, Karma Academy uses Google Classroom to post weekly computer science homework deadlines and reading materials.',
          'Google Forms Quiz Mode: Instantly transforms standard surveys into automated quizzes by assigning point values to correct answers, defining answer keys, and providing automated feedback. For example, students take a 10-question ICT quiz in Google Forms and receive their score immediately upon submission.',
          'Exporting Form Responses: Automatically links Google Form quiz submissions to a live Google Spreadsheet, organizing all student data into rows and columns for easy statistical grading. For example, a teacher exports quiz scores to calculate class averages and grade distributions instantly.'
        ],
        bhutanAnalogy: 'Google Classroom is like the central notice board at Karma Academy, while Google Forms is an instant digital quiz master that grades answers in 1 second!',
        exerciseQuestion: 'Which feature in Google Forms converts a survey into an automated quiz with instant scores?',
        mermaidDiagram: `graph LR
    Form[Google Form Quiz] --> StudentSubmit[Student Submits Answers]
    StudentSubmit --> AutoGrade[Auto-Grading Engine]
    AutoGrade --> GradeSheet[Instant Score in Google Sheets]`,
        xpReward: 50,
      },
      {
        id: 'workspace-meet-calendar',
        levelNumber: 6,
        title: 'Virtual Collaboration with Meet, Calendar & Chat',
        pageNo: 14,
        summary: 'Google Meet enables video conferencing, screen sharing, and live captions, synchronized directly with Google Calendar.',
        keyConcepts: [
          'Google Calendar Integration: Automatically links scheduling events with Google Meet, generating secure video conferencing links directly inside calendar invitations. For example, scheduling a study group session in Google Calendar instantly emails join links to all participants.',
          'Screen Sharing & Interactive Whiteboards: Presentation features that allow participants to share their computer screens or collaborate visually using digital whiteboard tools like Google Jamboard. For example, a teacher shares their screen to demonstrate Python programming code live during an online class.',
          'Breakout Rooms & Live Captions: Advanced video conferencing tools that divide large classes into smaller discussion groups and provide real-time speech-to-text accessibility subtitles. For example, students split into breakout rooms to discuss group presentation topics.'
        ],
        bhutanAnalogy: 'Google Meet connects a guest speaker in Geneva directly to a Class 10 computer lab in Paro as if sitting in the same classroom!',
        exerciseQuestion: 'Explain how scheduling a meeting in Google Calendar automatically simplifies joining a Google Meet video call.',
        mermaidDiagram: `graph TD
    Cal[Google Calendar Event] --> AutoLink[Auto-generates Meet Link]
    AutoLink --> Invite[Sent to Students]
    Invite --> Join[One-click Video Join]`,
        xpReward: 50,
      }
    ]
  },
  {
    id: 'digital-citizenship',
    chapterNumber: 3,
    title: 'Acknowledging Ownership & Citations',
    icon: '📜',
    description: 'Learn website verification, TLDs, plagiarism prevention, and master APA, MLA, and IEEE citation formats.',
    bhutanRegion: 'National Library of Bhutan, Thimphu',
    levels: [
      {
        id: 'website-credibility',
        levelNumber: 1,
        title: 'Verifying Website Owners & TLDs',
        pageNo: 15,
        summary: 'Identifying website owners ensures information is credible (believable) and authentic (real).',
        keyConcepts: [
          'Top-Level Domains (TLD): The suffix at the end of a web address (.edu for educational institutions, .gov for government bodies, .org for non-profits, .com for commercial sites) that indicates the publisher\'s nature. For example, an official government health notice hosted on www.moh.gov.bt is highly reliable compared to unverified commercial blogs.',
          'Source Verification Tools: Methods and tools used to verify website authenticity, including Whois domain registration lookups, author credential checks, reverse image searches, and fact-checking databases like Snopes. For example, before sharing a news article, students verify the publisher\'s editorial standards and author expertise.'
        ],
        bhutanAnalogy: 'Checking a website TLD is like checking an official seal on a Dzongkhag royal decree versus an unverified notice pinned on a Paro town shop wall!',
        exerciseQuestion: 'Tenzin is writing a report on Zhabdrung Ngawang Namgyel. Should he prioritize www.bhutanculturalheritage.com or www.library.gov.bt? State 2 indicators of credibility.',
        mermaidDiagram: `graph LR
    URL[Website Domain TLD] --> edu[.edu - High Trust]
    URL --> gov[.gov - Official Government]
    URL --> org[.org - Non-Profit]
    URL --> com[.com - Commercial]`,
        xpReward: 50,
      },
      {
        id: 'citation-styles',
        levelNumber: 2,
        title: 'Citation Rules: APA, MLA, & IEEE',
        pageNo: 16,
        summary: 'Citations grant credit to creators and uphold academic integrity. APA, MLA, and IEEE formats have unique structures.',
        keyConcepts: [
          'APA Style (American Psychological Association): A standard citation format primarily used in scientific and social science research, emphasizing author names and publication years. For example, an in-text citation appears as (Karma, 2022), pointing to a full reference entry with title and publisher.',
          'MLA Style (Modern Language Association): A citation format standard in humanities and literature, emphasizing author names and specific page numbers for literary quotes. For example, an in-text citation appears as (Wangmo 42), directing readers to the works cited page.',
          'IEEE Style (Institute of Electrical and Electronics Engineers): A numbered citation style standard in engineering, physics, and computer science fields. For example, sources are cited using bracketed numbers like [1] that correspond to a numbered reference list at the end of the document.'
        ],
        bhutanAnalogy: 'APA is for fast-changing environmental studies on Bhutanese glaciers; MLA is for analyzing folk tales of the Yeti; IEEE is for solar power wiring manuals at Jigme Namgyel Engineering College!',
        exerciseQuestion: 'You are citing Dr. Karma Phuntsho’s book "The History of Bhutan" (2013, Random House). Write the APA reference list format.',
        mermaidDiagram: `graph TD
    Citation[Citation Styles] --> APA[APA - Science: Author, Date]
    Citation --> MLA[MLA - Literature: Author Page]
    Citation --> IEEE[IEEE - Tech: Bracket Numbers [1]]`,
        xpReward: 50,
      },
      {
        id: 'academic-integrity',
        levelNumber: 3,
        title: 'Academic Integrity & Avoiding Plagiarism',
        pageNo: 17,
        summary: 'Plagiarism is presenting someone else\'s work or ideas as your own without proper credit.',
        keyConcepts: [
          'Direct Plagiarism: Copying word-for-word text from another author\'s book or website without using quotation marks or providing a citation. For example, copying an entire paragraph from Wikipedia into a school science report without attribution is academic dishonesty.',
          'Paraphrasing Plagiarism: Rephrasing another person\'s ideas or sentences using synonyms while failing to acknowledge the original source. For example, changing a few words in a source paragraph without citing the author is still considered plagiarism.',
          'Self-Plagiarism & Detection Tools: Submitting your own previously graded academic work for a new assignment without teacher permission, evaluated using automated plagiarism checkers like Turnitin. For example, reusing last year\'s history essay for a current computer science project violates academic integrity.'
        ],
        bhutanAnalogy: 'Plagiarism is like copying a master painter\'s Thangka artwork and claiming you painted it yourself in an art competition!',
        exerciseQuestion: 'How does proper paraphrasing differ from simply swapping a few words with synonyms?',
        mermaidDiagram: `graph LR
    Source[Original Source Text] --> Quote["Direct Quote: Use '...' + Citation"]
    Source --> Para["Paraphrase: Own Words + Citation"]
    Source --> Copy["Copying: Plagiarism (Violation)"]`,
        xpReward: 50,
      },
      {
        id: 'digital-footprint-bhutan',
        levelNumber: 4,
        title: 'Digital Footprint & Online Ethics in Bhutan',
        pageNo: 18,
        summary: 'A digital footprint is the permanent trail of data left behind when using the internet.',
        keyConcepts: [
          'Active Digital Footprint: Data and content that you intentionally and publicly post online, such as social media photos, blog comments, status updates, and uploaded files. For example, posting holiday pictures on public Instagram profiles creates an active digital footprint that persists online.',
          'Passive Digital Footprint: Data collected automatically by websites and servers without your active participation, including your IP address, browser type, location data, and tracking cookies. For example, websites log your browsing habits when you visit online shopping portals.',
          'Cyberbullying & Legal Penalties: Online harassment, malicious messaging, or spreading false rumors via digital platforms, which violates the Bhutan Penal Code and national cyber safety guidelines. For example, sending threatening messages online carries severe legal consequences under Bhutanese law.'
        ],
        bhutanAnalogy: 'Your digital footprint is like footprints on fresh snow along Chelela Pass: even after days, people can trace where you stepped!',
        exerciseQuestion: 'List 2 positive ways a Class 10 student can build a clean, respectful digital footprint online.',
        mermaidDiagram: `graph TD
    Activity[Online Activity] --> Active[Active Footprint: Posts & Tweets]
    Activity --> Passive[Passive Footprint: IP & Cookies]
    Active --> Reputation[Permanent Online Reputation]`,
        xpReward: 50,
      },
      {
        id: 'fact-checking-sift',
        levelNumber: 5,
        title: 'Source Evaluation & Fact-Checking (SIFT Method)',
        pageNo: 19,
        summary: 'The SIFT method (Stop, Investigate, Find better coverage, Trace claims) helps verify online information.',
        keyConcepts: [
          'S - Stop: The first step of the SIFT method, reminding users to pause and evaluate their emotional reaction before sharing sensational or unverified news posts online. For example, stopping to think before forwarding a shocking headline on a messaging app.',
          'I - Investigate the Source: Checking who published the information, evaluating their credentials, bias, and whether they are a trusted authority on the subject. For example, checking if a medical claim comes from an established health organization or an anonymous blog.',
          'F - Find Better Coverage: Searching trusted news networks and academic databases to see if reputable journalists or researchers have verified or debunked the claim. For example, cross-referencing a breaking news story with national broadcast channels.',
          'T - Trace Claims and Quotes: Tracing quotes, photos, and statistics back to their original context and primary source to ensure they haven\'t been manipulated or taken out of context. For example, using reverse image search to find when a viral photo was actually taken.'
        ],
        bhutanAnalogy: 'SIFT is like filtering fresh mountain stream water through a clean cloth to catch impurities before drinking!',
        exerciseQuestion: 'What does the letter "S" in the SIFT fact-checking method stand for, and why is it important?',
        mermaidDiagram: `graph LR
    SIFT[SIFT Fact Checking] --> S[S - Stop]
    SIFT --> I[I - Investigate Source]
    SIFT --> F[F - Find Trusted Coverage]
    SIFT --> T[T - Trace Original Context]`,
        xpReward: 50,
      }
    ]
  },
  {
    id: 'copyright-creative-commons',
    chapterNumber: 4,
    title: 'Copyright & Creative Commons',
    icon: '⚖️',
    description: 'Understand exclusive copyright rights, Bhutan law (Life + 50 years), and the 6 Creative Commons licenses.',
    bhutanRegion: 'Intellectual Property Office, Thimphu',
    levels: [
      {
        id: 'copyright-laws',
        levelNumber: 1,
        title: 'Copyright Basics & Bhutan Law',
        pageNo: 20,
        summary: 'Copyright protects original works fixed in tangible form (written, recorded, digital). Ideas cannot be copyrighted!',
        keyConcepts: [
          'Copyright Protected Works: Legal protection granted to original literary, musical, dramatic, artistic, software, and architectural works expressed in a tangible form. For example, a newly written computer software program or a published textbook is automatically protected by copyright.',
          'Exclusive Rights of Creators: Legal rights granting authors sole authority to reproduce, distribute, publicly display, perform, or adapt their copyrighted works. For example, printing and selling copies of an author\'s book without permission violates their exclusive distribution rights.',
          'Bhutan Copyright Duration: Under the Copyright Act of the Kingdom of Bhutan, copyright protection lasts for the entire lifetime of the author plus 50 years after their death, after which the work enters the public domain. For example, classic literary works published long ago become freely accessible to the public.'
        ],
        bhutanAnalogy: 'Dorji has an idea for a movie about a Yeti playing guitar. Ideas cannot be copyrighted, but once Karma writes the full script in tangible notebook paper, the script is protected!',
        exerciseQuestion: 'A shop in Thimphu sells pirated copies of Bhutanese films ("Namkhay"). What legal consequences do they face under Bhutan Copyright Law?',
        mermaidDiagram: `graph LR
    Idea[Unfixed Idea] -->|Write down / Record| Tangible[Tangible Expression]
    Tangible -->|Automatic Protection| Copyright[Copyright Protected]
    Copyright -->|Duration in Bhutan| LifePlus50[Life of Author + 50 Years]
    LifePlus50 -->|Expires| PublicDomain[Public Domain - Free for All]`,
        xpReward: 50,
      },
      {
        id: 'creative-commons-licenses',
        levelNumber: 2,
        title: 'Creative Commons Licenses & Icons',
        pageNo: 21,
        summary: 'Creative Commons allows creators to change from "All Rights Reserved" to "Some Rights Reserved" using 4 building blocks.',
        keyConcepts: [
          'Attribution (BY) & Non-Commercial (NC): CC building blocks requiring users to always credit the original author (BY) and restricting usage exclusively to non-profit, educational, or personal purposes (NC). For example, a school sharing educational slides under CC BY-NC allows free classroom use but forbids selling them commercially.',
          'No Derivatives (ND) & Share Alike (SA): CC building blocks forbidding any alterations or modifications to the work (ND) or requiring that any new derivative works be licensed under the exact same terms (SA). For example, translating a CC BY-SA article requires releasing the translated version under the same license.',
          'CC0 Public Domain Dedication: A legal tool allowing creators to completely waive all copyright and database rights, dedicating their creative work directly to the global public domain. For example, an open-source icon designer releases their graphics under CC0 so anyone can use them without attribution.'
        ],
        bhutanAnalogy: 'Tashi shares a map of Thimphu trekking trails under CC BY-SA. When Pema adds GPS coordinates for campsites, her new Enhanced Map MUST also be released under CC BY-SA!',
        exerciseQuestion: 'An artist releases a photo of a Paro Tshechu dance under CC BY-ND. Can a graphic designer crop it and turn it black-and-white for a poetry book cover?',
        mermaidDiagram: `graph TD
    CC[Creative Commons Building Blocks] --> BY[BY - Attribution]
    CC --> NC[NC - Non Commercial]
    CC --> ND[ND - No Derivatives]
    CC --> SA[SA - Share Alike]
    
    BY --> CC_BY[CC BY: Most Permissive]
    BY + NC + ND --> CC_BY_NC_ND[CC BY-NC-ND: Most Restrictive]
    CC --> CC0[CC0: Public Domain / Zero Restrictions]`,
        xpReward: 50,
      },
      {
        id: 'fair-use-exceptions',
        levelNumber: 3,
        title: 'Fair Use & Educational Exceptions',
        pageNo: 22,
        summary: 'Fair Use allows limited use of copyrighted material without permission for criticism, news reporting, teaching, or research.',
        keyConcepts: [
          'Four Factors of Fair Use: Legal criteria used by courts to evaluate fair use: (1) purpose of use, (2) nature of copyrighted work, (3) amount used relative to the whole, and (4) market impact on the original work. For example, quoting a short book excerpt in a literary critique review qualifies as fair use.',
          'Educational Exemption: Legal provisions allowing teachers and students to use copyrighted materials in face-to-face classroom teaching without securing prior licensing permissions. For example, displaying a news clipping on a classroom projector to discuss current events is protected under educational exemptions.'
        ],
        bhutanAnalogy: 'Using 10 seconds of a Bhutanese documentary film in a Class 10 video project for critique is Fair Use; showing the full 2-hour movie on YouTube for money is copyright infringement!',
        exerciseQuestion: 'What are the 4 factors used by courts to evaluate whether an action qualifies as Fair Use?',
        mermaidDiagram: `graph TD
    FU[Fair Use Evaluation] --> F1[1. Purpose: Educational vs Commercial]
    FU --> F2[2. Nature of Work: Factual vs Creative]
    FU --> F3[3. Amount: Small Clip vs Entire Work]
    FU --> F4[4. Market Impact: Harms Sales vs No Impact]`,
        xpReward: 50,
      },
      {
        id: 'public-domain-oer',
        levelNumber: 4,
        title: 'Public Domain & Open Educational Resources',
        pageNo: 23,
        summary: 'Public Domain consists of works whose copyright has expired or been dedicated freely to the public.',
        keyConcepts: [
          'Public Domain Works: Creative works whose copyright terms have expired or been waived, making them entirely free for anyone to copy, modify, and distribute without permission. For example, traditional folk songs and classical paintings belong to the public domain.',
          'Open Educational Resources (OER): Teaching, learning, and research materials residing in the public domain or released under open licenses that permit free use, adaptation, and redistribution. For example, Bhutanese educators share free OER textbooks on online repositories for students.'
        ],
        bhutanAnalogy: 'Traditional Bhutanese folk tales written centuries ago belong to the Public Domain, so anyone can freely publish or adapt them today!',
        exerciseQuestion: 'Explain why works in the Public Domain can be freely translated or adapted into new books without asking for permission.',
        mermaidDiagram: `graph LR
    PD[Public Domain Works] --> FreeCopy[Free Copying]
    PD --> FreeAdapt[Free Adaptation]
    PD --> FreeCommercial[Free Commercial Printing]`,
        xpReward: 50,
      },
      {
        id: 'drm-software-piracy',
        levelNumber: 5,
        title: 'Digital Rights Management & Software Piracy',
        pageNo: 24,
        summary: 'Digital Rights Management (DRM) uses technology controls to restrict unauthorized copying of digital media and software.',
        keyConcepts: [
          'Digital Rights Management (DRM): Technological access control mechanisms used by publishers to restrict the copying, modification, or redistribution of digital media and software. For example, online movie streaming services use DRM encryption to prevent unauthorized screen recording.',
          'Software Piracy & Open Source: Software piracy involves illegally copying and distributing proprietary software, whereas open-source licenses (like MIT or GPL) grant users freedom to view, modify, and share source code. For example, schools use legal open-source operating systems instead of cracked commercial software.'
        ],
        bhutanAnalogy: 'Software piracy is like breaking into a craft shop and stealing carved wooden masks rather than purchasing them legally!',
        exerciseQuestion: 'Why is using open-source software (like Python or LibreOffice) safer and legally preferable for schools than using cracked software?',
        mermaidDiagram: `graph TD
    Software[Software Types] --> Prop[Proprietary - Paid License & DRM]
    Software --> Open[Open Source - Free & Transparent Code]
    Prop --> PiracyRisk[Cracked Version: Malware Risk]`,
        xpReward: 50,
      }
    ]
  },
  {
    id: 'microsoft-excel',
    chapterNumber: 5,
    title: 'Microsoft Excel & Data Analysis',
    icon: '📊',
    description: 'Master spreadsheets, AutoFill, formulas, functions (SUM, IF, AVERAGE), absolute references ($A$1), charts & data validation.',
    bhutanRegion: 'Centenary Farmers Market & Paro Apple Trade',
    levels: [
      {
        id: 'excel-basics',
        levelNumber: 1,
        title: 'Spreadsheet Grid, Navigation & AutoFill',
        pageNo: 25,
        summary: 'An Excel Workbook consists of Worksheets (3 by default in older versions). Cells are intersections of Columns (A, B) and Rows (1, 2).',
        keyConcepts: [
          'Cell Address & Grid Structure: An Excel worksheet consists of grid rows (numbers 1, 2, 3...) and columns (letters A, B, C...). Each individual cell is identified by its column letter and row number, such as cell B5. For example, entering data into cell A1 establishes the starting point of a budget spreadsheet.',
          'Navigation Keyboard Shortcuts: Efficiency shortcuts like Ctrl+Home (jumps to cell A1), Ctrl+End (jumps to the last used cell), Tab (moves to the next column), and Enter (moves to the next row). For example, pressing Ctrl+Home instantly navigates a large spreadsheet back to the top-left corner.',
          'AutoFill & Fill Handle: A powerful productivity feature where clicking and dragging the small green square (fill handle) in the bottom-right corner of a cell automatically continues numerical series, days of the week, or months. For example, dragging down from "Jan" automatically fills Feb, Mar, Apr.'
        ],
        bhutanAnalogy: 'An Excel worksheet grid is like a well-organized apple crate storage in Paro, where every crate has a specific column shelf (A, B, C) and row height (1, 2, 3)!',
        exerciseQuestion: 'What keyboard key combination moves the active cell to the very beginning of the worksheet (cell A1)?',
        sampleCodeOrFormula: 'Shortcuts: Ctrl + Home = Cell A1 | F2 = Edit Cell | Ctrl + S = Save (.xlsx)',
        mermaidDiagram: `graph TD
    Workbook[Excel Workbook] --> WS1[Worksheet 1]
    Workbook --> WS2[Worksheet 2]
    Workbook --> WS3[Worksheet 3]
    WS1 --> Columns[Columns: A, B, C...]
    WS1 --> Rows[Rows: 1, 2, 3...]
    Columns & Rows --> Cell[Active Cell e.g. C4]`,
        xpReward: 50,
      },
      {
        id: 'excel-formulas-references',
        levelNumber: 2,
        title: 'Formulas, Relative vs Absolute References',
        pageNo: 26,
        summary: 'All Excel formulas start with = sign. Relative references change when copied, while Absolute references use $ to lock cells.',
        keyConcepts: [
          'Basic Math Formulas: All Excel formulas must begin with an equals sign (=), supporting addition (=A1+B1), subtraction, multiplication (*), and division (/). For example, typing `=C2*D2` multiplies unit price by quantity to calculate total cost.',
          'Relative References: Cell references (like A1) that automatically adjust and update their row or column coordinates when copied and pasted into other cells. For example, copying a formula `=A1*B1` down to row 2 automatically changes it to `=A2*B2`.',
          'Absolute References ($A$1): Cell references locked using dollar signs (`$B$5`) so they do not change when the formula is copied to other cells, perfect for fixed tax rates or discount constants. For example, locking the tax cell with `*$F$2` ensures all row calculations multiply against the exact same tax cell.'
        ],
        bhutanAnalogy: 'Relative reference is like calculation of total apple price based on quantity per box; Absolute reference is keeping Bhutan Sales Tax fixed at 7% stored in cell $F$2!',
        exerciseQuestion: 'You calculate price in C2, qty in D2, and tax rate in F2. What exact formula should you type in E2 to calculate total cost with fixed tax rate $F$2?',
        sampleCodeOrFormula: '=C2*D2*$F$2',
        mermaidDiagram: `graph LR
    Rel[Relative Reference e.g. A1] -->|Copy Down| Changes[Adjusts to A2, A3...]
    Abs[Absolute Reference e.g. $A$1] -->|Copy Down| Fixed[Stays $A$1 Fixed]`,
        xpReward: 50,
      },
      {
        id: 'excel-functions-validation',
        levelNumber: 3,
        title: 'Built-in Math & Statistical Functions',
        pageNo: 27,
        summary: 'Master key functions SUM, AVERAGE, MIN, MAX, and COUNT to compute statistical summaries over ranges.',
        keyConcepts: [
          'Statistical & Math Functions: Built-in Excel functions like =SUM(range), =AVERAGE(range), =MIN(range), =MAX(range), and =COUNT(range) that perform calculations over cell ranges instantly. For example, `=SUM(B2:B30)` calculates the total sum of 30 student marks without manual addition.',
          'Range Syntax: The colon symbol (:) specifies a continuous block of cells from a starting cell to an ending cell (e.g., A1:A10), while commas separate non-contiguous cells (e.g., =SUM(A1, B5)). For example, `=AVERAGE(C2:C20)` averages all values from cell C2 through C20.'
        ],
        bhutanAnalogy: 'Using =SUM(B2:B30) is like an automated counting scale at Centenary Farmers Market weighing 30 potato sacks in 1 second!',
        exerciseQuestion: 'Write the Excel formula to find the highest score among student marks in range B2 to B25.',
        sampleCodeOrFormula: '=MAX(B2:B25)',
        mermaidDiagram: `graph TD
    Fn[Excel Functions] --> SUM["=SUM(range)"]
    Fn --> AVG["=AVERAGE(range)"]
    Fn --> MAX["=MAX(range)"]
    Fn --> MIN["=MIN(range)"]`,
        xpReward: 50,
      },
      {
        id: 'excel-logical-if',
        levelNumber: 4,
        title: 'Logical Functions & Decision Making (IF, AND, OR)',
        pageNo: 28,
        summary: 'Logical functions evaluate conditional tests and return different calculated outcomes.',
        keyConcepts: [
          'IF Function Syntax: Evaluates a logical condition and returns one specified value if the test is True and another value if False, formatted as `=IF(test, true_value, false_value)`. For example, `=IF(marks>=40, "Pass", "Fail")` automatically grades student exam records.',
          'Logical Operators & Compound Tests: Using comparison operators (=, <, >, <=, >=, <>) alongside compound functions like AND() and OR() to evaluate multiple conditions simultaneously. For example, `=IF(AND(Math>=40, Science>=40), "Promoted", "Retake")` checks multiple subject pass requirements.'
        ],
        bhutanAnalogy: '=IF(marks>=40, "Pass", "Fail") is like the exam evaluator at Karma Academy making automated pass/fail decisions!',
        exerciseQuestion: 'Write an Excel IF statement for cell C4 that awards 30% commission if sales in C5 is greater than or equal to $G$6, else 1% commission.',
        sampleCodeOrFormula: '=IF(C5>=$G$6, C5*0.3, C5*0.01)',
        mermaidDiagram: `flowchart TD
    Cond{Sales C5 >= $G$6?} -->|True| Commission30[C5 * 0.3]
    Cond -->|False| Commission1[C5 * 0.01]`,
        xpReward: 50,
      },
      {
        id: 'excel-data-sorting-filtering',
        levelNumber: 5,
        title: 'Data Validation, Sorting & Filtering',
        pageNo: 29,
        summary: 'Data Validation restricts user input to allowable values (numbers, dates, drop-down lists), while Sorting & Filtering organizes data.',
        keyConcepts: [
          'Data Validation Rules: Restricts user data entry to specific allowable criteria, such as whole numbers within a range (1-100) or pre-defined drop-down lists. For example, setting data validation on a student grade column prevents typographical data entry errors.',
          'Sorting and AutoFilter: Sorting organizes data rows in ascending (A-Z, 0-9) or descending order, while AutoFilter displays only rows matching specific criteria. For example, filtering an employee spreadsheet to display only staff from Thimphu Dzongkhag.'
        ],
        bhutanAnalogy: 'Data validation is like a security checkpoint at Chuzom bridge: only authorized vehicle entries (valid numbers) are allowed past!',
        exerciseQuestion: 'How does creating a Dropdown List in Excel via Data Validation prevent spelling errors during data entry?',
        mermaidDiagram: `graph LR
    Input[User Input] --> Validation{Valid Number?}
    Validation -->|Yes| Accepted[Entered in Cell]
    Validation -->|No| ErrorAlert[Show Error Dialog]`,
        xpReward: 50,
      },
      {
        id: 'excel-charts-visualization',
        levelNumber: 6,
        title: 'Visualizing Data with Column, Bar, Line & Pie Charts',
        pageNo: 30,
        summary: 'Charts convert numerical tables into visual representations to highlight trends and comparisons.',
        keyConcepts: [
          'Column and Bar Charts: Visual graphs comparing discrete categories of data using vertical columns or horizontal bars. For example, a column chart comparing electricity consumption across different Bhutanese hydropower plants.',
          'Line and Pie Charts: Line charts display data trends over continuous time intervals (like monthly rainfall), while pie charts show percentage proportions of a whole. For example, a pie chart showing budget allocation percentages for school library books.'
        ],
        bhutanAnalogy: 'A Pie Chart showing Bhutan electricity exports vs local consumption instantly visualizes percentages better than a raw table of numbers!',
        exerciseQuestion: 'Which chart type is best suited for showing monthly temperature changes in Paro over a 12-month period?',
        mermaidDiagram: `graph TD
    Data[Numerical Table] --> Column[Column Chart: Comparison]
    Data --> Line[Line Chart: Trend Over Time]
    Data --> Pie[Pie Chart: Parts of Whole]`,
        xpReward: 50,
      },
      {
        id: 'excel-vlookup-summary',
        levelNumber: 7,
        title: 'Data Lookup (VLOOKUP) & PivotTable Basics',
        pageNo: 31,
        summary: 'VLOOKUP searches for a value in the first column of a table array and returns a value in the same row from a specified column.',
        keyConcepts: [
          'VLOOKUP Function: Searches for a specific value in the leftmost column of a table array and returns a corresponding value from another column in the same row, formatted as `=VLOOKUP(value, table, col_index, FALSE)`. For example, looking up a student ID number to retrieve their registered dormitory name.',
          'PivotTable Data Analysis: An interactive analytical tool used to automatically group, sort, count, and summarize large datasets into clean summary reports. For example, creating a PivotTable to summarize total sales by region and product category in seconds.'
        ],
        bhutanAnalogy: 'VLOOKUP is like looking up a student ID in a printed school directory to immediately find their Dzongkhag home address!',
        exerciseQuestion: 'In `=VLOOKUP(A2, D2:G100, 3, FALSE)`, what does the number `3` and the argument `FALSE` represent?',
        sampleCodeOrFormula: '=VLOOKUP("STD-101", A2:D50, 2, FALSE)',
        mermaidDiagram: `graph LR
    ID["Lookup ID: STD-101"] --> Table[Table Array A2:D50]
    Table --> Col3[Return Column 3 Value]
    Col3 --> Result["Student Name: Dechen"]`,
        xpReward: 50,
      }
    ]
  },
  {
    id: 'python-basics',
    chapterNumber: 6,
    title: 'Python Introduction, Shell & Output',
    icon: '🐍',
    description: 'Start programming with Python, Guido van Rossum, IDLE Shell vs Editor, `.py` files, print(), input(), and escape characters.',
    bhutanRegion: 'Thimphu TechPark',
    levels: [
      {
        id: 'python-intro-idle',
        levelNumber: 1,
        title: 'Python History, High-Level & IDLE',
        pageNo: 32,
        summary: 'Python was created by Guido van Rossum in 1989 at CWI Netherlands, launched in 1991. It is high-level and interpreted.',
        keyConcepts: [
          'High-Level & Interpreted: Python is a high-level programming language that resembles human English and is executed line-by-line by an interpreter without requiring prior manual compilation. For example, writing `print("Hello")` executes immediately and outputs text to the screen.',
          'IDLE Environment & Shell vs Script Mode: IDLE (Integrated Development and Learning Environment) provides an interactive Shell window (>>> prompt) for quick command testing and a Code Editor window for saving multi-line `.py` script files. For example, testing math expressions in the shell vs saving a complete game script in the editor.'
        ],
        bhutanAnalogy: 'Interactive Shell is like speaking directly to a Bhutanese guide for instant answers; Script mode (.py) is writing down a full official travel itinerary to execute later!',
        exerciseQuestion: 'What is the primary prompt symbol in the Python interactive shell window that indicates it is ready for input?',
        sampleCodeOrFormula: 'print("Kuzuzangpo la!")',
        mermaidDiagram: `graph LR
    Code[.py Script File] -->|F5 / Run Module| Interpreter[Python Interpreter]
    Interpreter -->|Executes Line-by-Line| Output[Console Shell Output]`,
        xpReward: 50,
      },
      {
        id: 'print-input-escape',
        levelNumber: 2,
        title: 'print(), input(), Typecasting & Comments',
        pageNo: 33,
        summary: 'Learn output formatting with print(), receiving string inputs with input(), typecasting with int()/float(), and code comments (#).',
        keyConcepts: [
          'print() and input() Functions: `print()` outputs text and variables to the console, while `input()` prompts the user for keyboard input and returns it as a string data type. For example, `name = input("Enter name: ")` captures user input into a variable.',
          'Typecasting and Comments: Typecasting functions like `int()` and `float()` convert data types (e.g., converting string input to a number for math), while `#` symbols create comments ignored by the interpreter. For example, `age = int(input("Age: "))` ensures age is stored as an integer number.'
        ],
        bhutanAnalogy: 'input() always returns text, just like a visitor handing a written letter at the Dzong gate. If it contains numbers, you must convert it into an integer before doing math!',
        exerciseQuestion: 'Why must you wrap an input() function inside int() when asking a user for their age before calculating birth year?',
        sampleCodeOrFormula: 'age = int(input("Enter age: "))  # Typecasts string to int',
        mermaidDiagram: `graph TD
    Input[user_input = input()] -->|Returns String| StringType[String Data Type]
    StringType -->|int(user_input)| IntType[Integer Number]
    IntType -->|Math calculation| Result[Result]`,
        xpReward: 50,
      },
      {
        id: 'python-string-formatting',
        levelNumber: 3,
        title: 'Escape Sequences & String Formatting (f-strings)',
        pageNo: 34,
        summary: 'Master string output customization using f-strings and escape sequences.',
        keyConcepts: [
          'Escape Sequences: Special character combinations starting with a backslash that format text output, such as `\n` for a new line, `\t` for a tab spacing, and `\\` for a backslash. For example, `print("Line1\nLine2")` prints text on two separate lines.',
          'f-strings and Print Parameters: Formatted string literals (f-strings) embed variables directly inside strings using curly braces like `f"Hello {name}"`, while `sep` and `end` customize print formatting. For example, `print("A", "B", sep="-")` outputs `A-B`.'
        ],
        bhutanAnalogy: '\\t is like aligning Dzongkhag administrative columns neatly in a table on paper!',
        exerciseQuestion: 'What will `print("Paro", "Thimphu", sep=" -> ")` output in the Python console?',
        sampleCodeOrFormula: 'print("Paro", "Thimphu", sep=" -> ")  # Outputs: Paro -> Thimphu',
        mermaidDiagram: `graph LR
    Code["f'Name: {name}'"] --> Evaluator[Evaluates {name} Variable]
    Evaluator --> StringOutput["Formated Result String"]`,
        xpReward: 50,
      },
      {
        id: 'python-error-types',
        levelNumber: 4,
        title: 'Python Error Types (Syntax, Runtime, Logical)',
        pageNo: 35,
        summary: 'Understanding error categories helps programmers isolate and fix bugs effectively.',
        keyConcepts: [
          'Syntax Errors: Violations of Python grammar rules (such as missing parentheses or typos in keywords) that prevent the program from running at all. For example, writing `prnt("Hello")` triggers a SyntaxError.',
          'Runtime Errors: Errors that occur while the program is actively running, causing it to crash abruptly (such as dividing a number by zero). For example, `10 / 0` raises a ZeroDivisionError during execution.',
          'Logical Errors: Flaws in program logic where the code runs successfully without crashing, but produces incorrect results due to flawed formulas. For example, adding instead of multiplying numbers in a formula.'
        ],
        bhutanAnalogy: 'Syntax error is misspelling a word in a formal letter; Logical error is giving correct directions but to the wrong village!',
        exerciseQuestion: 'If a program calculates rectangle area using `area = length + width` instead of `length * width`, which type of error is this?',
        mermaidDiagram: `graph TD
    Errors[Python Errors] --> Syntax[Syntax Error: Grammar mistake]
    Errors --> Runtime[Runtime Error: Crash during execution]
    Errors --> Logical[Logical Error: Wrong mathematical output]`,
        xpReward: 50,
      },
      {
        id: 'python-string-methods',
        levelNumber: 5,
        title: 'Working with Strings & Built-in String Methods',
        pageNo: 36,
        summary: 'Strings in Python are immutable sequences of text characters.',
        keyConcepts: [
          'String Indexing & Slicing: Accessing individual characters in a string using zero-based indices in square brackets, such as `s[0]` for the first character and `s[-1]` for the last character. For example, `text = "Bhutan"; text[0]` returns `"B"`.',
          'Built-in String Methods: Powerful text manipulation methods including `.upper()`, `.lower()`, `.strip()` (removes whitespace), `.replace()`, and `.split()`. For example, `"  hello  ".strip()` returns `"hello"` with outer whitespace removed.'
        ],
        bhutanAnalogy: 'String methods are like a digital typewriter in Thimphu TechPark that can instantly convert text to ALL CAPS or replace words!',
        exerciseQuestion: 'Given `text = "  Kuzuzangpo  "`, write the string method call that removes leading and trailing spaces.',
        sampleCodeOrFormula: 'clean_text = "  Kuzuzangpo  ".strip()  # "Kuzuzangpo"',
        mermaidDiagram: `graph LR
    Str["'  bhutan  '"] --> Strip[".strip()"] --> Stripped["'bhutan'"]
    Stripped --> Upper[".upper()"] --> Final["'BHUTAN'"]`,
        xpReward: 50,
      }
    ]
  },
  {
    id: 'python-control-flow',
    chapterNumber: 7,
    title: 'Variables, Operators & Control Flow',
    icon: '⚡',
    description: 'Master variable naming, arithmetic/logical/identity operators, if-elif-else conditionals, for/while loops, and break/continue/pass.',
    bhutanRegion: 'Taktsang (Tiger\'s Nest) Trail',
    levels: [
      {
        id: 'python-variables-operators',
        levelNumber: 1,
        title: 'Variables, Identifiers & Data Types',
        pageNo: 37,
        summary: 'Variables store data in memory. Identifiers must follow syntax rules and Python data types define data behavior.',
        keyConcepts: [
          'Identifier Rules & Case Sensitivity: Variable names (identifiers) must start with a letter or underscore, cannot contain spaces or special symbols, and are strictly case-sensitive (`age` vs `Age`). For example, `student_score = 95` is a valid identifier, while `2nd_score` is invalid.',
          'Basic Data Types & type(): Fundamental Python data types include `int` (integers), `float` (decimals), `str` (strings), and `bool` (Boolean True/False), verified using `type()`. For example, `type(98.6)` returns `<class \'float\'>`.'
        ],
        bhutanAnalogy: 'An identifier is like labeling a spice jar in a Bhutanese kitchen: `chilli_powder` is valid, but `1st_spice` or reserved word `if` is strictly forbidden!',
        exerciseQuestion: 'Which of the following identifier names is INVALID in Python: `student_name`, `2nd_place`, `_class`, `totalXp`?',
        sampleCodeOrFormula: 'x = 10\nprint(type(x))  # <class \'int\'>',
        mermaidDiagram: `graph TD
    Types[Python Data Types] --> Int[int: Whole numbers]
    Types --> Float[float: Decimals]
    Types --> Str[str: Text strings]
    Types --> Bool[bool: True or False]`,
        xpReward: 50,
      },
      {
        id: 'python-arithmetic-modulo',
        levelNumber: 2,
        title: 'Arithmetic, Floor Division & Modulo Operators',
        pageNo: 38,
        summary: 'Python provides operators for standard arithmetic, exponentiation, floor division, and remainder calculation.',
        keyConcepts: [
          'Floor Division (//) and Modulo (%): Floor division (`//`) divides two numbers and truncates the decimal to return an integer quotient, while modulo (`%`) returns the exact remainder. For example, `17 // 5` evaluates to `3`, and `17 % 5` evaluates to `2`.',
          'Exponentiation (**): The power operator raises a base number to an exponent power. For example, `2 ** 3` calculates 2 cubed, resulting in `8`.'
        ],
        bhutanAnalogy: 'Floor division // calculates how many full apple boxes you can fill; Modulo % calculates how many loose apples remain leftover!',
        exerciseQuestion: 'If `a = 17` and `b = 5`, what are the results of `a // b` and `a % b` in Python?',
        sampleCodeOrFormula: 'print(17 // 5)  # 3\nprint(17 % 5)  # 2',
        mermaidDiagram: `graph LR
    Div[17 / 5 = 3.4] --> Floor[17 // 5 = 3 Quotient]
    Div --> Mod[17 % 5 = 2 Remainder]`,
        xpReward: 50,
      },
      {
        id: 'python-comparison-logical',
        levelNumber: 3,
        title: 'Comparison, Logical, Identity & Membership Operators',
        pageNo: 39,
        summary: 'Boolean expressions use relational and logical operators to determine truth values.',
        keyConcepts: [
          'Relational and Logical Operators: Comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`) evaluate expressions to Booleans, while logical operators (`and`, `or`, `not`) combine multiple conditions. For example, `(score >= 40) and (attendance >= 80)` checks two conditions simultaneously.',
          'Membership and Identity Operators: Membership operators (`in`, `not in`) check if a value exists within a sequence, and identity operators (`is`, `is not`) compare memory locations. For example, `"a" in "Bhutan"` evaluates to `True`.'
        ],
        bhutanAnalogy: 'Logical `and` is like needing BOTH a valid ticket AND a student ID card to enter the Paro archery tournament!',
        exerciseQuestion: 'What will expression `(5 > 3) and (10 == 20)` evaluate to in Python?',
        sampleCodeOrFormula: 'print((5 > 3) and (10 == 20))  # False',
        mermaidDiagram: `graph TD
    Op[Operators] --> Comp[Comparison: ==, !=, <, >]
    Op --> Logic[Logical: and, or, not]
    Op --> Mem[Membership: in, not in]`,
        xpReward: 50,
      },
      {
        id: 'python-conditionals',
        levelNumber: 4,
        title: 'Conditional Statements (if, if-else, if-elif-else, nested)',
        pageNo: 40,
        summary: 'Conditionals control program execution flow based on Boolean truth values with mandatory 4-space indentation.',
        keyConcepts: [
          'if, elif, else Statements: Conditional statements control execution paths based on Boolean conditions, requiring strict 4-space indentation for code blocks. For example, an `if-elif-else` structure checks student exam marks to assign letter grades A, B, or C.',
          'Nested Conditionals: Placing one conditional `if` statement inside another `if` statement to evaluate multi-layered decision criteria. For example, checking if a student passed math, and if so, whether their score exceeds 90 for distinction.'
        ],
        bhutanAnalogy: 'Deciding weather gear for trekking to Taktsang: if temperature > 30°C wear light gho/kira; elif temperature < 10°C wear warm woolen cloak; else wear standard dress!',
        exerciseQuestion: 'Write a Python if-elif-else structure that checks student marks out of 100 and prints "Pass" if marks >= 40, else "Fail".',
        sampleCodeOrFormula: 'marks = int(input("Enter marks: "))\nif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")',
        mermaidDiagram: `flowchart TD
    Start([Start]) --> Cond{marks >= 40?}
    Cond -->|True| Pass[Print Pass]
    Cond -->|False| Fail[Print Fail]
    Pass --> End([End])
    Fail --> End`,
        xpReward: 50,
      },
      {
        id: 'python-loops-control',
        levelNumber: 5,
        title: 'Definite Iteration with for Loops & range()',
        pageNo: 41,
        summary: '`for` loops iterate over sequences or number ranges generated by range().',
        keyConcepts: [
          'for Loops & range() Generator: `for` loops iterate over sequences or number ranges generated by `range(start, stop, step)`, where the stop value is excluded. For example, `range(1, 6)` generates numbers 1, 2, 3, 4, 5.',
          'Iterating Sequences: Traversing through every character in a string or every item in a list using a `for` loop. For example, iterating through `for char in "Paro":` prints each letter individually.'
        ],
        bhutanAnalogy: 'A for loop is like chanting 108 prayer wheel rotations in sequence from 1 to 108!',
        exerciseQuestion: 'What sequence of numbers will `range(5, 20, 5)` generate in a Python for loop?',
        sampleCodeOrFormula: 'for i in range(5, 20, 5):\n    print(i)  # Prints 5, 10, 15',
        mermaidDiagram: `flowchart TD
    Start([Start Loop]) --> Check{i in range?}
    Check -->|True| Exec[Execute Statements]
    Exec --> Inc[Next Sequence Item]
    Inc --> Check
    Check -->|False| Exit([Loop Ends])`,
        xpReward: 50,
      },
      {
        id: 'python-while-loops',
        levelNumber: 6,
        title: 'Indefinite Iteration with while Loops',
        pageNo: 42,
        summary: '`while` loops repeat execution as long as a dynamic Boolean condition remains True.',
        keyConcepts: [
          'while Loop Execution: Repeats a block of code continuously as long as its controlling Boolean condition evaluates to `True`. For example, a game loop continues running while `score < 100`.',
          'Loop Variable Updates & Sentinel Loops: Programmers must update loop variables inside the body to prevent infinite loops, or use sentinel values to exit when requested. For example, stopping a while loop when the user types `"quit"` avoids infinite execution.'
        ],
        bhutanAnalogy: 'A while loop is like spinning a prayer wheel continuously until the monk rings the evening bell!',
        exerciseQuestion: 'What happens if a while loop condition never becomes False and contains no break statement?',
        sampleCodeOrFormula: 'count = 1\nwhile count <= 5:\n    print(count)\n    count += 1',
        mermaidDiagram: `flowchart TD
    Start([Start Loop]) --> Cond{count <= 5?}
    Cond -->|True| Body[Print & Increment count]
    Body --> Cond
    Cond -->|False| End([Exit Loop])`,
        xpReward: 50,
      },
      {
        id: 'python-loop-break-continue',
        levelNumber: 7,
        title: 'Loop Control (break, continue, pass) & Nested Loops',
        pageNo: 43,
        summary: 'Control statements alter standard loop iteration behavior.',
        keyConcepts: [
          'break, continue, and pass: `break` instantly terminates the loop, `continue` skips the current iteration and jumps to the next, and `pass` acts as a null placeholder statement. For example, using `break` to exit a search loop immediately upon finding a matching item.',
          'Nested Loops: Placing one loop inside another loop, frequently used for 2D grids or multiplication tables. For example, an outer loop for rows and an inner loop for columns prints a complete multiplication grid.'
        ],
        bhutanAnalogy: '`break` is exiting a trail walk instantly when rain starts; `continue` is skipping one muddy puddle step and continuing walking!',
        exerciseQuestion: 'What is the purpose of the `pass` keyword in a Python loop or conditional block?',
        sampleCodeOrFormula: 'for i in range(1, 10):\n    if i == 5:\n        break  # Stops loop when i reaches 5',
        mermaidDiagram: `graph TD
    Loop[Loop Iteration] --> Check{Condition?}
    Check -->|break| Terminate[Exit Loop Immediately]
    Check -->|continue| NextIter[Skip to Next Iteration]
    Check -->|pass| DoNothing[Placeholder - Keep Going]`,
        xpReward: 50,
      }
    ]
  },
  {
    id: 'python-collections',
    chapterNumber: 8,
    title: 'Python Collections (Data Structures)',
    icon: '📦',
    description: 'Master Lists, Tuples, Sets, and Dictionaries: ordering, mutability, methods, slicing, and dictionary comprehensions.',
    bhutanRegion: 'Paddy Fields & River Banks of Paro',
    levels: [
      {
        id: 'python-lists',
        levelNumber: 1,
        title: 'Python Lists (Ordered & Mutable)',
        pageNo: 44,
        summary: 'Lists store multiple items in a single variable using square brackets []. Lists are ordered, mutable, and allow duplicate items.',
        keyConcepts: [
          'Lists and Indexing: Lists are ordered, mutable collections enclosed in square brackets `[]` that allow duplicate items and indexing like `my_list[0]`. For example, `marks = [85, 90, 78]` stores three test scores in sequence.',
          'Slicing and Mutability: Slicing extracts sub-lists using `list[start:stop]`, and lists are mutable so individual elements can be reassigned in place. For example, `marks[0] = 95` updates the first item.'
        ],
        bhutanAnalogy: 'A list is like a basket of Bhutanese farm produce: you can add an apple at the end (`append`), swap oranges, or sort items by weight!',
        exerciseQuestion: 'Given `dishes = ["Ema Datshi", "Jasha Maroo", "Phaksha Paa"]`, write code to access the second item.',
        sampleCodeOrFormula: 'dishes = ["Ema Datshi", "Jasha Maroo", "Phaksha Paa"]\nprint(dishes[1])  # "Jasha Maroo"',
        mermaidDiagram: `graph LR
    List["List: ['Ema Datshi', 'Jasha Maroo']"] --> Index0["Index 0: Ema Datshi"]
    List --> Index1["Index 1: Jasha Maroo"]`,
        xpReward: 50,
      },
      {
        id: 'python-list-methods',
        levelNumber: 2,
        title: 'Essential List Methods & Operations',
        pageNo: 45,
        summary: 'Python provides rich built-in methods for modifying and sorting list elements.',
        keyConcepts: [
          'Adding and Removing Elements: Methods like `append()` and `insert()` add items, while `remove()` and `pop()` delete items from a list. For example, `dishes.append("Momos")` adds a new dish to the end of the list.',
          'Sorting and Reordering: The `.sort()` method rearranges list elements in ascending order, while `.reverse()` reverses element positions. For example, sorting a list of numbers puts them in numerical order.'
        ],
        bhutanAnalogy: '`append()` adds a new item to the end of your shopping cart; `pop()` removes and returns the top item!',
        exerciseQuestion: 'What is the difference between `list.remove("item")` and `list.pop(0)`?',
        sampleCodeOrFormula: 'nums = [3, 1, 4, 2]\nnums.sort()\nprint(nums)  # [1, 2, 3, 4]',
        mermaidDiagram: `graph TD
    Methods[List Methods] --> Append[append: Add to end]
    Methods --> Insert[insert: Add at specific index]
    Methods --> Pop[pop: Remove by index]
    Methods --> Sort[sort: Rearrange order]`,
        xpReward: 50,
      },
      {
        id: 'python-tuples-sets',
        levelNumber: 3,
        title: 'Tuples (Immutable) & Conversion Techniques',
        pageNo: 46,
        summary: 'Tuples () are ordered and immutable collections. Once created, tuple items cannot be altered.',
        keyConcepts: [
          'Tuples (Immutable Sequences): Tuples `()` are ordered collections that cannot be modified after creation, protecting constant data integrity. For example, `gps = (27.47, 89.63)` stores fixed geographic coordinates securely.',
          'Tuple Conversion Workaround: Since tuples are immutable, developers convert a tuple to a list (`list(t)`), modify the elements, and convert it back (`tuple(l)`). For example, modifying a tuple requires this temporary list conversion.'
        ],
        bhutanAnalogy: 'A tuple is like carved stone inscriptions in Punakha Dzong (cannot be altered); if you must edit, you make a paper copy (list), edit, and re-carve!',
        exerciseQuestion: 'Why are tuples preferred over lists when storing fixed configuration values like server coordinates?',
        sampleCodeOrFormula: 'coord = (27.38, 89.42)\n# coord[0] = 28.0  # TypeError: tuple object does not support item assignment',
        mermaidDiagram: `graph TD
    Data[Tuple Data] --> Fixed[Immutable Memory Structure]
    Fixed --> Protected[Read-Only Data Integrity]`,
        xpReward: 50,
      },
      {
        id: 'python-set-operations',
        levelNumber: 4,
        title: 'Sets & Set Operations (Unique Elements)',
        pageNo: 47,
        summary: 'Sets {} store unordered, unindexed, unique elements and support mathematical set operations.',
        keyConcepts: [
          'Sets & Uniqueness: Sets `{}` store unordered, unindexed collections of unique items, automatically discarding duplicate values. For example, converting `[1, 2, 2, 3]` to a set results in `{1, 2, 3}`.',
          'Mathematical Set Operations: Sets support powerful operations including union (`|`), intersection (`&`), and difference (`-`). For example, finding common students enrolled in two clubs using intersection.'
        ],
        bhutanAnalogy: 'A set is like a collection of unique prayer flags on Chelela Pass: duplicate flag patterns are ignored so only distinct flags remain!',
        exerciseQuestion: 'What is the main difference between set method `remove()` and `discard()` when an item is NOT present in the set?',
        sampleCodeOrFormula: 'a = {1, 2, 3}\nb = {3, 4, 5}\nprint(a.intersection(b))  # {3}',
        mermaidDiagram: `graph LR
    SetA["Set A: {1, 2, 3}"] & SetB["Set B: {3, 4, 5}"] --> Intersection["Intersection (&): {3}"]
    SetA & SetB --> Union["Union (|): {1, 2, 3, 4, 5}"]`,
        xpReward: 50,
      },
      {
        id: 'python-dictionaries',
        levelNumber: 5,
        title: 'Dictionaries & Key-Value Pairs',
        pageNo: 48,
        summary: 'Dictionaries store key-value pairs in curly braces {}. Keys must be unique and immutable.',
        keyConcepts: [
          'Dictionary Key-Value Pairs: Dictionaries store data in key-value pairs inside curly braces `{}`, where keys must be unique and immutable. For example, `student = {"name": "Pema", "age": 16}` maps keys to values.',
          'Accessing with .get(): Using `.get("key", default)` safely retrieves dictionary values without raising a KeyError if the key is missing. For example, `student.get("grade", "N/A")` prevents crashes.'
        ],
        bhutanAnalogy: 'A dictionary is like a Dzongkha-English glossary: search by key word ("Dzong") to find its value definition ("Fortress")!',
        exerciseQuestion: 'What dictionary method should you use instead of bracket indexing `d[key]` to avoid getting a KeyError if the key does not exist?',
        sampleCodeOrFormula: 'student = {"name": "Pema", "age": 16}\nprint(student.get("village", "Not Found"))  # "Not Found"',
        mermaidDiagram: `graph LR
    Dict["Dict: {'name': 'Pema'}"] --> Get["get('age')"] --> Val["16"]
    Dict --> Keys["keys()"] --> KList["['name', 'age']"]`,
        xpReward: 50,
      },
      {
        id: 'python-dict-methods',
        levelNumber: 6,
        title: 'Dictionary Methods & Dictionary Comprehension',
        pageNo: 49,
        summary: 'Explore iteration over key-value pairs and dictionary comprehensions.',
        keyConcepts: [
          'Dictionary Methods & Iteration: Methods like `.keys()`, `.values()`, and `.items()` return views for iterating over dictionary data with `for` loops. For example, `for k, v in d.items():` loops through all key-value pairs.',
          'Dictionary Comprehension: A concise syntax for generating dictionaries in a single line, such as `{x: x**2 for x in range(1, 4)}`. For example, creating a lookup table of squares instantly.'
        ],
        bhutanAnalogy: 'Dictionary comprehension is like an automated sorting machine generating student ID badge labels in one fast line of code!',
        exerciseQuestion: 'Write a dictionary comprehension that creates a dictionary mapping numbers 1 through 4 to their cubed values.',
        sampleCodeOrFormula: 'cubes = {x: x**3 for x in range(1, 5)}\nprint(cubes)  # {1: 1, 2: 8, 3: 27, 4: 64}',
        mermaidDiagram: `graph TD
    Comp["{x: x**2 for x in range(1,4)}"] --> Loop[Loop x: 1, 2, 3]
    Loop --> Map["Generate Key: Value Pairs"]
    Map --> Output["{1: 1, 2: 4, 3: 9}"]`,
        xpReward: 50,
      }
    ]
  },
  {
    id: 'python-functions',
    chapterNumber: 9,
    title: 'Python Functions, Scope & Recursion',
    icon: '🔁',
    description: 'Master modular programming with def functions, positional/keyword arguments, global/local scope, return values, and recursive functions.',
    bhutanRegion: 'Karma Academy & Jigme Namgyel Tower',
    levels: [
      {
        id: 'python-user-functions',
        levelNumber: 1,
        title: 'User-Defined Functions & Parameters',
        pageNo: 50,
        summary: 'Functions are reusable blocks of code defined using the `def` keyword. Parameters act as placeholders for arguments.',
        keyConcepts: [
          'User-Defined Functions & def: Functions are reusable code blocks defined using the `def` keyword, accepting parameters and performing specific tasks. For example, `def greet(): print("Kuzuzangpo")` defines a reusable greeting function.',
          'Parameters vs Arguments: Parameters are placeholder variable names listed in the function definition, while arguments are the actual values passed when calling the function. For example, passing `10, 5` as arguments into `calculate_area(l, w)` parameters.'
        ],
        bhutanAnalogy: 'A function is like a recipe for making Suja (butter tea): whenever visitors arrive, you call `make_suja(tea_leaves, butter)` instead of re-explaining the entire recipe!',
        exerciseQuestion: 'Define a Python function named `calculate_area` that takes `length` and `width` as parameters and returns the calculated area.',
        sampleCodeOrFormula: 'def calculate_area(length, width):\n    return length * width\n\nprint(calculate_area(10, 5))  # 50',
        mermaidDiagram: `graph TD
    Call["calculate_area(10, 5)"] -->|Passes Arguments| Func["def calculate_area(length, width)"]
    Func -->|Calculates length * width| Return["return 50"]`,
        xpReward: 50,
      },
      {
        id: 'python-argument-types',
        levelNumber: 2,
        title: 'Default, Keyword & Variable-length Arguments',
        pageNo: 51,
        summary: 'Functions support positional, default, keyword, and arbitrary variable-length arguments (*args, **kwargs).',
        keyConcepts: [
          'Default and Keyword Arguments: Default arguments provide fallback values if none are passed (e.g., `def run(speed=60):`), and keyword arguments specify parameter names explicitly during calls. For example, `greet(name="Dechen", title="Dasho")` specifies arguments by keyword.',
          'Variable-Length Arguments (*args, **kwargs): `*args` accepts an arbitrary tuple of positional arguments, and `**kwargs` accepts a dictionary of keyword arguments for maximum flexibility. For example, building functions that accept any number of score inputs.'
        ],
        bhutanAnalogy: 'Default arguments are like ordering milk tea in Bhutan: it comes with sugar by default unless you explicitly specify `sugar=False`!',
        exerciseQuestion: 'What is the advantage of specifying default parameter values in a Python function definition?',
        sampleCodeOrFormula: 'def welcome(student, school="Karma Academy"):\n    print(f"Welcome {student} from {school}")',
        mermaidDiagram: `graph TD
    Args[Argument Types] --> Positional[Positional: Passed in order]
    Args --> Default[Default: Fallback value]
    Args --> Keyword[Keyword: name=value]
    Args --> VarLength["*args & **kwargs: Flexible count"]`,
        xpReward: 50,
      },
      {
        id: 'python-return-values',
        levelNumber: 3,
        title: 'Return Statements & Multiple Return Values',
        pageNo: 52,
        summary: 'Functions return results back to the caller using the return keyword. In Python, returning multiple comma-separated values returns a tuple.',
        keyConcepts: [
          'return Statement & Multiple Returns: The `return` statement exits a function immediately and sends data back to the caller, returning `None` if omitted. Functions can also return multiple comma-separated values as a tuple. For example, `return min_val, max_val` returns two values simultaneously.',
          'Void Functions: Functions that perform actions (like printing text) without a `return` statement, implicitly returning `None` to the calling program.'
        ],
        bhutanAnalogy: 'A return statement is like a messenger returning from the Dzong with official stamped approval documents!',
        exerciseQuestion: 'What data type is returned when a Python function uses statement `return min_val, max_val`?',
        sampleCodeOrFormula: 'def min_max(numbers):\n    return min(numbers), max(numbers)\n\nlow, high = min_max([10, 5, 20])  # low=5, high=20',
        mermaidDiagram: `graph LR
    Func["min_max([10, 5, 20])"] --> Calc[Computes min & max]
    Calc --> Ret["return 5, 20 (Tuple)"]`,
        xpReward: 50,
      },
      {
        id: 'python-scope-recursion',
        levelNumber: 4,
        title: 'Variable Scope (Local vs Global) & global Keyword',
        pageNo: 53,
        summary: 'Local scope exists only inside a function; Global scope exists across the entire script.',
        keyConcepts: [
          'Local vs Global Scope: Local variables exist only inside their defining function, whereas global variables are declared in the main script and accessible everywhere. For example, a variable inside `calc()` cannot be accessed outside it.',
          'The global Keyword: Allows a function to modify a global variable from within its local scope using the `global` keyword. For example, `global score; score += 10` updates the global score variable.'
        ],
        bhutanAnalogy: 'Local variable is a classroom notice on a specific Karma Academy room board; Global variable is a national school holiday notice published across all Bhutan!',
        exerciseQuestion: 'What keyword must be used inside a Python function to modify a variable declared in the global scope?',
        sampleCodeOrFormula: 'count = 0\ndef increment():\n    global count\n    count += 1',
        mermaidDiagram: `graph TD
    Scope[Variable Scope] --> Local[Local Scope: Inside Function Only]
    Scope --> Global[Global Scope: Accessible Everywhere]
    Local -->|global keyword| ModifyGlobal[Modify Global Variable]`,
        xpReward: 50,
      },
      {
        id: 'python-recursive-functions',
        levelNumber: 5,
        title: 'Recursive Functions, Base Case & Call Stack',
        pageNo: 54,
        summary: 'Recursive functions call themselves until reaching a Base Case condition that stops recursion.',
        keyConcepts: [
          'Base Case & Recursive Step: Recursive functions call themselves to solve smaller sub-problems, requiring a strict Base Case condition to stop recursion and prevent stack overflow errors. For example, `if n == 0: return 1` acts as the base case for factorial calculation.',
          'Call Stack Memory: The underlying system memory stack that tracks active function calls during recursion, popping completed frames as base cases are reached.'
        ],
        bhutanAnalogy: 'Recursion is like an echo echoing across Paro valley: each echo gets smaller until it reaches base mountain stillness (Base Case)!',
        exerciseQuestion: 'What two essential components MUST every recursive function have to prevent infinite loops?',
        sampleCodeOrFormula: 'def factorial(n):\n    if n == 0:  # Base Case\n        return 1\n    else:  # Recursive Case\n        return n * factorial(n - 1)',
        mermaidDiagram: `flowchart TD
    Fact["factorial(3)"] -->|3 * factorial(2)| Fact2["factorial(2)"]
    Fact2 -->|2 * factorial(1)| Fact1["factorial(1)"]
    Fact1 -->|1 * factorial(0)| Fact0["factorial(0)"]
    Fact0 -->|Base Case| One[Return 1]
    One --> Res[Result = 6]`,
        xpReward: 50,
      }
    ]
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-paro-cloud',
    name: 'Paro Cloud Pathfinder',
    description: 'Completed Cloud Services & Deployment Models with mastery.',
    icon: '☁️',
    category: 'Cloud Services',
    unlocked: false,
    criteria: 'Complete all 6 levels of Cloud Services with 80%+ quiz score.'
  },
  {
    id: 'badge-workspace-hero',
    name: 'Workspace Collaboration Hero',
    description: 'Mastered Google Workspace tools and real-time co-authoring.',
    icon: '💼',
    category: 'Google Workspace',
    unlocked: false,
    criteria: 'Complete all Google Workspace quest modules.'
  },
  {
    id: 'badge-copyright-sentinel',
    name: 'Copyright Sentinel',
    description: 'Demonstrated excellence in digital citizenship and citation ethics.',
    icon: '📜',
    category: 'Digital Citizenship',
    unlocked: false,
    criteria: 'Master copyright laws, Fair Use, and APA/MLA/IEEE citations.'
  },
  {
    id: 'badge-excel-grandmaster',
    name: 'Excel Grandmaster',
    description: 'Conquered formulas, VLOOKUP, logical IF, and spreadsheet data analysis.',
    icon: '📊',
    category: 'Microsoft Excel',
    unlocked: false,
    criteria: 'Complete all Excel simulator challenges and quiz questions.'
  },
  {
    id: 'badge-python-coder',
    name: 'Python Coder Laureate',
    description: 'Mastered Python syntax, control flow, functions, and data structures.',
    icon: '🐍',
    category: 'Python Programming',
    unlocked: false,
    criteria: 'Pass all Python quest chapters and coding IDE labs.'
  },
  {
    id: 'badge-logic-guru',
    name: 'Logic & Control Master',
    description: 'Mastered conditional branching, loops, and boolean logic.',
    icon: '⚡',
    category: 'Control Flow',
    unlocked: false,
    criteria: 'Complete all control flow quest levels successfully.'
  },
  {
    id: 'badge-collections-king',
    name: 'Collections Architecture Expert',
    description: 'Mastered Python Lists, Tuples, Sets, and Dictionaries.',
    icon: '📦',
    category: 'Data Structures',
    unlocked: false,
    criteria: 'Score 100% on Python data structure challenges.'
  },
  {
    id: 'badge-recursion-legend',
    name: 'Recursion & Function Legend',
    description: 'Mastered user functions, variable scopes, and recursive algorithms.',
    icon: '🔁',
    category: 'Functions & Recursion',
    unlocked: false,
    criteria: 'Master all advanced function and recursion levels.'
  },
  {
    id: 'badge-gnh-guardian',
    name: 'GNH Digital Guardian',
    description: 'Balanced technological progress with Gross National Happiness principles.',
    icon: '🛡️',
    category: 'GNH & Ethics',
    unlocked: false,
    criteria: 'Complete the GNH EdTech game and ethical decision scenarios.'
  },
  {
    id: 'badge-edtech-pioneer',
    name: 'Bhutan EdTech Pioneer',
    description: 'Completed comprehensive BCSEA exam prep and ICT mastery curriculum.',
    icon: '🎓',
    category: 'Exam Mastery',
    unlocked: false,
    criteria: 'Pass the BCSEA Class 10 ICT final mock examination.'
  },
  {
    id: 'badge-local-tech-champion',
    name: 'Local Tech Champion',
    description: 'Contributed custom interactive lesson modules to the platform database.',
    icon: '🏆',
    category: 'Teacher Portal',
    unlocked: false,
    criteria: 'Generate and publish at least one custom teacher lesson plan.'
  }
];
