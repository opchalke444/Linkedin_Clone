import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { OpportunityItem } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { opportunityApi } from '../../api/opportunity.api';
import { useToast } from '../../contexts/ToastContext';

interface OpportunityCardProps {
  opportunity: OpportunityItem;
  onApplySuccess?: () => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onApplySuccess,
}) => {
  const [hasApplied, setHasApplied] = useState(opportunity.hasApplied);
  const [isApplying, setIsApplying] = useState(false);
  const { success, error } = useToast();

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await opportunityApi.applyToOpportunity(opportunity.id);
      setHasApplied(true);
      success(`Successfully submitted application for ${opportunity.title} at ${opportunity.company}!`);
      if (onApplySuccess) onApplySuccess();
    } catch (err: any) {
      error(err.message || 'Failed to submit application.');
    } finally {
      setIsApplying(false);
    }
  };

  const getMatchBadgeVariant = (score: number) => {
    if (score >= 70) return 'emerald';
    if (score >= 40) return 'sky';
    return 'slate';
  };

  return (
    <div className="bg-white dark:bg-[#1d2226] rounded-2xl p-6 border border-slate-200/80 dark:border-[#383b40] shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
      {/* Title & Match Score Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {opportunity.title}
            </h3>
            <Badge variant="indigo" size="sm">
              {opportunity.type}
            </Badge>
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{opportunity.company}</p>
        </div>

        {/* Feature 3: Rule-Based Skill Match Badge */}
        <div className="flex-shrink-0">
          <Badge
            variant={getMatchBadgeVariant(opportunity.matchScore)}
            size="md"
            className="font-bold py-1 px-3 text-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Skill Match: {opportunity.matchScore}%
          </Badge>
        </div>
      </div>

      {/* Meta tags */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          {opportunity.location}
        </span>
        {opportunity.stipend && (
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            {opportunity.stipend}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          {opportunity.experienceLevel}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {opportunity.description}
      </p>

      {/* Rule-Based Skills Breakdown */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#282c31] border border-slate-100 dark:border-[#383b40] space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
          <span>Requirement Evaluation</span>
          <span className="text-teal-700 dark:text-teal-400">
            {opportunity.matchingSkills.length} of{' '}
            {opportunity.matchingSkills.length + opportunity.missingSkills.length} criteria met
          </span>
        </div>

        {/* Matching Skills */}
        {opportunity.matchingSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium mr-1">Matching:</span>
            {opportunity.matchingSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        )}

        {/* Missing Skills */}
        {opportunity.missingSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium mr-1">Can Add:</span>
            {opportunity.missingSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
              >
                + {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-[#383b40]">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">
          Rule-based skill matching engine • Not an AI prediction
        </span>

        {hasApplied ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
            Applied
          </div>
        ) : (
          <Button
            size="sm"
            variant="primary"
            isLoading={isApplying}
            onClick={handleApply}
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Easy Apply
          </Button>
        )}
      </div>
    </div>
  );
};
