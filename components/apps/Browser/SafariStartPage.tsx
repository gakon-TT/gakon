import { FC, memo } from "react";
import styled from "styled-components";
import { SafariShieldIcon, SafariSearchIcon } from "components/apps/Browser/SafariIcons";

type SafariStartPageProps = {
  onNavigate: (url: string, title?: string) => void;
};

const StartPageContainer = styled.div`
  background: radial-gradient(circle at 50% 20%, #202433 0%, #161822 60%, #0f1016 100%);
  color: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif;
  height: 100%;
  overflow-y: auto;
  padding: 40px 24px 60px;
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

  .content-wrapper {
    margin: 0 auto;
    max-width: 860px;
  }

  .header-section {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-bottom: 36px;
    text-align: center;

    .safari-logo {
      filter: drop-shadow(0 10px 20px rgba(0, 100, 230, 0.35));
      height: 64px;
      margin-bottom: 14px;
      width: 64px;
    }

    h1 {
      font-size: 26px;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin: 0 0 6px;
    }

    p {
      color: #98989f;
      font-size: 13px;
      margin: 0;
    }
  }

  .section-title {
    color: #e5e5ea;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin: 0 0 16px;
    padding-left: 2px;
  }

  .favorites-grid {
    display: grid;
    gap: 20px 16px;
    grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
    margin-bottom: 40px;
  }

  .favorite-item {
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    outline: none;
    padding: 0;
    transition: transform 0.16s cubic-bezier(0.2, 0.9, 0.4, 1);

    &:hover {
      transform: translateY(-4px) scale(1.04);

      .tile-icon {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        border-color: rgba(255, 255, 255, 0.25);
      }

      .tile-name {
        color: #ffffff;
      }
    }

    &:active {
      transform: translateY(-1px) scale(0.98);
    }

    .tile-icon {
      align-items: center;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      display: flex;
      height: 64px;
      justify-content: center;
      margin-bottom: 8px;
      position: relative;
      transition: all 0.2s ease;
      width: 64px;

      svg, img {
        height: 36px;
        width: 36px;
      }

      .apple-icon {
        color: #ffffff;
        font-size: 30px;
        font-weight: 300;
      }
    }

    .tile-name {
      color: #b0b0b8;
      font-size: 11.5px;
      font-weight: 500;
      line-height: 1.2;
      max-width: 84px;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .privacy-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    display: flex;
    gap: 16px;
    margin-bottom: 36px;
    padding: 16px 20px;

    .shield-badge {
      align-items: center;
      background: rgba(48, 209, 88, 0.15);
      border: 1px solid rgba(48, 209, 88, 0.3);
      border-radius: 12px;
      color: #30d158;
      display: flex;
      height: 44px;
      justify-content: center;
      min-width: 44px;
      width: 44px;
    }

    .report-info {
      flex: 1;

      h3 {
        color: #ffffff;
        font-size: 13.5px;
        font-weight: 600;
        margin: 0 0 4px;
      }

      p {
        color: #94949b;
        font-size: 12px;
        line-height: 1.4;
        margin: 0;
      }
    }
  }

  .reading-list-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));

    .reading-card {
      align-items: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      gap: 12px;
      padding: 10px 14px;
      text-align: left;
      transition: background 0.15s ease, border-color 0.15s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.15);
      }

      .card-icon {
        align-items: center;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        display: flex;
        font-size: 18px;
        height: 34px;
        justify-content: center;
        min-width: 34px;
        width: 34px;
      }

      .card-text {
        overflow: hidden;

        h4 {
          color: #ffffff;
          font-size: 12px;
          font-weight: 500;
          margin: 0 0 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        span {
          color: #7c7c82;
          font-size: 11px;
        }
      }
    }
  }
`;

const AppleLogo = () => (
  <svg viewBox="0 0 170 170" width="28" height="28" fill="#ffffff">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.94-12.04-14.58-6.19-9.5-11.05-20.78-14.58-33.84-3.53-13.06-5.3-25.2-5.3-36.43 0-14.14 3.5-25.86 10.5-35.18 7-9.31 16.03-14.07 27.09-14.28 4.89 0 10.42 1.34 16.59 4.02 6.17 2.68 10.22 4.09 12.16 4.23 2.12 0 6.4-1.5 12.84-4.51 6.44-3.01 12.04-4.32 16.8-3.92 12.65 1.06 22.84 5.92 30.56 14.58-11.05 6.72-16.48 16.03-16.29 27.93.18 9.31 3.82 17.15 10.92 23.51 7.1 6.36 15.54 10.02 25.32 10.98-2.25 6.64-4.89 13.55-7.92 20.73zM119.22 31.84c0-7.39 2.65-14.33 7.95-20.82 5.3-6.49 11.83-10.49 19.59-12 1.06 7.61-.92 14.65-5.94 21.12-5.02 6.47-11.66 10.74-19.92 12.82-.42-.37-.98-.67-1.68-1.12z" />
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" width="30" height="30">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
  </svg>
);

const WikiLogo = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="#111111">
    <path d="M12.09 13.34 9.8 4.2H8.38L4.74 16.52l-2.3-7.53H1L4 19.8h1.27l3.6-11.45 3.19 11.45h1.28l3.77-11.5 3.62 11.5H22L17.7 4.2h-1.39l-2.27 9.14z" />
  </svg>
);

