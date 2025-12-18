import React from 'react';
import { X, User, Sparkles, Layout, BarChart, Download, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuide: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700 transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">User Guide</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">How to create a winning resume with Gemini CV Forge</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto overflow-x-hidden text-slate-700 dark:text-slate-300 space-y-10">
          
          {/* Introduction */}
          <section className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to Your AI Career Copilot</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Gemini CV Forge isn't just a template filler; it's a smart editor that helps you write better content, optimize for ATS algorithms, and design professional documents in minutes.
            </p>
          </section>

          {/* Step 1: Editor */}
          <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-full flex items-center justify-center mb-3">
                <User className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-blue-800 dark:text-blue-300">1. Build Your Profile</h4>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">The Editor Tab</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Start in the <strong>Content</strong> tab. Fill out your Personal Information, Experience, Education, and Skills.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span><strong>Profile Picture:</strong> Upload a professional photo if you plan to use the 'Creative' template.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span><strong>Drag & Drop:</strong> Reorder skills easily using the grip icon next to each item.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Step 2: AI Features */}
          <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-200 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-purple-800 dark:text-purple-300">2. AI Assistance</h4>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Enhance with Gemini</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Look for the "Sparkles" button throughout the editor. The AI is trained to write impactful, results-oriented content.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 dark:border-slate-700 rounded p-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Auto-Generate Summary</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Creates a professional bio based on your job title and added experience.</p>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded p-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Enhance Descriptions</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Turns basic tasks like "Did sales" into "Increased sales revenue by 20%..."</p>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded p-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Suggest Skills</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Automatically lists relevant technical and soft skills for your specific Job Title.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Step 3: Design */}
          <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-200 rounded-full flex items-center justify-center mb-3">
                <Layout className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-indigo-800 dark:text-indigo-300">3. Visual Design</h4>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">The Design Tab</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Switch between the <strong>Design</strong> tab to instantly visualize your data in different layouts.
              </p>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-2">
                  <span className="font-bold min-w-[80px]">Modern:</span>
                  <span>Clean lines and bold headers. Great for Tech and Startups.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold min-w-[80px]">Classic:</span>
                  <span>Serif fonts and traditional layout. Ideal for Finance, Law, and Academic roles.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold min-w-[80px]">Creative:</span>
                  <span>Features a sidebar and profile photo. Perfect for Designers and Marketing.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Step 4: Analysis */}
          <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-200 rounded-full flex items-center justify-center mb-3">
                <BarChart className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-orange-800 dark:text-orange-300">4. ATS Check</h4>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Job Match Analysis</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Before applying, go to the <strong>ATS Check</strong> tab. Paste the description of the job you want.
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border border-slate-100 dark:border-slate-700 text-sm">
                <p className="mb-2"><strong>What you get:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>A match score (0-100%)</li>
                  <li>List of critical keywords missing from your resume</li>
                  <li>3 specific, actionable tips to improve your CV for that specific role</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Step 5: Export */}
          <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center mb-3">
                <Download className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">5. Export</h4>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Download & Print</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Use the toolbar in the top right corner.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><strong>Save as PDF:</strong> Opens your browser's print dialog. Ensure "Background Graphics" is enabled in your print settings for best results.</li>
                <li><strong>Download HTML:</strong> Saves a raw HTML file of your resume, useful for hosting on a personal website.</li>
              </ul>
            </div>
          </section>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex justify-end">
           <button 
             onClick={onClose}
             className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white text-sm font-medium rounded hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
           >
             Got it
           </button>
        </div>
      </div>
    </div>
  );
};