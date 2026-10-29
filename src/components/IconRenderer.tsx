import {
  Code,
  Code2,
  Database,
  Palette,
  Server,
  Cloud,
  CloudUpload,
  Image,
  Square,
  Train,
  ArrowRight,
} from "lucide-react";

interface IconRendererProps {
  iconName: string;
  color?: string;
  size?: number;
  className?: string;
}

// Map icon names to lucide components
const iconMap: Record<string, React.ComponentType<any>> = {
  react: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3c4.97 0 9 2.686 9 6s-4.03 6-9 6-9-2.686-9-6 4.03-6 9-6" />
      <path d="M12 3v18M3 9h18M3 15h18" />
    </svg>
  ),
  "code": Code,
  "code-2": Code2,
  "database": Database,
  "palette": Palette,
  "server": Server,
  "snake": () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 6c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2H9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h6c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2" />
    </svg>
  ),
  "cloud": Cloud,
  "cloud-upload": CloudUpload,
  "image": Image,
  "square": Square,
  "train": Train,
  "arrow-right": ArrowRight,
};

export function IconRenderer({
  iconName,
  color,
  size = 24,
  className = "",
}: IconRendererProps) {
  const Component = iconMap[iconName] || Code;

  return (
    <div
      className={className}
      style={{
        color: color,
        width: size,
        height: size,
      }}
    >
      <Component size={size} strokeWidth={2} />
    </div>
  );
}
