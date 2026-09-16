"use client";

import React, { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { mockCommunityPosts, CommunityPost } from '@/lib/mockData';
import { 
  ThumbsUp, Flag, Camera, Shield, AlertTriangle, 
  MessageSquare, CheckCircle, Calendar, User, Send, Star, LogIn, Lock
} from 'lucide-react';

type FilterTab = 'all' | 'hygiene_report' | 'review' | 'whistleblow';

export default function CommunityFeed() {
  const { locale } = useLocale();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const isSw = locale === 'sw';
  
  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [upvotedPosts, setUpvotedPosts] = useState<Record<string, boolean>>({});

  /* Review Form State */
  const [restaurantName, setRestaurantName] = useState('');
  const [postType, setPostType] = useState<'review' | 'hygiene_report' | 'whistleblow'>('review');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredPosts = activeTab === 'all' 
    ? posts 
    : posts.filter(post => post.type === activeTab);

  const handleUpvote = (id: string) => {
    setUpvotedPosts(prev => {
      const current = !!prev[id];
      setPosts(pList =>
        pList.map(p => (p.id === id ? { ...p, upvotes: p.upvotes + (current ? -1 : 1) } : p))
      );
      return { ...prev, [id]: !current };
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newPost: CommunityPost = {
        id: `cp-user-${Date.now()}`,
        author: user?.name || (isSw ? 'Mlaaji' : 'Diner'),
        restaurantName: restaurantName || 'Arusha Eatery',
        restaurantId: 'r-aru-001',
        content: content,
        contentSw: content,
        type: postType,
        rating,
        upvotes: 1,
        date: new Date().toISOString().split('T')[0],
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
        verified: true,
      };

      setPosts([newPost, ...posts]);
      setContent('');
      setRestaurantName('');
      setIsSubmitting(false);
      setIsFormOpen(false);
    }, 600);
  };

  const getBadgeColors = (type: string) => {
    switch(type) {
      case 'hygiene_report': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700';
      case 'whistleblow': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-300 dark:border-red-700';
      case 'review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getBadgeIcon = (type: string) => {
    switch(type) {
      case 'hygiene_report': return <Shield className="w-3.5 h-3.5 mr-1 text-emerald-500" />;
      case 'whistleblow': return <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-500" />;
      case 'review': return <MessageSquare className="w-3.5 h-3.5 mr-1 text-amber-500" />;
      default: return null;
    }
  };

  const getBadgeLabel = (type: string) => {
    switch(type) {
      case 'hygiene_report': return isSw ? 'Ripoti ya Usafi' : 'Hygiene Audit';
      case 'whistleblow': return isSw ? 'Fichua' : 'Whistleblow';
      case 'review': return isSw ? 'Mapitio' : 'Diner Review';
      default: return type;
    }
  };

  return (
    <section id="community" className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Shield className="w-3.5 h-3.5" />
            {isSw ? "Jamii ya Arusha" : "Crowdsourced Hygiene Transparency"}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            {isSw ? "Mlisho wa Usafi na Mapitio" : "Community Hygiene & Review Feed"}
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {isSw 
              ? "Soma na ushirikishe mapitio halisi ya usafi kutoka kwa walaji wa Arusha kote Ngarenaro, Majengo, Mnara wa Saa na Njiro."
              : "Read authentic hygiene audits and diner reviews across Ngarenaro, Majengo, Clock Tower & Njiro."}
          </p>
        </div>

        {/* ── Sign-In Protected Review Prompt ── */}
        <div className="mb-10">
          {!isAuthenticated ? (
            /* Unauthenticated Visitor Banner */
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 dark:from-slate-900 dark:to-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-xl text-center flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
              
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 border border-amber-500/30">
                <Lock className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-extrabold text-white mb-2">
                {isSw ? "Ingia ili Uandike Mapitio na Rating" : "Sign In Required to Post Reviews & Ratings"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mb-5">
                {isSw
                  ? "Ili kulinda uwazi na kuzuia mapitio ya kughushi, unahitaji kuingia akaunti kabla ya kuweka ripoti ya usafi au rating ya mgahawa."
                  : "To guarantee authentic feedback, users must be signed in before submitting hygiene reports or star ratings for Arusha eateries."}
              </p>

              <button
                onClick={() => openAuthModal('signin')}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-sm"
              >
                <LogIn className="w-4 h-4" />
                {isSw ? "Ingia Sasa Ili Uandike Mapitio" : "Sign In to Write a Review"}
              </button>
            </div>
          ) : (
            /* Authenticated User Submit Button & Form */
            <div>
              <div>
                {user?.role === 'diner' ? (
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{isSw ? "Umeingia kama" : "Signed in as"}</p>
                        <p className="text-sm font-extrabold text-slate-900 dark:text-amber-400">{user?.name}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsFormOpen(!isFormOpen)}
                      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-xs shadow-md shadow-amber-500/20"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {isFormOpen ? (isSw ? "Funga Fomu" : "Close Form") : (isSw ? "Andika Mapitio Mapya" : "Post New Review")}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-amber-600 dark:text-amber-300">{isSw ? "Wamiliki hawana ruhusa ya kutuma mapitio." : "Owners are not permitted to submit reviews."}</p>
                )}
              </div>

              {/* Collapsible Submission Form */}
              {isFormOpen && (
                <form onSubmit={handleCreatePost} className="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    {isSw ? "Wasilisha Mapitio ya Mgahawa wa Arusha" : "Submit Arusha Eatery Hygiene Review"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">{isSw ? "Jina la Mgahawa" : "Restaurant Name"}</label>
                      <input 
                        type="text" 
                        required
                        value={restaurantName}
                        onChange={e => setRestaurantName(e.target.value)}
                        placeholder="e.g. Mama Zawadi's Kitchen, Ngarenaro" 
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white text-xs font-medium" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">{isSw ? "Aina ya Ripoti" : "Report Type"}</label>
                      <select 
                        value={postType}
                        onChange={e => setPostType(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white text-xs font-medium"
                      >
                        <option value="review">{isSw ? "Mapitio ya Mlaaji (Review)" : "Diner Review"}</option>
                        <option value="hygiene_report">{isSw ? "Ripoti ya Usafi (Hygiene Audit)" : "Hygiene Audit Report"}</option>
                        <option value="whistleblow">{isSw ? "Fichua Mapungufu (Whistleblow)" : "Hygiene Whistleblow"}</option>
                      </select>
                    </div>
                  </div>

                  {/* Star Rating Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">{isSw ? "Ukadiriaji wa Nyota" : "Star Rating"}</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1.5 transition-transform hover:scale-110"
                        >
                          <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-700'}`} />
                        </button>
                      ))}
                      <span className="text-xs font-extrabold text-amber-500 ml-2">{rating} / 5 Stars</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">{isSw ? "Maelezo ya Usafi au Uzoefu" : "Hygiene Experience & Feedback"}</label>
                    <textarea 
                      rows={3} 
                      required
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      placeholder={isSw ? "Eleza usafi wa jiko, kachumbari, maji ya kunawa mikono..." : "Describe kitchen cleanliness, food storage, water stations..."} 
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white text-xs font-medium"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs shadow-md shadow-amber-500/20"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? (isSw ? "Inawasilisha..." : "Submitting...") : (isSw ? "Wasilisha Mapitio" : "Post Review & Rating")}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
          {[
            { id: 'all', label: isSw ? 'Yote' : 'All Posts' },
            { id: 'hygiene_report', label: isSw ? 'Ripoti za Usafi' : 'Hygiene Audits' },
            { id: 'review', label: isSw ? 'Mapitio' : 'Diner Reviews' },
            { id: 'whistleblow', label: isSw ? 'Fichua' : 'Whistleblow' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FilterTab)}
              className={`whitespace-nowrap px-4 py-2 font-extrabold text-xs transition-colors relative ${
                activeTab === tab.id 
                  ? 'text-amber-500' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Feed Posts */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div 
              key={post.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:border-amber-500/40"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{post.author}</h4>
                      {post.verified && (
                        <span className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3 mr-0.5" /> Verified Diner
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-amber-500">{post.restaurantName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold ${getBadgeColors(post.type)}`}>
                    {getBadgeIcon(post.type)}
                    {getBadgeLabel(post.type)}
                  </span>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < post.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-700'}`} 
                  />
                ))}
                <span className="text-xs font-bold text-slate-500 ml-1.5">{post.date}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {isSw ? post.contentSw : post.content}
              </p>

              {/* Upvote & Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    upvotedPosts[post.id]
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
>
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.upvotes} {isSw ? "Wanaofaa" : "Helpful"}</span>
                </button>

                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1">
                  <Flag className="w-3.5 h-3.5" />
                  <span>{isSw ? "Ripoti" : "Flag"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
