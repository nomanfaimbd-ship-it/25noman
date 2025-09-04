import React from 'react';
import { WorkflowStatus, WorkflowStep, LogoFinishOption, LogoFinishCategory } from './types';

export const INITIAL_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    title: 'Input Validation',
    description: 'Checking for all required images and text.',
    status: WorkflowStatus.PENDING,
  },
  {
    id: 2,
    title: 'Prompt Construction',
    description: 'Building the detailed prompt for the AI model.',
    status: WorkflowStatus.PENDING,
  },
  {
    id: 3,
    title: 'System 1: 3D Model Synthesis',
    description: 'Constructing a 3D model from product dimensions.',
    status: WorkflowStatus.PENDING,
  },
  {
    id: 4,
    title: 'System 2: UV Mapping & Texturing',
    description: 'Applying leather pattern and material properties.',
    status: WorkflowStatus.PENDING,
  },
  {
    id: 5,
    title: 'System 3: Component Masking',
    description: 'Applying masks for camera, buttons, and ports.',
    status: WorkflowStatus.PENDING,
  },
  {
    id: 6,
    title: 'System 4: Logo Application',
    description: 'Applying the logo with the specified finish.',
    status: WorkflowStatus.PENDING,
  },
  {
    id: 7,
    title: 'System 5: Scene Composition',
    description: 'Placing product model into the virtual environment.',
    status: WorkflowStatus.PENDING,
  },
  {
    id: 8,
    title: 'System 6: Lighting Simulation',
    description: 'Simulating light sources and calculating reflections.',
    status: WorkflowStatus.PENDING,
  },
  {
    id: 9,
    title: 'System 7: AI Image Generation',
    description: 'Generating the core image with the AI model.',
    status: WorkflowStatus.PENDING,
  },
  {
    id: 10,
    title: 'System 8: AI Detail Enhancement',
    description: 'Using AI to refine fine details and textures.',
    status: WorkflowStatus.PENDING,
  },
  {
    id: 11,
    title: 'System 9: Quality Assurance Scan',
    description: 'Automatically scanning for common AI artifacts.',
    status: WorkflowStatus.PENDING,
  },
  {
    id: 12,
    title: 'Receiving Output',
    description: 'Processing the generated image from the AI.',
    status: WorkflowStatus.PENDING,
  },
  {
    id: 13,
    title: 'Finalizing',
    description: 'Preparing the final image for display.',
    status: WorkflowStatus.PENDING,
  },
];


export const QA_CHECKLIST_ITEMS: string[] = [
    "Clean logo (foil + debossed look)",
    "Sharp leather crosshatch (at 200% zoom)",
    "Phone frame/buttons are 100% correct",
    "No warping or AI artifacts visible",
];

export const SCENE_PROMPT_OPTIONS: string[] = [
  'A corporate meeting table',
  'A minimalist wooden desk with a single plant',
  'On a stack of high-fashion magazines',
  'Next to a sleek laptop on a modern office desk',
  'On a polished concrete surface with dramatic lighting',
  'Resting on a luxurious black velvet cloth',
  'On a rustic, weathered wooden plank',
  'Atop a marble kitchen counter with soft morning light',
  'Floating on a tranquil water surface with gentle ripples',
  'Nestled in a bed of pristine white sand',
  'On a futuristic, glowing neon grid surface',
  'Atop a stack of antique leather-bound books',
  'On a bed of lush green moss in an enchanted forest',
  'Placed on a reflective, mirror-like surface showing the sky',
  'Against a backdrop of shattered glass, artistically arranged',
  'In the center of a spartan, brutalist concrete room',
  'On a pedestal in a minimalist art gallery',
  'Amongst scattered autumn leaves on a forest floor',
  'On a vintage wooden crate surrounded by dried flowers',
  'On a sleek, minimalist charging pad',
  'Partially submerged in a pool of liquid gold',
  'Amongst professional camera lenses and equipment',
];

export const BACKGROUND_PROMPT_OPTIONS: string[] = [
  'A luxury marble/stone background',
  'A soft, out-of-focus photography studio background',
  'A dramatic, moody, dark, cinematic background',
  'A clean, bright, minimalist white background',
  'A warm, sunlit interior with soft, blurry shadows',
  'An abstract, futuristic geometric pattern background',
  'A richly textured, dark wood panel background',
  'A brushed metal surface with subtle reflections',
  'An industrial chic background with exposed brick and metal pipes',
  'A vibrant, colorful bokeh light background, out of focus',
  'A serene Japanese zen garden with raked sand patterns',
  'An underwater scene with gentle light rays filtering through',
  'A galaxy/nebula cosmic background with swirling colors',
  'A close-up of intricate, shimmering silk fabric',
  'A holographic, iridescent, shifting color background',
  'A distressed, peeling paint texture on an old wall',
  'An infinite white void, creating a floating effect',
  'A tropical leaf pattern with deep green hues',
  'An out-of-focus high-tech server room with glowing LEDs',
  'A single, powerful spotlight beam cutting through darkness',
  'A background of flowing, liquid metal',
];

export const ANGLE_VIEW_OPTIONS: string[] = [
  'Slightly angled',
  'Directly overhead (top-down)',
  'Low angle',
  'High angle',
  'Eye-level',
  'Dutch angle (tilted)',
  'Three-quarters',
  'Hero angle (low angle looking up)',
];

export const CAMERA_SHOT_TYPE_OPTIONS: string[] = [
  'Medium shot',
  'Close-up',
  'Extreme close-up',
  'Macro shot',
  'Full shot',
  'Product hero shot',
  'Detailed texture shot',
];

