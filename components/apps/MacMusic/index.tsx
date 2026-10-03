import {
  type FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import { SONGS_DATA, type Song } from "components/apps/MacMusic/songsData";

const Container = styled.div`
  background: #141416;
  color: #f5f5f7;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
    "Segoe UI", Roboto, sans-serif;
  height: 100%;
  user-select: none;
  width: 100%;
`;

const PlayerBar = styled.div`
  align-items: center;
  background: rgba(26, 26, 30, 0.96);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  grid-template-columns: 200px 1fr 220px;
  height: 64px;
  padding: 0 18px;
  position: relative;
  z-index: 10;

  .left-controls {
    align-items: center;
    display: flex;
    gap: 12px;

    button {
      align-items: center;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.85);
      cursor: pointer;
      display: flex;
      font-size: 14px;
      justify-content: center;
      transition: all 0.15s ease;

      &:hover {
        color: #fff;
        transform: scale(1.08);
      }

      &.shuffle-btn,
      &.repeat-btn {
        color: rgba(255, 255, 255, 0.45);
        font-size: 13px;

        &.active {
          color: #fa233b;
        }
      }

      &.play-btn {
        background: #fa233b;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(250, 35, 59, 0.4);
        color: #fff;
        font-size: 14px;
        height: 34px;
        width: 34px;

        &:hover {
          background: #fc3c44;
          transform: scale(1.05);
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }
  }

  .center-lcd {
    align-items: center;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    max-width: 480px;
    padding: 6px 14px;
    width: 100%;

    .track-row {
      align-items: center;
      display: flex;
      gap: 10px;
      width: 100%;

      .lcd-thumb {
        align-items: center;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
        display: flex;
        font-size: 14px;
        height: 28px;
        justify-content: center;
        min-width: 28px;
        width: 28px;
      }

      .info-text {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-width: 0;

        .title {
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .artist-album {
          color: #8e8e93;
          font-size: 11px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .favorite-btn {
        background: transparent;
        border: none;
        color: #8e8e93;
        cursor: pointer;
        font-size: 13px;
        transition: transform 0.15s ease;

        &.fav {
          color: #fa233b;
        }

        &:hover {
          transform: scale(1.2);
        }
      }
    }

    .progress-bar-row {
      align-items: center;
      display: flex;
      gap: 8px;
      margin-top: 4px;
      width: 100%;

      .time-label {
        color: #8e8e93;
        font-size: 10px;
        min-width: 26px;
        text-align: center;
      }

      .slider-container {
        cursor: pointer;
        flex: 1;
        height: 12px;
        position: relative;

        .bar-bg {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
          height: 3px;
          position: absolute;
          top: 4.5px;
          width: 100%;
        }

        .bar-fill {
          background: #fa233b;
          border-radius: 2px;
          height: 3px;
          position: absolute;
          top: 4.5px;
        }
      }
    }
  }

  .right-controls {
    align-items: center;
    display: flex;
    gap: 12px;
    justify-content: flex-end;

    button {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      font-size: 13px;

      &.mv-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 11px;
        font-weight: 600;
        padding: 4px 8px;
        transition: all 0.18s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.16);
          color: #fff;
        }

        &.active {
          background: rgba(250, 35, 59, 0.25);
          border-color: rgba(250, 35, 59, 0.4);
          color: #fa233b;
        }
      }
    }

    .volume-box {
      align-items: center;
      display: flex;
      gap: 6px;

      input[type="range"] {
        accent-color: #fa233b;
        cursor: pointer;
        height: 3px;
        width: 80px;
      }
    }
  }
`;

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const MvFloatingWindow = styled.div<{ $visible: boolean }>`
  background: #111114;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  bottom: 20px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  height: 220px;
  opacity: ${({ $visible }) => ($visible ? "1" : "0")};
  overflow: hidden;
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  position: absolute;
  right: 20px;
  transform: ${({ $visible }) =>
    $visible ? "scale(1) translateY(0)" : "scale(0.8) translateY(30px)"};
  transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  width: 360px;
  z-index: 100;

  .mv-header {
    align-items: center;
    background: rgba(20, 20, 24, 0.96);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: space-between;
    padding: 7px 12px;

    .mv-title {
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: #8e8e93;
      cursor: pointer;
      font-size: 13px;
      padding: 2px 4px;

      &:hover {
        color: #fff;
      }
    }
  }

  .player-frame-box {
    background: #000;
    flex: 1;
    overflow: hidden;
    position: relative;
    width: 100%;

    iframe,
    #macmusic-yt-player-slot {
      border: none;
      height: 100%;
      width: 100%;
    }
  }
`;

const ContentLayout = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.div`
  background: rgba(22, 22, 26, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  min-width: 210px;
  overflow-y: auto;
  padding: 14px 10px;
  width: 210px;

  .search-wrapper {
    margin-bottom: 12px;
    padding: 0 4px;

    input {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      color: #fff;
      font-size: 12px;
      outline: none;
      padding: 7px 10px;
      width: 100%;

      &::placeholder {
        color: #8e8e93;
      }

      &:focus {
        background: rgba(255, 255, 255, 0.12);
        border-color: #fa233b;
      }
    }
  }

  .section-label {
    color: #8e8e93;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.4px;
    margin: 12px 0 4px;
    padding: 0 8px;
    text-transform: uppercase;
  }

  .nav-btn {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    display: flex;
    font-size: 12px;
    font-weight: 500;
    gap: 9px;
    padding: 6px 10px;
    text-align: left;
    transition: all 0.12s ease;
    width: 100%;

    .badge {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      font-size: 10px;
      margin-left: auto;
      padding: 1px 6px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
    }

    &.active {
      background: rgba(250, 35, 59, 0.2);
      color: #fa233b;
      font-weight: 600;
    }
  }
`;

const MainPane = styled.div`
  background: #141416;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  padding: 20px 24px;

  /* Header banner */
  .playlist-header {
    align-items: flex-end;
    display: flex;
    gap: 20px;
    margin-bottom: 24px;

    .big-cover {
      align-items: center;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
      display: flex;
      font-size: 54px;
      height: 140px;
      justify-content: center;
      min-width: 140px;
      width: 140px;
    }

    .meta {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .type {
        color: #8e8e93;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }

      .title {
        color: #fff;
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -0.5px;
      }

      .stats {
        color: #8e8e93;
        font-size: 12px;
      }

      .action-buttons {
        display: flex;
        gap: 10px;
        margin-top: 8px;

        button {
          align-items: center;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          font-size: 12px;
          font-weight: 600;
          gap: 6px;
          padding: 7px 16px;
          transition: transform 0.15s ease;

          &.play-all {
            background: #fa233b;
            color: #fff;

            &:hover {
              background: #fc3c44;
            }
          }

          &.shuffle-all {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;

            &:hover {
              background: rgba(255, 255, 255, 0.16);
            }
          }
        }
      }
    }
  }

  /* Hero carousel for Browse */
  .browse-hero {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    margin-bottom: 24px;

    .hero-card {
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      min-height: 130px;
      overflow: hidden;
      padding: 16px;
      position: relative;
      transition: transform 0.2s ease;

      &:hover {
        transform: translateY(-3px);
      }

      .tag {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
        opacity: 0.85;
        text-transform: uppercase;
      }

      .hero-title {
        font-size: 18px;
        font-weight: 800;
        line-height: 1.2;
      }

      .hero-sub {
        font-size: 12px;
        margin-top: 4px;
        opacity: 0.9;
      }
    }
  }

  /* Songs Table */
  .songs-table {
    display: flex;
    flex-direction: column;
    width: 100%;

    .table-head {
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      color: #8e8e93;
      display: grid;
      font-size: 11px;
      font-weight: 600;
      gap: 12px;
      grid-template-columns: 32px 2.2fr 1.3fr 1.3fr 55px 32px;
      letter-spacing: 0.5px;
      padding: 8px 12px;
      text-transform: uppercase;
    }

    .song-row {
      align-items: center;
      border-radius: 6px;
      cursor: pointer;
      display: grid;
      font-size: 13px;
      gap: 12px;
      grid-template-columns: 32px 2.2fr 1.3fr 1.3fr 55px 32px;
      padding: 7px 12px;
      transition: background 0.12s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.06);

        .track-num {
          display: none;
        }

        .hover-play {
          display: block;
        }
      }

      &.playing {
        background: rgba(250, 35, 59, 0.12);

        .song-title {
          color: #fa233b;
          font-weight: 600;
        }
      }

      .col-index {
        align-items: center;
        color: #8e8e93;
        display: flex;
        font-size: 12px;
        justify-content: center;

        .hover-play {
          color: #fff;
          display: none;
          font-size: 11px;
        }

        .equalizer-anim {
          align-items: flex-end;
          display: flex;
          gap: 2px;
          height: 12px;

          span {
            animation: bounce 0.6s ease infinite alternate;
            background: #fa233b;
            border-radius: 1px;
            width: 2px;

            &:nth-child(1) {
              animation-delay: 0.1s;
              height: 60%;
            }
            &:nth-child(2) {
              animation-delay: 0.3s;
              height: 100%;
            }
            &:nth-child(3) {
              animation-delay: 0.2s;
              height: 40%;
            }
          }
        }
      }

      .col-title {
        align-items: center;
        display: flex;
        gap: 12px;
        min-width: 0;

        .row-thumb {
          align-items: center;
          border-radius: 4px;
          display: flex;
          font-size: 13px;
          height: 32px;
          justify-content: center;
          min-width: 32px;
          width: 32px;
        }

        .title-box {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;

          .song-title {
            color: #fff;
            font-size: 13px;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .song-genre {
            color: #8e8e93;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .col-artist {
        color: #aeaeb2;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .col-album {
        color: #8e8e93;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .col-duration {
        color: #8e8e93;
        font-size: 12px;
        text-align: right;
      }

      .col-fav {
        align-items: center;
        display: flex;
        justify-content: center;

        button {
          background: transparent;
          border: none;
          color: #636366;
          cursor: pointer;
          font-size: 12px;

          &.active {
            color: #fa233b;
          }

          &:hover {
            color: #fa233b;
          }
        }
      }
    }
  }

  @keyframes bounce {
    0% {
      height: 20%;
    }
    100% {
      height: 100%;
    }
  }
`;

const MacMusic: FC<ComponentProcessProps> = () => {
  const [songs, setSongs] = useState<Song[]>(SONGS_DATA);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [volume, setVolume] = useState<number>(80);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [showMv, setShowMv] = useState<boolean>(false);

  const ytPlayerRef = useRef<any>(null);
  const isYtReadyRef = useRef<boolean>(false);
  const pendingPlayRef = useRef<{ song: Song; vol: number } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const songsRef = useRef(songs);
  songsRef.current = songs;
  const currentSongIndexRef = useRef(currentSongIndex);
  currentSongIndexRef.current = currentSongIndex;
  const isShuffleRef = useRef(isShuffle);
  isShuffleRef.current = isShuffle;
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  const currentSong = songs[currentSongIndex] || songs[0];
  const currentSongRef = useRef(currentSong);
  currentSongRef.current = currentSong;

  // Filter songs based on activeTab and searchQuery
  const displayedSongs = useMemo(() => {
    let list = songs;
    if (activeTab === "vpop") {
      list = list.filter((s) => s.category === "vpop");
    } else if (activeTab === "usuk") {
      list = list.filter((s) => s.category === "usuk");
    } else if (activeTab === "kpop") {
      list = list.filter((s) => s.category === "kpop");
    } else if (activeTab === "chill") {
      list = list.filter((s) => s.category === "chill");
    } else if (activeTab === "favorites") {
      list = list.filter((s) => s.favorite);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          s.album.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, searchQuery, songs]);

  const displayedSongsRef = useRef(displayedSongs);
  displayedSongsRef.current = displayedSongs;

  const toggleFavorite = useCallback(
    (id: number, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setSongs((prev) =>
        prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s))
      );
    },
    []
  );

  const stopSynth = useCallback(() => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  }, []);

  const startSynth = useCallback((song: Song, vol: number) => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const scale = [
        261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25,
      ];
      let step = 0;

      const playStep = () => {
        if (!ctx || ctx.state === "closed") return;
        const now = ctx.currentTime;
        const root = scale[(song.id + step) % scale.length];
        const fifth = root * 1.5;
        const bass = root / 2;

        // Lead note
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(root, now);
        const leadVol = Math.max(0.02, (vol / 100) * 0.22);
        gain1.gain.setValueAtTime(leadVol, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.6);

        // Harmony note
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(fifth, now);
        const harmVol = Math.max(0.01, (vol / 100) * 0.15);
        gain2.gain.setValueAtTime(harmVol, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now);
        osc2.stop(now + 0.5);

        // Bass note
        if (step % 2 === 0) {
          const oscB = ctx.createOscillator();
          const gainB = ctx.createGain();
          oscB.type = "sine";
          oscB.frequency.setValueAtTime(bass, now);
          const bassVol = Math.max(0.02, (vol / 100) * 0.3);
          gainB.gain.setValueAtTime(bassVol, now);
          gainB.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          oscB.connect(gainB);
          gainB.connect(ctx.destination);
          oscB.start(now);
          oscB.stop(now + 0.85);
        }

        step = (step + 1) % 8;
      };

      playStep();
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = setInterval(playStep, 500);
    } catch {
      // audio fallback
    }
  }, []);

  const loadAndPlaySongRef = useRef<(song: Song, vol: number) => void>(
    () => {}
  );
  loadAndPlaySongRef.current = useCallback(
    (song: Song, vol: number) => {
      stopSynth();

      if (song.youtubeId && ytPlayerRef.current && isYtReadyRef.current) {
        try {
          ytPlayerRef.current.loadVideoById({
            videoId: song.youtubeId,
            startSeconds: 0,
          });
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(vol);
          // playVideo is called automatically by loadVideoById
          setIsPlaying(true);
          return;
        } catch {
          // fallback
        }
      }

      if (!isYtReadyRef.current && song.youtubeId) {
        pendingPlayRef.current = { song, vol };
      } else {
        startSynth(song, vol);
      }
    },
    [startSynth, stopSynth]
  );

  const playSongAt = useCallback(
    (song: Song) => {
      const idx = songsRef.current.findIndex((s) => s.id === song.id);
      if (idx !== -1) {
        setCurrentSongIndex(idx);
      }
      setCurrentTimeSec(0);
      setIsPlaying(true);
      loadAndPlaySongRef.current(song, volumeRef.current);
    },
    []
  );

  const nextTrackRef = useRef<() => void>(() => {});
  nextTrackRef.current = useCallback(() => {
    const list =
      displayedSongsRef.current.length > 0
        ? displayedSongsRef.current
        : songsRef.current;
    const currentId = songsRef.current[currentSongIndexRef.current]?.id;
    const listIdx = list.findIndex((s) => s.id === currentId);

    let nextIdx = 0;
    if (isShuffleRef.current) {
      nextIdx = Math.floor(Math.random() * list.length);
    } else if (listIdx !== -1) {
      nextIdx = (listIdx + 1) % list.length;
    }
    const nextSong = list[nextIdx] || list[0];
    if (nextSong) {
      playSongAt(nextSong);
    }
  }, [playSongAt]);

  const nextTrack = useCallback(() => {
    nextTrackRef.current();
  }, []);

  const prevTrack = useCallback(() => {
    const list =
      displayedSongsRef.current.length > 0
        ? displayedSongsRef.current
        : songsRef.current;
    const currentId = songsRef.current[currentSongIndexRef.current]?.id;
    const listIdx = list.findIndex((s) => s.id === currentId);

    let prevIdx = 0;
    if (listIdx !== -1) {
      prevIdx = (listIdx - 1 + list.length) % list.length;
    }
    const prevSong = list[prevIdx] || list[0];
    if (prevSong) {
      playSongAt(prevSong);
    }
  }, [playSongAt]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      if (
        ytPlayerRef.current &&
        typeof ytPlayerRef.current.pauseVideo === "function"
      ) {
        ytPlayerRef.current.pauseVideo();
      }
      stopSynth();
      setIsPlaying(false);
    } else {
      if (
        ytPlayerRef.current &&
        isYtReadyRef.current &&
        typeof ytPlayerRef.current.playVideo === "function"
      ) {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      } else {
        loadAndPlaySongRef.current(currentSongRef.current, volumeRef.current);
      }
    }
  }, [isPlaying, stopSynth]);

  // Adjust volume live
  const handleVolumeChange = useCallback((newVol: number) => {
    setVolume(newVol);
    if (
      ytPlayerRef.current &&
      typeof ytPlayerRef.current.setVolume === "function"
    ) {
      ytPlayerRef.current.setVolume(newVol);
      if (newVol > 0 && typeof ytPlayerRef.current.unMute === "function") {
        ytPlayerRef.current.unMute();
      }
    }
  }, []);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    const targetSec = Math.floor(
      percent * (currentSongRef.current.durationSec || 200)
    );
    setCurrentTimeSec(targetSec);
    if (
      ytPlayerRef.current &&
      typeof ytPlayerRef.current.seekTo === "function"
    ) {
      ytPlayerRef.current.seekTo(targetSec, true);
    }
  };

  // YouTube Iframe API initialization — empty deps so it only runs once
  useEffect(() => {
    const initYt = () => {
      if (!window.YT || !window.YT.Player) return;
      if (ytPlayerRef.current) return;

      try {
        ytPlayerRef.current = new window.YT.Player("macmusic-yt-player-slot", {
          width: "100%",
          height: "100%",
          videoId: SONGS_DATA[0].youtubeId || "abPmFUFQ4qE",
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            start: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              isYtReadyRef.current = true;
              event.target.setVolume(volumeRef.current);
              if (pendingPlayRef.current) {
                const { song, vol } = pendingPlayRef.current;
                pendingPlayRef.current = null;
                loadAndPlaySongRef.current(song, vol);
              }
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                // PLAYING
                setIsPlaying(true);
              } else if (event.data === 2) {
                // PAUSED
                setIsPlaying(false);
              } else if (event.data === 0) {
                // ENDED — use ref to avoid stale closure
                nextTrackRef.current();
              }
            },
            onError: () => {
              // synth fallback not needed — just skip to next
              nextTrackRef.current();
            },
          },
        });
      } catch {
        // fallback
      }
    };

    if (window.YT && window.YT.Player) {
      // small delay to ensure DOM element is mounted
      setTimeout(initYt, 100);
    } else {
      if (!document.getElementById("yt-iframe-api-script")) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api-script";
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      const prevOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevOnReady === "function") prevOnReady();
        setTimeout(initYt, 100);
      };
    }

    return () => {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }
      if (
        ytPlayerRef.current &&
        typeof ytPlayerRef.current.destroy === "function"
      ) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // ignore
        }
        ytPlayerRef.current = null;
        isYtReadyRef.current = false;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync current time while playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (ytPlayerRef.current && isYtReadyRef.current) {
          try {
            const t = ytPlayerRef.current.getCurrentTime();
            if (typeof t === "number" && !isNaN(t)) {
              setCurrentTimeSec(Math.floor(t));
            }
          } catch {
            // ignore
          }
        } else {
          setCurrentTimeSec((prev) => prev + 1);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatSec = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const currentPercent = Math.min(
    100,
    (currentTimeSec / (currentSong.durationSec || 1)) * 100
  );

  return (
    <Container>
      {/* Top Player Bar */}
      <PlayerBar>
        {/* Left playback controls */}
        <div className="left-controls">
          <button
            className={`shuffle-btn ${isShuffle ? "active" : ""}`}
            onClick={() => setIsShuffle((prev) => !prev)}
            title="Xáo trộn (Shuffle)"
            type="button"
          >
            🔀
          </button>
          <button onClick={prevTrack} title="Bài trước (Previous)" type="button">
            ⏮
          </button>
          <button
            className="play-btn"
            onClick={togglePlay}
            title={isPlaying ? "Tạm dừng (Pause)" : "Phát (Play)"}
            type="button"
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={nextTrack} title="Bài tiếp theo (Next)" type="button">
            ⏭
          </button>
          <button
            className="repeat-btn"
            onClick={() => setCurrentTimeSec(0)}
            title="Lặp lại (Repeat)"
            type="button"
          >
            🔁
          </button>
        </div>

        {/* Center LCD Now Playing Box */}
        <div className="center-lcd">
          <div className="track-row">
            <div
              className="lcd-thumb"
              style={{ background: currentSong.color }}
            >
              {currentSong.emoji}
            </div>
            <div className="info-text">
              <span className="title">{currentSong.title}</span>
              <span className="artist-album">
                {currentSong.artist} — {currentSong.album}
              </span>
            </div>
            <button
              className={`favorite-btn ${currentSong.favorite ? "fav" : ""}`}
              onClick={(e) => toggleFavorite(currentSong.id, e)}
              title="Yêu thích"
              type="button"
            >
              {currentSong.favorite ? "❤️" : "🤍"}
            </button>
          </div>

          {/* Progress row */}
          <div className="progress-bar-row">
            <span className="time-label">{formatSec(currentTimeSec)}</span>
            <div className="slider-container" onClick={handleSeek}>
              <div className="bar-bg" />
              <div
                className="bar-fill"
                style={{ width: `${currentPercent}%` }}
              />
            </div>
            <span className="time-label">{currentSong.duration}</span>
          </div>
        </div>

        {/* Right audio controls */}
        <div className="right-controls">
          <button
            className={`mv-btn ${showMv ? "active" : ""}`}
            onClick={() => setShowMv((prev) => !prev)}
            title="Xem MV (Music Video)"
            type="button"
          >
            🎬 MV
          </button>
          <button title="Lời bài hát (Lyrics)" type="button">
            💬
          </button>
          <button title="Danh sách phát tiếp theo (Up Next)" type="button">
            ☰
          </button>
          <div className="volume-box">
            <span>{volume === 0 ? "🔇" : volume < 50 ? "🔉" : "🔊"}</span>
            <input
              max="100"
              min="0"
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              type="range"
              value={volume}
            />
          </div>
        </div>
      </PlayerBar>

      {/* Main Content: Sidebar + Center Content */}
      <ContentLayout>
        {/* Navigation Sidebar */}
        <Sidebar>
          <div className="search-wrapper">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Tìm bài hát, nghệ sĩ..."
              type="text"
              value={searchQuery}
            />
          </div>

          <div className="section-label">Apple Music</div>
          <button
            className={`nav-btn ${activeTab === "browse" ? "active" : ""}`}
            onClick={() => setActiveTab("browse")}
            type="button"
          >
            <span>🏠</span> Khám phá
          </button>
          <button
            className={`nav-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
            type="button"
          >
            <span>🎵</span> Tất cả 100 bài hát
            <span className="badge">100</span>
          </button>

          <div className="section-label">Thư viện</div>
          <button
            className={`nav-btn ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
            type="button"
          >
            <span>❤️</span> Bài hát yêu thích
            <span className="badge">
              {songs.filter((s) => s.favorite).length}
            </span>
          </button>
          <button
            className={`nav-btn ${activeTab === "chill" ? "active" : ""}`}
            onClick={() => setActiveTab("chill")}
            type="button"
          >
            <span>☕️</span> Lo-Fi & Thư giãn
            <span className="badge">15</span>
          </button>

          <div className="section-label">Danh sách phát</div>
          <button
            className={`nav-btn ${activeTab === "vpop" ? "active" : ""}`}
            onClick={() => setActiveTab("vpop")}
            type="button"
          >
            <span>🇻🇳</span> Top 100 Việt Nam
            <span className="badge">30</span>
          </button>
          <button
            className={`nav-btn ${activeTab === "usuk" ? "active" : ""}`}
            onClick={() => setActiveTab("usuk")}
            type="button"
          >
            <span>🌎</span> US-UK Billboard
            <span className="badge">35</span>
          </button>
          <button
            className={`nav-btn ${activeTab === "kpop" ? "active" : ""}`}
            onClick={() => setActiveTab("kpop")}
            type="button"
          >
            <span>🇰🇷</span> K-Pop On Repeat
            <span className="badge">20</span>
          </button>
        </Sidebar>

        {/* Main Content Area */}
        <MainPane>
          {activeTab === "browse" ? (
            <>
              {/* Featured Hero Banners */}
              <div className="browse-hero">
                <div
                  className="hero-card"
                  onClick={() => playSongAt(songs[0])}
                  style={{
                    background:
                      "linear-gradient(135deg, #fa233b 0%, #6c0512 100%)",
                  }}
                >
                  <span className="tag">TIÊU ĐIỂM HÔM NAY</span>
                  <span className="hero-title">Đừng Làm Trái Tim Anh Đau</span>
                  <span className="hero-sub">
                    Sơn Tùng M-TP • Single thịnh hành nhất
                  </span>
                </div>

                <div
                  className="hero-card"
                  onClick={() => playSongAt(songs[30])}
                  style={{
                    background:
                      "linear-gradient(135deg, #007aff 0%, #001f54 100%)",
                  }}
                >
                  <span className="tag">SPATIAL AUDIO</span>
                  <span className="hero-title">Blinding Lights</span>
                  <span className="hero-sub">The Weeknd • Âm thanh không gian</span>
                </div>

                <div
                  className="hero-card"
                  onClick={() => playSongAt(songs[70])}
                  style={{
                    background:
                      "linear-gradient(135deg, #af52de 0%, #300a4d 100%)",
                  }}
                >
                  <span className="tag">K-POP HIGHLIGHT</span>
                  <span className="hero-title">Hype Boy & Ditto</span>
                  <span className="hero-sub">NewJeans • Trọn bộ hit đỉnh cao</span>
                </div>
              </div>
            </>
          ) : null}

          {/* Playlist Top Info Banner */}
          <div className="playlist-header">
            <div
              className="big-cover"
              style={{
                background:
                  activeTab === "vpop"
                    ? "linear-gradient(135deg, #ff0844, #ffb199)"
                    : activeTab === "usuk"
                      ? "linear-gradient(135deg, #1d2671, #c33764)"
                      : activeTab === "kpop"
                        ? "linear-gradient(135deg, #fa709a, #fee140)"
                        : activeTab === "chill"
                          ? "linear-gradient(135deg, #2c3e50, #4ca1af)"
                          : activeTab === "favorites"
                            ? "linear-gradient(135deg, #f857a6, #ff5858)"
                            : "linear-gradient(135deg, #fa233b, #fc3c44)",
              }}
            >
              {activeTab === "vpop"
                ? "🇻🇳"
                : activeTab === "usuk"
                  ? "🌎"
                  : activeTab === "kpop"
                    ? "🇰🇷"
                    : activeTab === "chill"
                      ? "☕️"
                      : activeTab === "favorites"
                        ? "❤️"
                        : "🎵"}
            </div>

            <div className="meta">
              <span className="type">DANH SÁCH PHÁT APPLE MUSIC</span>
              <h1 className="title">
                {activeTab === "vpop"
                  ? "Top 100 Việt Nam"
                  : activeTab === "usuk"
                    ? "US-UK Billboard Hits"
                    : activeTab === "kpop"
                      ? "K-Pop On Repeat"
                      : activeTab === "chill"
                        ? "Lo-Fi & Chill Beats"
                        : activeTab === "favorites"
                          ? "Bài hát yêu thích"
                          : "Tất cả bài hát"}
              </h1>
              <span className="stats">
                {displayedSongs.length} bài hát • Cập nhật hôm nay • Âm thanh Lossless
              </span>
              <div className="action-buttons">
                <button
                  className="play-all"
                  onClick={() => {
                    if (displayedSongs.length > 0) {
                      playSongAt(displayedSongs[0]);
                    }
                  }}
                  type="button"
                >
                  ▶ Phát tất cả
                </button>
                <button
                  className="shuffle-all"
                  onClick={() => {
                    if (displayedSongs.length > 0) {
                      const rand = Math.floor(
                        Math.random() * displayedSongs.length
                      );
                      playSongAt(displayedSongs[rand]);
                      setIsShuffle(true);
                    }
                  }}
                  type="button"
                >
                  🔀 Xáo trộn
                </button>
              </div>
            </div>
          </div>

          {/* Songs Table View */}
          <div className="songs-table">
            <div className="table-head">
              <span>#</span>
              <span>BÀI HÁT</span>
              <span>NGHỆ SĨ</span>
              <span>ALBUM</span>
              <span style={{ textAlign: "right" }}>THỜI LƯỢNG</span>
              <span style={{ textAlign: "center" }}></span>
            </div>

            {displayedSongs.map((song, idx) => {
              const isCurrent = currentSong.id === song.id;
              return (
                <div
                  key={song.id}
                  className={`song-row ${isCurrent ? "playing" : ""}`}
                  onDoubleClick={() => playSongAt(song)}
                >
                  <div className="col-index" onClick={() => playSongAt(song)}>
                    {isCurrent && isPlaying ? (
                      <div className="equalizer-anim">
                        <span />
                        <span />
                        <span />
                      </div>
                    ) : (
                      <>
                        <span className="track-num">{idx + 1}</span>
                        <span className="hover-play">▶</span>
                      </>
                    )}
                  </div>

                  <div className="col-title" onClick={() => playSongAt(song)}>
                    <div
                      className="row-thumb"
                      style={{ background: song.color }}
                    >
                      {song.emoji}
                    </div>
                    <div className="title-box">
                      <span className="song-title">{song.title}</span>
                      <span className="song-genre">{song.genre}</span>
                    </div>
                  </div>

                  <div className="col-artist" onClick={() => playSongAt(song)}>
                    {song.artist}
                  </div>

                  <div className="col-album" onClick={() => playSongAt(song)}>
                    {song.album}
                  </div>

                  <div
                    className="col-duration"
                    onClick={() => playSongAt(song)}
                  >
                    {song.duration}
                  </div>

                  <div className="col-fav">
                    <button
                      className={song.favorite ? "active" : ""}
                      onClick={(e) => toggleFavorite(song.id, e)}
                      type="button"
                    >
                      {song.favorite ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </MainPane>
      </ContentLayout>

      {/* Floating Picture-in-Picture MV player */}
      <MvFloatingWindow $visible={showMv}>
        <div className="mv-header">
          <span className="mv-title">
            🎬 {currentSong.title} — {currentSong.artist}
          </span>
          <button
            className="close-btn"
            onClick={() => setShowMv(false)}
            title="Thu nhỏ MV"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="player-frame-box">
          <div id="macmusic-yt-player-slot" />
        </div>
      </MvFloatingWindow>
    </Container>
  );
};

export default memo(MacMusic);
