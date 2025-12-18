import React, { useState } from 'react';
import { CVData, Skill, AnalysisResult, TemplateId, CustomSection, CustomItem } from '../types';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, FileText, Palette, BarChart3, Upload, X, Wand2, FolderPlus } from 'lucide-react';
import { AIButton } from './AIButton';
import { enhanceText, generateSummary, suggestSkills, analyzeJobMatch, tailorCV } from '../services/geminiService';

interface EditorProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

export const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'analysis'>('content');
  const [expandedSection, setExpandedSection] = useState<string | null>('personal');
  
  // Analysis State
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);

  const updateField = (section: keyof CVData, field: string, value: any) => {
    onChange({
      ...data,
      [section]: {
        ...(data[section] as any),
        [field]: value
      }
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // --- Helpers for Arrays ---
  const addItem = <T extends { id: string }>(key: keyof CVData, newItem: T) => {
    onChange({
      ...data,
      [key]: [...(data[key] as any[]), newItem]
    });
  };

  const removeItem = (key: keyof CVData, id: string) => {
    onChange({
      ...data,
      [key]: (data[key] as any[]).filter((item: any) => item.id !== id)
    });
  };

  const updateItem = (key: keyof CVData, id: string, field: string, value: any) => {
    onChange({
      ...data,
      [key]: (data[key] as any[]).map((item: any) => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  // --- Custom Sections Helpers ---
  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: 'New Section',
      items: []
    };
    onChange({
      ...data,
      customSections: [...(data.customSections || []), newSection]
    });
    setExpandedSection(newSection.id);
  };

  const removeCustomSection = (sectionId: string) => {
    if (confirm("Are you sure you want to delete this entire section?")) {
      onChange({
        ...data,
        customSections: data.customSections.filter(s => s.id !== sectionId)
      });
    }
  };

  const updateCustomSectionTitle = (sectionId: string, newTitle: string) => {
    onChange({
      ...data,
      customSections: data.customSections.map(s => 
        s.id === sectionId ? { ...s, title: newTitle } : s
      )
    });
  };

  const addCustomItem = (sectionId: string) => {
    const newItem: CustomItem = {
      id: Date.now().toString(),
      title: '',
      subtitle: '',
      description: ''
    };
    onChange({
      ...data,
      customSections: data.customSections.map(s => 
        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
      )
    });
  };

  const updateCustomItem = (sectionId: string, itemId: string, field: keyof CustomItem, value: string) => {
    onChange({
      ...data,
      customSections: data.customSections.map(s => 
        s.id === sectionId ? {
          ...s,
          items: s.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
        } : s
      )
    });
  };

  const removeCustomItem = (sectionId: string, itemId: string) => {
    onChange({
      ...data,
      customSections: data.customSections.map(s => 
        s.id === sectionId ? {
          ...s,
          items: s.items.filter(i => i.id !== itemId)
        } : s
      )
    });
  };


  // --- Image Upload Helper ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB for local storage safety)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size is too large. Please upload an image under 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('personalInfo', 'photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updateField('personalInfo', 'photo', undefined);
  };

  // --- AI Actions ---
  const handleGenerateSummary = async () => {
    const skillsList = data.skills.map(s => s.name);
    const expContext = data.experience.map(e => `${e.role} at ${e.company}`).join(', ');
    const summary = await generateSummary(data.personalInfo.jobTitle, skillsList, expContext);
    updateField('personalInfo', 'summary', summary);
  };

  const handleEnhanceDescription = async (id: string, currentText: string) => {
    const enhanced = await enhanceText(currentText, "Resume Job Description. Make it result-oriented.");
    updateItem('experience', id, 'description', enhanced);
  };

  const handleSuggestSkills = async () => {
    const suggestions = await suggestSkills(data.personalInfo.jobTitle);
    const newSkills: Skill[] = suggestions.map((name, i) => ({
      id: Date.now().toString() + i,
      name,
      level: 'Expert'
    }));
    
    const currentNames = new Set(data.skills.map(s => s.name.toLowerCase()));
    const uniqueNewSkills = newSkills.filter(s => !currentNames.has(s.name.toLowerCase()));

    onChange({
      ...data,
      skills: [...data.skills, ...uniqueNewSkills]
    });
  };

  const handleAnalyzeMatch = async () => {
    if (!jobDescription) return;
    setIsAnalyzing(true);
    try {
      // Create a simplified text representation of the CV for analysis
      const cvText = `
        Role: ${data.personalInfo.jobTitle}
        Summary: ${data.personalInfo.summary}
        Experience: ${data.experience.map(e => `${e.role} at ${e.company}. ${e.description}`).join('\n')}
        Skills: ${data.skills.map(s => s.name).join(', ')}
        Education: ${data.education.map(e => `${e.degree} from ${e.school}`).join(', ')}
      `;
      
      const result = await analyzeJobMatch(cvText, jobDescription);
      setAnalysisResult(result);
    } catch (e) {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTailorCV = async () => {
    if (!jobDescription) {
      alert("Please enter a job description first.");
      return;
    }
    
    if (!confirm("This will rewrite your Summary and Experience descriptions to match the job. Continue?")) return;

    setIsTailoring(true);
    try {
      const result = await tailorCV(data, jobDescription);
      
      // Merge changes
      const updatedExperience = data.experience.map(exp => {
        const match = result.experience.find(r => r.id === exp.id);
        return match ? { ...exp, description: match.description } : exp;
      });

      onChange({
        ...data,
        personalInfo: {
          ...data.personalInfo,
          summary: result.summary || data.personalInfo.summary
        },
        experience: updatedExperience
      });
      
      alert("CV Tailored successfully! Check your Summary and Experience sections.");
      setActiveTab('content'); // Switch back to content to see changes
    } catch (e) {
      console.error(e);
      alert("Failed to tailor CV. Please check API key or try again.");
    } finally {
      setIsTailoring(false);
    }
  };

  // --- Tabs Navigation ---
  const renderTabButton = (id: typeof activeTab, label: string, Icon: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 text-sm font-medium border-b-2 flex items-center justify-center gap-2 transition-colors ${
        activeTab === id 
          ? 'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500' 
          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const inputClass = "w-full p-2 border border-slate-300 dark:border-slate-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors";
  const labelClass = "text-xs font-medium text-slate-500 dark:text-slate-400 uppercase";

  return (
    <div className="flex flex-col h-full">
      <div className="flex bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mb-4 sticky top-0 z-10 transition-colors">
        {renderTabButton('content', 'Content', FileText)}
        {renderTabButton('design', 'Design', Palette)}
        {renderTabButton('analysis', 'Job Match', BarChart3)}
      </div>

      <div className="space-y-6 pb-20">
        
        {/* === CONTENT TAB === */}
        {activeTab === 'content' && (
          <>
            {/* Personal Info */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
              <button 
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => toggleSection('personal')}
              >
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">Personal Information</h2>
                {expandedSection === 'personal' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              
              {expandedSection === 'personal' && (
                <div className="p-4 space-y-4">
                  
                  {/* Photo Upload */}
                  <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 border-dashed">
                    <div className="h-16 w-16 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400">
                      {data.personalInfo.photo ? (
                        <img src={data.personalInfo.photo} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Profile Picture</label>
                      <div className="flex gap-2">
                         <label className="cursor-pointer px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                            Upload Photo
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                         </label>
                         {data.personalInfo.photo && (
                           <button onClick={removePhoto} className="px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-xs font-medium transition-colors">
                             Remove
                           </button>
                         )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Recommended for Creative template. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={labelClass}>Full Name</label>
                      <input 
                        className={inputClass}
                        value={data.personalInfo.fullName}
                        onChange={(e) => updateField('personalInfo', 'fullName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Job Title</label>
                      <input 
                        className={inputClass}
                        value={data.personalInfo.jobTitle}
                        onChange={(e) => updateField('personalInfo', 'jobTitle', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Email</label>
                      <input 
                        className={inputClass}
                        value={data.personalInfo.email}
                        onChange={(e) => updateField('personalInfo', 'email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Phone</label>
                      <input 
                        className={inputClass}
                        value={data.personalInfo.phone}
                        onChange={(e) => updateField('personalInfo', 'phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Location</label>
                      <input 
                        className={inputClass}
                        value={data.personalInfo.location}
                        onChange={(e) => updateField('personalInfo', 'location', e.target.value)}
                      />
                    </div>
                     <div className="space-y-1">
                      <label className={labelClass}>LinkedIn</label>
                      <input 
                        className={inputClass}
                        value={data.personalInfo.linkedin}
                        onChange={(e) => updateField('personalInfo', 'linkedin', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className={labelClass}>Professional Summary</label>
                       <AIButton label="Auto-Generate" onClick={handleGenerateSummary} />
                    </div>
                    <textarea 
                      className={`${inputClass} h-24 resize-none`}
                      value={data.personalInfo.summary}
                      onChange={(e) => updateField('personalInfo', 'summary', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
              <button 
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => toggleSection('experience')}
              >
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">Experience</h2>
                {expandedSection === 'experience' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {expandedSection === 'experience' && (
                <div className="p-4 space-y-6">
                  {data.experience.map((exp) => (
                    <div key={exp.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg relative group bg-slate-50/50 dark:bg-slate-800/50">
                      <button 
                        onClick={() => removeItem('experience', exp.id)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input 
                          placeholder="Company Name"
                          className={inputClass}
                          value={exp.company}
                          onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)}
                        />
                        <input 
                          placeholder="Role"
                          className={inputClass}
                          value={exp.role}
                          onChange={(e) => updateItem('experience', exp.id, 'role', e.target.value)}
                        />
                        <input 
                          placeholder="Location"
                          className={inputClass}
                          value={exp.location}
                          onChange={(e) => updateItem('experience', exp.id, 'location', e.target.value)}
                        />
                        <div className="flex gap-2">
                          <input 
                            placeholder="Start"
                            className={`${inputClass} w-1/2`}
                            value={exp.startDate}
                            onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)}
                          />
                          <input 
                            placeholder="End"
                            disabled={exp.isCurrent}
                            className={`${inputClass} w-1/2 disabled:bg-slate-100 dark:disabled:bg-slate-700 dark:disabled:text-slate-500`}
                            value={exp.isCurrent ? 'Present' : exp.endDate}
                            onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                       <div className="flex items-center gap-2 mb-3">
                        <input 
                          type="checkbox" 
                          id={`current-${exp.id}`}
                          checked={exp.isCurrent}
                          onChange={(e) => updateItem('experience', exp.id, 'isCurrent', e.target.checked)}
                          className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-700"
                        />
                        <label htmlFor={`current-${exp.id}`} className="text-sm text-slate-600 dark:text-slate-400">I currently work here</label>
                      </div>
                      
                      <div className="relative">
                        <div className="flex justify-between mb-1">
                          <label className={labelClass}>Description</label>
                          <AIButton variant="icon" tooltip="Improve writing" onClick={() => handleEnhanceDescription(exp.id, exp.description)} />
                        </div>
                        <textarea 
                          placeholder="• Achieved X..."
                          className={`${inputClass} h-32 resize-none text-sm`}
                          value={exp.description}
                          onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => addItem('experience', { id: Date.now().toString(), company: '', role: '', startDate: '', endDate: '', isCurrent: false, description: '', location: '' })}
                    className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Position
                  </button>
                </div>
              )}
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
              <button 
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => toggleSection('education')}
              >
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">Education</h2>
                {expandedSection === 'education' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {expandedSection === 'education' && (
                <div className="p-4 space-y-6">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg relative group bg-slate-50/50 dark:bg-slate-800/50">
                      <button 
                        onClick={() => removeItem('education', edu.id)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          placeholder="School"
                          className={inputClass}
                          value={edu.school}
                          onChange={(e) => updateItem('education', edu.id, 'school', e.target.value)}
                        />
                        <input 
                          placeholder="Degree"
                          className={inputClass}
                          value={edu.degree}
                          onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)}
                        />
                        <input 
                          placeholder="Field of Study"
                          className={inputClass}
                          value={edu.field}
                          onChange={(e) => updateItem('education', edu.id, 'field', e.target.value)}
                        />
                        <input 
                          placeholder="Date"
                          className={inputClass}
                          value={edu.endDate}
                          onChange={(e) => updateItem('education', edu.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => addItem('education', { id: Date.now().toString(), school: '', degree: '', field: '', startDate: '', endDate: '', isCurrent: false, location: '' })}
                    className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Education
                  </button>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
              <button 
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => toggleSection('skills')}
              >
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">Skills</h2>
                {expandedSection === 'skills' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {expandedSection === 'skills' && (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">List your technical and soft skills.</p>
                    <AIButton label="Suggest Skills" onClick={handleSuggestSkills} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {data.skills.map((skill) => (
                      <div key={skill.id} className="flex gap-2 items-center">
                        <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1">
                            <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-500 cursor-move" />
                            <input 
                              className="bg-transparent w-full outline-none text-sm text-slate-800 dark:text-slate-200"
                              value={skill.name}
                              onChange={(e) => updateItem('skills', skill.id, 'name', e.target.value)}
                            />
                        </div>
                        <button onClick={() => removeItem('skills', skill.id)} className="text-slate-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => addItem('skills', { id: Date.now().toString(), name: '', level: 'Expert' })}
                    className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Skill
                  </button>
                </div>
              )}
            </div>

            {/* Custom Sections */}
            {(data.customSections || []).map((section) => (
              <div key={section.id} className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
                 <button 
                  className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <input
                    className="font-semibold text-slate-800 dark:text-slate-200 bg-transparent border-none focus:ring-0 p-0 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded"
                    value={section.title}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)}
                    placeholder="Section Title (e.g. References)"
                  />
                  <div className="flex items-center gap-3">
                     <button 
                       onClick={(e) => { e.stopPropagation(); removeCustomSection(section.id); }}
                       className="text-slate-400 hover:text-red-500 transition-colors"
                       title="Remove Section"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                     {expandedSection === section.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </div>
                </button>

                {expandedSection === section.id && (
                  <div className="p-4 space-y-6">
                     {section.items.map((item) => (
                       <div key={item.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg relative group bg-slate-50/50 dark:bg-slate-800/50">
                          <button 
                            onClick={() => removeCustomItem(section.id, item.id)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-1">
                               <label className={labelClass}>Title (Role, Award, etc.)</label>
                               <input 
                                className={inputClass}
                                value={item.title}
                                onChange={(e) => updateCustomItem(section.id, item.id, 'title', e.target.value)}
                                placeholder="e.g. Volunteer Lead"
                              />
                            </div>
                            <div className="space-y-1">
                               <label className={labelClass}>Subtitle (Date, Location, etc.)</label>
                               <input 
                                className={inputClass}
                                value={item.subtitle}
                                onChange={(e) => updateCustomItem(section.id, item.id, 'subtitle', e.target.value)}
                                placeholder="e.g. 2020 - 2022"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                             <div className="flex justify-between">
                                <label className={labelClass}>Description</label>
                                <AIButton variant="icon" tooltip="Improve writing" onClick={() => handleEnhanceDescription(item.id, item.description)} />
                             </div>
                             <textarea 
                              className={`${inputClass} h-24 resize-none text-sm`}
                              value={item.description}
                              onChange={(e) => updateCustomItem(section.id, item.id, 'description', e.target.value)}
                              placeholder="Details..."
                            />
                          </div>
                       </div>
                     ))}
                     
                     <button 
                        onClick={() => addCustomItem(section.id)}
                        className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Item
                      </button>
                  </div>
                )}
              </div>
            ))}

             {/* Add Section Button */}
             <button 
              onClick={addCustomSection}
              className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <FolderPlus className="w-5 h-5" />
              Add Custom Section (References, Volunteering, etc.)
            </button>

          </>
        )}

        {/* === DESIGN TAB === */}
        {activeTab === 'design' && (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-4 space-y-6 transition-colors">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Templates</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {[
                  { id: 'modern', label: 'Modern' },
                  { id: 'classic', label: 'Classic' },
                  { id: 'minimal', label: 'Minimal' },
                  { id: 'creative', label: 'Creative (Photo)' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onChange({ ...data, templateId: t.id as TemplateId })}
                    className={`
                      border-2 rounded-lg p-3 text-sm font-medium transition-all text-left flex flex-col gap-1
                      ${data.templateId === t.id 
                        ? 'border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'}
                    `}
                  >
                    <span className="font-semibold">{t.label}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 opacity-80">
                      {t.id === 'creative' ? 'With Sidebar & Photo' : t.id === 'modern' ? 'Clean & Bold' : t.id === 'classic' ? 'Traditional Serif' : 'Simple & Elegant'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Accent Color</label>
              <div className="flex flex-wrap gap-3">
                {['#2563eb', '#0f172a', '#dc2626', '#16a34a', '#9333ea', '#ea580c'].map((color) => (
                  <button
                    key={color}
                    onClick={() => onChange({ ...data, themeColor: color })}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${data.themeColor === color ? 'border-slate-800 dark:border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === ANALYSIS TAB === */}
        {activeTab === 'analysis' && (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-4 space-y-4 transition-colors">
             <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Job Description & Tailoring</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Paste the job description below to check your CV compatibility or auto-tailor your content.</p>
                <textarea
                  className={`${inputClass} h-40 text-sm`}
                  placeholder="Paste Job Description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
                
                <div className="mt-3 flex gap-2">
                  <AIButton 
                    label="Analyze Match" 
                    onClick={handleAnalyzeMatch} 
                    className="flex-1 justify-center" 
                  />
                  
                  <button
                    onClick={handleTailorCV}
                    disabled={isTailoring || !jobDescription}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Wand2 className={`w-3.5 h-3.5 ${isTailoring ? 'animate-spin' : ''}`} />
                    {isTailoring ? 'Tailoring...' : 'Auto-Tailor CV'}
                  </button>
                </div>
             </div>

             {analysisResult && (
               <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-200">Match Score</span>
                    <span className={`text-2xl font-bold ${analysisResult.score >= 70 ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}`}>
                      {analysisResult.score}%
                    </span>
                 </div>
                 <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                   <div 
                     className={`h-2 rounded-full transition-all duration-1000 ${analysisResult.score >= 70 ? 'bg-green-500' : 'bg-orange-500'}`} 
                     style={{ width: `${analysisResult.score}%` }}
                   ></div>
                 </div>

                 <div>
                   <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Missing Keywords</h4>
                   <div className="flex flex-wrap gap-2">
                     {analysisResult.missingKeywords.map((kw, i) => (
                       <span key={i} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs rounded border border-red-100 dark:border-red-900/30">
                         {kw}
                       </span>
                     ))}
                   </div>
                 </div>

                 <div>
                   <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Improvements</h4>
                   <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
                     {analysisResult.improvements.map((imp, i) => (
                       <li key={i}>{imp}</li>
                     ))}
                   </ul>
                 </div>
               </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
};