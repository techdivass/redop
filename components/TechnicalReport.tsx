import React from 'react';
import { X, Server, Code2, Palette, Zap, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalReport: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700 transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Technical Report</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Gemini CV Forge Architecture & Implementation</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto overflow-x-hidden text-slate-700 dark:text-slate-300 space-y-8">
          
          {/* Section 1: Architecture */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-400">
              <Server className="w-5 h-5" />
              <h3 className="text-lg font-bold uppercase tracking-wider">1. Architecture & Technology Stack</h3>
            </div>
            <div className="pl-7 space-y-3 text-sm leading-relaxed">
              <p>
                The application is built as a <strong>Single Page Application (SPA)</strong> using <strong>React 19</strong>. 
                This decision prioritizes interactive user experience, immediate feedback loops, and component reusability—critical for a multi-template system.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600 dark:text-slate-400">
                <li><strong>Core Framework:</strong> React 19 with TypeScript for type safety and modern state management functionality.</li>
                <li><strong>Styling Engine:</strong> Tailwind CSS (v3.4) was selected for its utility-first approach, enabling rapid UI iteration and consistent design tokens (colors, spacing) across different CV templates without CSS bloat.</li>
                <li><strong>State Management:</strong> Application state is handled via React's <code>useState</code> and lifted to the root <code>App</code> component. Data persistence is achieved via the <code>localStorage</code> API, ensuring user data privacy by keeping PII (Personally Identifiable Information) strictly on the client side.</li>
                <li><strong>Build System:</strong> The app uses ES Modules directly via <code>importmap</code> for a lightweight, no-build-step development environment suitable for rapid prototyping, while remaining compatible with standard bundlers (Vite/Webpack) for production.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: API Integration */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-400">
              <Code2 className="w-5 h-5" />
              <h3 className="text-lg font-bold uppercase tracking-wider">2. API Integration Methodology</h3>
            </div>
            <div className="pl-7 space-y-3 text-sm leading-relaxed">
              <p>
                Integration with the <strong>Google Gemini API</strong> (`gemini-2.5-flash`) is encapsulated within a dedicated service layer (`services/geminiService.ts`). This separation of concerns allows for easy swapping of models or logic updates.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Prompt Engineering</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    We utilize "Persona-based" prompting (e.g., <em>"You are an expert career coach..."</em>) to condition the model. Context injection is used to provide the model with the user's existing skills and experience when generating summaries.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Structured Output (JSON)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    For the <strong>ATS Analysis</strong> and <strong>Skill Suggestions</strong>, we strictly enforce JSON output formats. The application parses this JSON to render visual scorecards and interactive lists, rather than displaying raw text.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Template Design */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-purple-700 dark:text-purple-400">
              <Palette className="w-5 h-5" />
              <h3 className="text-lg font-bold uppercase tracking-wider">3. Template Design Approach</h3>
            </div>
            <div className="pl-7 space-y-3 text-sm leading-relaxed">
              <p>
                The rendering engine uses a <strong>Strategy Pattern</strong> where the <code>Preview</code> component dynamically selects a sub-component (Modern, Classic, Creative) based on the <code>templateId</code> state.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600 dark:text-slate-400">
                <li><strong>Visual Hierarchy:</strong> Each template emphasizes different data points. 'Creative' prioritizes the photo and skills sidebar, while 'Classic' focuses on dense, serif-text hierarchies suitable for academic or legal roles.</li>
                <li><strong>Print Optimization:</strong> The CSS utilizes <code>@media print</code> queries extensively. It hides UI elements (navbars, editors) and resets margins to ensure the HTML output perfectly matches A4 dimensions when printed to PDF.</li>
                <li><strong>Dynamic Theming:</strong> Inline styles are used for accent colors (`themeColor`), allowing instantaneous re-skinning of any template without requiring separate CSS files.</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Performance */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-400">
              <Zap className="w-5 h-5" />
              <h3 className="text-lg font-bold uppercase tracking-wider">4. Performance Optimization</h3>
            </div>
            <div className="pl-7 space-y-3 text-sm leading-relaxed">
              <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600 dark:text-slate-400">
                <li><strong>On-Demand AI:</strong> AI generation is triggered explicitly by user actions (buttons) rather than automatically on keystrokes. This drastically reduces token usage and API latency.</li>
                <li><strong>Optimistic UI:</strong> Loading states provide immediate visual feedback during asynchronous AI operations, improving perceived performance.</li>
                <li><strong>Efficient Re-rendering:</strong> The Editor and Preview are split components. React's virtual DOM ensures that typing in the editor updates the preview in real-time (~60fps) without full page reloads.</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Limitations */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-bold uppercase tracking-wider">5. Limitations & Future Enhancements</h3>
            </div>
            <div className="pl-7 space-y-3 text-sm leading-relaxed">
              <div className="border-l-4 border-amber-200 dark:border-amber-700 pl-4 py-2 bg-amber-50 dark:bg-amber-900/10">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Current Limitations</h4>
                <ul className="list-disc list-inside mt-1 text-slate-600 dark:text-slate-400 text-xs">
                  <li><strong>Client-Side API Key:</strong> Currently, the API key is accessed via `process.env` on the client. In a production environment, this should be proxied through a backend to prevent key exposure.</li>
                  <li><strong>Export Formats:</strong> Native export is limited to PDF (via Browser Print) and HTML. DOCX export is not yet implemented due to the complexity of mapping DOM layouts to XML schemas client-side.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Future Roadmap</h4>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 text-xs">
                  <li><strong>Cloud Sync:</strong> Implementation of Firebase/Supabase for cross-device data synchronization.</li>
                  <li><strong>Cover Letter Generator:</strong> Using the same resume data and job description to auto-generate matching cover letters.</li>
                  <li><strong>DOCX Generation:</strong> Integration of `docx.js` to enable editable Word document downloads.</li>
                </ul>
              </div>
            </div>
          </section>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex justify-end">
           <button 
             onClick={onClose}
             className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white text-sm font-medium rounded hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
           >
             Close Report
           </button>
        </div>
      </div>
    </div>
  );
};