export const LIGHTING_STYLE_OPTIONS: string[] = [
  'Soft, diffused studio lighting',
  'Dramatic, high-contrast side lighting',
  'Warm, golden hour sunlight',
  'Cinematic neon and synthwave lighting',
  'Bright, clean, high-key lighting',
  'Moody, dark, low-key lighting',
  'Natural, overcast day lighting',
  'Backlit with a strong halo effect',
  'Split lighting (half in shadow)',
  'Rim lighting to highlight edges',
];

export const COLOR_SCHEME_OPTIONS: string[] = [
  'Vibrant and saturated',
  'Monochromatic with varying shades',
  'Pastel and muted tones',
  'Analogous (neighboring colors)',
  'Complementary (opposite colors)',
  'Earthy and natural tones',
  'Dark and moody with a single accent color',
  'Minimalist black and white',
  'Triadic color scheme for high contrast',
  'High-tech cyan and magenta',
];

export const AI_MODEL_OPTIONS = [
  { id: 'photorealistic', name: 'Imagen 4.0 - Photorealistic', description: 'Creates hyperrealistic, professional product photos.' },
  { id: 'artistic', name: 'Imagen 4.0 - Artistic Rendering', description: 'Generates a more stylized, artistic interpretation of the product.' },
  { id: 'sketch', name: 'Imagen 4.0 - Concept Sketch', description: 'Produces a clean, black and white concept sketch of the product.' },
  { id: 'clay', name: 'Imagen 4.0 - Clay Model', description: 'Renders the product as a neutral, monochrome clay model to emphasize form.' },
  { id: 'blueprint', name: 'Imagen 4.0 - Blueprint Schematic', description: 'Creates a technical blueprint-style drawing with annotations.' },
  { id: 'vintage', name: 'Imagen 4.0 - Vintage Photo', description: 'Simulates a product photo taken with vintage film camera equipment.' },
];

const MetallicFoilsIcon = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624l.21-1.035a3.375 3.375 0 00-2.455-2.456l-1.036-.259 1.036-.259a3.375 3.375 0 002.455-2.456l.21-1.035.21 1.035a3.375 3.375 0 002.456 2.456l1.035.259-1.035.259a3.375 3.375 0 00-2.456 2.456l-.21 1.035z" />
    </svg>
);

const ImpressionsTexturesIcon = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
    </svg>
);

const ModernArtisticIcon = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.251.023.501.05.75.082a9.75 9.75 0 018.25 8.25c.032.249.059.5.082.75l-4.5 4.5M9.75 3.104c-2.42 0-4.72.63-6.608 1.741L2.25 4.5l1.741-1.608A1.125 1.125 0 015.142 2.25l2.485.497M9.75 3.104a11.25 11.25 0 00-4.5 4.5M14.25 18.75l4.5 4.5m-4.5-4.5l-4.5-4.5" />
    </svg>
);

export const LOGO_FINISH_CATEGORIES: LogoFinishCategory[] = [
  {
    category: 'Metallic Foils',
    icon: MetallicFoilsIcon,
    options: [
      { id: 'gold-foil', name: 'Gold Foil Stamped', description: 'Classic 24k gold, pressed into the leather for a sharp, luxurious indent.' },
      { id: 'silver-foil', name: 'Silver Foil Stamped', description: 'Bright, modern silver, pressed in for a clean, high-tech look.' },
      { id: 'rose-gold-foil', name: 'Rose Gold Foil Stamped', description: 'Warm, trendy rose gold, debossed for a soft, elegant finish.' },
      { id: 'holographic-foil', name: 'Holographic Foil Stamped', description: 'An iridescent, rainbow-like foil that shifts color with light.' },
    ],
  },
  {
    category: 'Impressions & Textures',
    icon: ImpressionsTexturesIcon,
    options: [
      { id: 'blind-deboss', name: 'Blind Debossed', description: 'A subtle, sophisticated indentation with no color, just texture.' },
      { id: 'high-gloss-emboss', name: 'Raised High-Gloss Emboss', description: 'The logo is raised from the surface with a shiny, clear coating.' },
      { id: 'matte-print', name: 'Matte White Print', description: 'A flat, non-reflective white print directly on the leather surface.' },
      { id: 'gloss-black-print', name: 'Gloss Black Print', description: 'A slightly raised, shiny black print that contrasts with the leather.' },
    ],
  },
  {
    category: 'Modern & Artistic',
    icon: ModernArtisticIcon,
    options: [
        { id: 'metal-inlay', name: 'Polished Metal Inlay', description: 'A solid piece of polished metal set flush into the leather surface.' },
        { id: 'laser-engraved', name: 'Laser Engraved', description: 'The logo is burned into the leather, creating a dark, rustic effect.' },
        { id: 'tone-on-tone', name: 'Tone-on-Tone Varnish', description: 'A clear, glossy varnish in the shape of the logo for a subtle, wet look.' },
        { id: 'liquid-metal', name: 'Liquid Metal Effect', description: 'A futuristic, chrome-like raised finish that appears fluid.' },
        { id: 'iridescent-uv', name: 'Iridescent UV Print', description: 'A vibrant, color-shifting print that mimics oil on water.' },
        { id: 'anodized-aluminum', name: 'Anodized Aluminum Insert', description: 'A brushed aluminum piece inlaid for a sleek, durable finish.' },
    ]
  },
];


export const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

export const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const PendingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const SpinnerIcon = () => (
    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const ShuffleIcon = ({ className = "h-4 w-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20L20 4M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
);