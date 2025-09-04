import React from 'react';
import { UploadIcon } from '../constants';

interface ImageUploaderProps {
  label: string;
  description: string;
  previewUrl: string | null;
  onFileChange: (file: File) => void;
  onClear: () => void;
  id: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, description, previewUrl, onFileChange, onClear, id }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 transition-colors hover:border-slate-700">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300">{label}</label>
      <p className="text-xs text-slate-500 mb-2">{description}</p>
      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-800 border-dashed rounded-md min-h-[160px] items-center bg-slate-950/50">
        {previewUrl ? (
          <div className="relative group">
            <img src={previewUrl} alt="Preview" className="max-h-32 rounded-md mx-auto" />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                <label htmlFor={id} className="cursor-pointer text-white text-sm bg-slate-700 px-3 py-1 rounded-md hover:bg-slate-600">Change</label>
            </div>
             <button
                onClick={onClear}
                aria-label="Clear file"
                className="absolute -top-2 -right-2 bg-slate-700 hover:bg-red-600 rounded-full p-1 text-white transition-all duration-200 transform hover:scale-110 z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
        ) : (
          <div className="space-y-1 text-center">
            <UploadIcon />
            <div className="flex text-sm text-slate-500">
              <label htmlFor={id} className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-violet-400 hover:text-violet-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 focus-within:ring-violet-500 px-1 transition-colors">
                <span>Upload a file</span>
              </label>
              <input id={id} name={id} type="file" className="sr-only" onChange={handleFileChange} accept="image/jpeg, image/png" />
            </div>
            <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;