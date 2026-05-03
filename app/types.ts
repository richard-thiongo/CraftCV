export type Job = { id: string; title: string; start: string; end: string; desc: string; };
export type Education = { id: string; degree: string; gradDate: string; certifications: string; };
export type Project = { id: string; name: string; link: string; desc: string; };

export type CVData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  jobs: Job[];
  education: Education[];
  projects: Project[];
  skills: string;
  references: string;
};

export type FormStep = {
  id: keyof CVData;
  label: string;
  helper: string;
  type: 'text' | 'email' | 'textarea' | 'jobs' | 'education' | 'projects';
  required: boolean;
};

export const FORM_STEPS: FormStep[] = [
  { id: 'fullName', label: 'What is your full name?', helper: 'Please enter your complete legal name or the name you use professionally. For example: John Kamau Maina.', required: true, type: 'text' },
  { id: 'email', label: 'What is your professional email address?', helper: 'Provide an email address that you check regularly so employers can reach you. For example: kamau.john@email.com.', required: true, type: 'email' },
  { id: 'phone', label: 'What is the best phone number to reach you?', helper: 'Enter your primary contact number, including the country code if you are applying internationally. For example: +254 712 345 678.', required: true, type: 'text' },
  { id: 'location', label: 'Where are you currently located?', helper: 'Mention your city and country or neighborhood. This helps employers know your base. For example: Westlands, Nairobi, Kenya.', required: false, type: 'text' },
  { id: 'summary', label: 'Could you provide a brief professional summary?', helper: 'Write 2-3 sentences highlighting your core expertise, years of experience, and your career goals. For example: "A results-oriented Sales professional with over 5 years of experience driving revenue growth..."', required: false, type: 'textarea' },
  { id: 'jobs', label: 'Can you detail your work experience?', helper: 'Add your previous roles starting with the most recent. Be sure to highlight your key achievements and responsibilities.', required: false, type: 'jobs' },
  { id: 'education', label: 'What is your educational background?', helper: 'Add your degrees, the institutions you attended, and any relevant certifications you have earned along the way.', required: false, type: 'education' },
  { id: 'projects', label: 'Do you have any notable projects to showcase?', helper: 'Add any significant projects, open-source contributions, or portfolio pieces that demonstrate your practical skills.', required: false, type: 'projects' },
  { id: 'skills', label: 'What are your top professional skills?', helper: 'List your core competencies and technical skills, separated by commas. For example: Project Management, Strategic Planning, SQL, React.', required: false, type: 'text' },
  { id: 'references', label: 'Would you like to include any references?', helper: 'Provide the names, titles, and contact information for professional references. For example: Jane Doe, HR Manager at XYZ Ltd, jane@xyz.com.', required: false, type: 'textarea' }
];

export const isSkipped = (val: string) => {
  if (!val) return true;
  return /^(no|none|n\/a|not applicable|-)$/i.test(val.trim());
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
