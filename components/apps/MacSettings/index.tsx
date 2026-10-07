import { type FC, memo, useCallback, useState } from "react";
import styled from "styled-components";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import {
  useCloseEffect,
  useSessionActions,
  useWallpaperImage,
} from "contexts/session";
import { CLOSE_EFFECT_NAMES } from "utils/closeEffect";

const Container = styled.div`
  background: #1e1e22;
  color: #f5f5f7;
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
    Roboto, sans-serif;
  height: 100%;
  user-select: none;
  width: 100%;
`;

const Sidebar = styled.div`
  background: rgba(30, 30, 34, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  min-width: 220px;
  padding: 14px 10px;
  width: 220px;

  .user-card {
    align-items: center;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
    padding: 10px 12px;

    .avatar {
      align-items: center;
      background: linear-gradient(135deg, #007aff, #5856d6);
      border-radius: 50%;
      display: flex;
      font-size: 16px;
      font-weight: 700;
      height: 38px;
      justify-content: center;
      overflow: hidden;
      width: 38px;

      img {
        height: 100%;
        object-fit: cover;
        width: 100%;
      }
    }

    .info {
      display: flex;
      flex-direction: column;

      .name {
        font-size: 13px;
        font-weight: 600;
      }

      .apple-id {
        color: #8e8e93;
        font-size: 11px;
      }
    }
  }

  .nav-item {
    align-items: center;
    border-radius: 8px;
    color: #e5e5ea;
    cursor: pointer;
    display: flex;
    font-size: 13px;
    gap: 10px;
    padding: 7px 10px;
    transition: background 0.15s ease;

    .icon-badge {
      align-items: center;
      border-radius: 6px;
      display: flex;
      font-size: 13px;
      height: 24px;
      justify-content: center;
      width: 24px;
    }

    &.active {
      background: #007aff;
      color: #fff;
      font-weight: 500;
    }

    &:hover:not(.active) {
      background: rgba(255, 255, 255, 0.06);
    }
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;

  h2 {
    font-size: 19px;
    font-weight: 700;
    margin: 0 0 16px;
  }

  .setting-group {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    overflow: hidden;

    .row {
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-size: 13px;
        font-weight: 500;
      }

      .desc {
        color: #8e8e93;
        font-size: 11px;
        margin-top: 2px;
      }
    }
  }

  .theme-options {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;

    .theme-card {
      align-items: center;
      border: 2px solid transparent;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;
      transition: all 0.15s ease;

      &.selected {
        border-color: #007aff;
      }

      .preview {
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        height: 60px;
        width: 90px;
      }

      span {
        font-size: 12px;
      }
    }
  }

  .wallpaper-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));

    .wp-card {
      border: 2px solid transparent;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: transform 0.15s ease;

      &.selected {
        border-color: #007aff;
      }

      &:hover {
        transform: scale(1.03);
      }

      .thumb {
        align-items: center;
        display: flex;
        font-size: 24px;
        height: 80px;
        justify-content: center;
        width: 100%;
      }

      .title {
        background: rgba(0, 0, 0, 0.4);
        font-size: 11px;
        font-weight: 500;
        padding: 6px;
        text-align: center;
      }
    }
  }
`;

