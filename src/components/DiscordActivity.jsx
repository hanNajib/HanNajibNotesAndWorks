import { useEffect, useMemo, useRef, useState } from "react";

const DISCORD_ID = "734571877162549262";
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

const statusColors = {
    online: "bg-emerald-500",
    idle: "bg-amber-500",
    dnd: "bg-red-500",
    offline: "bg-zinc-400 dark:bg-zinc-600",
};

const activityLabels = {
    0: "Playing",
    1: "Streaming",
    2: "Listening to",
    3: "Watching",
    4: "Custom",
    5: "Competing in",
};

function getAssetUrl(asset, userId, applicationId) {
    if (!asset) return null;
    if (asset.startsWith("mp:")) {
        return `https://media.discordapp.net/${asset.slice(3)}`;
    }
    if (asset.startsWith("http")) return asset;
    if (applicationId) {
        return `https://cdn.discordapp.com/app-assets/${applicationId}/${asset}.png`;
    }
    if (userId) {
        return `https://cdn.discordapp.com/avatars/${userId}/${asset}.png`;
    }
    return null;
}

function getActivityText(activity) {
    if (!activity) return "No activity";
    if (activity.type === 4 && activity.state) {
    	return activity.state;
    }
    const label = activityLabels[activity.type] || "Using";
    return `${label} ${activity.name}`;
}

