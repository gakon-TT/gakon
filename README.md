<div align="center">

# 🌌 GOS — Ga kon Operating System 🌌
### *Môi trường Desktop hiện đại, mượt mà chạy trực tiếp trên trình duyệt Web*

[![Live Demo](https://img.shields.io/badge/Demo-gakon.dev-00f5d4?style=for-the-badge&logo=googlechrome&logoColor=black)](http://gakon.dev)
[![Developer](https://img.shields.io/badge/Developer-Ga_kon-ec4899?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://facebook.com/gak0nn)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[🌐 Trải nghiệm trực tuyến](http://gakon.dev) • [🎵 Gakon Music](https://music.gakon.dev/) • [👨‍💻 Thông tin tác giả](#-thông-tin-tác-giả--developer-profile) • [✨ Tính năng chính](#-tính-năng-nổi-bật) • [🚀 Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt--khởi-chạy)

---

</div>

## 📖 Giới thiệu tổng quan

**GOS (Ga kon Operating System)** là một hệ điều hành mô phỏng trên nền tảng Web (Web Desktop Environment) được tùy biến và phát triển bởi **Ga kon (Tài Trần )**, kế thừa nền tảng từ dự án mã nguồn mở [daedalOS](https://github.com/DustinBrett/daedalOS).

Dự án tái hiện trọn vẹn trải nghiệm của một hệ điều hành thực thụ kết hợp phong cách **macOS Sequoia** thanh lịch và hơi thở **Cyberpunk / VisionOS** hiện đại:
- 🚀 **Không cần cài đặt**: Khởi chạy trực tiếp ngay trên trình duyệt máy tính và điện thoại.
- 💾 **Hệ thống tệp thực thụ**: Lưu trữ dữ liệu an toàn ngay trên máy của bạn qua IndexedDB.
- 🪟 **Đa nhiệm hoàn hảo**: Cửa sổ kéo thả, thu phóng, menu chuột phải, thanh taskbar và top bar thông minh.
- 🧪 **Kho ứng dụng & Giả lập khổng lồ**: Soạn thảo code (Monaco), Terminal (Git & Python), giả lập Windows/DOS, chơi game console cổ điển, nghe nhạc US-UK chất lượng cao và tích hợp trí tuệ nhân tạo (AI).

---

## 👨‍💻 Thông tin tác giả / Developer Profile

<div align="center">

| Thông tin | Chi tiết |
| :--- | :--- |
| **Họ và tên** | **Tài Trần ** (Ga kon) |
| **Username / Handle** | `@g4kon.gg` / `_gakon` |
| **Vai trò** | Digital Creator & Cyberpunk Architect / Fullstack Web Developer |
| **Vị trí** | TP. Hồ Chí Minh, Việt Nam *(10.82°N, 106.63°E)* |
| **Lĩnh vực chuyên môn** | React, Next.js, Cyberpunk UI & Web Systems, Quản trị hệ thống & Máy chủ |
| **Website chính thức** | [gakon.dev](http://gakon.dev) |
| **Hệ sinh thái âm nhạc** | [music.gakon.dev (GAKON MUSIC)](https://music.gakon.dev/) |
| **Email liên hệ** | [gakon@g4kon.gg](mailto:gakon@g4kon.gg) |

### 🌐 Kết nối cùng tôi

[![Discord](https://img.shields.io/badge/Discord-_gakon-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/users/882230994499948625)
[![Facebook](https://img.shields.io/badge/Facebook-Ga_kon-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/gak0nn)
[![Spotify](https://img.shields.io/badge/Spotify-_gakon-1DB954?style=for-the-badge&logo=spotify&logoColor=white)](https://open.spotify.com/user/31hfwjh4pvtpsiz5wujs6fnkb4ai?si=79c4d27140014c82)
[![Steam](https://img.shields.io/badge/Steam-_gakon-000000?style=for-the-badge&logo=steam&logoColor=white)](https://steamcommunity.com/profiles/76561199245171581/)

</div>

---

## ✨ Tính năng nổi bật

### 1. 🧠 Hệ thống lõi (Core System)

* **📁 Hệ thống tệp ảo mạnh mẽ (File System)**:
  * Được cung cấp bởi [BrowserFS](https://github.com/jvilk/BrowserFS), lưu dữ liệu vĩnh viễn vào [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).
  * Hỗ trợ kéo & thả tệp tin từ máy thật vào trình duyệt và ngược lại.
  * Hỗ trợ nén & giải nén đa định dạng: `ZIP`, `ISO`, `RAR`, `7Z`, `TAR`, `GZ` qua WebAssembly ([fflate](https://www.npmjs.com/package/fflate), [7z-wasm](https://github.com/use-strict/7z-wasm)).
  * Trích xuất thumbnail và metadata tự động cho ảnh, nhạc, video và file save của trình giả lập.
  * Menu ngữ cảnh chuột phải đầy đủ chức năng: Cắt, Sao chép, Đổi tên, Nén, Trích xuất, Đặt làm hình nền, Chuyển đổi định dạng đa phương tiện qua [FFmpeg WASM](https://github.com/ffmpegwasm/ffmpeg.wasm).

* **🪟 Trình quản lý cửa sổ (Window Management)**:
  * Tùy biến kích thước, di chuyển linh hoạt dựa trên [react-rnd](https://github.com/bokuweb/react-rnd).
  * Thu nhỏ (Minimize), phóng to (Maximize), đóng kèm hiệu ứng chuyển động mượt mà của [Framer Motion](https://www.framer.com/motion/).
  * Tự động lưu vị trí và kích thước cửa sổ cho lần đăng nhập sau.

* **🍎 Thanh điều hướng macOS (Top Bar) & Start Menu**:
  * Menu Apple kinh điển tích hợp thông tin hệ thống **macOS Sequoia - Ga kon Edition**.
  * Spotlight Search tìm kiếm tức thì ứng dụng và tệp tin.
  * Trung tâm điều khiển (Control Center) quản lý Wi-Fi, âm lượng, độ sáng màn hình.
  * Xem trước cửa sổ thu nhỏ (Peek Window Preview) khi rê chuột vào taskbar.

* **⏰ Đồng hồ & Hiệu năng**:
  * Chạy trên luồng riêng [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) vẽ bằng [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas), tiết kiệm tài nguyên CPU.
  * Đồng bộ giờ chuẩn NTP server quốc tế.

* **🌌 Hình nền động & Trình bảo vệ màn hình (Screensavers)**:
  * Hình nền dải ngân hà Milky Way 3D tương tác cảm ứng con trỏ chuột.
  * Hiệu ứng sóng biển ([Vanta.js](https://www.vantajs.com/?effect=waves)), Matrix Rain, Hexells, Shader cảnh quan biển.
  * Tự động tải hình ảnh thiên văn trong ngày từ [NASA APOD](https://api.nasa.gov/#apod) và bảo tàng nghệ thuật [Metropolitan](https://metmuseum.github.io/).
  * Tạo hình nền bằng AI [Stable Diffusion](https://stability.ai/stable-diffusion).
  * Bộ sưu tập Screensaver retro: 3D FlowerBox, 3D Maze (mê cung Windows 95), Pipes.

---

### 2. 🧪 Ứng dụng tích hợp (Built-in Apps)

#### 💻 Công việc & Lập trình
| Ứng dụng | Mô tả & Tính năng |
| :--- | :--- |
| **Monaco Editor** | Trình soạn thảo mã nguồn mạnh mẽ tương tự VS Code. Hỗ trợ highlight syntax, tự động định dạng mã qua [Prettier](https://prettier.io/) (JS, TS, JSON, CSS, HTML, Markdown). Lưu file bằng `Ctrl + S`. |
| **Terminal** | Dòng lệnh mô phỏng UNIX ([xterm.js](https://xtermjs.org/)). Tích hợp [Git](https://isomorphic-git.org/) (checkout/clone), [Python](https://pyodide.org/) chạy trực tiếp trong browser, WAPM, FFmpeg chuyển đổi file, Neofetch hiển thị cấu hình. |
| **Browser** | Trình duyệt web trong web hỗ trợ CORS proxy, lưu bookmark, tìm kiếm Google, hỗ trợ giao thức phi tập trung IPFS và trò chơi khủng long `chrome://dino`. |
| **TinyMCE** | Soạn thảo văn bản dạng WYSIWYG tiện dụng, hỗ trợ đọc và lưu các định dạng `.rtf`, `.whtml`. |
| **PDF Reader** | Đọc, xem trước và in tài liệu PDF trực tiếp với [PDF.js](https://mozilla.github.io/pdf.js/). |
| **Marked** | Trình đọc và hiển thị tài liệu định dạng Markdown (`.md`). |
| **Vim** | Trình soạn thảo văn bản huyền thoại trên terminal dành cho các lập trình viên yêu thích phím tắt. |
| **DevTools** | Bộ công cụ phát triển [Eruda](https://eruda.liriliri.io/) (Console, Elements, Network, Sources, DOM) mở nhanh bằng `Shift + F12`. |

#### 🎨 Đa phương tiện & Giải trí
| Ứng dụng | Mô tả & Tính năng |
| :--- | :--- |
| **Ga kon (VisionOS)** | Ứng dụng hồ sơ cá nhân mang phong cách Apple VisionOS 3D không gian, tích hợp trình nghe nhạc US-UK trực tuyến độc quyền, điều chỉnh âm lượng thông minh và đếm lượt truy cập đồng bộ. |
| **Webamp** | Bản dựng lại hoàn hảo của trình phát nhạc huyền thoại Winamp: hỗ trợ tải skin từ Winamp Skin Museum, equalizer và hiệu ứng đồ họa Milkdrop thị giác sống động. |
| **Video Player** | Xem video chất lượng cao ([Video.js](https://videojs.com/)), hỗ trợ phím tắt và phát trực tiếp các đường link YouTube. |
| **Photos** | Trình xem ảnh sắc nét hỗ trợ zoom, xoay và mở hầu hết định dạng hình ảnh hiện đại: HEIF/HEIC, JPEG XL (JXL), QOI, TIFF, WebP, PNG, SVG,... |
| **Paint (JS Paint)** | Bản sao hoài niệm của Microsoft Paint kinh điển, vẽ và xuất các định dạng ảnh thông dụng. |
| **DesktopFly** | Nuôi ruồi ảo trên màn hình dựa trên mô phỏng mạng nơ-ron kết nối của 1.275 nơ-ron [FlyWire](https://flywire.ai/). |

#### 🤖 Trí tuệ nhân tạo (AI Tools)
| Ứng dụng | Mô tả & Tính năng |
| :--- | :--- |
| **AI Chat Agent** | Trợ lý ảo AI chạy trực tiếp trên client thông qua [WebLLM](https://github.com/mlc-ai/web-llm) hoặc Google Prompt API, hỗ trợ hỏi đáp, tóm tắt và sinh ảnh. |
| **Stable Diffusion** | Tạo ảnh nghệ thuật 512x512 bằng AI offline cục bộ ngay trên máy thông qua [WebSD](https://mlc.ai/web-stable-diffusion/). |

---

### 3. 🕹️ Giả lập & Trò chơi kinh điển (Emulators & Games)

GOS là một thiên đường cho những ai yêu thích máy tính cổ điển và game retro:

* **[BoxedWine](http://www.boxedwine.org/)**: Chạy trực tiếp các phần mềm Windows 16/32-bit (`.exe`, `.zip`) ngay trên web.
* **[js-dos](https://js-dos.com/)**: Giả lập hệ điều hành MS-DOS với tính năng tự động lưu trạng thái khi đóng.
* **[Virtual x86](https://copy.sh/v86/)**: Trình giả lập phần cứng x86 chạy các bản phân phối Linux hoặc Windows 95/98 từ tệp ISO/IMG.
* **[EmulatorJS](https://github.com/ethanaobrien/emulatorjs)**: Cỗ máy chiến game console hỗ trợ hơn 25 hệ máy: NES, SNES, Game Boy, GBA, Nintendo 64, Nintendo DS, Sega Genesis, Neo Geo,...
* **[Ruffle](https://ruffle.rs/)**: Chạy mượt mà các trò chơi và hoạt ảnh Flash cổ điển (`.swf`).
* **[TIC-80](https://tic80.com/)**: Máy tính tí hon giả lập chơi các tựa game fantasy 8-bit thú vị.

#### 🎮 Các trò chơi sẵn có:
- **Quake III Arena**: Bản chuyển đổi mượt mà của huyền thoại bắn súng góc nhìn thứ nhất.
- **Space Cadet Pinball**: Trò chơi Pinball 3D huyền thoại từng gắn liền với tuổi thơ trên Windows.
- **ClassiCube**: Phiên bản web tương thích hoàn hảo với Minecraft Classic.
- **DX-Ball**: Game đập gạch arcade kinh điển Arkanoid.
- **Chess**: Đánh cờ vua trực tiếp cùng đại kiện tướng AI mã nguồn mở hàng đầu thế giới [Stockfish](https://github.com/nmrugg/stockfish.js).

---

## ⌨️ Phím tắt hữu ích (Keyboard Shortcuts)

| Phím tắt | Chức năng |
| :--- | :--- |
| **Shift + Esc** | Mở Start Menu / Menu hệ thống |
| **Shift + F10** | Khởi chạy Terminal |
| **Shift + F12** | Mở công cụ nhà phát triển (DevTools) |
| **Ctrl + S** | Lưu tệp trong Monaco Editor / TinyMCE |
| **Ctrl + C / V / X** | Sao chép, Dán, Cắt tệp tin hoặc văn bản |
| **F2** | Đổi tên tệp / thư mục đang chọn |
| **Delete** | Xóa tệp / thư mục |
| **Ctrl + A** | Chọn tất cả tệp trong thư mục |
| **Phím Windows** *(khi bật toàn màn hình)* | Mở nhanh Start Menu |

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### 📋 Yêu cầu hệ thống
- [Node.js](https://nodejs.org/en/download/) (Khuyến nghị phiên bản LTS v20 hoặc mới hơn)
- [Yarn](https://yarnpkg.com/en/) (`npm install -g yarn`)

### 🛠️ Các bước thực hiện

1. **Cài đặt thư viện phụ thuộc**:
   ```bash
   yarn install
   ```

2. **Tiền xử lý tài nguyên hệ thống (Icons, Search Index, File System)**:
   ```bash
   yarn build:prebuild
   ```

3. **Khởi chạy môi trường phát triển (Development)**:
   ```bash
   yarn dev
   ```
   Sau khi hoàn tất, mở trình duyệt và truy cập: `http://localhost:3000`

---

### 📦 Đóng gói & Chạy Production

* **Build ứng dụng tĩnh**:
  ```bash
  yarn build
  yarn serve
  ```

* **Chạy bằng Docker**:
  ```bash
  docker build -t gos .
  docker run -dp 3000:3000 --rm --name gos gos
  ```

> [!NOTE]
> Nếu bạn gặp phải lỗi `digital envelope routines::unsupported` trong lúc chạy `yarn install` hoặc build, vui lòng thiết lập biến môi trường sau:
> - **Windows (PowerShell)**: `$env:NODE_OPTIONS="--openssl-legacy-provider"`
> - **Linux / macOS**: `export NODE_OPTIONS="--openssl-legacy-provider"`

---

## 🏗️ Kiến trúc & Công nghệ (Tech Stack)

* **Core Framework**: [Next.js](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
* **Giao diện & Chuyển động**: [styled-components](https://styled-components.com/), [Framer Motion](https://www.framer.com/motion/), Apple SF Pro Design System
* **Lưu trữ & Hệ thống tệp**: [BrowserFS](https://github.com/jvilk/BrowserFS), [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), [idb](https://github.com/jakearchibald/idb)
* **Xử lý đồ họa & Đa phương tiện**: WebAssembly (WASM), Web Workers, [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas), [FFmpeg WASM](https://ffmpegwasm.netlify.app/), WebGL, Three.js
* **Chất lượng mã nguồn**: [oxlint](https://oxc.rs/), [Stylelint](https://stylelint.io/), [Prettier](https://prettier.io/), [Jest](https://jestjs.io/), [Playwright](https://playwright.dev/)

---

## 🤝 Lời cảm ơn & Bản quyền (Credits & License)

- Dự án được tùy biến, phát triển và duy trì bởi **[Ga kon (Tài Trần )](http://gakon.dev)**.
- Được xây dựng trên nền tảng dự án nguồn mở xuất sắc **[daedalOS](https://github.com/DustinBrett/daedalOS)** được tạo bởi **[Dustin Brett](https://dustinbrett.com/)**.
- Xin chân thành cảm ơn toàn thể cộng đồng mã nguồn mở đã đóng góp những thư viện tuyệt vời để hiện thực hóa dự án này. Xem chi tiết danh sách tại [CREDITS.md](public/CREDITS.md).
- Mã nguồn được phân phối dưới giấy phép **[MIT License](LICENSE)**.

---

<div align="center">
  <sub>Được thiết kế và phát triển với cả đam mê bởi <b>Ga kon</b> © 2026.</sub>
</div>