const MacSettings: FC<ComponentProcessProps> = () => {
  const [activeTab, setActiveTab] = useState<string>("appearance");
  const [selectedTheme, setSelectedTheme] = useState<string>("dark");
  const wallpaperImage = useWallpaperImage();
  const closeEffect = useCloseEffect();
  const [selectedWallpaper, setSelectedWallpaper] = useState<string>(
    wallpaperImage || "GALAXY"
  );
  const { setCloseEffect, setWallpaper } = useSessionActions();

  const handleWallpaperChange = useCallback(
    (wp: string) => {
      setSelectedWallpaper(wp);
      setWallpaper(wp);
    },
    [setWallpaper]
  );

  return (
    <Container>
      <Sidebar>
        <div className="user-card">
          <div className="avatar">
            <img alt="Ga kon" src="/System/Icons/gakon.png" />
          </div>
          <div className="info">
            <span className="name">Ga kon</span>
            <span className="apple-id">@g4kon.gg • Apple ID, iCloud+</span>
          </div>
        </div>

        <div
          className={`nav-item ${activeTab === "appearance" ? "active" : ""}`}
          onClick={() => setActiveTab("appearance")}
        >
          <div className="icon-badge" style={{ background: "#5856d6" }}>
            🎨
          </div>
          <span>Giao diện</span>
        </div>

        <div
          className={`nav-item ${activeTab === "wallpaper" ? "active" : ""}`}
          onClick={() => setActiveTab("wallpaper")}
        >
          <div className="icon-badge" style={{ background: "#007aff" }}>
            🖼️
          </div>
          <span>Hình nền</span>
        </div>

        <div
          className={`nav-item ${activeTab === "sound" ? "active" : ""}`}
          onClick={() => setActiveTab("sound")}
        >
          <div className="icon-badge" style={{ background: "#ff3b30" }}>
            🔊
          </div>
          <span>Âm thanh</span>
        </div>

        <div
          className={`nav-item ${activeTab === "wifi" ? "active" : ""}`}
          onClick={() => setActiveTab("wifi")}
        >
          <div className="icon-badge" style={{ background: "#34c759" }}>
            📶
          </div>
          <span>Wi-Fi</span>
        </div>
      </Sidebar>

      <Content>
        {activeTab === "appearance" && (
          <>
            <h2>Giao diện (Appearance)</h2>
            <div className="theme-options">
              <div
                className={`theme-card ${selectedTheme === "light" ? "selected" : ""}`}
                onClick={() => setSelectedTheme("light")}
              >
                <div className="preview" style={{ background: "#ffffff" }} />
                <span>Sáng (Light)</span>
              </div>
              <div
                className={`theme-card ${selectedTheme === "dark" ? "selected" : ""}`}
                onClick={() => setSelectedTheme("dark")}
              >
                <div className="preview" style={{ background: "#1c1c1e" }} />
                <span>Tối (Dark)</span>
              </div>
              <div
                className={`theme-card ${selectedTheme === "auto" ? "selected" : ""}`}
                onClick={() => setSelectedTheme("auto")}
              >
                <div
                  className="preview"
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffff 50%, #1c1c1e 50%)",
                  }}
                />
                <span>Tự động (Auto)</span>
              </div>
            </div>

            <div className="setting-group">
              <div className="row">
                <div>
                  <div className="label">Màu chủ đạo (Accent Color)</div>
                  <div className="desc">Màu nổi bật cho các nút bấm và menu</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#007aff", "#af52de", "#ff2d55", "#ff9500", "#34c759"].map(
                    (color) => (
                      <div
                        key={color}
                        style={{
                          background: color,
                          borderRadius: "50%",
                          cursor: "pointer",
                          height: 18,
                          width: 18,
                        }}
                      />
                    )
                  )}
                </div>
              </div>
              <div className="row">
                <div>
                  <div className="label">Hiệu ứng Liquid Glass (Blur)</div>
                  <div className="desc">Bật độ mờ kính cho TopBar và Dock</div>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="row">
                <div>
                  <div className="label">Hiệu ứng tắt ứng dụng (Close Effect)</div>
                  <div className="desc">Kỹ xảo WebGL / Shader khi đóng cửa sổ app</div>
                </div>
                <select
                  aria-label="Hiệu ứng tắt ứng dụng"
                  onChange={(e) => setCloseEffect(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: 6,
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 12,
                    outline: "none",
                    padding: "5px 10px",
                  }}
                  value={closeEffect}
                >
                  {CLOSE_EFFECT_NAMES.map((name) => (
                    <option
                      key={name}
                      style={{ background: "#222", color: "#fff" }}
                      value={name}
                    >
                      {name === "Random"
                        ? "✨ Ngẫu nhiên (Random)"
                        : name === "None"
                          ? "🍎 Thu nhỏ mờ dần (macOS Smooth)"
                          : name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {activeTab === "wallpaper" && (
          <>
            <h2>Hình nền (Wallpaper)</h2>
            <div className="wallpaper-grid">
              {[
                {
                  id: "/Users/Public/Videos/nen.mp4",
                  name: "Video Nền 1",
                  videoSrc: "/Users/Public/Videos/nen.mp4",
                },
                {
                  id: "/Users/Public/Videos/nen2.mp4",
                  name: "Video Nền 2",
                  videoSrc: "/Users/Public/Videos/nen2.mp4",
                },
                {
                  id: "/Users/Public/Videos/nen3.mp4",
                  name: "Video Nền 3",
                  videoSrc: "/Users/Public/Videos/nen3.mp4",
                },
                {
                  id: "/Users/Public/Videos/nen4.mp4",
                  name: "Video Nền 4",
                  videoSrc: "/Users/Public/Videos/nen4.mp4",
                },
                {
                  id: "/Users/Public/Videos/nen5.mp4",
                  name: "Video Nền 5",
                  videoSrc: "/Users/Public/Videos/nen5.mp4",
                },
                {
                  id: "/Users/Public/Videos/nen6.mp4",
                  name: "Video Nền 6",
                  videoSrc: "/Users/Public/Videos/nen6.mp4",
                },
                {
                  id: "/Users/Public/Videos/nen7.mp4",
                  name: "Video Nền 7",
                  videoSrc: "/Users/Public/Videos/nen7.mp4",
                },
                {
                  id: "GALAXY",
                  name: "Thiên hà (Galaxy 3D)",
                  style: "linear-gradient(135deg, #09090e, #1a1a3a)",
                },
                {
                  id: "MATRIX",
                  name: "Matrix Rain",
                  style: "linear-gradient(135deg, #001100, #003300)",
                },
                {
                  id: "VANTA",
                  name: "Vanta Waves",
                  style: "linear-gradient(135deg, #002244, #004488)",
                },
                {
                  id: "HEXELLS",
                  name: "Hexells",
                  style: "linear-gradient(135deg, #330033, #660066)",
                },
                {
                  id: "COASTAL_LANDSCAPE",
                  name: "Bờ biển (Coastal)",
                  style: "linear-gradient(135deg, #ff9966, #ff5e62)",
                },
              ].map((wp) => (
                <div
                  key={wp.id}
                  className={`wp-card ${selectedWallpaper === wp.id ? "selected" : ""}`}
                  onClick={() => handleWallpaperChange(wp.id)}
                >
                  <div
                    className="thumb"
                    style={{
                      background: wp.style || "#0a0a10",
                      overflow: "hidden",
                    }}
                  >
                    {wp.videoSrc ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        src={wp.videoSrc}
                        style={{
                          height: "100%",
                          objectFit: "cover",
                          pointerEvents: "none",
                          width: "100%",
                        }}
                      />
                    ) : (
                      "✨"
                    )}
                  </div>
                  <div className="title">{wp.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "sound" && (
          <>
            <h2>Âm thanh (Sound)</h2>
            <div className="setting-group">
              <div className="row">
                <span className="label">Âm lượng cảnh báo</span>
                <input defaultValue="75" max="100" min="0" type="range" />
              </div>
              <div className="row">
                <span className="label">Phát âm thanh khởi động</span>
                <input defaultChecked type="checkbox" />
              </div>
            </div>
          </>
        )}

        {activeTab === "wifi" && (
          <>
            <h2>Wi-Fi</h2>
            <div className="setting-group">
              <div className="row">
                <div>
                  <div className="label">Wi-Fi</div>
                  <div className="desc">Đang kết nối: Apple Network 5GHz</div>
                </div>
                <input defaultChecked type="checkbox" />
              </div>
            </div>
          </>
        )}
      </Content>
    </Container>
  );
};

export default memo(MacSettings);