const DinoLogo = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="#222222">
    <path d="M19 3h-6v2h-1v2h-1v1h-1v2H9v1H8v1H6v1H5v2H4v3h1v-1h1v-1h1v-1h1v4h1v-2h1v3h1v-1h1v-1h1v-3h1v-1h1v-2h2v-1h1v-1h1V4h-1V3h-1zm-2 2h1v1h-1V5z" />
  </svg>
);

const FAVORITES = [
  {
    name: "Apple",
    url: "https://www.apple.com",
    customIcon: <AppleLogo />,
    bg: "linear-gradient(135deg, #1c1c1e 0%, #000 100%)",
  },
  {
    name: "Google",
    url: "https://www.google.com/webhp?igu=1",
    customIcon: <GoogleLogo />,
    bg: "#ffffff",
  },
  {
    name: "Wikipedia",
    url: "https://www.wikipedia.org/",
    customIcon: <WikiLogo />,
    bg: "#ffffff",
  },
  {
    name: "YouTube",
    url: "safari:youtube",
    customIcon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#ff0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    bg: "#ffffff",
  },
  {
    name: "GitHub",
    url: "https://github.com",
    customIcon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#ffffff">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    bg: "#181717",
  },
  {
    name: "Dino Game",
    url: "chrome://dino",
    customIcon: <DinoLogo />,
    bg: "#f7f7f7",
  },
  {
    name: "VnExpress",
    url: "https://vnexpress.net",
    customIcon: (
      <span style={{ color: "#9f224e", fontSize: "17px", fontWeight: "800", letterSpacing: "-0.5px" }}>
        VnE
      </span>
    ),
    bg: "#ffffff",
  },
  {
    name: "Internet Archive",
    url: "https://archive.org/",
    customIcon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#ffffff">
        <path d="M12 2 1 7v2h22V7L12 2zm1 8h-2v8h2v-8zm5 0h-2v8h2v-8zM6 10H4v8h2v-8zm16 10H2v2h20v-2z" />
      </svg>
    ),
    bg: "#2b2b2e",
  },
  {
    name: "Winamp",
    url: "https://skins.webamp.org/",
    customIcon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="#f5a623">
        <path d="M13 2 3 14h8l-2 8 10-12h-8l2-8z" />
      </svg>
    ),
    bg: "#1a1a1d",
  },
  {
    name: "Ga kon",
    url: "http://gakon.dev",
    customIcon: (
      <img
        alt="Ga kon"
        src="/System/Icons/gakon.png"
        style={{ borderRadius: "50%", height: 28, objectFit: "cover", width: 28 }}
      />
    ),
    bg: "#111424",
  },
];

const READING_LIST = [
  {
    title: "Ga kon - Digital Creator & Cyberpunk Architect",
    source: "gakon.dev",
    icon: "⚡",
    url: "http://gakon.dev",
  },
  {
    title: "Bảo mật nâng cao & Quyền riêng tư",
    source: "webkit.org",
    icon: "🛡️",
    url: "https://www.wikipedia.org/",
  },
  {
    title: "Khám phá các trang web cổ điển trên Wayback",
    source: "archive.org",
    icon: "🏛️",
    url: "https://archive.org/",
  },
];

const SafariStartPage: FC<SafariStartPageProps> = ({ onNavigate }) => {
  return (
    <StartPageContainer>
      <div className="content-wrapper">
        <div className="header-section">
          <img
            src="/System/Icons/safari.svg"
            alt="Safari"
            className="safari-logo"
          />
          <h1>Trang bắt đầu</h1>
          <p>Duyệt web nhanh, an toàn và riêng tư cùng Safari</p>
        </div>

        <div className="section-title">Mục ưa thích</div>
        <div className="favorites-grid">
          {FAVORITES.map((fav) => (
            <button
              key={fav.name}
              className="favorite-item"
              onClick={() => onNavigate(fav.url, fav.name)}
              type="button"
            >
              <div
                className="tile-icon"
                style={fav.bg ? { background: fav.bg } : undefined}
              >
                {fav.customIcon}
              </div>
              <div className="tile-name">{fav.name}</div>
            </button>
          ))}
        </div>

        <div className="privacy-card">
          <div className="shield-badge">
            <SafariShieldIcon />
          </div>
          <div className="report-info">
            <h3>Báo cáo quyền riêng tư của Safari</h3>
            <p>
              Trong 7 ngày qua, Safari đã ngăn <strong>48 trình theo dõi</strong> lập hồ sơ của bạn trên các trang web đã truy cập. Địa chỉ IP của bạn được ẩn khỏi các trình theo dõi đã biết.
            </p>
          </div>
        </div>

        <div className="section-title">Danh sách đọc</div>
        <div className="reading-list-grid">
          {READING_LIST.map((item) => (
            <div
              key={item.title}
              className="reading-card"
              onClick={() => onNavigate(item.url, item.title)}
            >
              <div className="card-icon">{item.icon}</div>
              <div className="card-text">
                <h4>{item.title}</h4>
                <span>{item.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StartPageContainer>
  );
};

export default memo(SafariStartPage);
