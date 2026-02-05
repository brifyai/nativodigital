import React from 'react';
import {
  OpenInNew as ExternalLinkIcon,
  PlayCircleOutline as VideoIcon,
  InsertDriveFile as FileTextIcon,
  MenuBook as BookOpenIcon,
  AutoAwesome as SparklesIcon,
} from '@mui/icons-material';
import { EducationalResource } from '../data/educationalResources';

interface ResourceSuggestionsProps {
  resources: EducationalResource[];
  onClose?: () => void;
}

const ResourceSuggestions: React.FC<ResourceSuggestionsProps> = ({ resources, onClose }) => {
  if (resources.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoIcon sx={{ fontSize: 16 }} />;
      case 'article': return <FileTextIcon sx={{ fontSize: 16 }} />;
      case 'course': return <BookOpenIcon sx={{ fontSize: 16 }} />;
      case 'interactive': return <SparklesIcon sx={{ fontSize: 16 }} />;
      default: return <ExternalLinkIcon sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl animate-in slide-in-from-bottom-4 fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
          <BookOpenIcon sx={{ fontSize: 14 }} className="text-blue-500" />
        </div>
        <h4 className="font-bold text-primary text-sm">Recursos Recomendados</h4>
      </div>
      
      <div className="space-y-2">
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 bg-surface hover:bg-surfaceHighlight border border-border rounded-lg transition-all hover:scale-[1.02] group"
          >
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform">
              {getIcon(resource.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h5 className="font-medium text-primary text-sm truncate">{resource.title}</h5>
                {resource.free && (
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded uppercase">
                    Gratis
                  </span>
                )}
              </div>
              <p className="text-xs text-secondary line-clamp-2">{resource.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-secondary bg-surfaceHighlight px-2 py-0.5 rounded">
                  {resource.platform}
                </span>
                <ExternalLinkIcon sx={{ fontSize: 10 }} className="text-secondary" />
              </div>
            </div>
          </a>
        ))}
      </div>
      
      <p className="text-xs text-secondary mt-3 italic">
        💡 Estos recursos pueden ayudarte a profundizar en el tema
      </p>
    </div>
  );
};

export default ResourceSuggestions;
