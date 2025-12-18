import React, { useState, useEffect } from 'react';
import { CVData, INITIAL_DATA } from './types';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { TechnicalReport } from './components/TechnicalReport';
import { UserGuide } from './components/UserGuide';
import { generateDocx } from './services/docxExport';
import { Printer, Download, Eye, Edit3, LayoutTemplate, FileCode, BookOpen, HelpCircle, FileType, ChevronDown, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  // Load initial state from local storage or fallback to default
  const [data, setData] = useState<CVData>(() => {
    const saved = localStorage.getItem('cv_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure templateId exists for older saves
        return { ...INITIAL_DATA, ...parsed };
      } catch (e) {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('cv_data', JSON.stringify(data));
  }, [data]);
  
  const handlePrint = () => {
    window.print();
    setIsExportMenuOpen(false);
  };

  const handleDownloadHtml = () => {
    const previewElement = document.getElementById('cv-preview');
    if (previewElement) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${data.personalInfo.fullName} - CV</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet">
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                    serif: ['Merriweather', 'serif'],
                  },
                }
              }
            }
          </script>
        </head>
        <body class="bg-white text-slate-900">
          ${previewElement.outerHTML}
        </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_CV.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExportMenuOpen(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
        const blob = await generateDocx(data);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_CV.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsExportMenuOpen(false);
    } catch (error) {
        console.error("Error generating DOCX:", error);
        alert("Failed to generate Word document.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-sans print:bg-white print:h-auto print:block transition-colors duration-200">
      <TechnicalReport isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
      <UserGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Top Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 print:hidden transition-colors duration-200">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              CV
            </div>
            <span className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight hidden sm:block">Gemini CV Forge</span>
          </div>

          <div className="flex items-center gap-3">
             {/* Mobile Tab Toggle */}
            <div className="flex md:hidden bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => setActiveTab('editor')}
                className={`p-2 rounded-md transition-all ${activeTab === 'editor' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
              >
                <Edit3 className="w-4 h-4" />
              </button>
               <button 
                onClick={() => setActiveTab('preview')}
                className={`p-2 rounded-md transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button 
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              title="User Guide"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden lg:inline">Help</span>
            </button>

            <button 
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              title="Technical Report"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden lg:inline">Report</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                    className="flex items-center gap-2 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                    <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
                </button>

                {isExportMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50">
                        <button 
                            onClick={handlePrint}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                        >
                            <Printer className="w-4 h-4 text-slate-400" />
                            PDF (Print)
                        </button>
                        <button 
                            onClick={handleDownloadDocx}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                        >
                            <FileType className="w-4 h-4 text-blue-500" />
                            Word (.DOCX)
                        </button>
                        <button 
                            onClick={handleDownloadHtml}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                        >
                            <FileCode className="w-4 h-4 text-orange-500" />
                            HTML Source
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 print:p-0 print:m-0 print:max-w-none print:w-full">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 h-full print:block">
          
          {/* Editor Column */}
          <div className={`w-full md:w-5/12 lg:w-1/3 xl:w-1/4 ${activeTab === 'preview' ? 'hidden md:block' : 'block'} print:hidden`}>
            <div className="sticky top-24">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Editor</h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                   <LayoutTemplate className="w-3 h-3" />
                   <span>Real-time updates</span>
                </div>
              </div>
              <div className="h-[calc(100vh-180px)] overflow-y-auto pr-2 custom-scrollbar">
                <Editor data={data} onChange={setData} />
              </div>
            </div>
          </div>

          {/* Preview Column */}
          <div className={`w-full md:w-7/12 lg:w-2/3 xl:w-3/4 ${activeTab === 'editor' ? 'hidden md:block' : 'block'} print:block print:w-full print:h-auto`}>
            <div className="h-full flex flex-col print:block">
               <div className="md:hidden mb-4 flex items-center justify-between print:hidden">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Preview</h2>
              </div>
              <div className="flex-1 flex justify-center bg-slate-200/50 dark:bg-slate-900 rounded-xl md:p-8 overflow-y-auto print:p-0 print:m-0 print:overflow-visible print:bg-white print:block transition-colors duration-200">
                <div className="w-full max-w-[210mm] print:max-w-none transform scale-100 md:scale-[0.85] lg:scale-100 origin-top transition-transform print:transform-none">
                   <Preview data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #475569;
        }
        /* Ensure background graphics are printed */
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
      `}</style>
    </div>
  );
};

export default App;