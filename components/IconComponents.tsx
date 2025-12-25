import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const getDimension = (size: number | string | undefined, defaultSize: number): number => {
  const numericSize = typeof size === 'string' ? parseInt(size, 10) : size;
  return numericSize && !isNaN(numericSize) ? Math.round(numericSize / 4) : Math.round(defaultSize / 4);
};

export const SearchIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => {
  const dimension = getDimension(size, 20);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }} />
);
}

export const StarIcon: React.FC<IconProps & { filled?: boolean }> = ({ size = 20, filled = false, className = '', ...props }) => {
  const dimension = getDimension(size, 20);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill={filled ? "currentColor" : "none"} className={`w-${dimension} h-${dimension} text-yellow-400 ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.82.61l-4.725-2.885a.562.562 0 0 0-.652 0l-4.725 2.885a.562.562 0 0 1-.82-.61l1.285-5.385a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);
}

export const SunIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => {
  const dimension = getDimension(size, 24);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25c0 1.31.67 2.415 1.683 3.016M12 12a2.25 2.25 0 0 1 2.25 2.25c0 1.31-.67 2.415-1.683 3.016M12 6.75A5.25 5.25 0 0 1 17.25 12a5.25 5.25 0 0 1-5.25 5.25A5.25 5.25 0 0 1 6.75 12a5.25 5.25 0 0 1 5.25-5.25Z" />
  </svg>
);
}

export const MoonIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => {
  const dimension = getDimension(size, 24);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);
}

export const CodeBracketIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => {
  const dimension = getDimension(size, 20);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
  </svg>
);
}

export const UserCircleIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => {
  const dimension = getDimension(size, 24);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);
}

export const ArrowDownTrayIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => {
  const dimension = getDimension(size, 20);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);
}

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => {
  const dimension = getDimension(size, 20);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);
}

export const SparklesIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => {
  const dimension = getDimension(size, 20);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L21 5.25l-.813 2.846a4.5 4.5 0 0 0-3.09 3.09L14.25 12l2.846.813a4.5 4.5 0 0 0 3.09 3.09L21 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L18.25 12Z" />
  </svg>
);
}

export const DocumentDuplicateIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => {
  const dimension = getDimension(size, 16);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625v2.625m-7.5-2.625v2.625m0-2.625H5.625m7.5 0H17.25m-7.5 0H9.75M5.625 7.5H8.25m2.625 0H17.25M5.625 7.5V5.25m11.25 0V5.25m0 0H8.25m5.25 0h2.625M5.625 7.5v3.5m11.25-3.5v3.5m0 0H8.25" />
  </svg>
);
}

export const CheckIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => {
  const dimension = getDimension(size, 16);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);
}

export const XMarkIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => {
  const dimension = getDimension(size, 24);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);
}

export const KeyIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => {
  const dimension = getDimension(size, 20);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
  </svg>
);
}

export const ChartBarIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => {
  const dimension = getDimension(size, 20);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);
}

export const ArrowUpOnSquareIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => {
  const dimension = getDimension(size, 20);
 return (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
  </svg>
);
}

export const ChatBubbleLeftEllipsisIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => {
  const dimension = getDimension(size, 20);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-3.861 8.25-8.625 8.25S3.75 16.556 3.75 12c0-4.556 3.861-8.25 8.625-8.25S21 7.444 21 12Z" />
  </svg>
);
}

export const LinkIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => {
  const dimension = getDimension(size, 16);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
  </svg>
);
}

export const FilterIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => {
  const dimension = getDimension(size, 20);
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${dimension} h-${dimension} ${className}`} {...props} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.482 0-2.901.556-3.996 1.504A5.97 5.97 0 0 0 6 7.5v9.75A2.25 2.25 0 0 0 8.25 19.5h7.5A2.25 2.25 0 0 0 18 17.25V7.5a5.97 5.97 0 0 0-2.004-4.004A5.97 5.97 0 0 0 12 3Zm0 3.75a2.25 2.25 0 0 1 2.25 2.25v6.75a2.25 2.25 0 0 1-2.25 2.25H9.75a2.25 2.25 0 0 1-2.25-2.25V9a2.25 2.25 0 0 1 2.25-2.25h2.25Z" />
  </svg>
);
}
