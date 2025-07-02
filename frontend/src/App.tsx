import React, { useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import ResumeTemplate from './components/ResumeTemplate';

// Type definitions for resume structure
interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  possible_work_locations: string[];
}

interface WorkExperience {
  role: string;
  company: string;
  location: string;
  from_date: string;
  to_date: string;
  description: string[];
}

interface Education {
  degree: string;
  university: string;
  from_date: string;
  to_date: string;
  special_achievements: string[];
}

interface Project {
  name: string;
  date: string;
  link?: string;
  purpose: string;
  key_technologies_concepts: string;
}

interface SkillCategory {
  name: string;
  skills: string[];
}

interface Certification {
  name: string;
  organization: string;
  date: string;
  certificate_link?: string;
  description: string;
  key_technologies_concepts: string;
}

interface CompleteResume {
  contact_info: ContactInfo;
  summary: string;
  work_experience: WorkExperience[];
  education: Education[];
  certification_and_training: Certification[];
  projects: Project[];
  skill_categories: SkillCategory[];
}

const SAMPLE_RESUME = `John Doe
john.doe@email.com
+1-555-0123
San Francisco, CA | New York, NY

PROFESSIONAL SUMMARY
Experienced Software Engineer with 5+ years developing scalable web applications and leading cross-functional teams. Passionate about clean code, system architecture, and mentoring junior developers.

WORK EXPERIENCE

Senior Software Engineer
Tech Corp, San Francisco, CA
March 2020 - Present
• Led a team of 5 developers in building microservices architecture serving 1M+ daily users
• Implemented CI/CD pipeline reducing deployment time by 60% and increasing release frequency
• Designed and built RESTful APIs handling 10,000+ requests per minute with 99.9% uptime
• Mentored 3 junior developers, improving team velocity by 40% and code quality metrics

Software Engineer
StartupXYZ, San Francisco, CA
June 2018 - February 2020
• Developed full-stack web applications using React, Node.js, and PostgreSQL
• Optimized database queries reducing page load times from 3s to 800ms
• Built automated testing suite achieving 85% code coverage and reducing bug reports by 50%

EDUCATION

Bachelor of Science in Computer Science
University of California, Berkeley
September 2014 - May 2018
• GPA: 3.8/4.0
• Dean's List: Fall 2016, Spring 2017
• Relevant coursework: Data Structures, Algorithms, Database Systems, Software Engineering

PROJECTS

E-commerce Platform
January 2023 - March 2023
https://github.com/johndoe/ecommerce-platform
• Built a full-stack e-commerce platform handling 1000+ daily transactions
• Technologies: React, Node.js, Express, PostgreSQL, Stripe API, AWS

Task Management App
September 2022 - November 2022
https://taskmanager-johndoe.herokuapp.com
• Developed a collaborative task management application with real-time updates
• Technologies: React, Socket.io, MongoDB, Express, JWT Authentication

SKILLS

Programming Languages: JavaScript, TypeScript, Python, Java, SQL
Frontend: React, Vue.js, HTML5, CSS3, Sass, Tailwind CSS
Backend: Node.js, Express, Django, Flask, RESTful APIs
Databases: PostgreSQL, MongoDB, MySQL, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Jenkins
Tools: Git, GitHub, VS Code, Postman, Figma

CERTIFICATIONS

AWS Certified Solutions Architect
Amazon Web Services
June 2022
https://aws.amazon.com/certification/
• Comprehensive cloud architecture and deployment strategies
• Key concepts: EC2, S3, RDS, Lambda, CloudFormation, VPC`;

function App() {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [parsedResume, setParsedResume] = useState<Partial<CompleteResume>>({});
  const [isStreaming, setIsStreaming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleParseResume = async () => {
    if (!resumeText.trim()) {
      setError('Please enter resume text');
      return;
    }

    setIsStreaming(true);
    setError(null);
    setParsedResume({});
    setProgress(0);

    try {
      await fetchEventSource('http://localhost:8000/parse-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: resumeText }),
        onmessage(event) {
          try {
            // Log the raw event data for debugging
            console.log('Raw event data:', event.data);
            
            const data = JSON.parse(event.data);
            
            if (data.error) {
              setError(data.error);
              setIsStreaming(false);
              return;
            }

            setParsedResume(data);
            
            // Calculate progress based on filled fields
            const totalFields = 7; // contact_info, summary, work_experience, education, certification_and_training, projects, skill_categories
            let filledFields = 0;
            
            if (data.contact_info?.name) filledFields++;
            if (data.summary) filledFields++;
            if (data.work_experience?.length > 0) filledFields++;
            if (data.education?.length > 0) filledFields++;
            if (data.certification_and_training?.length > 0) filledFields++;
            if (data.projects?.length > 0) filledFields++;
            if (data.skill_categories?.length > 0) filledFields++;
            
            setProgress((filledFields / totalFields) * 100);
          } catch (parseError) {
            console.error('Error parsing event data:', parseError);
            console.error('Raw event data that failed to parse:', event.data);
            // Don't set error state for parsing errors - just skip this event
            // The next event might be valid JSON
          }
        },
        onclose() {
          setIsStreaming(false);
          setProgress(100);
        },
        onerror(err) {
          console.error('EventSource failed:', err);
          setError('Connection error. Please try again.');
          setIsStreaming(false);
          throw err;
        }
      });
    } catch (error) {
      setError('Failed to parse resume. Please try again.');
      setIsStreaming(false);
    }
  };

  const clearResume = () => {
    setResumeText('');
    setParsedResume({});
    setProgress(0);
    setError(null);
  };

  const loadSample = () => {
    setResumeText(SAMPLE_RESUME);
    setParsedResume({});
    setProgress(0);
    setError(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">ATS-Friendly Resume Parser</h1>
          <p className="text-sm text-gray-500 mt-1">Paste a resume on the left, see the structured, ATS-friendly version on the right in real-time.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Resume Input</h2>
              <div className="space-x-2">
                <button 
                  onClick={loadSample} 
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                  disabled={isStreaming}
                >
                  Load Sample
                </button>
                <button 
                  onClick={clearResume} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 disabled:opacity-50"
                  disabled={isStreaming}
                >
                  Clear
                </button>
              </div>
            </div>
            
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full h-96 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Paste your resume here..."
              disabled={isStreaming}
            />

            <button
              onClick={handleParseResume}
              className="mt-4 w-full px-4 py-3 text-lg font-bold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={isStreaming}
            >
              {isStreaming ? 'Parsing...' : 'Parse Resume'}
            </button>

            {isStreaming && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-md">
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="bg-white p-6 rounded-lg shadow">
             <h2 className="text-xl font-bold text-gray-800 mb-4">Parsed Output</h2>
            <ResumeTemplate resumeData={parsedResume} isStreaming={isStreaming} />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
