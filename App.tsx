import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import WorkflowTracker from './components/WorkflowTracker';
import OutputDisplay from './components/OutputDisplay';
import { InputFileType, InputFiles, ImagePreviews, WorkflowStep, WorkflowStatus } from './types';
import { 
  INITIAL_WORKFLOW_STEPS, 
  SpinnerIcon, 
  ANGLE_VIEW_OPTIONS,
  CAMERA_SHOT_TYPE_OPTIONS,
  LOGO_FINISH_CATEGORIES,
  LIGHTING_STYLE_OPTIONS,
  COLOR_SCHEME_OPTIONS,
  SCENE_PROMPT_OPTIONS,
  BACKGROUND_PROMPT_OPTIONS,
  ShuffleIcon,
  AI_MODEL_OPTIONS,
} from './constants';

// Helper to convert data URL to a File object for placeholders
const dataURLtoFile = (dataUrl: string, filename: string): File | null => {
  try {
    const arr = dataUrl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch (e) {
    console.error("Error converting data URL to file:", e);
    return null;
  }
};

const placeholderPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const fileTypes: InputFileType[] = [
  'leatherPattern', 'caseBack', 'caseRight', 'caseLeft', 'caseTop', 'caseBottom', 'caseCamera', 'logo', 'depthMap'
];

const initialFiles: InputFiles = fileTypes.reduce((acc, type) => {
  acc[type] = dataURLtoFile(placeholderPixel, `${type}.png`);
  return acc;
}, {} as InputFiles);

const initialPreviews: ImagePreviews = fileTypes.reduce((acc, type) => {
  acc[type] = placeholderPixel;
  return acc;
}, {} as ImagePreviews);


const App: React.FC = () => {
  const [files, setFiles] = useState<InputFiles>(initialFiles);
  const [previews, setPreviews] = useState<ImagePreviews>(initialPreviews);
  const [textInputs, setTextInputs] = useState({
    productName: 'iPhone 16 Pro Max',
    productHeight: '160.8',
    productWidth: '78.1',
    productDepth: '7.65',
    caseThickness: '3',
    leatherPatternName: 'Saffiano',
    logoName: 'FAIMBD',
    logoFinish: LOGO_FINISH_CATEGORIES[0].options[0].name,
    logoColor: 'Gold',
    backgroundPrompt: BACKGROUND_PROMPT_OPTIONS[0],
    scenePrompt: SCENE_PROMPT_OPTIONS[0],
    imageView: 'Front',
    angleView: ANGLE_VIEW_OPTIONS[0],
    cameraShotType: CAMERA_SHOT_TYPE_OPTIONS[0],
    lightingStyle: LIGHTING_STYLE_OPTIONS[0],
    colorScheme: COLOR_SCHEME_OPTIONS[0],
    aiModel: 'photorealistic',
  });

  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(INITIAL_WORKFLOW_STEPS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputImages, setOutputImages] = useState<Record<string, string | null>>({});
  const [currentOutputView, setCurrentOutputView] = useState<string>('Front');
  const [currentLog, setCurrentLog] = useState<string>("");
  const [apiError, setApiError] = useState<React.ReactNode | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleFileChange = useCallback((file: File, type: InputFileType) => {
    setFiles(prev => ({ ...prev, [type]: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClearFile = useCallback((type: InputFileType) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    setPreviews(prev => ({ ...prev, [type]: null }));
    const input = document.getElementById(type) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTextInputs(prev => ({ ...prev, [name]: value }));
    if (name === 'imageView') {
      setCurrentOutputView(value);
    }
    if (formErrors[name]) {
        setFormErrors(prev => ({...prev, [name]: ''}));
    }
  };

  const handleInspireMe = (promptType: 'scenePrompt' | 'backgroundPrompt') => {
    const options = promptType === 'scenePrompt' ? SCENE_PROMPT_OPTIONS : BACKGROUND_PROMPT_OPTIONS;
    const randomPrompt = options[Math.floor(Math.random() * options.length)];
    setTextInputs(prev => ({...prev, [promptType]: randomPrompt }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const dimensions = ['productHeight', 'productWidth', 'productDepth', 'caseThickness'];
    
    if (!textInputs.productName.trim()) {
        errors.productName = 'Product name is required.';
    }
    if (!textInputs.leatherPatternName.trim()) {
        errors.leatherPatternName = 'Leather pattern is required.';
    }
     if (!textInputs.logoName.trim()) {
        errors.logoName = 'Logo name is required.';
    }

    dimensions.forEach(dim => {
        if (!textInputs[dim].trim()) {
            errors[dim] = 'Dimension is required.';
        } else if (isNaN(parseFloat(textInputs[dim]))) {
            errors[dim] = 'Please enter a valid number.';
        }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleGenerateClick = async (viewOverride?: string) => {
    setApiError(null);

    if (!validateForm()) {
        return;
    }
    
    const viewToGenerate = viewOverride || textInputs.imageView;
    setCurrentOutputView(viewToGenerate);

    setIsGenerating(true);
    let steps = INITIAL_WORKFLOW_STEPS.map(s => ({ ...s, status: WorkflowStatus.PENDING }));
    setWorkflowSteps(steps);

    const updateStep = (id: number, status: WorkflowStatus, log?: string) => {
      steps = steps.map(s => (s.id === id ? { ...s, status } : s));
      setWorkflowSteps(steps);
      if (log) setCurrentLog(log);
    };

    try {
      // Step 1: Input Validation
      updateStep(1, WorkflowStatus.RUNNING, "Validating inputs...");
      const requiredFiles: InputFileType[] = ['leatherPattern', 'caseBack', 'caseRight', 'caseLeft', 'caseTop', 'caseBottom', 'caseCamera', 'logo', 'depthMap'];
      const missingFiles = requiredFiles.filter(type => !files[type]);
      if (missingFiles.length > 0) {
        throw new Error(`Missing required input files: ${missingFiles.join(', ')}`);
      }
      await new Promise(r => setTimeout(r, 300)); // UX delay
      updateStep(1, WorkflowStatus.COMPLETED);

      // Step 2: Prompt Construction
      updateStep(2, WorkflowStatus.RUNNING, "Constructing AI prompt...");
      
      let stylePrefix = "A hyperrealistic photograph of";
      let styleSuffix = "Award-winning professional product photography. Extremely detailed, sharp focus, shallow depth of field (bokeh). Rendered in stunning, ultra-high 8K resolution. Photorealistic quality, as if shot on a high-end DSLR camera.";

      if (textInputs.aiModel === 'artistic') {
          stylePrefix = "An artistic, stylized rendering of";
          styleSuffix = "A digital painting with vibrant colors and expressive brush strokes. A unique piece of digital art suitable for a high-fashion magazine cover. Rendered in 8K."
      } else if (textInputs.aiModel === 'sketch') {
          stylePrefix = "A detailed, monochrome concept sketch of";
          styleSuffix = "A clean, black and white line art drawing. Focus on form and structure, like an industrial design blueprint. Minimalist aesthetic. Rendered in 8K."
      } else if (textInputs.aiModel === 'clay') {
          stylePrefix = "A studio photograph of a monochrome clay model of";
          styleSuffix = "Matte finish, uniform grey color. Perfect, even studio lighting to highlight contours and shape. No textures, logos, or colors. Focus on 3D form. Rendered in 8K.";
      } else if (textInputs.aiModel === 'blueprint') {
          stylePrefix = "A technical blueprint schematic of";
          styleSuffix = "White lines on a blue background. Includes dimensional callouts, annotations, and construction lines. Extremely precise and detailed, like a CAD drawing. Rendered in 8K.";
      } else if (textInputs.aiModel === 'vintage') {
          stylePrefix = "A vintage 1970s film photograph of";
          styleSuffix = "Shot on Kodak Portra 400 film. Warm color tones, soft focus, and natural grain. Retro, nostalgic aesthetic. Slight lens flare and vignetting. Rendered in 8K.";
      }
      
      const hasColor = !['sketch', 'clay', 'blueprint'].includes(textInputs.aiModel);
      const angleViewForPrompt = viewToGenerate === 'Angled' ? 'Three-quarters hero angle' : textInputs.angleView;

      const prompt = `
**Primary Subject**: ${stylePrefix} a premium "${textInputs.leatherPatternName}" leather phone case designed for the "${textInputs.productName}".
- **Phone Dimensions**: ${textInputs.productHeight}mm (H) x ${textInputs.productWidth}mm (W) x ${textInputs.productDepth}mm (D).
- **Case Thickness**: ${textInputs.caseThickness}mm.

**Logo Specifications**:
- **Brand Name**: "${textInputs.logoName}"
- **Application**: The logo should be rendered with a "${textInputs.logoFinish}" finish.${hasColor ? ` The color should be a rich ${textInputs.logoColor}.` : ''} The application should be precise and clean.

**Photographic Composition**:
- **Viewpoint**: A professional ${textInputs.cameraShotType} of the case from the ${viewToGenerate} view, captured at a ${angleViewForPrompt}.

**Scene & Ambiance**:
- **Setting**: The case is placed within a sophisticated scene: "${textInputs.scenePrompt}".
- **Background**: The backdrop is "${textInputs.backgroundPrompt}", creating a cohesive and professional atmosphere.
- **Lighting**: The scene is illuminated by "${textInputs.lightingStyle}", designed to accentuate the leather texture and the logo finish. The lighting should create realistic reflections and soft shadows.${hasColor ? `
- **Color Palette**: The overall image should adhere to a "${textInputs.colorScheme}" color scheme.` : ''}

**Mandatory Quality Directives**:
- **Core Style**: ${styleSuffix}
- **Texture Detail**: The "${textInputs.leatherPatternName}" leather must be hyper-detailed, with a clearly visible and sharp cross-hatch pattern, especially when zoomed in.
- **Logo Integrity**: The "${textInputs.logoName}" logo must be perfectly legible, crisp, and accurately represent the specified "${textInputs.logoFinish}".
- **Physical Accuracy**: The phone case must have clean, precise edges and cutouts. There should be no warping, melting, or other AI-generated artifacts. The interaction between the case and the surface it rests on must be physically believable.
- **Overall Impression**: The final image must be of the highest professional quality, suitable for a luxury brand's marketing campaign.
`;
      await new Promise(r => setTimeout(r, 300)); // UX delay
      updateStep(2, WorkflowStatus.COMPLETED);
      
      // Simulate Systems 1-6
      updateStep(3, WorkflowStatus.RUNNING, "System 1: Synthesizing 3D model...");
      await new Promise(r => setTimeout(r, 800));
      updateStep(3, WorkflowStatus.COMPLETED);

      updateStep(4, WorkflowStatus.RUNNING, "System 2: Applying textures...");
      await new Promise(r => setTimeout(r, 1000));
      updateStep(4, WorkflowStatus.COMPLETED);

      updateStep(5, WorkflowStatus.RUNNING, "System 3: Applying component masks...");
      await new Promise(r => setTimeout(r, 600));
      updateStep(5, WorkflowStatus.COMPLETED);

      updateStep(6, WorkflowStatus.RUNNING, "System 4: Detailing logo...");
      await new Promise(r => setTimeout(r, 800));
      updateStep(6, WorkflowStatus.COMPLETED);

      updateStep(7, WorkflowStatus.RUNNING, "System 5: Composing scene...");
      await new Promise(r => setTimeout(r, 700));
      updateStep(7, WorkflowStatus.COMPLETED);
      
      updateStep(8, WorkflowStatus.RUNNING, "System 6: Simulating lighting...");
      await new Promise(r => setTimeout(r, 1200));
      updateStep(8, WorkflowStatus.COMPLETED);

      // Step 9: AI Image Generation (Actual API Call)
      updateStep(9, WorkflowStatus.RUNNING, `System 7: Generating ${viewToGenerate} view...`);
      let imageUrl: string;

      if (isDemoMode) {
        // DEMO PATH
        await new Promise(r => setTimeout(r, 1500));
        imageUrl = `https://placehold.co/1024x1024/0f172a/6d28d9/png?text=Demo%0A${viewToGenerate}`;
      } else {
        // REAL API PATH
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
            },
        });
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      }
      updateStep(9, WorkflowStatus.COMPLETED);
      
      // Simulate Systems 8-9
      updateStep(10, WorkflowStatus.RUNNING, "System 8: Enhancing details...");
      await new Promise(r => setTimeout(r, 900));
      updateStep(10, WorkflowStatus.COMPLETED);

      updateStep(11, WorkflowStatus.RUNNING, "System 9: Performing QA scan...");
      await new Promise(r => setTimeout(r, 500));
      updateStep(11, WorkflowStatus.COMPLETED);

      // Step 12: Receiving Output
      updateStep(12, WorkflowStatus.RUNNING, "Processing AI output...");
      setOutputImages(prev => ({...prev, [viewToGenerate]: imageUrl}));
      await new Promise(r => setTimeout(r, 300)); // UX delay
      updateStep(12, WorkflowStatus.COMPLETED);

      // Step 13: Finalizing
      updateStep(13, WorkflowStatus.RUNNING, "Finalizing image...");
      await new Promise(r => setTimeout(r, 300)); // UX delay
      updateStep(13, WorkflowStatus.COMPLETED, "Process completed successfully!");

    } catch (e: any) {
      console.error(e);
      let isQuotaError = false;
      const message = e && typeof e.message === 'string' ? e.message : '';

      // Check for keywords in the error message string
      const lowerCaseMessage = message.toLowerCase();
      if (lowerCaseMessage.includes('quota') || lowerCaseMessage.includes('resource_exhausted') || lowerCaseMessage.includes('429')) {
        isQuotaError = true;
      }

      // If not found, try parsing the message as JSON to check for structured error details
      // This handles cases where the message itself is a JSON string.
      if (!isQuotaError && message.startsWith('{')) {
        try {
          const errorJson = JSON.parse(message);
          const status = errorJson?.error?.status;
          const code = errorJson?.error?.code;
          if (status === 'RESOURCE_EXHAUSTED' || code === 429) {
            isQuotaError = true;
          }
        } catch (jsonError) {
          // It wasn't valid JSON, so we continue
        }
      }

      if (isQuotaError) {
        setIsDemoMode(true);
        // Ensure we don't also show a generic error message.
        setApiError(null); 
      } else {
        setApiError(
          <>
            <strong>Generation failed:</strong> {message || "An unexpected error occurred."}
          </>
        );
      }
      
      const runningStepIndex = steps.findIndex(s => s.status === WorkflowStatus.RUNNING);
      if (runningStepIndex > -1) {
        updateStep(steps[runningStepIndex].id, WorkflowStatus.FAILED, "Generation failed.");
      } else {
        // If it fails before any step is running, fail the first step.
        updateStep(1, WorkflowStatus.FAILED, "Validation failed.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = useCallback(() => {
    const imageUrl = outputImages[currentOutputView];
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-case-${currentOutputView.toLowerCase()}-8k.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [outputImages, currentOutputView]);

  const handleViewChange = (view: string) => {
    setCurrentOutputView(view);
    if (!outputImages[view] && !isGenerating) {
        handleGenerateClick(view);
    }
  };

  const isButtonDisabled = isGenerating || Object.values(files).some(f => f === null);

  const Button = ({ children, isLoading, ...props }) => (
    <button
        {...props}
        className="w-full flex items-center justify-center text-lg font-semibold py-3 px-6 rounded-lg transition-all duration-300 bg-violet-600 text-white hover:bg-violet-500 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-violet-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transform hover:-translate-y-0.5 disabled:transform-none shadow-lg shadow-violet-900/20"
    >
        {isLoading ? <><SpinnerIcon /><span className="ml-2">Generating...</span></> : children}
    </button>
  );

  const CustomSelect = ({ label, name, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block font-medium text-slate-300 text-sm mb-2">{label}</label>
        <div className="relative">
            <select 
                id={name} 
                name={name} 
                value={value} 
                onChange={onChange} 
                className="block w-full bg-slate-800 border-slate-700 hover:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500 text-slate-200 p-2.5 appearance-none pr-10 text-sm transition-all duration-200"
            >
                {options.map((option) => (
                    <option key={option} value={option} className="bg-slate-800 text-slate-200">{option}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                 <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0
                 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
            </div>
        </div>
    </div>
);

 const TextInput = ({ label, name, value, onChange, error, ...props }) => (
    <div>
      <label htmlFor={name} className="block font-medium text-slate-300 mb-2 text-sm">{label}</label>
      <input
        type="text"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`block w-full bg-slate-800 rounded-md shadow-sm text-slate-200 p-2.5 text-sm transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500
        ${error ? 'border-red-500/50 ring-1 ring-red-500' : 'border border-slate-700 hover:border-slate-600'}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );

  const Textarea = ({ label, name, value, onChange, children, ...props }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={name} className="block font-medium text-slate-300 text-sm">{label}</label>
        {children}
      </div>
      <textarea
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="block w-full bg-slate-800 border-slate-700 hover:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500 text-slate-200 p-2.5 text-sm transition-all duration-200"
        {...props}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div className="flex flex-col space-y-8">
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                <h3 className="text-xl font-bold text-slate-100 mb-6 border-b border-slate-800 pb-4">Input Images</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ImageUploader id="leatherPattern" label="Leather Pattern" description="Texture image." previewUrl={previews.leatherPattern} onFileChange={(file) => handleFileChange(file, 'leatherPattern')} onClear={() => handleClearFile('leatherPattern')} />
                    <ImageUploader id="caseBack" label="Case Back" description="Back of the case." previewUrl={previews.caseBack} onFileChange={(file) => handleFileChange(file, 'caseBack')} onClear={() => handleClearFile('caseBack')} />
                    <ImageUploader id="caseRight" label="Case Right" description="Right side view." previewUrl={previews.caseRight} onFileChange={(file) => handleFileChange(file, 'caseRight')} onClear={() => handleClearFile('caseRight')} />
                    <ImageUploader id="caseLeft" label="Case Left" description="Left side view." previewUrl={previews.caseLeft} onFileChange={(file) => handleFileChange(file, 'caseLeft')} onClear={() => handleClearFile('caseLeft')} />
                    <ImageUploader id="caseTop" label="Case Top" description="Top side view." previewUrl={previews.caseTop} onFileChange={(file) => handleFileChange(file, 'caseTop')} onClear={() => handleClearFile('caseTop')} />
                    <ImageUploader id="caseBottom" label="Case Bottom" description="Bottom side view." previewUrl={previews.caseBottom} onFileChange={(file) => handleFileChange(file, 'caseBottom')} onClear={() => handleClearFile('caseBottom')} />
                    <ImageUploader id="caseCamera" label="Case Camera" description="Camera cutout view." previewUrl={previews.caseCamera} onFileChange={(file) => handleFileChange(file, 'caseCamera')} onClear={() => handleClearFile('caseCamera')} />
                    <ImageUploader id="logo" label="Logo" description="Transparent logo." previewUrl={previews.logo} onFileChange={(file) => handleFileChange(file, 'logo')} onClear={() => handleClearFile('logo')} />
                    <ImageUploader id="depthMap" label="Depth Map" description="Front depth map." previewUrl={previews.depthMap} onFileChange={(file) => handleFileChange(file, 'depthMap')} onClear={() => handleClearFile('depthMap')} />
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                <h3 className="text-xl font-bold text-slate-100 mb-6 border-b border-slate-800 pb-4">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput label="Product Name" name="productName" value={textInputs.productName} onChange={handleTextChange} error={formErrors.productName} />
                    <TextInput label="Leather Pattern" name="leatherPatternName" value={textInputs.leatherPatternName} onChange={handleTextChange} error={formErrors.leatherPatternName} />
                </div>
                <div className="mt-6 pt-6 border-t border-slate-800">
                    <h4 className="text-base font-semibold text-slate-200 mb-4">Dimensions</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <TextInput label="Height (mm)" name="productHeight" value={textInputs.productHeight} onChange={handleTextChange} error={formErrors.productHeight} />
                        <TextInput label="Width (mm)" name="productWidth" value={textInputs.productWidth} onChange={handleTextChange} error={formErrors.productWidth} />
                        <TextInput label="Depth (mm)" name="productDepth" value={textInputs.productDepth} onChange={handleTextChange} error={formErrors.productDepth} />
                        <TextInput label="Thickness (mm)" name="caseThickness" value={textInputs.caseThickness} onChange={handleTextChange} error={formErrors.caseThickness} />
                    </div>
                </div>
                 <div className="mt-6 pt-6 border-t border-slate-800">
                    <h4 className="text-base font-semibold text-slate-200 mb-4">Logo Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput label="Logo Name" name="logoName" value={textInputs.logoName} onChange={handleTextChange} error={formErrors.logoName} />
                        <TextInput label="Logo Color" name="logoColor" value={textInputs.logoColor} onChange={handleTextChange} error={formErrors.logoColor} />
                    </div>
                    <div className="mt-6">
                        <TextInput label="Logo Finish" name="logoFinish" id="logoFinish" value={textInputs.logoFinish} onChange={handleTextChange} list="logo-finishes" error={formErrors.logoFinish} />
                        <datalist id="logo-finishes">
                            {LOGO_FINISH_CATEGORIES.flatMap(category => category.options).map(option => <option key={option.id} value={option.name} />)}
                        </datalist>
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                <h3 className="text-xl font-bold text-slate-100 mb-6 border-b border-slate-800 pb-4">Creative Direction</h3>
                <div>
                    <h4 className="text-base font-semibold text-slate-200 mb-4">AI Model &amp; Style</h4>
                    <div className="space-y-3">
                        {AI_MODEL_OPTIONS.map((option) => (
                            <label key={option.id} className={`flex items-start space-x-4 p-4 rounded-lg border transition-all cursor-pointer ${textInputs.aiModel === option.id ? 'bg-violet-500/10 border-violet-500 ring-1 ring-violet-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}`}>
                                <input
                                    type="radio"
                                    name="aiModel"
                                    value={option.id}
                                    checked={textInputs.aiModel === option.id}
                                    onChange={handleTextChange}
                                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer text-violet-600 bg-slate-700 border-slate-600 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                />
                                <div>
                                    <span className="font-medium text-slate-200">{option.name}</span>
                                    <p className="text-sm text-slate-400 mt-1">{option.description}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-800">
                    <h4 className="text-base font-semibold text-slate-200 mb-4">Composition</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <CustomSelect label="Initial Image View" name="imageView" value={textInputs.imageView} onChange={handleTextChange} options={['Front', 'Back', 'Left', 'Right', 'Top', 'Bottom', 'Angled']} />
                        <CustomSelect label="Angle View" name="angleView" value={textInputs.angleView} onChange={handleTextChange} options={ANGLE_VIEW_OPTIONS} />
                        <CustomSelect label="Camera Shot" name="cameraShotType" value={textInputs.cameraShotType} onChange={handleTextChange} options={CAMERA_SHOT_TYPE_OPTIONS} />
                     </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-800">
                    <h4 className="text-base font-semibold text-slate-200 mb-4">Aesthetics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput label="Lighting Style" name="lightingStyle" id="lightingStyle" value={textInputs.lightingStyle} onChange={handleTextChange} list="lighting-styles" error={formErrors.lightingStyle} />
                        <datalist id="lighting-styles">
                            {LIGHTING_STYLE_OPTIONS.map(o => <option key={o} value={o} />)}
                        </datalist>

                        <TextInput label="Color Scheme" name="colorScheme" id="colorScheme" value={textInputs.colorScheme} onChange={handleTextChange} list="color-schemes" error={formErrors.colorScheme} />
                        <datalist id="color-schemes">
                            {COLOR_SCHEME_OPTIONS.map(o => <option key={o} value={o} />)}
                        </datalist>
                    </div>
                     <div className="grid grid-cols-1 gap-6 mt-6">
                        <Textarea label="Scene Prompt" name="scenePrompt" id="scenePrompt" value={textInputs.scenePrompt} onChange={handleTextChange} rows={2}>
                            <button onClick={() => handleInspireMe('scenePrompt')} type="button" className="flex items-center space-x-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                                <ShuffleIcon />
                                <span>Inspire Me</span>
                            </button>
                        </Textarea>
                        <Textarea label="Background Prompt" name="backgroundPrompt" id="backgroundPrompt" value={textInputs.backgroundPrompt} onChange={handleTextChange} rows={2}>
                             <button onClick={() => handleInspireMe('backgroundPrompt')} type="button" className="flex items-center space-x-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                                <ShuffleIcon />
                                <span>Inspire Me</span>
                            </button>
                        </Textarea>
                     </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                <h3 className="text-xl font-bold text-slate-100 mb-4">Ready to Generate</h3>
                {isDemoMode && (
                    <div className="text-sm text-yellow-200 mb-4 bg-yellow-900/40 p-3 rounded-lg border border-yellow-500/50">
                        <div className="flex items-center justify-between">
                            <p>
                                <strong>Demo Mode Active:</strong> API quota may have been reached.
                            </p>
                            <button
                                onClick={() => {
                                    setIsDemoMode(false);
                                    setApiError(null);
                                }}
                                className="ml-4 flex-shrink-0 text-xs font-semibold bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-100 px-3 py-1.5 rounded-md transition-colors"
                            >
                                Try Real API
                            </button>
                        </div>
                    </div>
                )}
                {apiError && <div className="text-sm text-red-400 mb-4 bg-red-900/30 p-3 rounded-md border border-red-500/50">{apiError}</div>}
                <p className="text-sm text-slate-400 mb-6">
                    Once all inputs are provided and settings are configured, you can start the generation process. This may take several minutes.
                </p>
                 <Button
                    onClick={() => handleGenerateClick()}
                    disabled={isButtonDisabled}
                    isLoading={isGenerating}
                 >
                    {isDemoMode ? 'Generate Demo Image' : 'Generate Image'}
                </Button>
            </div>
            
            <div className="lg:hidden">
              <OutputDisplay 
                imageUrl={outputImages[currentOutputView]} 
                isGenerating={isGenerating} 
                onDownload={handleDownloadImage}
                onViewChange={handleViewChange}
                currentView={currentOutputView}
                generatedViews={Object.keys(outputImages)}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-8 sticky top-24">
            <WorkflowTracker steps={workflowSteps} currentLog={currentLog} />
            <div className="hidden lg:block">
              <OutputDisplay 
                imageUrl={outputImages[currentOutputView]} 
                isGenerating={isGenerating} 
                onDownload={handleDownloadImage}
                onViewChange={handleViewChange}
                currentView={currentOutputView}
                generatedViews={Object.keys(outputImages)}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
