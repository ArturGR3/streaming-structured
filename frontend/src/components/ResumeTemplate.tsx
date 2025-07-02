import React from 'react';

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
  
  const StreamingPlaceholder = ({ text }: { text: string }) => (
    <div className="py-4">
      <p className="text-sm text-gray-500 animate-pulse">{text}</p>
    </div>
  );

  const Section = ({ title, content, children }: { title: string, content: any, children: React.ReactNode }) => {
    if (hasContent(content)) {
      return (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-700 border-b-2 border-gray-300 pb-2 mb-3">{title}</h2>
          {children}
        </div>
      );
    }
    if (isStreaming) {
      return <StreamingPlaceholder text={`Extracting ${title.toLowerCase()}...`} />;
    }
    return null;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto font-sans text-gray-800">
      
      {/* Header Section */}
      {hasContent(contact_info) ? (
        <div className="text-center border-b pb-4 mb-4">
          <h1 className="text-4xl font-bold">{contact_info?.name}</h1>
          <div className="flex justify-center items-center space-x-4 mt-2 text-sm text-gray-600">
            {contact_info?.email && <span>{contact_info.email}</span>}
            {contact_info?.phone && <><span>|</span><span>{contact_info.phone}</span></>}
            {contact_info?.possible_work_locations && contact_info.possible_work_locations.length > 0 && <><span>|</span><span>{contact_info.possible_work_locations.join(', ')}</span></>}
          </div>
        </div>
      ) : (isStreaming && <StreamingPlaceholder text="Extracting contact information..." />)}

      {/* Summary Section */}
      <Section title="Professional Summary" content={summary}>
        <p className="text-base text-gray-700">{summary}</p>
      </Section>

      {/* Work Experience Section */}
      <Section title="Work Experience" content={work_experience}>
        {work_experience?.map((job, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{job.role}</h3>
              <span className="text-sm font-medium text-gray-500">{job.from_date} - {job.to_date}</span>
            </div>
            <div className="text-md text-gray-600">{job.company} • {job.location}</div>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-700 space-y-1">
              {job.description?.map((desc, i) => <li key={i}>{desc}</li>)}
            </ul>
          </div>
        ))}
      </Section>
      
      {/* Education Section */}
      <Section title="Education" content={education}>
        {education?.map((edu, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{edu.degree}</h3>
              <span className="text-sm font-medium text-gray-500">{edu.from_date} - {edu.to_date}</span>
            </div>
            <div className="text-md text-gray-600">{edu.university}</div>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-700 space-y-1">
              {edu.special_achievements?.map((achievement, i) => <li key={i}>{achievement}</li>)}
            </ul>
          </div>
        ))}
      </Section>

      {/* Projects Section */}
      <Section title="Projects" content={projects}>
        {projects?.map((project, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{project.name}</a>
                ) : (
                  project.name
                )}
              </h3>
              <span className="text-sm font-medium text-gray-500">{project.date}</span>
            </div>
            <p className="text-sm text-gray-600 italic mt-1">{project.purpose}</p>
            {project.key_technologies_concepts && (
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold">Technologies:</span> {project.key_technologies_concepts}
              </p>
            )}
          </div>
        ))}
      </Section>

      {/* Certifications Section */}
      <Section title="Certifications & Training" content={certification_and_training}>
        {certification_and_training?.map((cert, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{cert.name}</h3>
              <span className="text-sm font-medium text-gray-500">{cert.date}</span>
            </div>
            <div className="text-md text-gray-600">{cert.organization}</div>
            <p className="text-sm text-gray-700 mt-1">{cert.description}</p>
             {cert.certificate_link && (
              <a href={cert.certificate_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">View Certificate</a>
            )}
          </div>
        ))}
      </Section>
      
      {/* Skills Section */}
      <Section title="Skills" content={skill_categories}>
        {skill_categories?.map((category, index) => (
          <div key={index} className="mb-3">
            <h3 className="text-md font-semibold">{category.name}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {category.skills?.map((skill, i) => (
                <span key={i} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
};

export default ResumeTemplate;