export interface DzongkhaTerm {
  english: string;
  dzongkha: string;
  phonetic: string;
  category: 'Python' | 'Excel' | 'Cloud' | 'Cyber' | 'General';
  definition: string;
}

export const DZONGKHA_GLOSSARY: DzongkhaTerm[] = [
  {
    english: 'Greeting / Welcome',
    dzongkha: 'སྐུ་གཟུགས་བཟང་པོ་ལགས།',
    phonetic: 'Kuzuzangpo la!',
    category: 'General',
    definition: 'Traditional respectful Bhutanese greeting meaning hello and good health.'
  },
  {
    english: 'Thank You',
    dzongkha: 'བཀྲིས་བདེ་ལེགས།',
    phonetic: 'Tashi Delek / Kadrinche',
    category: 'General',
    definition: 'Blessings, congratulations, or express gratitude.'
  },
  {
    english: 'Variable',
    dzongkha: 'འགྱུར་ཅན།',
    phonetic: 'Gyur-chen',
    category: 'Python',
    definition: 'A named container in memory used to store data values in programming.'
  },
  {
    english: 'Condition / Decision',
    dzongkha: 'གནས་སྟངས་རྩིས་ཞིབ།',
    phonetic: 'Netshang Tsi-zhib',
    category: 'Python',
    definition: 'Logical IF-ELSE structures that execute code based on TRUE or FALSE conditions.'
  },
  {
    english: 'Loop / Iteration',
    dzongkha: 'སྐྱར་འཁོར།',
    phonetic: 'Kyarkhor',
    category: 'Python',
    definition: 'Repeated execution of a block of code (FOR loops, WHILE loops).'
  },
  {
    english: 'Function',
    dzongkha: 'ལས་ཐབས།',
    phonetic: 'Lethab',
    category: 'Python',
    definition: 'A reusable block of organized code designed to perform a specific action.'
  },
  {
    english: 'Spreadsheet / Excel',
    dzongkha: 'ཤོག་ཁྲམ།',
    phonetic: 'Shokthram',
    category: 'Excel',
    definition: 'A grid of rows and columns used to perform mathematical calculations and analysis.'
  },
  {
    english: 'Formula / Calculation',
    dzongkha: 'རྩིས་གཞི།',
    phonetic: 'Tsigzhi',
    category: 'Excel',
    definition: 'An expression defining calculations on cell contents (e.g. =SUM, =AVERAGE, =IF).'
  },
  {
    english: 'Cloud Storage',
    dzongkha: 'སྤྲིན་ཕུང་གནས་སྡུད།',
    phonetic: 'Trinpung Nedue',
    category: 'Cloud',
    definition: 'Storing files online on remote servers accessible from anywhere via internet.'
  },
  {
    english: 'Copyright & Ethics',
    dzongkha: 'པར་དབང་དང་ཡ་རབས།',
    phonetic: 'Parwang dang Yarab',
    category: 'Cyber',
    definition: 'Legal ownership rights of creators and moral guidelines for using digital materials.'
  },
  {
    english: 'Google Workspace',
    dzongkha: 'གུ་གལ་ ལས་ཡུལ།',
    phonetic: 'Gugal Layul',
    category: 'Cloud',
    definition: 'Cloud productivity software suite including Google Docs, Sheets, Slides, and Forms.'
  },
  {
    english: 'Citations & Citations',
    dzongkha: 'ཁུངས་གཏུགས།',
    phonetic: 'Khungtug',
    category: 'Cyber',
    definition: 'Formally acknowledging original sources and authors using standard reference formats (APA, MLA).'
  }
];