function formatTime(ms) {
    if (!ms || ms < 0) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
	
    if (hours > 0) {
    	return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatElapsedTime(startTimestamp) {
    if (!startTimestamp) return null;
    const now = Date.now();
    const elapsed = now - startTimestamp;
    return formatTime(elapsed);
}

export default function DiscordActivity() {
    const [payload, setPayload] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activityIndex, setActivityIndex] = useState(0);
    const [error, setError] = useState(false);
    const [spotifyProgress, setSpotifyProgress] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [elapsedTime, setElapsedTime] = useState("");
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [overflowDistance, setOverflowDistance] = useState(0);

    const hasAutoCollapsedRef = useRef(false);
    const textContainerRef = useRef(null);
    const textSpanRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const fetchActivity = async () => {
            try {
                const response = await fetch(LANYARD_URL);
                if (!response.ok) throw new Error(`Lanyard status: ${response.status}`);
                const result = await response.json();
                if (isMounted) {
                    setPayload(result.data);
                    setError(false);
                }
            } catch (fetchError) {
                console.error("Gagal memuat Discord activity:", fetchError);
                if (isMounted) setError(true);
            }
        };

        fetchActivity();
        const intervalId = window.setInterval(fetchActivity, 15000);
        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
        };
    }, []);

    const activities = useMemo(() => {
        if (!payload) return [];
        const spotifyActivity = payload.listening_to_spotify && payload.spotify
            ? [{ kind: "spotify", ...payload.spotify }]
            : [];
        const otherActivities = (payload.activities || [])
            .filter((activity) => activity.name !== "Spotify")
            .map((activity) => ({ kind: "discord", ...activity }));
        return [...spotifyActivity, ...otherActivities];
    }, [payload]);

    const currentActivity = activities[activityIndex];
    const isSpotify = currentActivity?.kind === "spotify";
    const isCustomStatus = currentActivity?.type === 4;
    const activityTitle = isSpotify
        ? `Listening to ${currentActivity.song}`
        : getActivityText(currentActivity);

    useEffect(() => {
        if (activityIndex >= activities.length) setActivityIndex(0);
    }, [activities.length, activityIndex]);

    // Auto-collapse intro: hanya jalan 1x di awal setelah 5 detik jika user belum berinteraksi
    useEffect(() => {
        if (hasAutoCollapsedRef.current || hasUserInteracted || isOpen) return;

        const collapseTimer = window.setTimeout(() => {
            setIsCollapsed(true);
            hasAutoCollapsedRef.current = true;
        }, 5000);

        return () => window.clearTimeout(collapseTimer);
    }, [isOpen, hasUserInteracted]);

    // Hitung jarak overflow teks jika teks lebih panjang dari lebar pill
    useEffect(() => {
        if (!textSpanRef.current || !textContainerRef.current || isCollapsed) {
            setOverflowDistance(0);
            return;
        }

        const measureOverflow = () => {
            if (!textSpanRef.current || !textContainerRef.current) return;
            const scrollW = textSpanRef.current.scrollWidth;
            const clientW = textContainerRef.current.clientWidth;

            if (scrollW > clientW + 2) {
                setOverflowDistance(scrollW - clientW);
            } else {
                setOverflowDistance(0);
            }
        };

        // Beri jeda 350ms agar animasi transisi lebar pill selesai sebelum diukur
        const timer = window.setTimeout(measureOverflow, 350);
        return () => window.clearTimeout(timer);
    }, [activityTitle, isCollapsed, activityIndex]);

    // Auto-rotate activities: tunggu teks selesai bergulir + jeda 2 detik di akhir sebelum berganti
    useEffect(() => {
        if (activities.length <= 1 || isOpen) return;

        // Jika teks overflow, tunggu 8 detik (2s awal + 4s scroll + 2s akhir). Jika teks pendek, 5 detik.
        const displayDuration = overflowDistance > 0 ? 8000 : 5000;

        let transitionTimer;
        const rotateTimer = window.setTimeout(() => {
            setIsTransitioning(true);
            transitionTimer = window.setTimeout(() => {
                setActivityIndex((i) => (i + 1) % activities.length);
                setIsTransitioning(false);
            }, 200);
        }, displayDuration);

        return () => {
            window.clearTimeout(rotateTimer);
            if (transitionTimer) window.clearTimeout(transitionTimer);
        };
    }, [activities.length, isOpen, activityIndex, overflowDistance]);

    // Update Spotify progress bar
    useEffect(() => {
        const currentActivity = activities[activityIndex];
        if (!currentActivity || currentActivity.kind !== "spotify" || !currentActivity.timestamps) {
            return;
        }

        const updateProgress = () => {
            const now = Date.now();
            const { start, end } = currentActivity.timestamps;
            const elapsed = Math.max(0, now - start);
            const total = end - start;
            const progress = total > 0 ? Math.min(100, (elapsed / total) * 100) : 0;
            setSpotifyProgress(progress);
        };

        updateProgress();
        const progressInterval = window.setInterval(updateProgress, 1000);
        return () => window.clearInterval(progressInterval);
    }, [activities, activityIndex]);

    // Update elapsed time for all activities
    useEffect(() => {
        const currentActivity = activities[activityIndex];
        if (!currentActivity || !currentActivity.timestamps?.start) {
            setElapsedTime("");
            return;
        }

        const updateElapsed = () => {
            const formatted = formatElapsedTime(currentActivity.timestamps.start);
            setElapsedTime(formatted || "");
        };

        updateElapsed();
        const elapsedInterval = window.setInterval(updateElapsed, 1000);
        return () => window.clearInterval(elapsedInterval);
    }, [activities, activityIndex]);

    const changeActivity = (direction) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setActivityIndex((i) =>
                direction === "next"
                    ? (i + 1) % activities.length
                    : (i - 1 + activities.length) % activities.length
            );
            setIsTransitioning(false);
        }, 200);
    };

    if (!payload || error) return null;

    const status = payload.discord_status || "offline";
    const activityImage = isSpotify
        ? currentActivity.album_art_url
        : getAssetUrl(
            currentActivity?.assets?.large_image,
            payload.discord_user?.id,
            currentActivity?.application_id
        );
    const avatarUrl = payload.discord_user?.avatar
        ? `https://cdn.discordapp.com/avatars/${payload.discord_user.id}/${payload.discord_user.avatar}.png?size=64`
        : null;

    const getActivityLink = () => {
        if (!currentActivity) return null;
		
        if (isSpotify && currentActivity.track_id) {
            return `https://open.spotify.com/track/${currentActivity.track_id}`;
        }
		
        // YouTube link - extract video ID from thumbnail URL in large_image
        if (currentActivity.name === "YouTube" && currentActivity.assets?.large_image) {
            const thumbnailUrl = currentActivity.assets.large_image;
            // Pattern: i.ytimg.com/vi/{VIDEO_ID}/
            const thumbnailMatch = thumbnailUrl.match(/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]{11})\//);
            if (thumbnailMatch) {
            	return `https://www.youtube.com/watch?v=${thumbnailMatch[1]}`;
            }
        }
		
        if (currentActivity.name === "YouTube" && currentActivity.sync_id) {
            return `https://www.youtube.com/watch?v=${currentActivity.sync_id}`;
        }
		
        if (currentActivity.name === "YouTube") {
            const detailsOrState = currentActivity.details || currentActivity.state || "";
            const youtubeMatch = detailsOrState.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            if (youtubeMatch) {
            	return `https://www.youtube.com/watch?v=${youtubeMatch[1]}`;
            }
        }
		
        return null;
    };

    const activityLink = getActivityLink();

    const getSpotifyTime = () => {
        if (!currentActivity || currentActivity.kind !== "spotify" || !currentActivity.timestamps) {
            return { current: "0:00", total: "0:00" };
        }
        const now = Date.now();
        const elapsed = Math.max(0, now - currentActivity.timestamps.start);
        const total = Math.max(0, currentActivity.timestamps.end - currentActivity.timestamps.start);
        return { current: formatTime(elapsed), total: formatTime(total) };
    };

    const spotifyTime = getSpotifyTime();

    return (
        <div className="fixed bottom-6 left-6 z-40 scale-90 md:scale-100">
            <button
                type="button"
                onClick={() => {
                    setHasUserInteracted(true);
                    setIsCollapsed((prev) => {
                        const next = !prev;
                        if (next) setIsOpen(false);
                        return next;
                    });
                }}
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? "Show Discord activity" : "Discord activity"}
                className={`group flex items-center gap-3 border bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-500 ease-out dark:bg-zinc-900/90 ${
                    isCollapsed
                        ? "h-12 w-12 scale-95 justify-center rounded-full border-zinc-300/50 p-1 hover:scale-100 hover:border-zinc-300 hover:shadow-2xl dark:border-zinc-700/50 dark:hover:border-zinc-700"
                        : "scale-100 rounded-xl border-zinc-200 px-3 py-2.5 hover:scale-[1.02] hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800 dark:hover:border-zinc-700"
                }`}
            >
                <div className="relative shrink-0">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt=""
                            className={`rounded-full object-cover transition-all duration-500 ${
                            	isCollapsed ? "h-10 w-10" : "h-9 w-9"
                            }`}
                        />
                    ) : (
                        <div className={`rounded-full bg-zinc-200 transition-all duration-500 dark:bg-zinc-800 ${
                            isCollapsed ? "h-10 w-10" : "h-9 w-9"
                        }`} />
                    )}
                    <span
                        className={`absolute -bottom-0.5 -right-0.5 rounded-full ring-2 ring-white transition-all duration-500 dark:ring-zinc-900 ${
                            isCollapsed ? "h-3.5 w-3.5 scale-110" : "h-3 w-3 scale-100"
                        } ${statusColors[status] || statusColors.offline}`}
                    />
                </div>
                <div
                    className={`min-w-0 overflow-hidden transition-all duration-500 ease-out ${
                        isCollapsed ? "max-w-0 opacity-0" : "max-w-[190px] opacity-100 delay-100"
                    }`}
                >
                    <div
                        className="transition-all duration-300 ease-in-out"
                        style={{
                            transform: isTransitioning ? 'translateY(-100%)' : 'translateY(0)',
                            opacity: isTransitioning ? 0 : 1
                        }}
                    >
                        <p className="font-jetmono text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-left">
                            {payload.discord_user?.username}
                        </p>
                        <div ref={textContainerRef} className="overflow-hidden w-full relative text-left">
                            <span
                                ref={textSpanRef}
                                className="inline-block whitespace-nowrap text-xs font-medium text-zinc-800 dark:text-zinc-200"
                                style={
                                    overflowDistance > 0
                                        ? {
                                            animation: activities.length > 1
                                                ? 'marqueeScrollAndPause 8s ease-in-out forwards'
                                                : 'marqueePingPong 10s ease-in-out infinite',
                                            '--overflow-dist': `-${overflowDistance}px`
                                        }
                                        : undefined
                                }
                            >
                                {activityTitle}
                            </span>
                        </div>
                    </div>
                </div>

                {!isCollapsed && (
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen((open) => !open);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                                setIsOpen((open) => !open);
                            }
                        }}
                        title={isOpen ? "Tutup detail" : "Lihat detail"}
                        className="ml-auto rounded p-1 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                    >
                        <svg
                            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-80 max-w-[calc(100vw-3rem)] animate-in rounded-xl border border-zinc-200 bg-white/95 p-4 shadow-xl backdrop-blur-sm transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900/95" style={{
                	animation: 'slideUpFadeIn 0.3s ease-out'
                }}>
                    <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt=""
                                        className="h-12 w-12 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                                    />
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                )}
                                <span
                                    className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white dark:ring-zinc-900 ${statusColors[status] || statusColors.offline}`}
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                                    {payload.discord_user?.username}
                                </p>
                                <p className="text-xs capitalize text-zinc-500 dark:text-zinc-400">
                                    {status}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg p-1 text-zinc-400 transition-all duration-200 hover:scale-110 hover:bg-zinc-100 hover:text-zinc-800 hover:rotate-90 active:scale-95 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                            aria-label="Close"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {currentActivity && (
                        <div className="overflow-hidden">
                            <div
                                className="space-y-3 transition-all duration-300 ease-out"
                                style={{
                                    transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
                                    opacity: isTransitioning ? 0 : 1
                                }}
                            >
                                <div className="flex gap-3 rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 transition-colors duration-200 hover:border-zinc-300 hover:bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-800/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-700/50">
                                    {activityImage && (
                                        activityLink ? (
                                            <a 
                                            	href={activityLink} 
                                            	target="_blank" 
                                            	rel="noopener noreferrer"
                                            	className="group/image relative shrink-0"
                                            >
                                            	<img
                                            		src={activityImage}
                                            		alt=""
                                            		className="h-16 w-16 rounded-lg object-cover transition-transform duration-300 group-hover/image:scale-105"
                                            	/>
                                            	<div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 opacity-0 transition-all duration-300 group-hover/image:bg-black/40 group-hover/image:opacity-100">
                                            		<svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            			<path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                            		</svg>
                                            	</div>
                                            </a>
                                        ) : (
                                            <img
                                            	src={activityImage}
                                            	alt=""
                                            	className="h-16 w-16 shrink-0 rounded-lg object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        )
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="mb-0.5 font-jetmono text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                            {isSpotify ? "Spotify" : isCustomStatus ? "Status" : "Activity"}
                                        </p>
                                        {activityLink ? (
                                            <a 
                                            	href={activityLink} 
                                            	target="_blank" 
                                            	rel="noopener noreferrer"
                                            	className="group/link block"
                                            >
                                            	<p 
                                                    className="line-clamp-2 break-words text-sm font-semibold text-zinc-900 transition-colors group-hover/link:text-indigo-600 dark:text-zinc-100 dark:group-hover/link:text-indigo-400"
                                                    title={isSpotify ? currentActivity.song : isCustomStatus ? currentActivity.state : currentActivity.name}
                                                >
                                            		{isSpotify ? currentActivity.song : isCustomStatus ? currentActivity.state : currentActivity.name}
                                            		<svg className="ml-1 inline h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            			<path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            		</svg>
                                            	</p>
                                            </a>
                                        ) : (
                                            <p 
                                                className="line-clamp-2 break-words text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                                                title={isSpotify ? currentActivity.song : isCustomStatus ? currentActivity.state : currentActivity.name}
                                            >
                                            	{isSpotify ? currentActivity.song : isCustomStatus ? currentActivity.state : currentActivity.name}
                                            </p>
                                        )}
                                        {isSpotify ? (
                                            <>
                                                <p className="line-clamp-1 truncate text-xs text-zinc-600 dark:text-zinc-400">
                                                    {currentActivity.artist}
                                                </p>
                                                <div className="mt-2">
                                                    <div className="mb-1 h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000 ease-linear"
                                                            style={{ width: `${spotifyProgress}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between font-jetmono text-[9px] text-zinc-400 dark:text-zinc-500">
                                                        <span>{spotifyTime.current}</span>
                                                        <span>{spotifyTime.total}</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {!isCustomStatus && (
                                                    <p 
                                                        className="line-clamp-2 break-words text-xs text-zinc-600 dark:text-zinc-400"
                                                        title={currentActivity.details || currentActivity.state}
                                                    >
                                                        {currentActivity.details || currentActivity.state || "Active"}
                                                    </p>
                                                )}
                                                {elapsedTime && (
                                                    <p className="mt-1 font-jetmono text-[9px] text-zinc-400 dark:text-zinc-500">
                                                        {elapsedTime} elapsed
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {activities.length > 1 && (
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => changeActivity("prev")}
                                            className="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                        >
                                            ← Prev
                                        </button>
                                        <span className="font-jetmono text-[10px] text-zinc-400">
                                            {activityIndex + 1} / {activities.length}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => changeActivity("next")}
                                            className="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes marqueeScrollAndPause {
                    0%, 25% {
                        transform: translateX(0);
                    }
                    75%, 100% {
                        transform: translateX(var(--overflow-dist, 0px));
                    }
                }

                @keyframes marqueePingPong {
                    0%, 20% {
                        transform: translateX(0);
                    }
                    50%, 70% {
                        transform: translateX(var(--overflow-dist, 0px));
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}