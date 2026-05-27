/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  History, 
  Trash2, 
  CheckCircle, 
  MoreVertical, 
  X, 
  UserCheck, 
  Bookmark, 
  Clock, 
  Filter 
} from 'lucide-react';
import { Talent, Engagement } from '../types';
import { INITIAL_TALENTS, INITIAL_ENGAGEMENTS } from '../data';

interface ClientPortalProps {
  onReviewSubmit?: (reviewData: { id: string; score: number; notes: string }) => void;
}

export default function ClientPortal({ onReviewSubmit }: ClientPortalProps) {
  const [talents, setTalents] = useState<Talent[]>(INITIAL_TALENTS);
  const [engagements, setEngagements] = useState<Engagement[]>(INITIAL_ENGAGEMENTS);
  
  // Feedback modal states
  const [selectedEngagement, setSelectedEngagement] = useState<Engagement | null>(null);
  const [ratingVal, setRatingVal] = useState(4);
  const [reviewText, setReviewText] = useState('');
  const [tempRatingHover, setTempRatingHover] = useState<number | null>(null);

  // Filter state
  const [filterActive, setFilterActive] = useState(false);

  // Manage Bookmarks
  const handleRemoveBookmark = (id: string) => {
    setTalents(prev => prev.filter(t => t.id !== id));
  };

  // Open feedback modal
  const openFeedback = (eng: Engagement) => {
    setSelectedEngagement(eng);
    setRatingVal(5);
    setReviewText('');
  };

  // Close modal
  const closeFeedback = () => {
    setSelectedEngagement(null);
  };

  // Handle feedback submission
  const handleSubmitFeedback = () => {
    if (!selectedEngagement) return;

    // Update locally
    setEngagements(prev => 
      prev.map(eng => {
        if (eng.id === selectedEngagement.id) {
          return {
            ...eng,
            reviewed: true,
            score: ratingVal,
            reviewNotes: reviewText
          };
        }
        return eng;
      })
    );

    if (onReviewSubmit) {
      onReviewSubmit({
        id: selectedEngagement.id,
        score: ratingVal,
        notes: reviewText
      });
    }

    closeFeedback();
  };

  // Toggle filter
  const toggleAvailableOnly = () => {
    setFilterActive(!filterActive);
  };

  const displayedTalents = filterActive 
    ? talents.filter(t => t.status === 'Available Now')
    : talents;

  return (
    <div className="flex-1 font-sans text-on-surface bg-surface min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tight mb-2">Talent Registry</h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-xl leading-relaxed">
          Manage your curated network, historical engagements, and verify work quality parameters.
        </p>
      </header>

      {/* Bookmarked Talent Database */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span>Bookmarked Talent</span>
          </h2>
          <div className="flex gap-2">
            <span className="bg-surface-container-high px-3 py-1 rounded-lg text-xs font-mono border border-border-dark flex items-center gap-1.5 text-on-surface">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>{talents.length} CURATED</span>
            </span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {displayedTalents.map((talent) => (
              <motion.div
                key={talent.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bento-card bg-surface-container-lowest border border-border-dark p-bento-padding rounded-xl group relative overflow-hidden"
              >
                {/* Image Frame */}
                <div className="relative mb-4 aspect-square bg-surface-container rounded-lg overflow-hidden border border-border-dark">
                  <img 
                    alt={talent.name} 
                    src={talent.imageUrl}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded bg-surface/80 backdrop-blur-md border text-[10px] font-mono font-bold uppercase tracking-wider ${
                    talent.status === 'Available Now' 
                      ? 'border-emerald-500/30 text-emerald-500' 
                      : 'border-zinc-700 text-on-surface-variant'
                  }`}>
                    {talent.status}
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight mb-1 group-hover:text-primary transition-colors">
                      {talent.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-4">{talent.title}</p>
                  </div>
                  <button 
                    onClick={() => handleRemoveBookmark(talent.id)}
                    className="text-zinc-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all pointer-events-auto cursor-pointer"
                    title="Remove from bookmarks"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Score / Metrics */}
                <div className="grid grid-cols-2 gap-2 border-t border-border-dark pt-4 font-sans">
                  <div>
                    <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider mb-0.5">Success Rate</p>
                    <p className="text-sm font-bold text-primary font-mono">{talent.successRate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider mb-0.5">Experience</p>
                    <p className="text-sm font-bold text-white font-mono">{talent.experience}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Engagement History */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <span>Engagement History</span>
          </h2>
          <button 
            onClick={toggleAvailableOnly}
            className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              filterActive 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'bg-surface-container-low border-border-dark hover:bg-surface-container-high'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{filterActive ? 'Showing Available' : 'Filter Available'}</span>
          </button>
        </div>

        <div className="bg-surface-container shadow-sm border border-border-dark rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead className="bg-surface-container-low border-b border-border-dark font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-normal">Project ID</th>
                  <th className="px-6 py-4 font-normal">Talent</th>
                  <th className="px-6 py-4 font-normal">Date Closed</th>
                  <th className="px-6 py-4 font-normal">Deliverable Status</th>
                  <th className="px-6 py-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark font-sans text-xs">
                {engagements.map((eng) => (
                  <tr key={eng.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-zinc-400 font-medium">
                      {eng.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-container-lowest border border-border-dark flex items-center justify-center font-bold text-primary font-sans">
                          {eng.talentName[0]}
                        </div>
                        <span className="font-semibold text-white text-sm">{eng.talentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {eng.dateClosed}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-emerald-500 font-bold uppercase tracking-wider text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>COMPLETED</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {eng.reviewed ? (
                        <div className="flex items-center justify-end gap-2 pr-2">
                          <span className="text-on-surface-variant italic font-medium">Reviewed</span>
                          <span className="text-primary font-mono font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-primary text-primary" /> {eng.score}/5
                          </span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => openFeedback(eng)}
                          className="bg-primary hover:brightness-110 text-on-primary px-4 py-1.5 rounded font-bold uppercase tracking-wider text-[11px] transition-all cursor-pointer shadow-[0_0_10px_rgba(78,222,163,0.15)] active:scale-95"
                        >
                          Rate &amp; Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Review Feedback Modal */}
      <AnimatePresence>
        {selectedEngagement && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeFeedback}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />

            {/* Content Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-surface-container border border-border-dark rounded-xl w-full max-w-md p-bento-padding shadow-2xl relative z-10 font-sans"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white tracking-tight">Evaluate Engagement</h3>
                <button 
                  onClick={closeFeedback}
                  className="text-on-surface-variant hover:text-white p-1 rounded-lg hover:bg-surface-container-high transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                Detail your project alignment with <span className="text-primary font-bold">{selectedEngagement.talentName}</span> for secure network indexing.
              </p>

              <div className="space-y-6">
                {/* Rating system */}
                <div>
                  <label className="block text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mb-2 font-bold">
                    Performance Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = tempRatingHover !== null ? star <= tempRatingHover : star <= ratingVal;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setTempRatingHover(star)}
                          onMouseLeave={() => setTempRatingHover(null)}
                          onClick={() => setRatingVal(star)}
                          className="text-primary hover:scale-115 transition-transform cursor-pointer"
                        >
                          <Star 
                            className={`w-7 h-7 ${isActive ? 'fill-primary text-primary' : 'text-zinc-600'}`} 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mb-2 font-bold">
                    Private Notes
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    placeholder="Describe specific milestone achievements, task management alignment, or code quality standards..."
                    className="w-full bg-surface-container-lowest border border-border-dark rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-all resize-none placeholder:text-zinc-600 focus:ring-0"
                  />
                </div>

                {/* Submit trigger */}
                <button
                  type="button"
                  onClick={handleSubmitFeedback}
                  className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold uppercase tracking-wider text-xs hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(78,222,163,0.2)] cursor-pointer"
                >
                  Submit Final Evaluation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
