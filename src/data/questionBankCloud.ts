import { InteractiveQuestion, createRandomizedMCQ } from './predefinedQuestions';

export const questionBankCloud: Record<string, InteractiveQuestion[]> = {
  'cloud-types': [
    createRandomizedMCQ(
      'cloud-types-q1',
      'Which cloud service model is best suited for Charro Bakery in Paro town since they have no IT department and want a ready-to-use custom ordering system?',
      'SaaS (Software as a Service)',
      ['PaaS (Platform as a Service)', 'IaaS (Infrastructure as a Service)', 'On-Premise Private Server'],
      'SaaS provides fully functional, ready-to-use software over the internet, requiring no coding or IT setup.'
    ),
    {
      id: 'cloud-types-q2',
      question: 'Fill in the blank: Cloud platforms like Google App Engine and Heroku that let developers deploy code without worrying about server operating systems are called ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'PaaS',
      explanation: 'PaaS (Platform as a Service) provides developers with the environment and tools needed to build apps.'
    },
    {
      id: 'cloud-types-q3',
      question: 'Complete the statement regarding Infrastructure as a Service:',
      type: 'drag-drop',
      blankSentence: 'AWS EC2, Google Compute Engine, and virtual servers rented as raw compute materials represent ______.',
      dragOptions: ['IaaS', 'SaaS', 'PaaS', 'FaaS'],
      correctAnswer: 'IaaS',
      explanation: 'IaaS gives IT administrators raw computing infrastructure like virtual servers, storage, and networking.'
    },
    {
      id: 'cloud-types-q4',
      question: 'Match each Cloud Service Model with its primary target user:',
      type: 'match-following',
      leftItems: ['IaaS', 'PaaS', 'SaaS'],
      rightItems: ['IT Administrators & Network Architects', 'Software Developers & Coders', 'Everyday Users (Students & Teachers)'],
      correctAnswer: {
        'IaaS': 'IT Administrators & Network Architects',
        'PaaS': 'Software Developers & Coders',
        'SaaS': 'Everyday Users (Students & Teachers)'
      },
      explanation: 'IaaS is managed by IT admins, PaaS is used by developers, and SaaS is used by everyday end-users.'
    },
    createRandomizedMCQ(
      'cloud-types-q5',
      'What do users manage when utilizing a SaaS application like Gmail or Netflix?',
      'Nothing! The provider manages code, servers, security, and updates.',
      ['Operating system and virtual hard drives', 'Application source code and libraries', 'Network cables and physical routers'],
      'In SaaS, the cloud vendor manages everything from physical servers to software updates.'
    ),
    createRandomizedMCQ(
      'cloud-types-q6',
      'Which of the following is an example of Infrastructure as a Service (IaaS)?',
      'Amazon Web Services (AWS) EC2',
      ['Google App Engine', 'Microsoft Azure App Service', 'Google Docs'],
      'AWS EC2 provides raw virtual servers and storage, making it an IaaS offering.'
    ),
    {
      id: 'cloud-types-q7',
      question: 'Fill in the blank: In PaaS, software developers manage the application ______ while the cloud provider manages the operating system.',
      type: 'fill-in-the-blank',
      correctAnswer: 'code',
      explanation: 'Developers in PaaS focus strictly on writing and managing application code.'
    },
    {
      id: 'cloud-types-q8',
      question: 'Identify the correct cloud service model for Google App Engine:',
      type: 'drag-drop',
      blankSentence: 'Google App Engine is an example of ______ where programmers deploy web apps directly.',
      dragOptions: ['PaaS', 'IaaS', 'SaaS', 'DaaS'],
      correctAnswer: 'PaaS',
      explanation: 'Google App Engine is a classic Platform as a Service for developers.'
    },
    {
      id: 'cloud-types-q9',
      question: 'Match the service example to its cloud service tier:',
      type: 'match-following',
      leftItems: ['Google Compute Engine', 'Heroku', 'Spotify'],
      rightItems: ['IaaS', 'PaaS', 'SaaS'],
      correctAnswer: {
        'Google Compute Engine': 'IaaS',
        'Heroku': 'PaaS',
        'Spotify': 'SaaS'
      },
      explanation: 'Compute Engine is raw infrastructure (IaaS), Heroku is a dev platform (PaaS), Spotify is an end-user app (SaaS).'
    },
    createRandomizedMCQ(
      'cloud-types-q10',
      'Why is SaaS the most common type of cloud service used in schools across Bhutan?',
      'It requires no software installation or code writing; users simply log in via web browser.',
      ['It requires manual hardware installation in the school computer lab.', 'It requires students to configure Linux OS kernels.', 'It costs thousands of dollars per device.'],
      'SaaS applications like Google Workspace run directly in browsers without requiring technical installation.'
    )
  ],

  'cloud-deployment': [
    createRandomizedMCQ(
      'cloud-deployment-q1',
      'How does JDWNRH Hospital manage both confidential patient records and a public website for doctor directories?',
      'By implementing a Hybrid Cloud model',
      ['By hosting everything on a Public Cloud', 'By using a standalone offline USB drive', 'By relying purely on IaaS without networking'],
      'Hybrid Cloud keeps confidential medical records on a secure Private Cloud while hosting public visitor info on a Public Cloud.'
    ),
    {
      id: 'cloud-deployment-q2',
      question: 'Fill in the blank: A cloud deployment model that is owned by a single organization exclusively for maximum security is called a ______ cloud.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Private',
      explanation: 'Private Cloud is dedicated solely to one organization, providing maximum security and control.'
    },
    {
      id: 'cloud-deployment-q3',
      question: 'Complete the cloud deployment analogy from the textbook:',
      type: 'drag-drop',
      blankSentence: 'Sharing cloud hardware with millions of users like Gmail or Dropbox is like riding a ______ bus.',
      dragOptions: ['Public', 'Private', 'Hybrid', 'Chartered'],
      correctAnswer: 'Public',
      explanation: 'Public Cloud is compared to a public bus where resources are shared among passengers.'
    },
    {
      id: 'cloud-deployment-q4',
      question: 'Match each cloud deployment model with its characteristic:',
      type: 'match-following',
      leftItems: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud'],
      rightItems: ['Shared infrastructure, cost-effective (Public Bus)', 'Dedicated to single organization, highest security (Private Car)', 'Mix of public and private clouds for flexibility'],
      correctAnswer: {
        'Public Cloud': 'Shared infrastructure, cost-effective (Public Bus)',
        'Private Cloud': 'Dedicated to single organization, highest security (Private Car)',
        'Hybrid Cloud': 'Mix of public and private clouds for flexibility'
      },
      explanation: 'Public is shared, Private is dedicated, Hybrid combines both.'
    },
    createRandomizedMCQ(
      'cloud-deployment-q5',
      'Why would a large bank or government agency in Bhutan build a Private Cloud?',
      'Because they handle top secret or sensitive financial data that cannot be shared on public hardware.',
      ['Because Private Cloud is cheaper than Public Cloud.', 'Because Private Cloud requires no internet connection.', 'Because Public Cloud does not support web browsers.'],
      'Private cloud provides total control and isolation for sensitive government and financial records.'
    ),
    createRandomizedMCQ(
      'cloud-deployment-q6',
      'Which cloud deployment model is used when a school stores student grades in a private database but uses Google Drive for class projects?',
      'Hybrid Cloud',
      ['Public Cloud', 'Private Cloud', 'Community Cloud'],
      'Combining a private internal grade storage with a public cloud tool like Google Drive represents a Hybrid Cloud approach.'
    ),
    {
      id: 'cloud-deployment-q7',
      question: 'Fill in the blank: Gmail and Dropbox are examples of ______ cloud services where infrastructure is shared among millions.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Public',
      explanation: 'Gmail and Dropbox run on public cloud infrastructure managed by Google and Dropbox.'
    },
    {
      id: 'cloud-deployment-q8',
      question: 'Classify the security level:',
      type: 'drag-drop',
      blankSentence: 'The cloud deployment model offering the highest level of security and custom control is the ______ cloud.',
      dragOptions: ['Private', 'Public', 'Hybrid', 'Open'],
      correctAnswer: 'Private',
      explanation: 'Private cloud gives organizations complete sovereignty over security configurations.'
    },
    {
      id: 'cloud-deployment-q9',
      question: 'Match the deployment model with its real-world example from ICT-10:',
      type: 'match-following',
      leftItems: ['Gmail inbox', 'Bank internal customer database', 'Netflix video streaming + private CDN'],
      rightItems: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud'],
      correctAnswer: {
        'Gmail inbox': 'Public Cloud',
        'Bank internal customer database': 'Private Cloud',
        'Netflix video streaming + private CDN': 'Hybrid Cloud'
      },
      explanation: 'Gmail is public, bank database is private, Netflix utilizes a hybrid cloud architecture.'
    },
    createRandomizedMCQ(
      'cloud-deployment-q10',
      'What is a primary financial drawback of building a Private Cloud compared to using a Public Cloud?',
      'It is much more expensive because the organization pays for all hardware, fuel/electricity, and maintenance.',
      ['It forces the user to share data publicly.', 'It cannot be accessed remotely.', 'It restricts the number of allowed files to 10.'],
      'Private clouds require high capital expenditure and dedicated maintenance teams.'
    )
  ],

  'cloud-benefits-drawbacks': [
    createRandomizedMCQ(
      'cloud-benefits-drawbacks-q1',
      'What is the biggest risk if Karma Academy moves 100% of exams and lessons to the cloud and the internet connection drops in Paro?',
      'Internet Dependency: Students and teachers are locked out of all files and cannot conduct exams.',
      ['Vendor Lock-in: All computers will overheat.', 'Disaster Recovery: Files will be permanently erased.', 'Cost Efficiency: Fees double automatically.'],
      'No Wi-Fi means no access to cloud files, highlighting internet dependency.'
    ),
    {
      id: 'cloud-benefits-drawbacks-q2',
      question: 'Fill in the blank: The cloud feature that allows server capacity to automatically expand when web traffic spikes is called ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Scalability',
      explanation: 'Scalability (or flexibility) allows systems to handle sudden traffic spikes without crashing.'
    },
    {
      id: 'cloud-benefits-drawbacks-q3',
      question: 'Identify the cloud drawback described below:',
      type: 'drag-drop',
      blankSentence: 'Difficulty moving thousands of family photos and videos from Apple iCloud to Google Drive is called vendor ______.',
      dragOptions: ['Lock-in', 'Outage', 'Downtime', 'Breach'],
      correctAnswer: 'Lock-in',
      explanation: 'Vendor lock-in makes migrating data between competing platforms complex and frustrating.'
    },
    {
      id: 'cloud-benefits-drawbacks',
      question: 'Match the cloud feature to its definition:',
      type: 'match-following',
      leftItems: ['Scalability', 'Pay-as-you-go', 'Disaster Recovery', 'Vendor Lock-in'],
      rightItems: ['Instantly increase storage or processing power', 'Only pay for the exact resources consumed', 'Data backed up in multiple geographic locations', 'Difficulty migrating data between cloud providers'],
      correctAnswer: {
        'Scalability': 'Instantly increase storage or processing power',
        'Pay-as-you-go': 'Only pay for the exact resources consumed',
        'Disaster Recovery': 'Data backed up in multiple geographic locations',
        'Vendor Lock-in': 'Difficulty migrating data between cloud providers'
      },
      explanation: 'Scalability handles load, pay-as-you-go saves cost, disaster recovery protects data, vendor lock-in restricts migration.'
    },
    createRandomizedMCQ(
      'cloud-benefits-drawbacks-q5',
      'How does the "Pay-as-you-go" pricing model benefit a new Bhutanese online gaming startup?',
      'They only pay for servers used by current players rather than buying millions in upfront hardware.',
      ['They receive free hardware from Microsoft.', 'They never pay any electricity or internet bills.', 'They are guaranteed zero competition.'],
      'Pay-as-you-go operates like a utility bill where costs match actual resource consumption.'
    ),
    createRandomizedMCQ(
      'cloud-benefits-drawbacks-q6',
      'If a student’s laptop suffers a "Blue Screen of Death" and dies, why are their Google Drive documents still safe?',
      'Because cloud data is backed up remotely across redundant cloud datacenters (Disaster Recovery).',
      ['Because Google Drive installs a new motherboard on the laptop.', 'Because the hard drive is physically indestructible.', 'Because Blue Screen errors only affect audio files.'],
      'Disaster recovery in the cloud ensures data persistence regardless of local device failure.'
    ),
    {
      id: 'cloud-benefits-drawbacks-q7',
      question: 'Fill in the blank: Service disruptions when giant providers like Google or Amazon experience technical outages are referred to as ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Downtime',
      explanation: 'Downtime or outages happen when cloud servers become temporarily unavailable.'
    },
    {
      id: 'cloud-benefits-drawbacks-q8',
      question: 'Categorize the cloud benefit:',
      type: 'drag-drop',
      blankSentence: 'Accessing school projects from a laptop at home and continuing on a phone during the bus ride illustrates ______.',
      dragOptions: ['Accessibility', 'Downtime', 'Lock-in', 'Virtualization'],
      correctAnswer: 'Accessibility',
      explanation: 'Cloud accessibility allows users to access work from any device with internet connection.'
    },
    {
      id: 'cloud-benefits-drawbacks-q9',
      question: 'Match the advantage to its daily life analogy:',
      type: 'match-following',
      leftItems: ['Cost Efficiency', 'Automatic Updates', 'Disaster Recovery'],
      rightItems: ['Paying for water per liter consumed', 'Apps updating without manual re-installation', 'Backup copies stored in a fireproof vault'],
      correctAnswer: {
        'Cost Efficiency': 'Paying for water per liter consumed',
        'Automatic Updates': 'Apps updating without manual re-installation',
        'Disaster Recovery': 'Backup copies stored in a fireproof vault'
      },
      explanation: 'Pay-as-you-go is like water metering, auto-updates happen seamlessly, disaster recovery uses redundant vaults.'
    },
    createRandomizedMCQ(
      'cloud-benefits-drawbacks-q10',
      'What distinguishes cloud computing from traditional desktop computing according to ICT-10?',
      'Cloud computing delivers services over the internet rather than relying solely on a physical local hard drive.',
      ['Cloud computing requires physical floppy disks.', 'Desktop computing is always faster than cloud servers.', 'Cloud computing cannot store images or videos.'],
      'Cloud computing moves storage and processing from local disks to internet-connected remote servers.'
    )
  ],

  'cloud-security-sovereignty': [
    createRandomizedMCQ(
      'cloud-security-sovereignty-q1',
      'What does "Data Sovereignty" mean for official government records in Bhutan?',
      'Digital data is subject to the privacy laws and governance of the country where it is physically stored.',
      ['All data must be uploaded to foreign public servers.', 'Data can be freely sold to international advertisers.', 'Data is exempt from all digital laws.'],
      'Data sovereignty dictates that national records remain governed by local country laws and data centers.'
    ),
    {
      id: 'cloud-security-sovereignty-q2',
      question: 'Fill in the blank: Scrambling plain readable text into unreadable ciphertext to protect data in transit is called ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'encryption',
      explanation: 'Encryption scrambles data so unauthorized interceptors cannot read it.'
    },
    {
      id: 'cloud-security-sovereignty-q3',
      question: 'Identify the authentication method:',
      type: 'drag-drop',
      blankSentence: 'Requiring both a password and an SMS code to log into the Bhutan Government portal is called ______ authentication.',
      dragOptions: ['Multi-Factor', 'Single-Sign-On', 'Public', 'Anonymous'],
      correctAnswer: 'Multi-Factor',
      explanation: 'Multi-Factor Authentication (2FA/MFA) adds an extra verification layer beyond passwords.'
    },
    {
      id: 'cloud-security-sovereignty-q4',
      question: 'Match the security term with its primary function:',
      type: 'match-following',
      leftItems: ['Encryption at Rest', 'Encryption in Transit', 'Data Sovereignty'],
      rightItems: ['Protecting stored data on server hard drives', 'Protecting data as it travels across network cables', 'Complying with national storage location laws'],
      correctAnswer: {
        'Encryption at Rest': 'Protecting stored data on server hard drives',
        'Encryption in Transit': 'Protecting data as it travels across network cables',
        'Data Sovereignty': 'Complying with national storage location laws'
      },
      explanation: 'At rest protects disk storage, in transit protects transmitted packets, sovereignty governs location laws.'
    },
    createRandomizedMCQ(
      'cloud-security-sovereignty-q5',
      'Why is storing civil registration records within Bhutanese data centers important for national security?',
      'It prevents unauthorized foreign access and ensures compliance with GovTech Bhutan privacy standards.',
      ['It eliminates the need for passwords.', 'It makes website loading slower.', 'It prevents citizens from changing their passwords.'],
      'Hosting sensitive citizen data locally upholds data sovereignty and legal protection.'
    ),
    createRandomizedMCQ(
      'cloud-security-sovereignty-q6',
      'Which cryptographic protocol is widely used to secure web traffic in transit for online banking in Bhutan?',
      'SSL / TLS HTTPS',
      ['FTP', 'HTTP', 'Telnet'],
      'HTTPS uses SSL/TLS encryption to protect data sent over the internet.'
    ),
    {
      id: 'cloud-security-sovereignty-q7',
      question: 'Fill in the blank: Encryption of stored database records on cloud disks is known as encryption at ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'rest',
      explanation: 'Data stored on servers is protected via encryption at rest.'
    },
    {
      id: 'cloud-security-sovereignty-q8',
      question: 'Select the appropriate security protocol:',
      type: 'drag-drop',
      blankSentence: 'To prevent unauthorized data leaks, sensitive files stored on cloud drives use AES-256 ______.',
      dragOptions: ['encryption', 'compression', 'decompression', 'formatting'],
      correctAnswer: 'encryption',
      explanation: 'AES-256 is an advanced encryption standard used for cloud security.'
    },
    {
      id: 'cloud-security-sovereignty-q9',
      question: 'Match the access control mechanism to its description:',
      type: 'match-following',
      leftItems: ['Role-Based Access Control', 'One-Time Password (OTP)', 'Firewall'],
      rightItems: ['Granting permissions based on job role', 'Temporary numeric code sent via SMS', 'Network barrier filtering unauthorized traffic'],
      correctAnswer: {
        'Role-Based Access Control': 'Granting permissions based on job role',
        'One-Time Password (OTP)': 'Temporary numeric code sent via SMS',
        'Firewall': 'Network barrier filtering unauthorized traffic'
      },
      explanation: 'RBAC restricts access by job title, OTP verifies identity dynamically, firewalls block unauthorized network packets.'
    },
    createRandomizedMCQ(
      'cloud-security-sovereignty-q10',
      'What responsibility does an organization have under Bhutanese data privacy guidelines when using cloud storage?',
      'To ensure citizen data is encrypted, access is restricted, and stored in compliance with local regulations.',
      ['To share all password files on public social media.', 'To disable all security logs.', 'To delete all backups every week.'],
      'Organizations must maintain strict security and legal compliance when managing citizen data.'
    )
  ],

  'cloud-virtualization-storage': [
    createRandomizedMCQ(
      'cloud-virtualization-storage-q1',
      'What is Virtualization in cloud computing?',
      'Creating virtual software representations of physical servers, storage, and networks on a single physical host.',
      ['Replacing computers with paper notebooks.', 'Installing physical RAM chips manually.', 'Converting wireless signals to cable wires.'],
      'Virtualization allows multiple virtual machines (VMs) to run on one physical server.'
    ),
    {
      id: 'cloud-virtualization-storage-q2',
      question: 'Fill in the blank: The software layer that manages virtual machines on physical hardware is called a ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'hypervisor',
      explanation: 'A hypervisor (or Virtual Machine Monitor) manages virtual machines and host hardware allocation.'
    },
    {
      id: 'cloud-virtualization-storage-q3',
      question: 'Identify the storage type:',
      type: 'drag-drop',
      blankSentence: 'Cloud storage where files are accessible over the internet from any device is called ______ storage.',
      dragOptions: ['cloud', 'floppy', 'tape', 'optical'],
      correctAnswer: 'cloud',
      explanation: 'Cloud storage lets users store and access files remotely via the internet.'
    },
    {
      id: 'cloud-virtualization-storage-q4',
      question: 'Match the virtualization component with its function:',
      type: 'match-following',
      leftItems: ['Host Machine', 'Guest VM', 'Hypervisor'],
      rightItems: ['Physical server hardware', 'Virtual operating system instance', 'Software allocating physical resources to VMs'],
      correctAnswer: {
        'Host Machine': 'Physical server hardware',
        'Guest VM': 'Virtual operating system instance',
        'Hypervisor': 'Software allocating physical resources to VMs'
      },
      explanation: 'The host provides physical resources, the hypervisor abstracts them, and guest VMs run isolated operating systems.'
    },
    createRandomizedMCQ(
      'cloud-virtualization-storage-q5',
      'How does virtualization improve server utilization in a datacenter?',
      'By allowing one physical server to host multiple independent virtual servers simultaneously.',
      ['By requiring each virtual server to buy a separate physical machine.', 'By turning off physical electricity completely.', 'By reducing server storage to zero.'],
      'Virtualization maximizes hardware usage by running multiple VMs on a single physical host.'
    ),
    createRandomizedMCQ(
      'cloud-virtualization-storage-q6',
      'Which of the following is a primary benefit of Cloud Storage over local flash drives?',
      'Files are automatically synced and backed up remotely across multiple devices.',
      ['Cloud storage works without electricity or internet.', 'Cloud storage can only be opened once.', 'Cloud storage loses data if dropped on the floor.'],
      'Cloud storage provides remote accessibility, auto-sync, and hardware failure protection.'
    ),
    {
      id: 'cloud-virtualization-storage-q7',
      question: 'Fill in the blank: Virtual instances running inside a host server are referred to as Virtual ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Machines',
      explanation: 'Virtual Machines (VMs) emulate physical computers with their own operating systems.'
    },
    {
      id: 'cloud-virtualization-storage-q8',
      question: 'Complete the cloud storage statement:',
      type: 'drag-drop',
      blankSentence: 'Services like Google Drive and Microsoft OneDrive provide cloud ______ for remote backup.',
      dragOptions: ['storage', 'cables', 'monitors', 'printers'],
      correctAnswer: 'storage',
      explanation: 'Google Drive provides cloud storage for user files.'
    },
    {
      id: 'cloud-virtualization-storage-q9',
      question: 'Match the cloud storage term to its property:',
      type: 'match-following',
      leftItems: ['Object Storage', 'Block Storage', 'File Storage'],
      rightItems: ['Storing unstructured data like photos/videos with metadata', 'Raw storage volumes used by virtual machine hard drives', 'Hierarchical folder and file directory system'],
      correctAnswer: {
        'Object Storage': 'Storing unstructured data like photos/videos with metadata',
        'Block Storage': 'Raw storage volumes used by virtual machine hard drives',
        'File Storage': 'Hierarchical folder and file directory system'
      },
      explanation: 'Object storage handles unstructured media, block storage powers VM disks, file storage uses traditional directories.'
    },
    createRandomizedMCQ(
      'cloud-virtualization-storage-q10',
      'Why do modern cloud providers use redundant storage systems?',
      'To ensure that if one physical hard drive fails, duplicate copies prevent data loss.',
      ['To increase electricity consumption on purpose.', 'To restrict file uploads to text files only.', 'To slow down download speeds.'],
      'Redundancy guarantees high availability and zero data loss during disk crashes.'
    )
  ],

  'cloud-cost-roi': [
    createRandomizedMCQ(
      'cloud-cost-roi-q1',
      'What does ROI (Return on Investment) measure when a school evaluates moving to cloud infrastructure?',
      'The financial benefit and efficiency gains compared to the total cost spent on cloud migration.',
      ['The number of physical cables installed in classrooms.', 'The weight of desktop computers in the computer lab.', 'The age of the school principal.'],
      'ROI calculates the net savings and efficiency returns relative to investment cost.'
    ),
    {
      id: 'cloud-cost-roi-q2',
      question: 'Fill in the blank: Replacing large upfront hardware costs (CapEx) with operational monthly cloud subscriptions (OpEx) is called shifting CapEx to ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'OpEx',
      explanation: 'Cloud shifts Capital Expenditure (CapEx) to Operational Expenditure (OpEx).'
    },
    {
      id: 'cloud-cost-roi-q3',
      question: 'Select the cost term:',
      type: 'drag-drop',
      blankSentence: 'Buying physical servers upfront is Capital Expenditure (CapEx), while paying monthly cloud fees is ______ Expenditure.',
      dragOptions: ['Operational', 'Fixed', 'Sunk', 'Deferred'],
      correctAnswer: 'Operational',
      explanation: 'Monthly subscriptions fall under Operational Expenditure (OpEx).'
    },
    {
      id: 'cloud-cost-roi-q4',
      question: 'Match the financial expenditure type with its description:',
      type: 'match-following',
      leftItems: ['CapEx (Capital Expenditure)', 'OpEx (Operational Expenditure)', 'TCO (Total Cost of Ownership)'],
      rightItems: ['Upfront purchase of physical hardware servers', 'Ongoing monthly subscription payments for cloud usage', 'Complete cost including hardware, power, cooling, and maintenance'],
      correctAnswer: {
        'CapEx (Capital Expenditure)': 'Upfront purchase of physical hardware servers',
        'OpEx (Operational Expenditure)': 'Ongoing monthly subscription payments for cloud usage',
        'TCO (Total Cost of Ownership)': 'Complete cost including hardware, power, cooling, and maintenance'
      },
      explanation: 'CapEx is upfront capital, OpEx is ongoing operational cost, TCO includes all hidden overhead costs.'
    },
    createRandomizedMCQ(
      'cloud-cost-roi-q5',
      'What hidden costs are eliminated when a Bhutanese institution migrates from on-premise servers to cloud computing?',
      'Server room air conditioning, electricity bills, hardware maintenance, and physical security upgrades.',
      ['Student tuition fees.', 'Internet service provider fees.', 'Software license fees.'],
      'Cloud hosting eliminates physical facility overheads like cooling, power, and hardware upkeep.'
    ),
    createRandomizedMCQ(
      'cloud-cost-roi-q6',
      'Which decision matrix factor favors cloud adoption for a small startup in Thimphu?',
      'Zero upfront hardware capital requirement and fast market launch.',
      ['High initial cost and long hardware delivery delay.', 'Need for local physical server racks.', 'Absence of internet connectivity.'],
      'Startups benefit from low initial cost and immediate server availability.'
    ),
    {
      id: 'cloud-cost-roi-q7',
      question: 'Fill in the blank: Total Cost of Ownership is abbreviated as ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'TCO',
      explanation: 'TCO stands for Total Cost of Ownership.'
    },
    {
      id: 'cloud-cost-roi-q8',
      question: 'Complete the ROI evaluation statement:',
      type: 'drag-drop',
      blankSentence: 'A positive Return on Investment (ROI) indicates that cloud migration generated greater ______ than expenditure.',
      dragOptions: ['savings', 'deficits', 'downtime', 'penalties'],
      correctAnswer: 'savings',
      explanation: 'Positive ROI means financial and operational savings exceeded costs.'
    },
    {
      id: 'cloud-cost-roi-q9',
      question: 'Match the cloud decision matrix scenario with the recommended approach:',
      type: 'match-following',
      leftItems: ['Low budget, rapid deployment needed', 'Strict data sovereignty, custom security', 'Seasonal traffic bursts during board exams'],
      rightItems: ['SaaS / Public Cloud', 'Private Cloud', 'Hybrid Cloud with auto-scaling'],
      correctAnswer: {
        'Low budget, rapid deployment needed': 'SaaS / Public Cloud',
        'Strict data sovereignty, custom security': 'Private Cloud',
        'Seasonal traffic bursts during board exams': 'Hybrid Cloud with auto-scaling'
      },
      explanation: 'Low budget suits public SaaS, strict security needs private cloud, traffic bursts suit hybrid auto-scaling.'
    },
    createRandomizedMCQ(
      'cloud-cost-roi-q10',
      'Why is cloud computing considered more sustainable and eco-friendly for Bhutanese schools?',
      'Centralized cloud datacenters optimize energy efficiency and reduce e-waste from discarded local PCs.',
      ['Cloud servers operate on solar batteries only.', 'Cloud computing eliminates electricity entirely.', 'Cloud servers do not generate heat.'],
      'Shared cloud infrastructure optimizes power utilization and reduces electronic waste.'
    )
  ],

  'workspace-evolution': [
    createRandomizedMCQ(
      'workspace-evolution-q1',
      'What was Google Workspace originally named when launched in 2006?',
      'Google Apps for Your Domain',
      ['G Suite', 'Google Workplace', 'Google Classroom'],
      'Google Workspace launched in 2006 as "Google Apps for Your Domain" before rebranding to G Suite in 2016 and Google Workspace in 2020.'
    ),
    {
      id: 'workspace-evolution-q2',
      question: 'Fill in the blank: In 2016, Google Apps for Your Domain was rebranded to ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'G Suite',
      explanation: 'Google rebranded the suite to G Suite in 2016.'
    },
    {
      id: 'workspace-evolution-q3',
      question: 'Identify the rebrand year:',
      type: 'drag-drop',
      blankSentence: 'G Suite was officially renamed to "Google Workspace" in the year ______.',
      dragOptions: ['2020', '2006', '2016', '2012'],
      correctAnswer: '2020',
      explanation: 'The current name "Google Workspace" was adopted in 2020.'
    },
    {
      id: 'workspace-evolution-q4',
      question: 'Match the year with the brand name evolution:',
      type: 'match-following',
      leftItems: ['2006', '2016', '2020'],
      rightItems: ['Google Apps for Your Domain', 'G Suite', 'Google Workspace'],
      correctAnswer: {
        '2006': 'Google Apps for Your Domain',
        '2016': 'G Suite',
        '2020': 'Google Workspace'
      },
      explanation: '2006: Google Apps for Your Domain -> 2016: G Suite -> 2020: Google Workspace.'
    },
    createRandomizedMCQ(
      'workspace-evolution-q5',
      'Why did Google change the name from "Apps" to "Workspace"?',
      'To reflect a deeply integrated environment where messaging, docs, and video tools work together seamlessly.',
      ['To charge students money for opening files.', 'Because Google lost the rights to the word Apps.', 'Because it only runs on Apple computers.'],
      'The name Workspace emphasizes seamless collaboration across integrated productivity tools.'
    ),
    createRandomizedMCQ(
      'workspace-evolution-q6',
      'Which specialized edition of Google Workspace is tailored specifically for schools, teachers, and students?',
      'Google Workspace for Education',
      ['Google Workspace Business Starter', 'Google Workspace Enterprise Plus', 'Google Workspace Personal'],
      'Google Workspace for Education is tailored for educational institutions with free/affordable tools.'
    ),
    {
      id: 'workspace-evolution-q7',
      question: 'Fill in the blank: Transitioning from paper assignments to digital submission in Google Classroom creates a ______ classroom.',
      type: 'fill-in-the-blank',
      correctAnswer: 'paperless',
      explanation: 'Digital distribution and collection creates a paperless classroom, reducing waste and cost.'
    },
    {
      id: 'workspace-evolution-q8',
      question: 'Select the education advantage:',
      type: 'drag-drop',
      blankSentence: 'Google Classroom acts as a digital hub, providing paperless assignment submission and central ______.',
      dragOptions: ['organization', 'fragmentation', 'cancellation', 'printing'],
      correctAnswer: 'organization',
      explanation: 'Google Classroom organizes all assignments, links, and deadlines in one place.'
    },
    {
      id: 'workspace-evolution-q9',
      question: 'Match the Google Workspace benefit with its classroom impact:',
      type: 'match-following',
      leftItems: ['Paperless Classroom', 'Real-time Co-authoring', 'Scalability'],
      rightItems: ['Reduces paper waste and printing costs', 'Multiple students edit the same document together', 'Easily add thousands of students to school system'],
      correctAnswer: {
        'Paperless Classroom': 'Reduces paper waste and printing costs',
        'Real-time Co-authoring': 'Multiple students edit the same document together',
        'Scalability': 'Easily add thousands of students to school system'
      },
      explanation: 'Paperless saves paper, co-authoring enables teamwork, scalability supports whole schools.'
    },
    createRandomizedMCQ(
      'workspace-evolution-q10',
      'What security benefit does Google Workspace provide for student accounts?',
      'Data encryption and Two-Factor Authentication (2FA) to protect student files.',
      ['Disabling password requirements completely.', 'Automatic public publishing of all homework.', 'Deleting all files every 24 hours.'],
      'Google Workspace enforces high-level security like 2FA and encryption.'
    )
  ],

  'google-ecosystem': [
    createRandomizedMCQ(
      'google-ecosystem-q1',
      'Which tool from Google’s "Advanced Technology & AI" category can translate textbook text in real-time using your phone camera?',
      'Google Lens',
      ['Google Maps', 'TensorFlow', 'Google Meet'],
      'Google Lens uses your camera to search for objects, scan text, and translate foreign languages in real time.'
    ),
    {
      id: 'google-ecosystem-q2',
      question: 'Fill in the blank: Google’s conversational AI assistant used for brainstorming and coding help is called ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Gemini',
      explanation: 'Gemini (formerly Bard) is Google’s conversational AI assistant.'
    },
    {
      id: 'google-ecosystem-q3',
      question: 'Identify the operating system:',
      type: 'drag-drop',
      blankSentence: 'The lightweight operating system found on Chromebooks used widely in schools is ______ OS.',
      dragOptions: ['Chrome', 'Android', 'Linux', 'Ubuntu'],
      correctAnswer: 'Chrome',
      explanation: 'Chrome OS is Google’s lightweight cloud-centric operating system for Chromebooks.'
    },
    {
      id: 'google-ecosystem-q4',
      question: 'Match the Google Ecosystem category with its service:',
      type: 'match-following',
      leftItems: ['Communication', 'Information & Research', 'Advanced Tech & AI', 'Operating Systems'],
      rightItems: ['Google Meet & Chat', 'Google Scholar & Maps', 'Gemini & Google Lens', 'Android & Chrome OS'],
      correctAnswer: {
        'Communication': 'Google Meet & Chat',
        'Information & Research': 'Google Scholar & Maps',
        'Advanced Tech & AI': 'Gemini & Google Lens',
        'Operating Systems': 'Android & Chrome OS'
      },
      explanation: 'Categorized according to Google Ecosystem classifications in ICT-10.'
    },
    createRandomizedMCQ(
      'google-ecosystem-q5',
      'Which open-source Google library is designed specifically for Machine Learning and AI development?',
      'TensorFlow',
      ['Google Translate', 'Google Sites', 'Google Earth'],
      'TensorFlow is Google’s popular open-source machine learning framework.'
    ),
    createRandomizedMCQ(
      'google-ecosystem-q6',
      'If Jigme is at home, Riwang at the library, and Kabir in a taxi, how does Google Workspace solve their group presentation assignment?',
      'By enabling cloud-based real-time co-authoring where all three edit the same presentation simultaneously from anywhere.',
      ['By requiring them all to meet physically in Paro.', 'By forcing them to print paper copies first.', 'By emailing USB flash drives back and forth.'],
      'Real-time cloud collaboration allows simultaneous editing across different locations and devices.'
    ),
    {
      id: 'google-ecosystem-q7',
      question: 'Fill in the blank: The world’s most popular mobile operating system developed by Google is ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Android',
      explanation: 'Android is Google’s mobile operating system.'
    },
    {
      id: 'google-ecosystem-q8',
      question: 'Select the research tool:',
      type: 'drag-drop',
      blankSentence: 'For searching academic research papers and scholarly literature, students use Google ______.',
      dragOptions: ['Scholar', 'Lens', 'Meet', 'Chat'],
      correctAnswer: 'Scholar',
      explanation: 'Google Scholar indexes peer-reviewed academic papers and literature.'
    },
    {
      id: 'google-ecosystem-q9',
      question: 'Match the tool to its primary function:',
      type: 'match-following',
      leftItems: ['Google Meet', 'Google Earth', 'Google Translate'],
      rightItems: ['High-quality video conferencing', 'Geography and global exploration', 'Language translation across 100+ languages'],
      correctAnswer: {
        'Google Meet': 'High-quality video conferencing',
        'Google Earth': 'Geography and global exploration',
        'Google Translate': 'Language translation across 100+ languages'
      },
      explanation: 'Meet handles video calls, Earth explores maps/geography, Translate translates languages.'
    },
    createRandomizedMCQ(
      'google-ecosystem-q10',
      'What is Bard known as today in the Google AI Ecosystem?',
      'Gemini',
      ['Claude', 'Copilot', 'Llama'],
      'Google Bard was rebranded as Gemini.'
    )
  ],

  'workspace-docs-slides': [
    createRandomizedMCQ(
      'workspace-docs-slides-q1',
      'What happens when two Class 10 students edit the same Google Doc simultaneously?',
      'Changes appear in real-time, and colorful presence cursors show where each teammate is typing.',
      ['The file locks and prevents editing for 24 hours.', 'The computer creates two duplicate corrupt files.', 'The second student is logged out.'],
      'Real-time co-authoring allows concurrent editing with live presence indicators.'
    ),
    {
      id: 'workspace-docs-slides-q2',
      question: 'Fill in the blank: To suggest changes or give feedback without altering original text in Google Docs, users leave ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'comments',
      explanation: 'Comments allow collaborators to discuss and suggest edits in documents.'
    },
    {
      id: 'workspace-docs-slides-q3',
      question: 'Complete the Version History statement:',
      type: 'drag-drop',
      blankSentence: 'If a teammate accidentally deletes a slide in Google Slides, Version History allows you to ______ to a previous version.',
      dragOptions: ['revert', 'delete', 'format', 'encrypt'],
      correctAnswer: 'revert',
      explanation: 'Version History tracks all edits and lets users restore previous document versions.'
    },
    {
      id: 'workspace-docs-slides-q4',
      question: 'Match the Google app to its primary workplace role:',
      type: 'match-following',
      leftItems: ['Google Docs', 'Google Slides', 'Google Forms'],
      rightItems: ['Dynamic Word Processing & Report Writing', 'Engaging Visual Presentations & Pitch Decks', 'Custom Data Collection & Quizzes'],
      correctAnswer: {
        'Google Docs': 'Dynamic Word Processing & Report Writing',
        'Google Slides': 'Engaging Visual Presentations & Pitch Decks',
        'Google Forms': 'Custom Data Collection & Quizzes'
      },
      explanation: 'Docs is for documents, Slides for presentations, Forms for surveys/quizzes.'
    },
    createRandomizedMCQ(
      'workspace-docs-slides-q5',
      'Why is Version History essential during group projects at Karma Academy?',
      'It tracks who made specific edits and allows restoring older versions if mistakes happen.',
      ['It automatically deletes old files every Friday.', 'It grades student essays using AI.', 'It translates all text into Dzongkha.'],
      'Version history provides audit trails of edits and complete restore capabilities.'
    ),
    createRandomizedMCQ(
      'workspace-docs-slides-q6',
      'How do students notify a specific classmate inside a Google Doc comment?',
      'By typing @ followed by their email address (e.g., @student@education.gov.bt).',
      ['By sending a physical letter via Bhutan Post.', 'By changing the font size to 72pt.', 'By restarting the computer.'],
      'Tagging with @ or + notifies the collaborator directly via email.'
    ),
    {
      id: 'workspace-docs-slides-q7',
      question: 'Fill in the blank: Google Docs saves every keystroke automatically to the cloud, eliminating the need to manually click ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'save',
      explanation: 'Cloud apps save edits continuously in real time.'
    },
    {
      id: 'workspace-docs-slides-q8',
      question: 'Select the mode for editing:',
      type: 'drag-drop',
      blankSentence: 'To propose edits that the document owner must approve, switch from Editing mode to ______ mode.',
      dragOptions: ['Suggesting', 'Viewing', 'Printing', 'Offline'],
      correctAnswer: 'Suggesting',
      explanation: 'Suggesting mode highlights edits as tracked changes for approval.'
    },
    {
      id: 'workspace-docs-slides-q9',
      question: 'Match the presentation feature in Google Slides with its purpose:',
      type: 'match-following',
      leftItems: ['Presenter View', 'Slide Transitions', 'Embedded Video'],
      rightItems: ['Viewing speaker notes and timer while presenting', 'Visual animation effects between slides', 'Playing YouTube clips directly inside a slide'],
      correctAnswer: {
        'Presenter View': 'Viewing speaker notes and timer while presenting',
        'Slide Transitions': 'Visual animation effects between slides',
        'Embedded Video': 'Playing YouTube clips directly inside a slide'
      },
      explanation: 'Presenter view shows speaker notes, transitions animate slide changes, embedded video plays media directly.'
    },
    createRandomizedMCQ(
      'workspace-docs-slides-q10',
      'What happens if Rigsel’s laptop screen turns black 2 hours before her Google Doc assignment deadline?',
      'She can stay calm because her work is auto-saved in Google Drive and accessible immediately from any other phone or PC.',
      ['Her work is lost forever.', 'Google Docs sends her a fine.', 'Her account is suspended.'],
      'Cloud storage ensures data persistence and cross-device access.'
    )
  ],

  'workspace-drive-permissions': [
    createRandomizedMCQ(
      'workspace-drive-permissions-q1',
      'Which Google Drive permission setting allows a classmate to read a report without making changes or adding comments?',
      'Viewer',
      ['Editor', 'Commenter', 'Owner'],
      'Viewer permission grants read-only access without edit or comment capabilities.'
    ),
    {
      id: 'workspace-drive-permissions-q2',
      question: 'Fill in the blank: The Google Drive access permission that lets someone leave feedback flags without editing original text is ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Commenter',
      explanation: 'Commenters can add suggestions and comments but cannot directly alter the text.'
    },
    {
      id: 'workspace-drive-permissions-q3',
      question: 'Select the permission level:',
      type: 'drag-drop',
      blankSentence: 'To grant a teammate full rights to edit text, delete files, and change sharing settings, assign the ______ role.',
      dragOptions: ['Editor', 'Viewer', 'Commenter', 'Restricted'],
      correctAnswer: 'Editor',
      explanation: 'Editors have full privileges to modify content and sharing settings.'
    },
    {
      id: 'workspace-drive-permissions-q4',
      question: 'Match the Google Drive access tier with its capability:',
      type: 'match-following',
      leftItems: ['Viewer', 'Commenter', 'Editor'],
      rightItems: ['Can view files but cannot edit or comment', 'Can view files and leave comments/suggestions', 'Can edit files, accept suggestions, and share'],
      correctAnswer: {
        'Viewer': 'Can view files but cannot edit or comment',
        'Commenter': 'Can view files and leave comments/suggestions',
        'Editor': 'Can edit files, accept suggestions, and share'
      },
      explanation: 'Viewer is read-only, Commenter adds suggestions, Editor has full modification rights.'
    },
    createRandomizedMCQ(
      'workspace-drive-permissions-q5',
      'What is the difference between "Restricted" and "Anyone with the link" sharing in Google Drive?',
      'Restricted allows only specified invited email accounts, while Anyone with the link allows anyone holding the URL.',
      ['Restricted makes files public on Google Search.', 'Anyone with the link deletes the file after 5 minutes.', 'Restricted converts docs into PDF automatically.'],
      'Restricted sharing requires explicit email permissions, whereas link sharing grants access to link holders.'
    ),
    createRandomizedMCQ(
      'workspace-drive-permissions-q6',
      'Where do files deleted from Google Drive go before permanent deletion after 30 days?',
      'Google Drive Trash / Bin',
      ['Spam Folder', 'Archive Folder', 'Hard Drive C:'],
      'Deleted items remain in the Drive Trash bin for 30 days before being permanently removed.'
    ),
    {
      id: 'workspace-drive-permissions-q7',
      question: 'Fill in the blank: Shared folders in Google Drive allow team members to collaborate in a single shared ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'space',
      explanation: 'Shared folders create collaborative cloud spaces for team files.'
    },
    {
      id: 'workspace-drive-permissions-q8',
      question: 'Identify the storage limit:',
      type: 'drag-drop',
      blankSentence: 'Free personal Google accounts provide ______ GB of cloud storage across Drive, Gmail, and Photos.',
      dragOptions: ['15', '100', '5', '50'],
      correctAnswer: '15',
      explanation: 'Personal Google accounts include 15 GB of free cloud storage.'
    },
    {
      id: 'workspace-drive-permissions-q9',
      question: 'Match the Drive feature with its description:',
      type: 'match-following',
      leftItems: ['Shared Drives', 'My Drive', 'Priority / Starred'],
      rightItems: ['Files owned by the school/organization team', 'Personal private cloud storage space', 'Quick access to frequently opened files'],
      correctAnswer: {
        'Shared Drives': 'Files owned by the school/organization team',
        'My Drive': 'Personal private cloud storage space',
        'Priority / Starred': 'Quick access to frequently opened files'
      },
      explanation: 'Shared Drives belong to organizations, My Drive is personal, Starred bookmarks important files.'
    },
    createRandomizedMCQ(
      'workspace-drive-permissions-q10',
      'Why should a teacher set student access to "Viewer" when sharing an official exam paper on Google Drive?',
      'To ensure students can read the exam questions without altering or deleting the original test text.',
      ['To prevent students from seeing the exam at all.', 'To force students to print the test.', 'To grade the test automatically.'],
      'Viewer mode prevents students from editing official questions.'
    )
  ],

  'workspace-classroom-forms': [
    createRandomizedMCQ(
      'workspace-classroom-forms-q1',
      'How does Google Forms assist teachers like Madam Karma in conducting paperless quizzes?',
      'It collects student responses digitally and can auto-grade multiple choice questions instantly.',
      ['It requires teachers to print and hand-grade papers.', 'It records student voices without permission.', 'It blocks internet access.'],
      'Google Forms collects responses into spreadsheets and auto-grades quiz questions.'
    ),
    {
      id: 'workspace-classroom-forms-q2',
      question: 'Fill in the blank: Google Classroom acts as a digital hub where teachers post class materials, links, and assignment ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'deadlines',
      explanation: 'Google Classroom centralizes materials, class links, and submission deadlines.'
    },
    {
      id: 'workspace-classroom-forms-q3',
      question: 'Identify the Google Forms question type:',
      type: 'drag-drop',
      blankSentence: 'A question format in Google Forms that allows students to choose one answer from a list is ______ choice.',
      dragOptions: ['Multiple', 'Checkbox', 'Linear Scale', 'Paragraph'],
      correctAnswer: 'Multiple',
      explanation: 'Multiple choice questions restrict student selection to a single radio option.'
    },
    {
      id: 'workspace-classroom-forms-q4',
      question: 'Match the Google Classroom feature to its primary purpose:',
      type: 'match-following',
      leftItems: ['Stream Tab', 'Classwork Tab', 'Gradebook'],
      rightItems: ['Class announcements and discussion board', 'Structured assignment distribution and topic modules', 'Organizing student marks and feedback'],
      correctAnswer: {
        'Stream Tab': 'Class announcements and discussion board',
        'Classwork Tab': 'Structured assignment distribution and topic modules',
        'Gradebook': 'Organizing student marks and feedback'
      },
      explanation: 'Stream handles communications, Classwork organizes assignments, Gradebook manages marks.'
    },
    createRandomizedMCQ(
      'workspace-classroom-forms-q5',
      'Which option in Google Forms converts a standard survey into an auto-graded quiz with point values?',
      'Make this a quiz in Settings',
      ['Export to PDF', 'Print Survey', 'Change Theme Color'],
      'Enabling "Make this a quiz" in Forms settings unlocks answer keys and auto-grading.'
    ),
    createRandomizedMCQ(
      'workspace-classroom-forms-q6',
      'Where do student responses submitted in Google Forms automatically accumulate for detailed data analysis?',
      'A linked Google Sheet',
      ['Google Slides presentation', 'Google Meet recording', 'Gmail draft'],
      'Google Forms can export and sync all submitted responses to a Google Sheet.'
    ),
    {
      id: 'workspace-classroom-forms-q7',
      question: 'Fill in the blank: When students submit homework in Google Classroom, teachers can return marks and private ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'feedback',
      explanation: 'Teachers give private comments and grade feedback directly inside Classroom.'
    },
    {
      id: 'workspace-classroom-forms-q8',
      question: 'Select the Classroom role:',
      type: 'drag-drop',
      blankSentence: 'In Google Classroom, the user who creates classes, invites students, and assigns marks is the ______.',
      dragOptions: ['Teacher', 'Student', 'Guardian', 'Auditor'],
      correctAnswer: 'Teacher',
      explanation: 'Teachers manage classroom setup, assignments, and grades.'
    },
    {
      id: 'workspace-classroom-forms-q9',
      question: 'Match the Forms feature to its function:',
      type: 'match-following',
      leftItems: ['Answer Key', 'Checkboxes', 'Required Field'],
      rightItems: ['Specifying the correct answer and point value', 'Allowing selection of multiple correct options', 'Forcing students to answer before submitting'],
      correctAnswer: {
        'Answer Key': 'Specifying the correct answer and point value',
        'Checkboxes': 'Allowing selection of multiple correct options',
        'Required Field': 'Forcing students to answer before submitting'
      },
      explanation: 'Answer key sets points, checkboxes allow multiple answers, required field prevents blank submissions.'
    },
    createRandomizedMCQ(
      'workspace-classroom-forms-q10',
      'How does Google Classroom help reduce a school’s carbon footprint in Bhutan?',
      'By distributing and collecting assignments electronically as a paperless classroom.',
      ['By generating free electricity from solar panels.', 'By turning off classroom lights automatically.', 'By replacing school buses with bicycles.'],
      'Digital assignment submission eliminates thousands of printed sheets of paper.'
    )
  ],

  'workspace-meet-calendar': [
    createRandomizedMCQ(
      'workspace-meet-calendar-q1',
      'Which Google Workspace tool is designed specifically for high-quality video conferencing and virtual lessons?',
      'Google Meet',
      ['Google Chat', 'Google Keep', 'Google Sites'],
      'Google Meet provides secure video conferencing for virtual classes and meetings.'
    ),
    {
      id: 'workspace-meet-calendar-q2',
      question: 'Fill in the blank: Scheduling online class meetings and setting assignment reminders is managed using Google ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Calendar',
      explanation: 'Google Calendar manages scheduling, appointment slots, and automated reminders.'
    },
    {
      id: 'workspace-meet-calendar-q3',
      question: 'Identify the messaging app:',
      type: 'drag-drop',
      blankSentence: 'Instant team messaging and topic spaces in Google Workspace are powered by Google ______.',
      dragOptions: ['Chat', 'Meet', 'Drive', 'Sites'],
      correctAnswer: 'Chat',
      explanation: 'Google Chat provides direct messaging and team collaboration spaces.'
    },
    {
      id: 'workspace-meet-calendar-q4',
      question: 'Match the communication tool with its core function:',
      type: 'match-following',
      leftItems: ['Google Meet', 'Google Calendar', 'Google Chat'],
      rightItems: ['Virtual video lessons and screen sharing', 'Scheduling meetings and assignment notifications', 'Direct team messaging and group spaces'],
      correctAnswer: {
        'Google Meet': 'Virtual video lessons and screen sharing',
        'Google Calendar': 'Scheduling meetings and assignment notifications',
        'Google Chat': 'Direct team messaging and group spaces'
      },
      explanation: 'Meet is video, Calendar is scheduling, Chat is instant messaging.'
    },
    createRandomizedMCQ(
      'workspace-meet-calendar-q5',
      'How can a teacher automatically attach a Google Meet link to an upcoming class session?',
      'By creating an event in Google Calendar and clicking "Add Google Meet video conferencing".',
      ['By printing a QR code on paper.', 'By typing a code in Microsoft Excel.', 'By calling Bhutan Telecom.'],
      'Google Calendar integrates directly with Google Meet to attach video call links to events.'
    ),
    createRandomizedMCQ(
      'workspace-meet-calendar-q6',
      'Which feature in Google Meet allows a student to display their presentation slides to the entire virtual class?',
      'Share Screen / Present Now',
      ['Mute Audio', 'In-call Chat', 'Raise Hand'],
      'Present Now / Screen Share displays the presenter’s screen or window to all meeting participants.'
    ),
    {
      id: 'workspace-meet-calendar-q7',
      question: 'Fill in the blank: To ask a question during a Google Meet call without interrupting the speaker, students click the Raise ______ icon.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Hand',
      explanation: 'The Raise Hand button notifies the teacher that a student has a question.'
    },
    {
      id: 'workspace-meet-calendar-q8',
      question: 'Select the scheduling feature:',
      type: 'drag-drop',
      blankSentence: 'In Google Calendar, recurring events like weekly ICT classes can be set to repeat ______.',
      dragOptions: ['weekly', 'never', 'randomly', 'hourly'],
      correctAnswer: 'weekly',
      explanation: 'Calendar supports recurring schedules like daily, weekly, or monthly events.'
    },
    {
      id: 'workspace-meet-calendar-q9',
      question: 'Match the Meet feature to its benefit:',
      type: 'match-following',
      leftItems: ['Breakout Rooms', 'In-call Chat', 'Host Controls'],
      rightItems: ['Splitting students into small discussion groups', 'Text messaging and link sharing during calls', 'Muting participants and managing access'],
      correctAnswer: {
        'Breakout Rooms': 'Splitting students into small discussion groups',
        'In-call Chat': 'Text messaging and link sharing during calls',
        'Host Controls': 'Muting participants and managing access'
      },
      explanation: 'Breakout rooms enable small groups, in-call chat shares links, host controls maintain decorum.'
    },
    createRandomizedMCQ(
      'workspace-meet-calendar-q10',
      'What benefit does Google Calendar notification provide to students before an assignment deadline?',
      'It sends automated pop-up and email reminders on phones or laptops prior to the due date.',
      ['It automatically completes the assignment.', 'It cancels school classes.', 'It changes the student grade to 100%.'],
      'Calendar reminders alert students ahead of deadlines.'
    )
  ]
};
