import { FC, memo, useState } from "react";
import styled from "styled-components";

type SafariYouTubeProps = {
  onOpenExternal?: (url: string) => void;
};

const YouTubeContainer = styled.div`
  background: #0f0f12;
  color: #f5f5f7;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
    Roboto, sans-serif;
  height: 100%;
  overflow-y: auto;
  user-select: none;
  width: 100%;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  .yt-header {
    align-items: center;
    background: rgba(18, 18, 22, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    gap: 16px;
    justify-content: space-between;
    padding: 12px 20px;
    position: sticky;
    top: 0;
    z-index: 10;

    .yt-brand {
      align-items: center;
      display: flex;
      font-size: 16px;
      font-weight: 700;
      gap: 8px;
      letter-spacing: -0.02em;

      svg {
        height: 24px;
        width: 32px;
      }
    }

    .yt-search-box {
      align-items: center;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      display: flex;
      max-width: 440px;
      padding: 0 12px;
      width: 100%;

      input {
        background: transparent;
        border: none;
        color: #fff;
        font-family: inherit;
        font-size: 13px;
        height: 32px;
        outline: none;
        width: 100%;
      }

      button {
        background: transparent;
        border: none;
        color: #8e8e93;
        cursor: pointer;
        display: flex;
        padding: 4px;

        &:hover {
          color: #fff;
        }
      }
    }

    .yt-external-btn {
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      color: #fff;
      cursor: pointer;
      display: flex;
      font-size: 12px;
      gap: 6px;
      height: 30px;
      padding: 0 12px;
      transition: background 0.15s ease;
      white-space: nowrap;

      &:hover {
        background: rgba(255, 255, 255, 0.18);
      }
    }
  }

  .yt-player-section {
    background: #000;
    display: flex;
    flex-direction: column;
    padding: 16px 20px;
    width: 100%;

    .player-wrapper {
      aspect-ratio: 16 / 9;
      background: #000;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      margin: 0 auto;
      max-height: 480px;
      overflow: hidden;
      width: 100%;

      iframe {
        border: none;
        height: 100%;
        width: 100%;
      }
    }

    .video-info {
      margin-top: 12px;

      h2 {
        font-size: 17px;
        font-weight: 600;
        margin: 0 0 6px;
      }

      p {
        color: #8e8e93;
        font-size: 12px;
        margin: 0;
      }
    }
  }

  .yt-grid-section {
    padding: 20px;

    h3 {
      font-size: 15px;
      font-weight: 600;
      margin: 0 0 16px;
    }

    .videos-grid {
      display: grid;
      gap: 16px 14px;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }

    .video-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      cursor: pointer;
      overflow: hidden;
      text-align: left;
      transition: transform 0.15s ease, background 0.15s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-3px);
      }

      .card-thumbnail {
        aspect-ratio: 16 / 9;
        background: #202025;
        position: relative;
        width: 100%;

        img {
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .play-overlay {
          align-items: center;
          background: rgba(0, 0, 0, 0.4);
          bottom: 0;
          display: flex;
          justify-content: center;
          left: 0;
          opacity: 0;
          position: absolute;
          right: 0;
          top: 0;
          transition: opacity 0.15s ease;

          svg {
            fill: #fff;
            height: 36px;
            width: 36px;
          }
        }
      }

      &:hover .play-overlay {
        opacity: 1;
      }

      .card-details {
        padding: 10px;

        h4 {
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.3;
          margin: 0 0 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        span {
          color: #8e8e93;
          font-size: 11.5px;
        }
      }
    }
  }
`;

