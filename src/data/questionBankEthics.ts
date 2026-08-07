import { InteractiveQuestion, createRandomizedMCQ } from './predefinedQuestions';

export const questionBankEthics: Record<string, InteractiveQuestion[]> = {
  'website-credibility': [
    createRandomizedMCQ(
      'website-credibility-q1',
      'Tenzin is writing a report on Zhabdrung Ngawang Namgyel. Between www.bhutanculturalheritage.com (anonymous blog) and www.library.gov.bt (National Library of Bhutan), which should he prioritize and why?',
      'www.library.gov.bt because the .gov.bt TLD indicates an official, trustworthy government agency.',
      ['www.bhutanculturalheritage.com because anonymous blogs are always unbiased.', 'Neither site because internet sources are never credible.', 'Whichever site has brighter color images.'],
      'Government (.gov) and educational (.edu) domains undergo official oversight and are highly reliable.'
    ),
    {
      id: 'website-credibility-q2',
      question: 'Fill in the blank: The Top-Level Domain (TLD) extension designated for official government agencies is ______.',
      type: 'fill-in-the-blank',
      correctAnswer: '.gov',
      explanation: '.gov domains represent verified government entities (e.g. NASA.gov or library.gov.bt).'
    },
    {
      id: 'website-credibility-q3',
      question: 'Select the domain type:',
      type: 'drag-drop',
      blankSentence: 'The TLD extension .edu represents verified ______ institutions.',
      dragOptions: ['Educational', 'Commercial', 'Non-profit', 'Government'],
      correctAnswer: 'Educational',
      explanation: '.edu domains are reserved for accredited educational institutions like universities.'
    },
    {
      id: 'website-credibility-q4',
      question: 'Match the Top-Level Domain (TLD) with its typical ownership:',
      type: 'match-following',
      leftItems: ['.edu', '.gov', '.org', '.com'],
      rightItems: ['Educational institutions (Harvard.edu)', 'Government agencies (NASA.gov)', 'Non-profit organizations (usually good, can be biased)', 'Commercial businesses or personal blogs'],
      correctAnswer: {
        '.edu': 'Educational institutions (Harvard.edu)',
        '.gov': 'Government agencies (NASA.gov)',
        '.org': 'Non-profit organizations (usually good, can be biased)',
        '.com': 'Commercial businesses or personal blogs'
      },
      explanation: 'TLDs indicate the nature and primary objective of website owners.'
    },
    createRandomizedMCQ(
      'website-credibility-q5',
      'What tool can be used to perform a "digital background check" to see who officially registered a domain name?',
      'Whois Lookup (who.is)',
      ['Google Lens', 'Google Translate', 'Python IDLE'],
      'Whois Lookup tools like who.is display official domain registration details and owners.'
    ),
    createRandomizedMCQ(
      'website-credibility-q6',
      'Why should you be skeptical if a site claiming to be a "Medical Research Center" lacks an "About Us" page or staff physical address?',
      'Legitimate professional organizations provide verifiable contact details, staff credentials, and physical addresses.',
      ['Because websites without About Us pages load faster.', 'Because medical sites are forbidden from listing doctors.', 'Because physical addresses are illegal on websites.'],
      'Lack of transparent contact info or author bios is a major red flag for unverified content.'
    ),
    {
      id: 'website-credibility-q7',
      question: 'Fill in the blank: To check where else an online photo or logo exists on the web, perform a Reverse ______ Search.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Image',
      explanation: 'Reverse Image Search on Google finds the original source and duplicate uses of an image.'
    },
    {
      id: 'website-credibility-q8',
      question: 'Select the credibility verification tool:',
      type: 'drag-drop',
      blankSentence: 'Checking author bios to confirm if an article on heart health was written by a doctor rather than "FitnessLover123" verifies author ______.',
      dragOptions: ['credentials', 'formatting', 'encryption', 'sponsorship'],
      correctAnswer: 'credentials',
      explanation: 'Author credentials (degrees, medical titles) verify expertise in the subject matter.'
    },
    {
      id: 'website-credibility-q9',
      question: 'Match the evaluation tool with its primary purpose:',
      type: 'match-following',
      leftItems: ['Whois Lookup', 'Reverse Image Search', 'Fact-Checking Site (Snopes)'],
      rightItems: ['Checking official domain registration owner', 'Tracing image origins and verifying photo authenticity', 'Exposing urban legends and debunking viral rumors'],
      correctAnswer: {
        'Whois Lookup': 'Checking official domain registration owner',
        'Reverse Image Search': 'Tracing image origins and verifying photo authenticity',
        'Fact-Checking Site (Snopes)': 'Exposing urban legends and debunking viral rumors'
      },
      explanation: 'Whois checks domains, Reverse Image checks photo source, Snopes debunks rumors.'
    },
    createRandomizedMCQ(
      'website-credibility-q10',
      'Which third-party tool informs users if a website is safe or contains dangerous malware?',
      'Google Transparency Report',
      ['Whois Lookup', 'Google Translate', 'Python Shell'],
      'Google Transparency Report scans and reports security threats and malware on websites.'
    )
  ],

  'citation-styles': [
    createRandomizedMCQ(
      'citation-styles-q1',
      'Which citation style is primarily used in Science and Psychology and emphasizes the publication Date (Author, Year)?',
      'APA Style (American Psychological Association)',
      ['MLA Style', 'IEEE Style', 'Chicago Style'],
      'APA style prioritizes the publication date because scientific information changes rapidly.'
    ),
    {
      id: 'citation-styles-q2',
      question: 'Fill in the blank: The citation style commonly used in Technical & Engineering fields that uses numbers in square brackets like [1] is ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'IEEE',
      explanation: 'IEEE style uses numbered brackets [1] to keep engineering papers clean and concise.'
    },
    {
      id: 'citation-styles-q3',
      question: 'Identify the citation style for Humanities:',
      type: 'drag-drop',
      blankSentence: 'Literature and English humanities papers use ______ style, focusing on Author and Page number (e.g. Rowling 42).',
      dragOptions: ['MLA', 'APA', 'IEEE', 'Harvard'],
      correctAnswer: 'MLA',
      explanation: 'MLA (Modern Language Association) focuses on author and page location.'
    },
    {
      id: 'citation-styles-q4',
      question: 'Match the citation style to its primary subject field:',
      type: 'match-following',
      leftItems: ['APA Style', 'MLA Style', 'IEEE Style'],
      rightItems: ['Science & Psychology (Focuses on Date)', 'English & Literature (Focuses on Author & Page)', 'Engineering & Tech (Focuses on Numbers in Brackets)'],
      correctAnswer: {
        'APA Style': 'Science & Psychology (Focuses on Date)',
        'MLA Style': 'English & Literature (Focuses on Author & Page)',
        'IEEE Style': 'Engineering & Tech (Focuses on Numbers in Brackets)'
      },
      explanation: 'APA is for sciences, MLA for humanities, IEEE for engineering.'
    },
    createRandomizedMCQ(
      'citation-styles-q5',
      'Write the correct APA reference list citation for Dr. Karma Phuntsho’s 2013 book "The History of Bhutan" published by Random House:',
      'Phuntsho, K. (2013). The history of Bhutan. Random House.',
      ['Karma Phuntsho, "The History of Bhutan", 2013.', 'Phuntsho 2013 Page 100.', '[1] K. Phuntsho, History of Bhutan, 2013.'],
      'APA reference list format: Author Last name, Initial. (Year). Title in sentence case. Publisher.'
    ),
    createRandomizedMCQ(
      'citation-styles-q6',
      'How does an in-text citation differ from a Reference/Works Cited page?',
      'In-text citations give immediate brief credit inside paragraphs, while Reference lists give full publication details at the end.',
      ['In-text citations are only for images, while Reference lists are for numbers.', 'Reference lists are optional, while in-text citations are illegal.', 'They are identical in length.'],
      'In-text citations point to the full reference list entries at the end of the document.'
    ),
    {
      id: 'citation-styles-q7',
      question: 'Fill in the blank: In MLA in-text citations (Rowling 42), notice that there is NO ______ between author name and page number.',
      type: 'fill-in-the-blank',
      correctAnswer: 'comma',
      explanation: 'MLA format uses (Author Page) without a comma.'
    },
    {
      id: 'citation-styles-q8',
      question: 'Select the citation format:',
      type: 'drag-drop',
      blankSentence: 'The text "(Smith, 2023)" inside a sentence represents an in-text citation in ______ style.',
      dragOptions: ['APA', 'MLA', 'IEEE', 'Vancouver'],
      correctAnswer: 'APA',
      explanation: 'APA in-text format uses (Author Last Name, Year).'
    },
    {
      id: 'citation-styles-q9',
      question: 'Match the in-text citation example to its style:',
      type: 'match-following',
      leftItems: ['(Smith, 2023)', '(Rowling 42)', '[1]'],
      rightItems: ['APA In-text Citation', 'MLA In-text Citation', 'IEEE In-text Citation'],
      correctAnswer: {
        '(Smith, 2023)': 'APA In-text Citation',
        '(Rowling 42)': 'MLA In-text Citation',
        '[1]': 'IEEE In-text Citation'
      },
      explanation: 'APA uses (Name, Year), MLA uses (Name Page), IEEE uses bracketed numbers [1].'
    },
    createRandomizedMCQ(
      'citation-styles-q10',
      'Why do technical engineering papers prefer IEEE bracketed numbers [1] over author-date citations?',
      'To keep complex technical equations and code descriptions clean, uncluttered, and easy to read.',
      ['Because engineers do not know author names.', 'Because bracketed numbers hide the publication year.', 'Because IEEE style requires no references.'],
      'Numbered bracket citations maintain readability in dense technical writing.'
    )
  ],

  'academic-integrity': [
    createRandomizedMCQ(
      'academic-integrity-q1',
      'Pema downloads a stunning photo of Tiger’s Nest from Instagram and uses it as her school magazine cover without asking or crediting the photographer. Is this ethical?',
      'No, because taking and publishing someone else’s intellectual property without credit or permission violates fair use and IP rights.',
      ['Yes, because anything on Instagram is free for public printing.', 'Yes, as long as she crops out the photographer name.', 'No, only if the photo was taken in winter.'],
      'Right-clicking and saving does not grant ownership or commercial/publication rights.'
    ),
    {
      id: 'academic-integrity-q2',
      question: 'Fill in the blank: Presenting someone else’s work, ideas, or words as your own without proper citation is called ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Plagiarism',
      explanation: 'Plagiarism is academic dishonesty that involves taking credit for another author’s work.'
    },
    {
      id: 'academic-integrity-q3',
      question: 'Select the legal concept:',
      type: 'drag-drop',
      blankSentence: 'Intangible human creations like music, books, photos, and software are protected under Intellectual ______ rights.',
      dragOptions: ['Property', 'Domain', 'Monopoly', 'Territory'],
      correctAnswer: 'Property',
      explanation: 'Intellectual Property (IP) laws protect original artistic, literary, and technical creations.'
    },
    {
      id: 'academic-integrity-q4',
      question: 'Match the ethical principle with its definition:',
      type: 'match-following',
      leftItems: ['Plagiarism', 'Intellectual Property', 'Academic Integrity'],
      rightItems: ['Taking credit for someone else’s work', 'Legal ownership rights over creative/intellectual work', 'Honesty and responsibility in academic and research work'],
      correctAnswer: {
        'Plagiarism': 'Taking credit for someone else’s work',
        'Intellectual Property': 'Legal ownership rights over creative/intellectual work',
        'Academic Integrity': 'Honesty and responsibility in academic and research work'
      },
      explanation: 'Plagiarism is copying, IP is creation rights, Academic Integrity is honesty.'
    },
    createRandomizedMCQ(
      'academic-integrity-q5',
      'Why is giving credit to digital creators important for the "creative ecosystem"?',
      'If creators are not credited or compensated, they cannot afford to produce future music, photography, or software.',
      ['It makes internet bandwidth faster in Bhutan.', 'It automatically ranks websites higher on Google.', 'It converts web files to PDF format.'],
      'Proper credit and licensing sustain the livelihoods of artists and developers.'
    ),
    createRandomizedMCQ(
      'academic-integrity-q6',
      'What consequences can a student face for committing severe plagiarism in school or university?',
      'Failing grades, academic suspension, or loss of diploma.',
      ['Awarding extra XP points.', 'Receiving a free laptop from school.', 'Promotion to school captain.'],
      'Academic institutions enforce strict penalties for plagiarism to uphold integrity.'
    ),
    {
      id: 'academic-integrity-q7',
      question: 'Fill in the blank: Just because you can "right-click and save" an image online does NOT mean you ______ it.',
      type: 'fill-in-the-blank',
      correctAnswer: 'own',
      explanation: 'Downloading a digital file does not transfer copyright ownership.'
    },
    {
      id: 'academic-integrity-q8',
      question: 'Complete the ethics rule:',
      type: 'drag-drop',
      blankSentence: 'To practice ethical digital citizenship, students must always cite sources and obtain ______ when using commercial work.',
      dragOptions: ['permission', 'passwords', 'encryption', 'monopolies'],
      correctAnswer: 'permission',
      explanation: 'Permission or proper licensing is required before using copyrighted work.'
    },
    {
      id: 'academic-integrity-q9',
      question: 'Match the action with its ethical standing:',
      type: 'match-following',
      leftItems: ['Citing a photographer in a school report', 'Copying a Wikipedia paragraph without quotes or citation', 'Paying a subscription for software'],
      rightItems: ['Ethical attribution', 'Academic Plagiarism', 'Responsible IP support'],
      correctAnswer: {
        'Citing a photographer in a school report': 'Ethical attribution',
        'Copying a Wikipedia paragraph without quotes or citation': 'Academic Plagiarism',
        'Paying a subscription for software': 'Responsible IP support'
      },
      explanation: 'Attribution gives credit, uncredited copying is plagiarism, paying supports creators.'
    },
    createRandomizedMCQ(
      'academic-integrity-q10',
      'How does proper citation protect a student authoring an essay on Bhutanese history?',
      'It proves thorough research, builds reader trust, and avoids plagiarism penalties.',
      ['It guarantees an A grade regardless of content.', 'It hides the student identity from teachers.', 'It makes the essay shorter.'],
      'Citations strengthen academic credibility and demonstrate scholarly rigor.'
    )
  ],

  'digital-footprint-bhutan': [
    createRandomizedMCQ(
      'digital-footprint-bhutan-q1',
      'What is a "Digital Footprint"?',
      'The trail of data and online activity left behind whenever someone uses the internet or social media.',
      ['The physical shoe size recorded by smart socks.', 'A virus that deletes computer files.', 'The length of fiber optic cables in Thimphu.'],
      'Digital footprint encompasses all online traces including posts, comments, searches, and uploads.'
    ),
    {
      id: 'digital-footprint-bhutan-q2',
      question: 'Fill in the blank: Online activity that you intentionally post like social media photos and comments forms your ______ digital footprint.',
      type: 'fill-in-the-blank',
      correctAnswer: 'active',
      explanation: 'Active digital footprint includes content you deliberately share online.'
    },
    {
      id: 'digital-footprint-bhutan-q3',
      question: 'Select the footprint type:',
      type: 'drag-drop',
      blankSentence: 'Data collected automatically in the background like IP addresses and browsing history forms your ______ digital footprint.',
      dragOptions: ['passive', 'active', 'manual', 'visible'],
      correctAnswer: 'passive',
      explanation: 'Passive footprint is collected silently without active user input.'
    },
    {
      id: 'digital-footprint-bhutan-q4',
      question: 'Match the footprint component with its example:',
      type: 'match-following',
      leftItems: ['Active Footprint', 'Passive Footprint', 'Digital Reputation'],
      rightItems: ['Posting a comment on Facebook', 'IP address logged by a web server', 'Public perception based on your online history'],
      correctAnswer: {
        'Active Footprint': 'Posting a comment on Facebook',
        'Passive Footprint': 'IP address logged by a web server',
        'Digital Reputation': 'Public perception based on your online history'
      },
      explanation: 'Active is intentional, passive is automatic, reputation is public impact.'
    },
    createRandomizedMCQ(
      'digital-footprint-bhutan-q5',
      'Why should Class 10 students in Bhutan be cautious about what they post on social media?',
      'Online posts create permanent digital footprints that can impact future college admissions and job prospects.',
      ['Because posts are automatically deleted after 2 hours.', 'Because social media accounts are illegal in Bhutan.', 'Because posts cannot be seen by school principals.'],
      'Digital footprints are permanent and searchable by future employers and universities.'
    ),
    createRandomizedMCQ(
      'digital-footprint-bhutan-q6',
      'What is considered good digital etiquette (Netiquette) when interacting in online Bhutanese student forums?',
      'Being respectful, avoiding cyberbullying, verifying facts before sharing, and protecting privacy.',
      ['Posting aggressive insults anonymously.', 'Sharing unverified gossip about classmates.', 'Uploading private photos of others.'],
      'Netiquette emphasizes respect, constructive discourse, and privacy protection.'
    ),
    {
      id: 'digital-footprint-bhutan-q7',
      question: 'Fill in the blank: The guidelines and ethics for responsible behavior on the internet are referred to as digital ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'citizenship',
      explanation: 'Digital citizenship defines rights and responsibilities in the digital world.'
    },
    {
      id: 'digital-footprint-bhutan-q8',
      question: 'Identify the privacy protection step:',
      type: 'drag-drop',
      blankSentence: 'Adjusting account settings on social media to restrict post visibility to approved friends manages your online ______.',
      dragOptions: ['privacy', 'bandwidth', 'resolution', 'storage'],
      correctAnswer: 'privacy',
      explanation: 'Privacy settings control who can view and interact with your digital content.'
    },
    {
      id: 'digital-footprint-bhutan-q9',
      question: 'Match the online behavior to its impact:',
      type: 'match-following',
      leftItems: ['Posting hateful comments', 'Fact-checking news before sharing', 'Using strong passwords and 2FA'],
      rightItems: ['Damages digital reputation and harms others', 'Prevents spread of false misinformation', 'Secures personal digital footprint from hacking'],
      correctAnswer: {
        'Posting hateful comments': 'Damages digital reputation and harms others',
        'Fact-checking news before sharing': 'Prevents spread of false misinformation',
        'Using strong passwords and 2FA': 'Secures personal digital footprint from hacking'
      },
      explanation: 'Behavior dictates online safety, reputation, and truthfulness.'
    },
    createRandomizedMCQ(
      'digital-footprint-bhutan-q10',
      'Is content deleted from social media completely erased from the internet?',
      'No, because screenshots, server backups, and web archives can retain copies permanently.',
      ['Yes, clicking delete erases all copies globally instantly.', 'Yes, if you turn off your phone right away.', 'Yes, social media companies never save backups.'],
      'Digital content can persist indefinitely via archives, screenshots, and server logs.'
    )
  ],

  'fact-checking-sift': [
    createRandomizedMCQ(
      'fact-checking-sift-q1',
      'Dorji sees a Facebook post from "Bhutan News Flash" (no About section) claiming a hydropower project finishes next month. What is the FIRST step of the SIFT method?',
      'Stop! (Do not share or react immediately; pause and evaluate).',
      ['Share the post with all classmates instantly.', 'Comment "True news!" on the post.', 'Delete Facebook app from the phone.'],
      'The "S" in SIFT stands for STOP before sharing unverified claims.'
    ),
    {
      id: 'fact-checking-sift-q2',
      question: 'Fill in the blank: In the SIFT fact-checking method, the letter "I" stands for Investigate the ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'source',
      explanation: 'Investigate the source checks who published the claim and their credibility.'
    },
    {
      id: 'fact-checking-sift-q3',
      question: 'Identify the SIFT step:',
      type: 'drag-drop',
      blankSentence: 'Looking for trusted news outlets or official government statements to see what other sources say represents "Find ______ coverage".',
      dragOptions: ['trusted', 'local', 'viral', 'secret'],
      correctAnswer: 'trusted',
      explanation: 'Finding trusted, better coverage verifies if other reputable sources report the same news.'
    },
    {
      id: 'fact-checking-sift-q4',
      question: 'Match each letter of the SIFT fact-checking model with its action:',
      type: 'match-following',
      leftItems: ['S', 'I', 'F', 'T'],
      rightItems: ['STOP (Pause before sharing or believing)', 'Investigate the source (Check who is behind the claim)', 'Find trusted coverage (Cross-check with reputable outlets)', 'Trace claims back to the original context'],
      correctAnswer: {
        'S': 'STOP (Pause before sharing or believing)',
        'I': 'Investigate the source (Check who is behind the claim)',
        'F': 'Find trusted coverage (Cross-check with reputable outlets)',
        'T': 'Trace claims back to the original context'
      },
      explanation: 'S-I-F-T is the standard 4-step source evaluation method.'
    },
    createRandomizedMCQ(
      'fact-checking-sift-q5',
      'What does "Trace claims, quotes, and media back to the original context" mean in SIFT?',
      'Locating where an image or quote originally appeared to ensure it hasn’t been edited or taken out of context.',
      ['Translating the quote into three languages.', 'Tracing the letters of the quote on paper.', 'Counting how many words are in the claim.'],
      'Tracing context verifies whether media or quotes were distorted or repurposed deceptively.'
    ),
    createRandomizedMCQ(
      'fact-checking-sift-q6',
      'Why do fake news posts and clickbait headlines spread quickly on social media?',
      'Because they exploit strong emotions like fear or excitement to trick users into sharing without checking.',
      ['Because government agencies write them.', 'Because social media bans true news.', 'Because fake posts are shorter than 3 letters.'],
      'Clickbait uses emotional triggers to bypass critical evaluation.'
    ),
    {
      id: 'fact-checking-sift-q7',
      question: 'Fill in the blank: Evaluating whether a news page has an "About Us" section and official contact info helps investigate the ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'source',
      explanation: 'Source investigation examines publisher transparency and credentials.'
    },
    {
      id: 'fact-checking-sift-q8',
      question: 'Select the SIFT action:',
      type: 'drag-drop',
      blankSentence: 'When an unverified viral post appears, the SIFT method advises you to ______ before clicking share.',
      dragOptions: ['STOP', 'SHARE', 'LIKE', 'REPOST'],
      correctAnswer: 'STOP',
      explanation: 'STOP is the essential first step to prevent spreading misinformation.'
    },
    {
      id: 'fact-checking-sift-q9',
      question: 'Match the misinformation term with its description:',
      type: 'match-following',
      leftItems: ['Misinformation', 'Disinformation', 'Clickbait'],
      rightItems: ['False information shared unintentionally without bad intent', 'False information deliberately created to deceive people', 'Sensational headline designed to attract clicks'],
      correctAnswer: {
        'Misinformation': 'False information shared unintentionally without bad intent',
        'Disinformation': 'False information deliberately created to deceive people',
        'Clickbait': 'Sensational headline designed to attract clicks'
      },
      explanation: 'Misinformation is accidental error; Disinformation is intentional deception; Clickbait is sensational attraction.'
    },
    createRandomizedMCQ(
      'fact-checking-sift-q10',
      'Which Bhutanese agency or official news portal should students consult to verify national government announcements?',
      'Official ministry websites (e.g. BBS, GovTech, Cabinet Secretariat) ending in .gov.bt',
      ['Anonymous Facebook group comments.', 'Unverified TikTok viral videos.', 'Random messaging chain letters.'],
      'Official government portals (.gov.bt) provide authentic, verified news.'
    )
  ],

  'copyright-laws': [
    createRandomizedMCQ(
      'copyright-laws-q1',
      'Karma paints a unique mural on her bedroom wall depicting Rig Sum Goenpo. Does she hold copyright over her artwork even if she hasn’t registered it?',
      'Yes! Copyright is automatically granted the moment an original work is fixed in a tangible form.',
      ['No, copyright requires paying Nu 10,000 at a police station.', 'No, murals cannot be copyrighted.', 'Yes, but only for 24 hours.'],
      'Copyright is automatic upon creation and tangible fixation under copyright law.'
    ),
    {
      id: 'copyright-laws-q2',
      question: 'Fill in the blank: Under Bhutanese copyright law, copyright protection generally lasts for the author’s life plus ______ years.',
      type: 'fill-in-the-blank',
      correctAnswer: '50',
      explanation: 'In Bhutan, copyright protection lasts for the life of the author plus 50 years.'
    },
    {
      id: 'copyright-laws-q3',
      question: 'Select the copyright eligibility factor:',
      type: 'drag-drop',
      blankSentence: 'Copyright protects the expression of an idea fixed in a tangible form, NOT raw ______ or unwritten ideas.',
      dragOptions: ['ideas', 'paintings', 'novels', 'sculptures'],
      correctAnswer: 'ideas',
      explanation: 'Copyright law protects the tangible expression of ideas, not abstract ideas or facts themselves.'
    },
    {
      id: 'copyright-laws-q4',
      question: 'Match the exclusive right of a copyright owner with its meaning:',
      type: 'match-following',
      leftItems: ['Reproduction Right', 'Distribution Right', 'Adaptation Right', 'Public Display Right'],
      rightItems: ['The right to make copies of the work', 'The right to sell or lend copies to the public', 'The right to create derivative works (translations)', 'The right to exhibit art or photos publicly'],
      correctAnswer: {
        'Reproduction Right': 'The right to make copies of the work',
        'Distribution Right': 'The right to sell or lend copies to the public',
        'Adaptation Right': 'The right to create derivative works (translations)',
        'Public Display Right': 'The right to exhibit art or photos publicly'
      },
      explanation: 'Copyright owners hold exclusive rights over reproduction, distribution, adaptation, and public display.'
    },
    createRandomizedMCQ(
      'copyright-laws-q5',
      'Dorji tells a classmate an idea for a movie about a Yeti playing guitar. The classmate writes a full script. Can Dorji sue for copyright infringement of his idea?',
      'No, because copyright does not protect unwritten ideas or spoken concepts—only tangible expressions (the script).',
      ['Yes, because Dorji spoke first.', 'Yes, ideas are fully protected by law.', 'No, unless the Yeti plays traditional Dramyen.'],
      'Copyright protects tangible expressions, not abstract ideas.'
    ),
    createRandomizedMCQ(
      'copyright-laws-q6',
      'What happens to a copyrighted book or photo after its copyright term expires?',
      'It enters the Public Domain, allowing anyone to use, share, and adapt it freely.',
      ['It is permanently destroyed by the government.', 'It becomes owned by Google.', 'It requires a new copyright fee.'],
      'Expired works enter the public domain for unrestricted public use.'
    ),
    {
      id: 'copyright-laws-q7',
      question: 'Fill in the blank: Using a copyrighted work without permission or violating exclusive owner rights is called copyright ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'infringement',
      explanation: 'Copyright infringement is the unauthorized use of copyrighted material.'
    },
    {
      id: 'copyright-laws-q8',
      question: 'Identify the category that CANNOT be copyrighted:',
      type: 'drag-drop',
      blankSentence: 'Individual facts, mathematical formulas, and raw unwritten ideas cannot be protected by ______.',
      dragOptions: ['copyright', 'textbooks', 'paintings', 'movies'],
      correctAnswer: 'copyright',
      explanation: 'Facts and formulas are not subject to copyright protection.'
    },
    {
      id: 'copyright-laws-q9',
      question: 'Match the creative work category with an example from ICT-10:',
      type: 'match-following',
      leftItems: ['Literary Works', 'Musical Works', 'Software Works', 'Visual Art'],
      rightItems: ['Books, poems, and blogs', 'Songs, compositions, and lyrics', 'Computer programs and games', 'Paintings, photographs, and illustrations'],
      correctAnswer: {
        'Literary Works': 'Books, poems, and blogs',
        'Musical Works': 'Songs, compositions, and lyrics',
        'Software Works': 'Computer programs and games',
        'Visual Art': 'Paintings, photographs, and illustrations'
      },
      explanation: 'Examples of tangible original works subject to copyright.'
    },
    createRandomizedMCQ(
      'copyright-laws-q10',
      'What legal penalties can a shop in Thimphu face for selling pirated copies of Bhutanese films ("Namkhay")?',
      'Fines, confiscation of pirated goods, monetary damages, and potential imprisonment under Bhutan copyright law.',
      ['A warning letter without any legal impact.', 'Receiving a free license from the film director.', 'Promotion on national television.'],
      'Piracy and copyright infringement carry civil damages and criminal penalties.'
    )
  ],

  'creative-commons-licenses': [
    createRandomizedMCQ(
      'creative-commons-licenses-q1',
      'What do Creative Commons (CC) licenses allow creators to do?',
      'Change default "all rights reserved" copyright terms to "some rights reserved" by granting permissions in advance.',
      ['Give up their copyright ownership entirely to the government.', 'Prevent anyone from ever viewing their work.', 'Sell their work automatically on eBay.'],
      'CC licenses let creators give public permission in advance under specified conditions.'
    ),
    {
      id: 'creative-commons-licenses-q2',
      question: 'Fill in the blank: The Creative Commons license element "BY" stands for ______, requiring users to credit the original author.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Attribution',
      explanation: 'BY (Attribution) requires giving appropriate credit to the creator.'
    },
    {
      id: 'creative-commons-licenses-q3',
      question: 'Identify the CC icon symbol:',
      type: 'drag-drop',
      blankSentence: 'The license condition prohibiting commercial use or paid advertisements is symbolized by NC (Non-______).',
      dragOptions: ['Commercial', 'Compliant', 'Copyright', 'Creative'],
      correctAnswer: 'Commercial',
      explanation: 'NC stands for Non-Commercial.'
    },
    {
      id: 'creative-commons-licenses-q4',
      question: 'Match the four Creative Commons license elements with their rules:',
      type: 'match-following',
      leftItems: ['BY (Attribution)', 'ND (No Derivatives)', 'SA (Share Alike)', 'NC (Non-Commercial)'],
      rightItems: ['Must credit the original creator', 'Work must be passed along unchanged without edits', 'New creations must use identical license terms', 'Work can only be used for non-commercial purposes'],
      correctAnswer: {
        'BY (Attribution)': 'Must credit the original creator',
        'ND (No Derivatives)': 'Work must be passed along unchanged without edits',
        'SA (Share Alike)': 'New creations must use identical license terms',
        'NC (Non-Commercial)': 'Work can only be used for non-commercial purposes'
      },
      explanation: 'Core conditions that form all 6 Creative Commons licenses.'
    },
    createRandomizedMCQ(
      'creative-commons-licenses-q5',
      'If Tashi releases a trekking map under CC BY-SA, and Pema creates an "Enhanced Map" adding GPS coordinates, what license MUST Pema use?',
      'CC BY-SA (must share new creations under identical terms due to ShareAlike).',
      ['CC BY-NC-ND', 'All Rights Reserved Copyright', 'Public Domain'],
      'ShareAlike (SA) forces derivative works to adopt the exact same CC license.'
    ),
    createRandomizedMCQ(
      'creative-commons-licenses-q6',
      'An artist releases a Tshechu photo under CC BY-ND. Is a graphic designer allowed to crop and turn the photo black-and-white for a poetry book?',
      'No, because ND (No Derivatives) forbids editing, cropping, or altering the original image.',
      ['Yes, cropping is always allowed.', 'Yes, if she credits the photographer.', 'Yes, if she prints in black and white.'],
      'No Derivatives (ND) requires the work to be passed along unchanged.'
    ),
    {
      id: 'creative-commons-licenses-q7',
      question: 'Fill in the blank: The most restrictive Creative Commons license allowing downloads with credit but no changes or commercial use is CC BY-NC-______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'ND',
      explanation: 'CC BY-NC-ND is the most restrictive CC license.'
    },
    {
      id: 'creative-commons-licenses-q8',
      question: 'Select the public domain dedication tool:',
      type: 'drag-drop',
      blankSentence: 'A photographer who waives all copyright rights to donate photos to the world uses the ______ Public Domain Dedication tool.',
      dragOptions: ['CC0', 'CC BY', 'CC BY-ND', 'Copyright'],
      correctAnswer: 'CC0',
      explanation: 'CC0 (CC Zero) places work into the worldwide public domain with no conditions.'
    },
    {
      id: 'creative-commons-licenses-q9',
      question: 'Match the Creative Commons license with its allowed usage:',
      type: 'match-following',
      leftItems: ['CC BY', 'CC BY-SA', 'CC BY-NC', 'CC0'],
      rightItems: ['Most flexible; allows remix and commercial use with credit', 'Allows remixing if new work uses identical ShareAlike license', 'Allows remixing for non-commercial purposes only', 'Waives all rights; no credit or conditions required'],
      correctAnswer: {
        'CC BY': 'Most flexible; allows remix and commercial use with credit',
        'CC BY-SA': 'Allows remixing if new work uses identical ShareAlike license',
        'CC BY-NC': 'Allows remixing for non-commercial purposes only',
        'CC0': 'Waives all rights; no credit or conditions required'
      },
      explanation: 'Standard CC license permissions from most open (CC0/CC BY) to conditional.'
    },
    createRandomizedMCQ(
      'creative-commons-licenses-q10',
      'Sonam uses a CC BY-NC song for her school gardening video. A local cafe asks to use her video in a paid TV advertisement. Can the cafe use it?',
      'No, because NC (Non-Commercial) forbids using the song or video in paid commercial advertisements.',
      ['Yes, because cafes sell coffee.', 'Yes, if the cafe plays the video on repeat.', 'Yes, because school videos have no copyright.'],
      'Non-Commercial restrictions prevent commercial and advertising use.'
    )
  ],

  'fair-use-exceptions': [
    createRandomizedMCQ(
      'fair-use-exceptions-q1',
      'What is "Fair Use" (or Educational Exception) in copyright law?',
      'A legal doctrine that allows limited use of copyrighted material without permission for critique, news reporting, teaching, or research.',
      ['A rule allowing students to sell pirated movies.', 'A license that costs Nu 5,000 per month.', 'A rule that permits copying entire textbooks for commercial resale.'],
      'Fair use allows limited, non-commercial educational use without copyright holder permission.'
    ),
    {
      id: 'fair-use-exceptions-q2',
      question: 'Fill in the blank: Using a small snippet of a news broadcast in a student classroom presentation is protected under ______ use.',
      type: 'fill-in-the-blank',
      correctAnswer: 'fair',
      explanation: 'Fair use protects non-profit educational analysis of brief excerpts.'
    },
    {
      id: 'fair-use-exceptions-q3',
      question: 'Identify the fair use factor:',
      type: 'drag-drop',
      blankSentence: 'Analyzing whether an excerpt was used for non-profit education versus commercial profit evaluates the ______ of the use.',
      dragOptions: ['purpose', 'color', 'filetype', 'bandwidth'],
      correctAnswer: 'purpose',
      explanation: 'The purpose and character of the use is the first key factor of fair use evaluation.'
    },
    {
      id: 'fair-use-exceptions-q4',
      question: 'Match the Fair Use Evaluation Factor with its description:',
      type: 'match-following',
      leftItems: ['Purpose of Use', 'Nature of Work', 'Amount Used', 'Market Effect'],
      rightItems: ['Non-profit educational vs commercial commercial use', 'Factual/scholarly work vs highly creative fiction', 'Brief excerpt/snippet vs entire book or movie', 'Impact on the original author’s commercial sales'],
      correctAnswer: {
        'Purpose of Use': 'Non-profit educational vs commercial commercial use',
        'Nature of Work': 'Factual/scholarly work vs highly creative fiction',
        'Amount Used': 'Brief excerpt/snippet vs entire book or movie',
        'Market Effect': 'Impact on the original author’s commercial sales'
      },
      explanation: 'The four statutory factors used to determine if a use qualifies as Fair Use.'
    },
    createRandomizedMCQ(
      'fair-use-exceptions-q5',
      'A school in Zhemgang wants to translate an entire English textbook into Khengkha and print 500 copies for district distribution. Is this automatically Fair Use?',
      'No, because translating and printing an entire textbook replaces market sales and requires copyright owner permission.',
      ['Yes, all translations are automatically fair use.', 'Yes, if printed on recycled paper.', 'No, only because Khengkha is a regional language.'],
      'Copying and distributing an entire textbook impacts the market and exceeds fair use limits.'
    ),
    createRandomizedMCQ(
      'fair-use-exceptions-q6',
      'Which of the following scenarios is MOST likely to qualify as Fair Use?',
      'Quoting two sentences from a published book in a student critical review essay.',
      ['Uploading a full movie to YouTube for monetization.', 'Photocopying a complete workbook for 200 students.', 'Selling pirated MP3 songs at a festival.'],
      'Brief quotations for criticism, commentary, or education represent classic fair use.'
    ),
    {
      id: 'fair-use-exceptions-q7',
      question: 'Fill in the blank: Transformative use that adds new meaning or commentary to an original work strengthens a claim of ______ use.',
      type: 'fill-in-the-blank',
      correctAnswer: 'fair',
      explanation: 'Transformative commentary or criticism supports fair use claims.'
    },
    {
      id: 'fair-use-exceptions-q8',
      question: 'Select the fair use purpose:',
      type: 'drag-drop',
      blankSentence: 'Using excerpts of copyrighted work for news reporting, parody, or academic ______ is permitted under fair use.',
      dragOptions: ['research', 'resale', 'piracy', 'monetization'],
      correctAnswer: 'research',
      explanation: 'Research and scholarship are explicit fair use purposes.'
    },
    {
      id: 'fair-use-exceptions-q9',
      question: 'Match the scenario to its legal standing:',
      type: 'match-following',
      leftItems: ['Playing a 10-second song clip in a music review video', 'Selling photocopied textbooks in a bookstore', 'Parodying a famous movie scene in a drama class'],
      rightItems: ['Likely Fair Use', 'Copyright Infringement', 'Likely Fair Use'],
      correctAnswer: {
        'Playing a 10-second song clip in a music review video': 'Likely Fair Use',
        'Selling photocopied textbooks in a bookstore': 'Copyright Infringement',
        'Parodying a famous movie scene in a drama class': 'Likely Fair Use'
      },
      explanation: 'Brief clips for review and educational parodies qualify; commercial resale is infringement.'
    },
    createRandomizedMCQ(
      'fair-use-exceptions-q10',
      'Why does copying an entire textbook harm the copyright holder under the "Market Effect" factor?',
      'Because students no longer purchase the book, depriving authors and publishers of rightful revenue.',
      ['Because it causes computer servers to overheat.', 'Because textbooks become illegal.', 'Because publishers prefer free printing.'],
      'Depriving creators of sales is a primary reason unauthorized full-book copying fails fair use tests.'
    )
  ],

  'public-domain-oer': [
    createRandomizedMCQ(
      'public-domain-oer-q1',
      'You find a historical photograph of the 3rd King of Bhutan taken by a photographer who passed away in 1960. In 2026, can you use this photo freely for a public exhibition?',
      'Yes, because 1960 + 50 years expired in 2010, placing the photograph in the Public Domain under Bhutanese law.',
      ['No, historical photos can never be exhibited.', 'No, unless you pay a royalty to Apple.', 'Yes, but only if kept secret.'],
      'Under Bhutan law (life + 50 years), copyright expired in 2010, so the photo is in the public domain.'
    ),
    {
      id: 'public-domain-oer-q2',
      question: 'Fill in the blank: Open Educational Resources (OER) are teaching and learning materials released under open licenses that permit free use and ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'adaptation',
      explanation: 'OER materials allow teachers and students to freely access, adapt, and redistribute content.'
    },
    {
      id: 'public-domain-oer-q3',
      question: 'Select the material state:',
      type: 'drag-drop',
      blankSentence: 'Creative works whose copyright protection has expired belong to the ______ domain.',
      dragOptions: ['public', 'private', 'restricted', 'licensed'],
      correctAnswer: 'public',
      explanation: 'Public domain works are free of copyright restrictions.'
    },
    {
      id: 'public-domain-oer-q4',
      question: 'Match the resource type with its license condition:',
      type: 'match-following',
      leftItems: ['Public Domain Work', 'Open Educational Resource (OER)', 'All Rights Reserved Work'],
      rightItems: ['No copyright restrictions; free to use without permission', 'Free educational material under open Creative Commons license', 'Full copyright protection; requires explicit permission/payment'],
      correctAnswer: {
        'Public Domain Work': 'No copyright restrictions; free to use without permission',
        'Open Educational Resource (OER)': 'Free educational material under open Creative Commons license',
        'All Rights Reserved Work': 'Full copyright protection; requires explicit permission/payment'
      },
      explanation: 'Public domain has no copyright, OER uses open licenses, All Rights Reserved requires permissions.'
    },
    createRandomizedMCQ(
      'public-domain-oer-q5',
      'Which of the following is an example of an Open Educational Resource (OER)?',
      'A digital textbook published under a CC BY license on Wikimedia Commons.',
      ['A commercial movie sold in cinema halls.', 'A password-protected paid software program.', 'A copyrighted music CD.'],
      'OER resources are openly licensed educational assets like CC BY textbooks.'
    ),
    createRandomizedMCQ(
      'public-domain-oer-q6',
      'What are the "5 Rs" permissions granted by Open Educational Resources (OER)?',
      'Retain, Reuse, Revise, Remix, and Redistribute.',
      ['Remove, Reject, Restrict, Refund, Replace.', 'Read, Recite, Record, Repeat, Return.', 'Render, Rasterize, Rotate, Resize, Record.'],
      'The 5 Rs define open education rights: Retain, Reuse, Revise, Remix, Redistribute.'
    ),
    {
      id: 'public-domain-oer-q7',
      question: 'Fill in the blank: Works dedicated using the CC0 tool enter the public ______ immediately.',
      type: 'fill-in-the-blank',
      correctAnswer: 'domain',
      explanation: 'CC0 surrenders copyright to put works into the public domain.'
    },
    {
      id: 'public-domain-oer-q8',
      question: 'Identify the OER benefit:',
      type: 'drag-drop',
      blankSentence: 'OER materials reduce textbook costs for students and allow teachers to ______ content to fit local Bhutanese curricula.',
      dragOptions: ['adapt', 'restrict', 'censor', 'delete'],
      correctAnswer: 'adapt',
      explanation: 'OER allows teachers to adapt and localize learning materials.'
    },
    {
      id: 'public-domain-oer-q9',
      question: 'Match the 5 R permission with its meaning in OER:',
      type: 'match-following',
      leftItems: ['Revise', 'Remix', 'Redistribute'],
      rightItems: ['Adapting or translating the content', 'Combining original content with other materials', 'Sharing copies of modified content with students'],
      correctAnswer: {
        'Revise': 'Adapting or translating the content',
        'Remix': 'Combining original content with other materials',
        'Redistribute': 'Sharing copies of modified content with students'
      },
      explanation: 'Revise modifies text, Remix combines sources, Redistribute shares final copies.'
    },
    createRandomizedMCQ(
      'public-domain-oer-q10',
      'Why does government funding of Open Educational Resources benefit rural schools in Bhutan?',
      'It ensures every student receives free high-quality digital textbooks that can be printed or read offline.',
      ['It forces students to pay monthly fees.', 'It limits textbook access to wealthy cities.', 'It bans digital devices.'],
      'OER provides equitable access to quality educational resources across all regions.'
    )
  ],

  'drm-software-piracy': [
    createRandomizedMCQ(
      'drm-software-piracy-q1',
      'What is DRM (Digital Rights Management)?',
      'Technology and encryption controls used by software and media companies to restrict unauthorized copying and distribution.',
      ['A computer virus that formats hard drives.', 'A free download website.', 'A government taxes on printers.'],
      'DRM controls access and prevents illegal copying or playback of digital media.'
    ),
    {
      id: 'drm-software-piracy-q2',
      question: 'Fill in the blank: The unauthorized copying, downloading, or distribution of commercial software is called software ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'piracy',
      explanation: 'Software piracy refers to illegal duplication and distribution of licensed software.'
    },
    {
      id: 'drm-software-piracy-q3',
      question: 'Identify the software license model:',
      type: 'drag-drop',
      blankSentence: 'Software whose source code is open to the public for free inspection, modification, and redistribution is called ______ Source.',
      dragOptions: ['Open', 'Proprietary', 'Pirated', 'Encrypted'],
      correctAnswer: 'Open',
      explanation: 'Open Source software (like Linux or Python) permits free inspection and modification.'
    },
    {
      id: 'drm-software-piracy-q4',
      question: 'Match the software licensing model with its characteristic:',
      type: 'match-following',
      leftItems: ['Proprietary Software', 'Open Source Software', 'Freeware', 'Pirated Software'],
      rightItems: ['Closed source code, paid license required (e.g. MS Windows)', 'Source code publicly accessible and customizable (e.g. Python)', 'Free to use closed-source software (e.g. Adobe Reader)', 'Illegally copied commercial software violating copyright'],
      correctAnswer: {
        'Proprietary Software': 'Closed source code, paid license required (e.g. MS Windows)',
        'Open Source Software': 'Source code publicly accessible and customizable (e.g. Python)',
        'Freeware': 'Free to use closed-source software (e.g. Adobe Reader)',
        'Pirated Software': 'Illegally copied commercial software violating copyright'
      },
      explanation: 'Proprietary is closed/paid, Open Source is open/free, Freeware is free/closed, Pirated is illegal.'
    },
    createRandomizedMCQ(
      'drm-software-piracy-q5',
      'What security risks do computer labs face when installing pirated "cracked" software?',
      'Pirated software cracks frequently contain malware, keyloggers, and ransomware that compromise network security.',
      ['Pirated software makes internet speeds 10x faster.', 'Pirated software automatically cleans room dust.', 'Pirated software increases hardware warranty.'],
      'Cracked software files often hide malicious trojans and ransomware.'
    ),
    createRandomizedMCQ(
      'drm-software-piracy-q6',
      'How does End User License Agreement (EULA) govern software usage?',
      'It is a legal contract between the software publisher and user defining allowed installation limits and restrictions.',
      ['It is a receipt for buying computer hardware.', 'It is a password manager app.', 'It deletes the software after 1 hour.'],
      'EULAs stipulate terms of use, device limits, and restrictions.'
    ),
    {
      id: 'drm-software-piracy-q7',
      question: 'Fill in the blank: Activation keys and hardware dongles are examples of ______ enforcement mechanisms.',
      type: 'fill-in-the-blank',
      correctAnswer: 'DRM',
      explanation: 'Product keys and license verification enforce Digital Rights Management.'
    },
    {
      id: 'drm-software-piracy-q8',
      question: 'Select the legal alternative:',
      type: 'drag-drop',
      blankSentence: 'Instead of downloading pirated paid software, schools should adopt free ______ source software like LibreOffice or Linux.',
      dragOptions: ['open', 'cracked', 'illegal', 'closed'],
      correctAnswer: 'open',
      explanation: 'Open source software provides safe, legal, and free alternatives.'
    },
    {
      id: 'drm-software-piracy-q9',
      question: 'Match the DRM technology to its method:',
      type: 'match-following',
      leftItems: ['Product Activation Key', 'Digital Watermarking', 'Encryption Lock'],
      rightItems: ['Unique code required during software installation', 'Embedding hidden owner tracking data inside media files', 'Scrambling video streams so only authorized players can decrypt'],
      correctAnswer: {
        'Product Activation Key': 'Unique code required during software installation',
        'Digital Watermarking': 'Embedding hidden owner tracking data inside media files',
        'Encryption Lock': 'Scrambling video streams so only authorized players can decrypt'
      },
      explanation: 'Activation keys verify serials, watermarking tracks copies, encryption locks playback.'
    },
    createRandomizedMCQ(
      'drm-software-piracy-q10',
      'Why is supporting legal software licenses important for national technology growth in Bhutan?',
      'It encourages foreign software investments, protects local Bhutanese IT developers, and maintains global legal standards.',
      ['It forces all citizens to buy new computers.', 'It bans internet connections.', 'It restricts students from learning programming.'],
      'Respecting software IP fosters a vibrant domestic software development industry.'
    )
  ]
};
