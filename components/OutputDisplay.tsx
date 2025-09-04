import React from 'react';
import { QA_CHECKLIST_ITEMS } from '../constants';

const QACheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-violet-400">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
)

interface OutputDisplayProps {
  imageUrl: string | null;
  isGenerating: boolean;
  onDownload?: () => void;
  onViewChange: (view: string) => void;
  currentView: string;
  generatedViews: string[];
}

const VIEW_OPTIONS = ['Front', 'Back', 'Left', 'Right', 'Top', 'Bottom', 'Angled'];

const OutputDisplay: React.FC<OutputDisplayProps> = ({ imageUrl, isGenerating, onDownload, onViewChange, currentView, generatedViews }) => {
  return (
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
      <h3 className="text-xl font-bold text-slate-100 mb-4">Generated Output</h3>
      
      <div className="mb-4 pb-4 border-b border-slate-800">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">3D View</h4>
        <div className="flex flex-wrap gap-2">
            {VIEW_OPTIONS.map(view => (
                <button
                    key={view}
                    onClick={() => onViewChange(view)}
                    disabled={isGenerating}
                    className={`relative px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60
                    ${currentView === view
                        ? 'bg-violet-600 text-white ring-2 ring-offset-2 ring-offset-slate-900 ring-violet-500'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                >
                    {view}
                    {generatedViews.includes(view) && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-green-500 rounded-full"></span>
                    )}
                </button>
            ))}
        </div>
      </div>
      
      <div className="aspect-square bg-slate-950 rounded-lg flex items-center justify-center border border-slate-800 relative overflow-hidden">
        {isGenerating && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
             <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-500"></div>
             <p className="mt-4 text-slate-300">Generating {currentView} view...</p>
          </div>
        )}
        {imageUrl ? (
          <img src={imageUrl} alt={`Generated output - ${currentView} view`} className="object-cover w-full h-full" />
        ) : (
          <div className="text-center text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm">Output will appear here</p>
          </div>
        )}
      </div>
      {imageUrl && !isGenerating && onDownload && (
        <button
          onClick={onDownload}
          className="w-full mt-6 flex items-center justify-center text-md font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300 bg-green-600 text-white hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download 8K Image
        </button>
      )}
      <div className="mt-6 pt-6 border-t border-slate-800">
        <h4 className="font-semibold text-slate-200 mb-3">QA Checklist</h4>
        <ul className="space-y-3 text-sm">
            {QA_CHECKLIST_ITEMS.map((item, index) => (
                 <li key={index} className="flex items-start space-x-3 text-slate-300">
                    <QACheckIcon />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default OutputDisplay;
