import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  HelpOutline as QuestionIcon,
  CheckCircle as CheckIcon,
  Lightbulb as LightbulbIcon,
  FavoriteBorder as HeartIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Psychology as BrainIcon,
  AutoAwesome as SparklesIcon,
  School as SchoolIcon,
  MenuBook as BookIcon,
  Science as ScienceIcon,
  Palette as PaletteIcon,
  MusicNote as MusicIcon,
  SportsBasketball as SportsIcon,
  Celebration as CelebrationIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface EnhancedMarkdownProps {
  content: string;
  className?: string;
}

const EnhancedMarkdown: React.FC<EnhancedMarkdownProps> = ({ content, className }) => {
  
  // Map emojis to Material UI icons with colors
  const getIconForEmoji = (emoji: string) => {
    const iconMap: Record<string, { icon: React.ReactElement; colorClass: string }> = {
      '❓': { icon: <QuestionIcon sx={{ fontSize: 18 }} />, colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' },
      '?': { icon: <QuestionIcon sx={{ fontSize: 18 }} />, colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' },
      '✅': { icon: <CheckIcon sx={{ fontSize: 18 }} />, colorClass: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' },
      '✓': { icon: <CheckIcon sx={{ fontSize: 18 }} />, colorClass: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' },
      '💡': { icon: <LightbulbIcon sx={{ fontSize: 18 }} />, colorClass: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30' },
      '💜': { icon: <HeartIcon sx={{ fontSize: 18 }} />, colorClass: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30' },
      '💙': { icon: <HeartIcon sx={{ fontSize: 18 }} />, colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' },
      '💚': { icon: <HeartIcon sx={{ fontSize: 18 }} />, colorClass: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' },
      '🧡': { icon: <HeartIcon sx={{ fontSize: 18 }} />, colorClass: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30' },
      '💛': { icon: <HeartIcon sx={{ fontSize: 18 }} />, colorClass: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30' },
      '⭐': { icon: <StarIcon sx={{ fontSize: 18 }} />, colorClass: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30' },
      '🏆': { icon: <TrophyIcon sx={{ fontSize: 18 }} />, colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30' },
      '🔥': { icon: <FireIcon sx={{ fontSize: 18 }} />, colorClass: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30' },
      '🧠': { icon: <BrainIcon sx={{ fontSize: 18 }} />, colorClass: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30' },
      '✨': { icon: <SparklesIcon sx={{ fontSize: 18 }} />, colorClass: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30' },
      '📚': { icon: <BookIcon sx={{ fontSize: 18 }} />, colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30' },
      '🎓': { icon: <SchoolIcon sx={{ fontSize: 18 }} />, colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' },
      '🔬': { icon: <ScienceIcon sx={{ fontSize: 18 }} />, colorClass: 'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30' },
      '🎨': { icon: <PaletteIcon sx={{ fontSize: 18 }} />, colorClass: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30' },
      '🎵': { icon: <MusicIcon sx={{ fontSize: 18 }} />, colorClass: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30' },
      '⚽': { icon: <SportsIcon sx={{ fontSize: 18 }} />, colorClass: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' },
      '🎉': { icon: <CelebrationIcon sx={{ fontSize: 18 }} />, colorClass: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30' },
      '⚠️': { icon: <WarningIcon sx={{ fontSize: 18 }} />, colorClass: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30' },
      'ℹ️': { icon: <InfoIcon sx={{ fontSize: 18 }} />, colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' },
    };
    
    return iconMap[emoji] || null;
  };

  // Process text to replace emojis with icon components
  const processText = (text: string) => {
    const parts: (string | React.ReactElement)[] = [];
    let currentText = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const twoChar = text.slice(i, i + 2);
      
      // Check for two-character emojis first
      const iconData = getIconForEmoji(twoChar) || getIconForEmoji(char);
      
      if (iconData) {
        // Push accumulated text
        if (currentText) {
          parts.push(currentText);
          currentText = '';
        }
        
        // Push icon component
        parts.push(
          <span 
            key={`icon-${i}`}
            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${iconData.colorClass} mr-2 flex-shrink-0`}
          >
            {iconData.icon}
          </span>
        );
        
        // Skip next character if it was a two-character emoji
        if (getIconForEmoji(twoChar)) {
          i++;
        }
      } else {
        currentText += char;
      }
    }
    
    // Push remaining text
    if (currentText) {
      parts.push(currentText);
    }
    
    return parts;
  };

  // Custom components for ReactMarkdown
  const components = {
    p: ({ children, ...props }: any) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return processText(child);
        }
        return child;
      });
      
      return <p {...props}>{processedChildren}</p>;
    },
    strong: ({ children, ...props }: any) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return processText(child);
        }
        return child;
      });
      
      return <strong {...props}>{processedChildren}</strong>;
    },
    li: ({ children, ...props }: any) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return processText(child);
        }
        return child;
      });
      
      return <li {...props}>{processedChildren}</li>;
    },
  };

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default EnhancedMarkdown;
