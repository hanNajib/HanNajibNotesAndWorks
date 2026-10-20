import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Jakarta"
    });
};

const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
}

export default function Feed({ posts }) {
    const [currentFilter, setCurrentFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [liveViews, setLiveViews] = useState({})

    useEffect(() => {
        async function fetchLatestViews() {
            try {
                const { data, error } = await supabase
                    .from('post_views')
                    .select('post_id, views');

                if (!error && data) {
                    const viewsMap = data.reduce((acc, curr) => {
                        acc[curr.post_id] = curr.views;
                        return acc;
                    }, {});
                    setLiveViews(viewsMap);
                }
            } catch (err) {
                console.error("Gagal memuat live views:", err);
            }
        }
        fetchLatestViews();
    }, []);

    const filteredPosts = posts.filter(post => {
        const matchCategory = currentFilter === 'all'
            ? post.category !== 'snap'
            : post.category === currentFilter;

        const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchCategory && matchSearch;
    });



    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex space-x-1 border-b sm:border-b-0 border-zinc-200 dark:border-zinc-800 pb-2 sm:pb-0 overflow-x-auto whitespace-nowrap scrollbar-none">
                    {['all', 'note', 'work', 'til', 'snap'].map((category) => (
                        <button key={category} onClick={() => setCurrentFilter(category)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all border border-transparent capitalize cursor-pointer ${currentFilter === category ? 'text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-900' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'}`}>
                            {category === 'all' ? 'Semua' : category === 'note' ? 'Notes' : category === 'work' ? 'Works' : category === 'til' ? 'TIL' : category === 'snap' ? 'Snaps' : category}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-64">
                    <svg className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" placeholder='Cari tulisan atau tag...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all text-zinc-800 dark:text-zinc-200' />
                </div>
            </div>

            {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                    <svg className="w-8 h-8 text-zinc-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-sm text-zinc-500">Tidak ada data yang cocok.</p>
                </div>
            ) : currentFilter === 'snap' ? (
                <div className="columns-1 sm:columns-2 md:columns-3 gap-6 [column-fill:_balance]">
                    {filteredPosts.map((post) => {
                        const targetUrl = `/snaps/${post.slug}`;
                        return (
                            <div 
                                key={post.id} 
                                className="break-inside-avoid mb-8 group cursor-pointer"
                            >
                                <a href={targetUrl} className="block">
                                    <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50 dark:bg-zinc-900/50 shadow-sm hover:shadow-md transition-all duration-300 relative">
                                        {post.image ? (
                                            <img 
                                                src={post.image} 
                                                alt={post.title} 
                                                className="w-full h-auto object-cover group-hover:scale-[1.015] transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="h-48 flex items-center justify-center text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-900 font-mono text-xs">
                                                No visual snap
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/5 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <div className="mt-3 px-1">
                                        <h4 className="font-bold text-sm md:text-base text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors line-clamp-2 leading-snug tracking-tight">
                                            {post.title}
                                        </h4>
                                        <div className="flex items-center space-x-1.5 mt-1.5 text-[10px] md:text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                                            <span>{formatDate(post.created_at)}</span>
                                            <span>&bull;</span>
                                            <span>{liveViews[post.id] !== undefined ? liveViews[post.id] : (post.views || 0)} views</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-12">
                    {filteredPosts.map((post, index) => {
                        const targetUrl = `/${post.category === 'note' ? 'notes/' : post.category === 'work' ? 'works/' : post.category === 'til' ? 'til/' : post.category === 'snap' ? 'snaps/' : ''}${post.slug}`;
                        return (
                            <article key={post.id} className="group border-b border-zinc-100 dark:border-zinc-900 pb-10 transition-all hover:border-zinc-300 dark:hover:border-zinc-700" >
                                <a href={targetUrl} className="block">
                                    <div className="flex items-center space-x-2 text-xs text-zinc-400 dark:text-zinc-500 font-mono mb-2 uppercase tracking-wider flex-wrap">
                                        <span className="font-bold text-zinc-650 dark:text-zinc-300">{post.category}</span>
                                        <span>&bull;</span>
                                        <span>{formatDate(post.created_at)}</span>
                                        <span>&bull;</span>
                                        <span>{post.read_time} min read</span>
                                        <span>&bull;</span>
                                        <span>{liveViews[post.id] !== undefined ? liveViews[post.id] : (post.views || 0)} views</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors tracking-tight mb-2">
                                        {post.title}
                                    </h3>
                                    {post.image && (
                                        <div className={`mb-4 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 ${
                                            post.cover_display === 'full' ? 'max-h-96 flex items-center justify-center' : 'max-h-72'
                                        }`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                loading={index < 2 ? 'eager' : 'lazy'}
                                                className={`w-full group-hover:scale-[1.01] transition-transform duration-500 ${
                                                    post.cover_display === 'full'
                                                        ? 'h-auto max-h-96 object-contain'
                                                        : post.cover_display === 'top'
                                                        ? 'h-full object-cover object-top max-h-72'
                                                        : post.cover_display === 'bottom'
                                                        ? 'h-full object-cover object-bottom max-h-72'
                                                        : 'h-full object-cover object-center max-h-72'
                                                }`}
                                            />
                                        </div>
                                    )}
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                                        {stripHtml(post.content)}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-zinc-400">
                                        <span className="font-mono text-xs">
                                            {post.tags.map(tag => `#${tag.toLowerCase()}`).join(' ')}
                                        </span>
                                    </div>
                                </a>
                            </article>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
