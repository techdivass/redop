import React from 'react';
import { CVData } from '../types';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface PreviewProps {
  data: CVData;
}

export const Preview: React.FC<PreviewProps> = ({ data }) => {
  const { templateId } = data;

  const renderContent = () => {
    switch (templateId) {
      case 'classic':
        return <ClassicTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="bg-white w-full h-full min-h-[1123px] shadow-2xl print:shadow-none print:w-full print:min-h-0 mx-auto print:border-none" id="cv-preview">
      {/* Container sizing for A4 mostly */}
      <div className="max-w-[210mm] mx-auto min-h-[297mm] text-slate-800 print:max-w-none print:min-h-0">
        {renderContent()}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS FOR TEMPLATES ---

const ModernTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, customSections, themeColor } = data;
  
  return (
    <div className="p-8 md:p-12 flex flex-col gap-6 print:p-0">
       <header className="border-b-2 pb-6 flex items-start justify-between" style={{ borderColor: themeColor }}>
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tight mb-2" style={{ color: themeColor }}>
              {personalInfo.fullName}
            </h1>
            <p className="text-xl font-medium text-slate-600 mb-4">{personalInfo.jobTitle}</p>
            <ContactLine info={personalInfo} />
          </div>
        </header>

        {personalInfo.summary && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-slate-500">Professional Summary</h3>
            <p className="text-sm leading-relaxed text-slate-700">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-500">Experience</h3>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-slate-800">{exp.role}</h4>
                    <span className="text-xs font-medium text-slate-500">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">{exp.company}</span>
                    <span className="text-xs text-slate-500">{exp.location}</span>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
          {education.length > 0 && (
            <section className="break-inside-avoid">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-500">Education</h3>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-slate-800">{edu.school}</h4>
                    <p className="text-sm text-slate-700">{edu.degree}, {edu.field}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{edu.startDate} – {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section className="break-inside-avoid">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-500">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded print:border print:border-slate-200">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Custom Sections */}
        {(customSections || []).map(section => (
          <section key={section.id} className="break-inside-avoid">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-500">{section.title}</h3>
            <div className="space-y-4">
              {section.items.map(item => (
                <div key={item.id}>
                   <div className="flex justify-between items-baseline mb-1">
                      {item.title && <h4 className="font-bold text-slate-800">{item.title}</h4>}
                      {item.subtitle && <span className="text-xs font-medium text-slate-500">{item.subtitle}</span>}
                   </div>
                   {item.description && <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ))}
    </div>
  );
};

const CreativeTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, customSections, themeColor } = data;
  
  // Use user selected color or default to slate-800 for side panel if no color
  const sidebarColor = themeColor === '#2563eb' ? '#1e293b' : themeColor; 

  return (
    <div className="flex h-full min-h-[297mm]">
       {/* Left Sidebar */}
       <div className="w-[32%] text-white p-8 flex flex-col gap-8 shrink-0 print:h-auto print:min-h-screen" style={{ backgroundColor: sidebarColor }}>
          <div className="text-center break-inside-avoid">
            {personalInfo.photo ? (
              <div className="w-32 h-32 mx-auto rounded-full border-4 border-white/20 overflow-hidden mb-4 shadow-lg">
                <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
               <div className="w-32 h-32 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4 text-4xl font-bold text-white/50">
                  {personalInfo.fullName.charAt(0)}
               </div>
            )}
             <h2 className="text-lg font-bold uppercase tracking-widest text-white/90 mb-4">Contact</h2>
             <div className="flex flex-col gap-3 text-xs text-white/80 text-left">
                {personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 shrink-0" /> <span className="break-all">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0" /> <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" /> <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-3.5 h-3.5 shrink-0" /> <span className="break-all">{personalInfo.linkedin}</span>
                  </div>
                )}
                 {personalInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 shrink-0" /> <span className="break-all">{personalInfo.website}</span>
                  </div>
                )}
             </div>
          </div>

          {skills.length > 0 && (
             <div className="break-inside-avoid">
               <h2 className="text-lg font-bold uppercase tracking-widest text-white/90 mb-4 border-b border-white/20 pb-2">Skills</h2>
               <div className="flex flex-wrap gap-2">
                 {skills.map(s => (
                   <span key={s.id} className="px-2 py-1 bg-white/10 rounded text-xs text-white/90">
                     {s.name}
                   </span>
                 ))}
               </div>
             </div>
          )}

          {education.length > 0 && (
            <div className="break-inside-avoid">
              <h2 className="text-lg font-bold uppercase tracking-widest text-white/90 mb-4 border-b border-white/20 pb-2">Education</h2>
              <div className="space-y-4 text-white/80">
                {education.map(edu => (
                  <div key={edu.id}>
                    <div className="text-sm font-bold text-white">{edu.school}</div>
                    <div className="text-xs mb-1">{edu.degree}</div>
                    <div className="text-[10px] opacity-70">{edu.startDate} - {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
       </div>

       {/* Main Content */}
       <div className="flex-1 p-10 bg-white print:p-8">
          <header className="mb-10 pt-4">
             <h1 className="text-5xl font-bold uppercase text-slate-800 mb-2 leading-tight" style={{ color: sidebarColor }}>{personalInfo.fullName}</h1>
             <p className="text-2xl text-slate-500 font-light">{personalInfo.jobTitle}</p>
          </header>

          {personalInfo.summary && (
            <section className="mb-10">
              <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-wider flex items-center gap-2">
                <span className="w-1 h-4 bg-slate-300 inline-block"></span> Profile
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">{personalInfo.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase text-slate-400 mb-6 tracking-wider flex items-center gap-2">
                 <span className="w-1 h-4 bg-slate-300 inline-block"></span> Experience
              </h3>
              <div className="space-y-8">
                {experience.map(exp => (
                  <div key={exp.id} className="break-inside-avoid">
                     <div className="flex justify-between items-baseline mb-1">
                        <h4 className="text-lg font-bold text-slate-800">{exp.role}</h4>
                        <span className="text-xs font-mono text-slate-400">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                     </div>
                     <div className="text-sm text-slate-600 font-medium mb-2">{exp.company} • {exp.location}</div>
                     <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {(customSections || []).map(section => (
            <section key={section.id} className="mt-8">
               <h3 className="text-sm font-bold uppercase text-slate-400 mb-6 tracking-wider flex items-center gap-2">
                 <span className="w-1 h-4 bg-slate-300 inline-block"></span> {section.title}
              </h3>
              <div className="space-y-6">
                {section.items.map(item => (
                  <div key={item.id} className="break-inside-avoid">
                     {(item.title || item.subtitle) && (
                       <div className="flex justify-between items-baseline mb-1">
                          {item.title && <h4 className="text-md font-bold text-slate-800">{item.title}</h4>}
                          {item.subtitle && <span className="text-xs font-mono text-slate-400">{item.subtitle}</span>}
                       </div>
                     )}
                     {item.description && <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ))}
       </div>
    </div>
  );
};

const ClassicTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, customSections } = data;
  
  return (
    <div className="p-10 md:p-14 font-serif text-slate-900 max-w-3xl mx-auto print:p-0">
      <header className="text-center border-b border-slate-300 pb-6 mb-6">
        <h1 className="text-3xl font-bold mb-2 tracking-wide">{personalInfo.fullName}</h1>
        <p className="text-lg italic text-slate-700 mb-3">{personalInfo.jobTitle}</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• LinkedIn</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-6">
          <h3 className="font-bold border-b border-slate-800 mb-3 uppercase text-sm tracking-widest">Summary</h3>
          <p className="text-sm leading-relaxed text-justify">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h3 className="font-bold border-b border-slate-800 mb-4 uppercase text-sm tracking-widest">Experience</h3>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between font-bold text-sm">
                  <span>{exp.company}, {exp.location}</span>
                  <span>{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <div className="italic text-sm mb-1">{exp.role}</div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6 break-inside-avoid">
          <h3 className="font-bold border-b border-slate-800 mb-4 uppercase text-sm tracking-widest">Education</h3>
          <div className="space-y-3">
             {education.map((edu) => (
               <div key={edu.id}>
                 <div className="flex justify-between font-bold text-sm">
                   <span>{edu.school}, {edu.location}</span>
                   <span>{edu.startDate} – {edu.endDate}</span>
                 </div>
                 <div className="text-sm">{edu.degree} in {edu.field}</div>
               </div>
             ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="break-inside-avoid mb-6">
          <h3 className="font-bold border-b border-slate-800 mb-3 uppercase text-sm tracking-widest">Skills</h3>
          <p className="text-sm leading-relaxed">
            {skills.map(s => s.name).join(' • ')}
          </p>
        </section>
      )}

      {/* Custom Sections */}
      {(customSections || []).map(section => (
         <section key={section.id} className="mb-6 break-inside-avoid">
            <h3 className="font-bold border-b border-slate-800 mb-4 uppercase text-sm tracking-widest">{section.title}</h3>
            <div className="space-y-4">
              {section.items.map(item => (
                <div key={item.id}>
                   <div className="flex justify-between font-bold text-sm">
                      {item.title && <span>{item.title}</span>}
                      {item.subtitle && <span>{item.subtitle}</span>}
                   </div>
                   {item.description && <div className="text-sm leading-relaxed whitespace-pre-wrap mt-1">{item.description}</div>}
                </div>
              ))}
            </div>
         </section>
      ))}

    </div>
  );
};

const MinimalTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, customSections } = data;
  
  return (
    <div className="p-8 md:p-12 font-sans text-slate-800 max-w-4xl mx-auto print:p-0">
      <header className="mb-8">
        <h1 className="text-5xl font-light mb-2">{personalInfo.fullName}</h1>
        <p className="text-xl text-slate-500 font-light mb-4">{personalInfo.jobTitle}</p>
        <div className="text-xs text-slate-400 font-mono flex flex-col gap-1">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          <div className="flex gap-4 mt-1">
             {personalInfo.linkedin && <span className="underline decoration-slate-300">LinkedIn</span>}
             {personalInfo.website && <span className="underline decoration-slate-300">Portfolio</span>}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-[1fr_2fr] gap-10">
         {/* Left Column */}
         <div className="space-y-8">
            {personalInfo.summary && (
              <section>
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-3">About</h3>
                <p className="text-sm leading-relaxed text-slate-600">{personalInfo.summary}</p>
              </section>
            )}

            {skills.length > 0 && (
              <section>
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-3">Expertise</h3>
                <ul className="space-y-1">
                  {skills.map(s => (
                    <li key={s.id} className="text-sm font-medium text-slate-700">{s.name}</li>
                  ))}
                </ul>
              </section>
            )}

            {education.length > 0 && (
              <section>
                 <h3 className="text-xs font-bold uppercase text-slate-400 mb-3">Education</h3>
                 <div className="space-y-4">
                    {education.map(edu => (
                      <div key={edu.id}>
                        <div className="text-sm font-bold">{edu.school}</div>
                        <div className="text-xs text-slate-600">{edu.degree}</div>
                        <div className="text-xs text-slate-400 mt-1">{edu.startDate.slice(0,4)} - {edu.endDate.slice(0,4)}</div>
                      </div>
                    ))}
                 </div>
              </section>
            )}
         </div>

         {/* Right Column */}
         <div>
            {experience.length > 0 && (
              <section>
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-6">Experience</h3>
                <div className="space-y-8 border-l border-slate-200 pl-6 relative">
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative break-inside-avoid">
                      <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-slate-300"></div>
                      <div className="flex flex-col mb-1">
                        <span className="text-lg font-medium">{exp.role}</span>
                        <span className="text-sm text-slate-500">{exp.company}</span>
                      </div>
                      <div className="text-xs text-slate-400 mb-2 font-mono">
                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                      </div>
                      <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {exp.description}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Custom Sections */}
            {(customSections || []).map(section => (
               <section key={section.id} className="mt-8">
                  <h3 className="text-xs font-bold uppercase text-slate-400 mb-6">{section.title}</h3>
                  <div className="space-y-6 border-l border-slate-200 pl-6 relative">
                    {section.items.map(item => (
                      <div key={item.id} className="relative break-inside-avoid">
                        <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-slate-300"></div>
                        <div className="flex flex-col mb-1">
                          {item.title && <span className="text-lg font-medium">{item.title}</span>}
                          {item.subtitle && <span className="text-sm text-slate-500">{item.subtitle}</span>}
                        </div>
                        {item.description && <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{item.description}</div>}
                      </div>
                    ))}
                  </div>
               </section>
            ))}
         </div>
      </div>
    </div>
  );
};

const ContactLine: React.FC<{ info: any }> = ({ info }) => (
  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
    {info.email && (
      <div className="flex items-center gap-1.5">
        <Mail className="w-3.5 h-3.5" />
        <span>{info.email}</span>
      </div>
    )}
    {info.phone && (
      <div className="flex items-center gap-1.5">
        <Phone className="w-3.5 h-3.5" />
        <span>{info.phone}</span>
      </div>
    )}
    {info.location && (
      <div className="flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5" />
        <span>{info.location}</span>
      </div>
    )}
    {info.linkedin && (
      <div className="flex items-center gap-1.5">
        <Linkedin className="w-3.5 h-3.5" />
        <a href={info.linkedin.startsWith('http') ? info.linkedin : `https://${info.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
      </div>
    )}
    {info.website && (
      <div className="flex items-center gap-1.5">
        <Globe className="w-3.5 h-3.5" />
        <a href={info.website.startsWith('http') ? info.website : `https://${info.website}`} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>
      </div>
    )}
  </div>
);