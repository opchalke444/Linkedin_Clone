import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Sparkles, Globe, Users, Briefcase } from 'lucide-react';
import { Button } from '../components/common/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[#0a66c2] dark:text-[#70b5f9] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About LinkedIn Clone</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          Connecting the World's Professionals
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          A high-fidelity full-stack clone of LinkedIn built with React, Node.js, Express, PostgreSQL, Prisma ORM, and Socket.IO.
        </p>
      </div>

      {/* Tech Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-lg bg-white dark:bg-[#1d2226] border border-[#e0dfdc] dark:border-[#383b40] shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#0a66c2] dark:text-[#70b5f9] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Authentic LinkedIn Interface</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Faithfully recreated LinkedIn desktop and mobile experience: 3-column feed, official navigation bar, reaction picker with microinteractions, member profiles with #OpenToWork, and real-time chat.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-white dark:bg-[#1d2226] border border-[#e0dfdc] dark:border-[#383b40] shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Relational PostgreSQL & Prisma</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Backed by a normalized PostgreSQL schema with Prisma ORM. Models users, profiles, work experiences, educations, skills, connection networks, feed posts, reactions, and nested comments.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-white dark:bg-[#1d2226] border border-[#e0dfdc] dark:border-[#383b40] shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-md bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Real-Time Socket.IO Messaging</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Direct 1-on-1 messaging, online presence indicators, and instant notification dispatches powered by WebSockets with persistent message histories.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-white dark:bg-[#1d2226] border border-[#e0dfdc] dark:border-[#383b40] shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Jobs & Opportunity Matching</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Rule-based skill matching engine that compares registered candidate skills against job requirements, calculating overlap percentages and Easy Apply functionality.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link to="/feed">
          <Button variant="primary" size="md">
            Go to LinkedIn Home Feed
          </Button>
        </Link>
      </div>
    </div>
  );
};