const SUGGESTED_VIDEOS = [
  {
    channel: "Sơn Tùng M-TP Official",
    id: "abPmZCZZrFA",
    thumb: "https://img.youtube.com/vi/abPmZCZZrFA/mqdefault.jpg",
    title: "ĐỪNG LÀM TRÁI TIM ANH ĐAU - SƠN TÙNG M-TP",
  },
  {
    channel: "Apple",
    id: "EAR7De6Goz4",
    thumb: "https://img.youtube.com/vi/EAR7De6Goz4/mqdefault.jpg",
    title: "Introducing macOS Sonoma & Apple Silicon",
  },
  {
    channel: "Chill Music",
    id: "5qap5aO4i9A",
    thumb: "https://img.youtube.com/vi/5qap5aO4i9A/mqdefault.jpg",
    title: "Lofi Hip Hop Beats 2026 - Nhạc Thư Giãn Học Tập",
  },
  {
    channel: "Sơn Tùng M-TP Official",
    id: "knW7-x7Y7RE",
    thumb: "https://img.youtube.com/vi/knW7-x7Y7RE/mqdefault.jpg",
    title: "CHÚNG TA CỦA TƯƠNG LAI - SƠN TÙNG M-TP",
  },
  {
    channel: "Acoustic Cafe",
    id: "n61ULEU7SU0",
    thumb: "https://img.youtube.com/vi/n61ULEU7SU0/mqdefault.jpg",
    title: "Best Acoustic Songs of All Time - Guitar Cafe",
  },
];

const SafariYouTube: FC<SafariYouTubeProps> = ({ onOpenExternal }) => {
  const [currentVideo, setCurrentVideo] = useState(SUGGESTED_VIDEOS[0]);
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    // Check if input is a YouTube URL with ID
    const urlMatch = searchInput.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
    if (urlMatch?.[1]) {
      setCurrentVideo({
        channel: "YouTube Video",
        id: urlMatch[1],
        thumb: `https://img.youtube.com/vi/${urlMatch[1]}/mqdefault.jpg`,
        title: `Video: ${urlMatch[1]}`,
      });
      return;
    }

    // Otherwise find in suggested or open search
    const found = SUGGESTED_VIDEOS.find((v) =>
      v.title.toLowerCase().includes(searchInput.toLowerCase())
    );
    if (found) {
      setCurrentVideo(found);
    } else {
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(searchInput)}`,
        "_blank"
      );
    }
  };

  return (
    <YouTubeContainer>
      <div className="yt-header">
        <div className="yt-brand">
          <svg viewBox="0 0 24 24" fill="#ff0000">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <span>YouTube on Safari</span>
        </div>

        <form className="yt-search-box" onSubmit={handleSearch}>
          <input
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm video hoặc dán link YouTube..."
            type="text"
            value={searchInput}
          />
          <button type="submit">🔍</button>
        </form>

        <button
          className="yt-external-btn"
          onClick={() => {
            if (onOpenExternal) {
              onOpenExternal(`https://www.youtube.com/watch?v=${currentVideo.id}`);
            } else {
              window.open(
                `https://www.youtube.com/watch?v=${currentVideo.id}`,
                "_blank"
              );
            }
          }}
          title="Mở video này trên tab trình duyệt ngoài"
          type="button"
        >
          <span>Mở trên YouTube ↗</span>
        </button>
      </div>

      <div className="yt-player-section">
        <div className="player-wrapper">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            src={`https://www.youtube-nocookie.com/embed/${currentVideo.id}?autoplay=1`}
            title={currentVideo.title}
          />
        </div>
        <div className="video-info">
          <h2>{currentVideo.title}</h2>
          <p>{currentVideo.channel}</p>
        </div>
      </div>

      <div className="yt-grid-section">
        <h3>Video thịnh hành & gợi ý</h3>
        <div className="videos-grid">
          {SUGGESTED_VIDEOS.map((vid) => (
            <div
              key={vid.id}
              className="video-card"
              onClick={() => setCurrentVideo(vid)}
            >
              <div className="card-thumbnail">
                <img alt={vid.title} src={vid.thumb} />
                <div className="play-overlay">
                  <svg viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
              <div className="card-details">
                <h4>{vid.title}</h4>
                <span>{vid.channel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </YouTubeContainer>
  );
};

export default memo(SafariYouTube);
