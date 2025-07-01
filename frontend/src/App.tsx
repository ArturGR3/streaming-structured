import React, { useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import ResumeTemplate from './components/ResumeTemplate';
import './App.css';

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
    <div className="App">
      <header className="app-header">
        <h1>🚀 Resume Parser Stream</h1>
        <p>Real-time structured resume parsing with streaming JSON output</p>
      </header>

      <div className="container">
        <div className="input-section">
          <div className="input-header">
            <h2>Resume Input</h2>
            <div className="button-group">
              <button 
                onClick={loadSample} 
                className="secondary-button"
                disabled={isStreaming}
              >
                Load Sample
              </button>
              <button 
                onClick={clearResume} 
                className="secondary-button"
                disabled={isStreaming}
              >
                Clear
              </button>
            </div>
          </div>
          
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            disabled={isStreaming}
            className="resume-input"
          />
          
          <div className="controls">
            <button 
              onClick={handleParseResume} 
              disabled={isStreaming || !resumeText.trim()}
              className="parse-button"
            >
              {isStreaming ? 'Parsing...' : 'Parse Resume'}
            </button>
            
            {isStreaming && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="progress-text">{Math.round(progress)}%</span>
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </div>

        <div className="output-section">
          <h2>Parsed Resume (Live Stream)</h2>
          
          {Object.keys(parsedResume).length === 0 && !isStreaming ? (
            <div className="empty-state">
              👈 Enter resume text and click "Parse Resume" to see a professional resume being built in real-time
            </div>
          ) : (
            <ResumeTemplate 
              resumeData={parsedResume} 
              isStreaming={isStreaming}
            />
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>
          Built with <strong>FastAPI</strong> + <strong>Instructor</strong> + <strong>React</strong>
          <br />
          Demonstrates streaming structured output from LLMs
        </p>
      </footer>
    </div>
  );
}

export default App;
