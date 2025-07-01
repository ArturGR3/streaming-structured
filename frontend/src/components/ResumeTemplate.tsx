import React from 'react';
import './ResumeTemplate.css';

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

interface ResumeData {
  contact_info?: ContactInfo;
  summary?: string;
  work_experience?: WorkExperience[];
  education?: Education[];
  certification_and_training?: Certification[];
  projects?: Project[];
  skill_categories?: SkillCategory[];
}

interface ResumeTemplateProps {
  resumeData: ResumeData;
  isStreaming: boolean;
}

const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, isStreaming }) => {
  const { contact_info, summary, work_experience, education, certification_and_training, projects, skill_categories } = resumeData;

  // Helper function to check if a section has content
  const hasContent = (section: any): boolean => {
    if (!section) return false;
    if (Array.isArray(section)) return section.length > 0;
    if (typeof section === 'object') {
      return Object.values(section).some(value => 
        value && (Array.isArray(value) ? value.length > 0 : value.toString().trim() !== '')
      );
    }
    return section.toString().trim() !== '';
  };

  return (
    <div className="resume-template">
      {/* Header Section */}
      <div className={`resume-section ${hasContent(contact_info) ? 'has-content' : 'streaming'}`}>
        {contact_info?.name && (
          <div className="resume-header">
            <h1 className="resume-name">{contact_info.name}</h1>
            <div className="resume-contact">
              {contact_info.email && (
                <span className="contact-item">
                  📧 {contact_info.email}
                </span>
              )}
              {contact_info.phone && (
                <span className="contact-item">
                  📞 {contact_info.phone}
                </span>
              )}
              {contact_info.possible_work_locations?.length > 0 && (
                <span className="contact-item">
                  📍 {contact_info.possible_work_locations.join(', ')}
                </span>
              )}
            </div>
          </div>
        )}
        {!hasContent(contact_info) && isStreaming && (
          <div className="streaming-placeholder">
            <div className="pulse">Extracting contact information...</div>
          </div>
        )}
      </div>

      {/* Summary Section */}
      {(hasContent(summary) || isStreaming) && (
        <div className={`resume-section ${hasContent(summary) ? 'has-content' : 'streaming'}`}>
          {hasContent(summary) ? (
            <>
              <h2 className="section-title">Professional Summary</h2>
              <p className="summary-text">{summary}</p>
            </>
          ) : (
            <div className="streaming-placeholder">
              <div className="pulse">Extracting professional summary...</div>
            </div>
          )}
        </div>
      )}

      {/* Work Experience Section */}
      {(hasContent(work_experience) || isStreaming) && (
        <div className={`resume-section ${hasContent(work_experience) ? 'has-content' : 'streaming'}`}>
          {hasContent(work_experience) ? (
            <>
              <h2 className="section-title">Work Experience</h2>
              {work_experience?.map((job, index) => (
                <div key={index} className="work-item">
                  <div className="work-header">
                    <h3 className="job-title">{job.role}</h3>
                    <span className="job-period">
                      {job.from_date} - {job.to_date}
                    </span>
                  </div>
                  <div className="company-location">
                    <strong>{job.company}</strong> • {job.location}
                  </div>
                  {job.description?.length > 0 && (
                    <ul className="job-description">
                      {job.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="streaming-placeholder">
              <div className="pulse">Extracting work experience...</div>
            </div>
          )}
        </div>
      )}

      {/* Education Section */}
      {(hasContent(education) || isStreaming) && (
        <div className={`resume-section ${hasContent(education) ? 'has-content' : 'streaming'}`}>
          {hasContent(education) ? (
            <>
              <h2 className="section-title">Education</h2>
              {education?.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="education-header">
                    <h3 className="degree-title">{edu.degree}</h3>
                    <span className="education-period">
                      {edu.from_date} - {edu.to_date}
                    </span>
                  </div>
                  <div className="university-name">{edu.university}</div>
                  {edu.special_achievements?.length > 0 && (
                    <ul className="achievements">
                      {edu.special_achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="streaming-placeholder">
              <div className="pulse">Extracting education...</div>
            </div>
          )}
        </div>
      )}

      {/* Projects Section */}
      {(hasContent(projects) || isStreaming) && (
        <div className={`resume-section ${hasContent(projects) ? 'has-content' : 'streaming'}`}>
          {hasContent(projects) ? (
            <>
              <h2 className="section-title">Projects</h2>
              {projects?.map((project, index) => (
                <div key={index} className="project-item">
                  <div className="project-header">
                    <h3 className="project-title">
                      {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          {project.name} 🔗
                        </a>
                      ) : (
                        project.name
                      )}
                    </h3>
                    <span className="project-date">{project.date}</span>
                  </div>
                  <p className="project-purpose">{project.purpose}</p>
                  {project.key_technologies_concepts && (
                    <div className="project-tech">
                      <strong>Technologies:</strong> {project.key_technologies_concepts}
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="streaming-placeholder">
              <div className="pulse">Extracting projects...</div>
            </div>
          )}
        </div>
      )}

      {/* Skills Section */}
      {(hasContent(skill_categories) || isStreaming) && (
        <div className={`resume-section ${hasContent(skill_categories) ? 'has-content' : 'streaming'}`}>
          {hasContent(skill_categories) ? (
            <>
              <h2 className="section-title">Skills</h2>
              <div className="skills-grid">
                {skill_categories?.map((category, index) => (
                  <div key={index} className="skill-category">
                    <h4 className="skill-category-name">{category.name}</h4>
                    <div className="skills-list">
                      {category.skills?.map((skill, i) => (
                        <span key={i} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="streaming-placeholder">
              <div className="pulse">Extracting skills...</div>
            </div>
          )}
        </div>
      )}

      {/* Certifications Section */}
      {hasContent(certification_and_training) && (
        <div className="resume-section has-content">
          <h2 className="section-title">Certifications & Training</h2>
          {certification_and_training?.map((cert, index) => (
            <div key={index} className="certification-item">
              <div className="certification-header">
                <h3 className="certification-title">
                  {cert.certificate_link ? (
                    <a href={cert.certificate_link} target="_blank" rel="noopener noreferrer">
                      {cert.name} 🔗
                    </a>
                  ) : (
                    cert.name
                  )}
                </h3>
                <span className="certification-date">{cert.date}</span>
              </div>
              <div className="certification-org">{cert.organization}</div>
              {cert.description && <p className="certification-desc">{cert.description}</p>}
              {cert.key_technologies_concepts && (
                <div className="certification-tech">
                  <strong>Key Concepts:</strong> {cert.key_technologies_concepts}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Loading Indicator */}
      {isStreaming && (
        <div className="streaming-indicator">
          <div className="loader"></div>
          <span>Building resume in real-time...</span>
        </div>
      )}
    </div>
  );
};

export default ResumeTemplate; 