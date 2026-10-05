import React from 'react';
import { QUICK_LINKS } from '../data/quickLinks';
import { Globe, Eye, BookOpen, Wand2, ExternalLink, ArrowUpRight } from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Globe,
  Eye,
  BookOpen,
  Wand2,
};

export const QuickLinks: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-bg-secondary">
          My Links
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_LINKS.map((link) => {
          const IconComponent = ICON_MAP[link.iconName] || Globe;

          return (
            <a
              key={link.id}
              href={link.url}
              target={link.isExternal ? '_blank' : '_self'}
              rel={link.isExternal ? 'noopener noreferrer' : undefined}
              className="group flex items-center justify-between p-3 bg-white/80 dark:bg-[#142438]/80 hover:bg-white dark:hover:bg-[#142438] rounded-xl border border-[#1B3D5F]/10 dark:border-slate-800 hover:border-[#99BFF9] dark:hover:border-[#99BFF9] shadow-2xs hover:shadow-xs transition-all duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] dark:bg-slate-800 text-[#1B3D5F] dark:text-[#99BFF9] group-hover:bg-[#99BFF9]/20 flex items-center justify-center shrink-0 transition-colors">
                  <IconComponent className="w-4 h-4 stroke-[2]" />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#1B3D5F] dark:text-slate-100 truncate group-hover:text-[#28537D] dark:group-hover:text-[#99BFF9] transition-colors">
                    {link.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-editorial italic truncate">
                    {link.description}
                  </div>
                </div>
              </div>

              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1B3D5F] dark:group-hover:text-slate-200 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
            </a>
          );
        })}
      </div>
    </div>
  );
};
