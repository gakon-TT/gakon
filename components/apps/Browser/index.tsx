import { basename, join, resolve } from "path";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  bookmarks,
  DINO_GAME,
  GAKON_SITE,
  HOME_PAGE,
  NOT_FOUND,
  PROXIES,
  SURF_TO_MISC,
} from "components/apps/Browser/config";
import {
  createDirectoryIndex,
  type DirectoryEntries,
} from "components/apps/Browser/directoryIndex";
import {
  SafariBookOpenIcon,
  SafariChevronLeft,
  SafariChevronRight,
  SafariCloseIcon,
  SafariLockIcon,
  SafariPlusIcon,
  SafariReloadIcon,
  SafariShareIcon,
  SafariShieldIcon,
  SafariSidebarIcon,
  SafariStopIcon,
  SafariTabOverviewIcon,
} from "components/apps/Browser/SafariIcons";
import SafariStartPage from "components/apps/Browser/SafariStartPage";
import SafariYouTube from "components/apps/Browser/SafariYouTube";
import StyledBrowser from "components/apps/Browser/StyledBrowser";
import useBookmarkMenu from "components/apps/Browser/useBookmarkMenu";
import useHistoryMenu from "components/apps/Browser/useHistoryMenu";
import useProxyMenu, {
  type ProxyState,
} from "components/apps/Browser/useProxyMenu";
import { ADDRESS_INPUT_PROPS } from "components/apps/FileExplorer/AddressBar";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import {
  getInfoWithExtension,
  getModifiedTime,
  getShortcutInfo,
} from "components/system/Files/FileEntry/functions";
import useTitle from "components/system/Window/useTitle";
import { useFileSystemActions, useFs } from "contexts/fileSystem";
import { hasProcess, useProcess, useProcessesActions } from "contexts/process";
import { useSessionActions } from "contexts/session";
import useHistory from "hooks/useHistory";
import Button from "styles/common/Button";
import Icon from "styles/common/Icon";
import {
  FAVICON_BASE_PATH,
  IFRAME_CONFIG,
  ONE_TIME_PASSIVE_EVENT,
  SHORTCUT_EXTENSION,
} from "utils/constants";
import {
  getExtension,
  getUrlOrSearch,
  GOOGLE_SEARCH_QUERY,
  haltEvent,
  label,
  LOCAL_HOST,
} from "utils/functions";

declare module "react" {
  interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
    credentialless?: "credentialless";
  }
}

type Tab = {
  icon?: string;
  id: string;
  title: string;
  url: string;
};

const SAFARI_BOOKMARKS = [
  {
    icon: "/System/Icons/safari.svg",
    name: "Apple",
    url: "https://www.apple.com",
  },
  {
    icon: "/System/Icons/Favicons/16x16/google.webp",
    name: "Google",
    url: "https://www.google.com/webhp?igu=1",
  },
  {
    icon: "/System/Icons/Favicons/16x16/wikipedia.webp",
    name: "Wikipedia",
    url: "https://www.wikipedia.org/",
  },
  {
    icon: "/System/Icons/Favicons/16x16/dino.webp",
    name: "Dino Game",
    url: "chrome://dino",
  },
  {
    icon: "/System/Icons/Favicons/16x16/archive.webp",
    name: "Internet Archive",
    url: "https://archive.org/",
  },
  {
    icon: "/System/Icons/48x48/webamp.webp",
    name: "Winamp Museum",
    url: "https://skins.webamp.org/",
  },
  {
    icon: "/System/Icons/gakon.png",
    name: "Ga kon",
    url: "http://gakon.dev",
  },
];

const Browser: FC<ComponentProcessProps> = ({ id }) => {
  const {
    icon: setIcon,
    linkElement,
    open,
    url: changeUrl,
  } = useProcessesActions();
  const process = useProcess(id);
  const { setForegroundId, updateRecentFiles } = useSessionActions();
  const { prependFileToTitle } = useTitle(id);
  const { initialTitle = "", url = "" } = process;
  const initialUrl =
    !url || url === "https://www.google.com/webhp?igu=1"
      ? HOME_PAGE
      : url;
  const { canGoBack, canGoForward, history, moveHistory, position } =
    useHistory(initialUrl, id);
  const { exists, readdir, readFile, stat } = useFileSystemActions();
  const fs = useFs();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [srcDoc, setSrcDoc] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showToast, setShowToast] = useState("");

  // Tabs state
  const [tabs, setTabs] = useState<Tab[]>([
    {
      icon:
        initialUrl === "safari:startpage" || !initialUrl
          ? "/System/Icons/safari.svg"
          : initialUrl.includes("google")
            ? "/System/Icons/Favicons/16x16/google.webp"
            : "/System/Icons/safari.svg",
      id: "tab-initial",
      title:
        initialUrl === "safari:startpage" || !initialUrl
          ? "Trang bắt đầu"
          : initialUrl.includes("google")
            ? "Google"
            : "Safari",
      url: initialUrl,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-initial");

  const changeHistory = (step: number): void => {
    moveHistory(step);
    if (inputRef.current) inputRef.current.value = history[position + step];
  };

  const currentUrl = useRef("");
  const changeIframeWindowLocation = (
    newUrl: string,
    contentWindow: Window
  ): void => {
    let isSrcDoc = false;

    try {
      isSrcDoc = contentWindow.location?.pathname === "srcdoc";
    } catch {
      // Ignore failure to read iframe window path
    }

    if (isSrcDoc) {
      setSrcDoc("");
      iframeRef.current?.setAttribute("src", newUrl);
    } else {
      contentWindow.location?.replace(newUrl);
    }
  };

  const goToLink = useCallback(
    (newUrl: string, newTitle?: string): void => {
      if (inputRef.current) {
        inputRef.current.value = newUrl;
      }

      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeTabId
            ? {
                ...tab,
                title: newTitle || tab.title,
                url: newUrl,
              }
            : tab
        )
      );

      changeUrl(id, newUrl);
    },
    [activeTabId, changeUrl, id]
  );

  const { backMenu, forwardMenu } = useHistoryMenu(
    history,
    position,
    moveHistory
  );
  const [proxyState, setProxyState] = useState<ProxyState>("CORS");
  const proxyMenu = useProxyMenu(proxyState, setProxyState);
  const bookmarkMenu = useBookmarkMenu();

  const setUrl = useCallback(
    async (addressInput: string): Promise<void> => {
      if (addressInput === "safari:startpage" || !addressInput) {
        setLoading(false);
        setSrcDoc("");
        setIcon(id, "/System/Icons/safari.svg");
        prependFileToTitle("Trang bắt đầu");
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === activeTabId
              ? {
                  ...tab,
                  icon: "/System/Icons/safari.svg",
                  title: "Trang bắt đầu",
                  url: "safari:startpage",
                }
              : tab
          )
        );
        return;
      }

      const lowerAddress = addressInput.toLowerCase();
      if (
        addressInput === "safari:youtube" ||
        lowerAddress.includes("youtube.com") ||
        lowerAddress.includes("youtu.be")
      ) {
        setLoading(false);
        setSrcDoc("");
        setIcon(id, "/System/Icons/safari.svg");
        prependFileToTitle("YouTube");
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === activeTabId
              ? {
                  ...tab,
                  icon: "/System/Icons/safari.svg",
                  title: "YouTube",
                  url: "safari:youtube",
                }
              : tab
          )
        );
        return;
      }

      const { contentWindow } = iframeRef.current || {};

      if (contentWindow?.location) {
        const isHtml =
          [".htm", ".html"].includes(getExtension(addressInput)) &&
          (await exists(addressInput));

        setLoading(true);
        if (isHtml) setSrcDoc((await readFile(addressInput)).toString());
        setIcon(id, "/System/Icons/safari.svg");

        const loadLocalSite = (localPath: string, localTitle: string): void => {
          iframeRef.current?.removeAttribute("sandbox");
          changeIframeWindowLocation(
            `${window.location.origin}${localPath}`,
            contentWindow
          );
          prependFileToTitle(localTitle);
          setTabs((prev) =>
            prev.map((tab) =>
              tab.id === activeTabId
                ? { ...tab, title: localTitle, url: addressInput }
                : tab
            )
          );
        };
        const lowerAddressInput = addressInput.toLowerCase();

        if (lowerAddressInput.startsWith(SURF_TO_MISC.url)) {
          loadLocalSite(SURF_TO_MISC.path, SURF_TO_MISC.name);
        } else if (lowerAddressInput.startsWith(DINO_GAME.url)) {
          loadLocalSite(DINO_GAME.path, `${DINO_GAME.url}/`);
        } else if (
          lowerAddressInput.startsWith(GAKON_SITE.url) ||
          lowerAddressInput.startsWith("https://gakon.dev") ||
          lowerAddressInput === "gakon.dev"
        ) {
          loadLocalSite(GAKON_SITE.path, GAKON_SITE.name);
        } else if (!isHtml) {
          iframeRef.current?.setAttribute("sandbox", IFRAME_CONFIG.sandbox);

          const processedUrl = await getUrlOrSearch(addressInput);

          if (
            LOCAL_HOST.has(processedUrl.host) ||
            LOCAL_HOST.has(addressInput)
          ) {
            const directory =
              decodeURI(processedUrl.pathname).replace(/\/$/, "") || "/";
            const searchParams = Object.fromEntries(
              new URLSearchParams(
                processedUrl.search.replace(";", "&")
              ).entries()
            );
            const { C: column, O: order } = searchParams;
            const isAscending = !order || order === "A";

            let newSrcDoc = NOT_FOUND;
            let newTitle = "404 Not Found";

            if (
              (await exists(directory)) &&
              (await stat(directory)).isDirectory()
            ) {
              const dirStats = (
                await Promise.all<DirectoryEntries>(
                  (await readdir(directory)).map(async (entry) => {
                    const href = join(directory, entry);
                    let description;
                    let shortcutUrl;

                    if (getExtension(entry) === SHORTCUT_EXTENSION) {
                      try {
                        ({ comment: description, url: shortcutUrl } =
                          getShortcutInfo(await readFile(href)));
                      } catch {
                        // Ignore failure to read shortcut
                      }
                    }

                    const filePath =
                      shortcutUrl && (await exists(shortcutUrl))
                        ? shortcutUrl
                        : href;
                    const stats = await stat(filePath);
                    const isDir = stats.isDirectory();

                    return {
                      description,
                      href: isDir && shortcutUrl ? shortcutUrl : href,
                      icon: isDir ? "folder" : undefined,
                      modified: getModifiedTime(filePath, stats),
                      size: isDir || shortcutUrl ? undefined : stats.size,
                    };
                  })
                )
              )
                .sort(
                  (a, b) =>
                    Number(b.icon === "folder") - Number(a.icon === "folder")
                )
                .sort((a, b) => {
                  const aIsFolder = a.icon === "folder";
                  const bIsFolder = b.icon === "folder";

                  if (aIsFolder === bIsFolder) {
                    const aName = basename(a.href);
                    const bName = basename(b.href);

                    if (isAscending) return aName < bName ? -1 : 1;

                    return aName > bName ? -1 : 1;
                  }

                  return 0;
                })
                .sort((a, b) => {
                  if (!column || column === "N") return 0;

                  const sortValue = (
                    getValue: (entry: DirectoryEntries) => number | string
                  ): number => {
                    const aValue = getValue(a);
                    const bValue = getValue(b);

                    if (aValue === bValue) return 0;
                    if (isAscending) return aValue < bValue ? -1 : 1;

                    return aValue > bValue ? -1 : 1;
                  };

                  if (column === "S") {
                    return sortValue(({ size }) => size ?? 0);
                  }

                  if (column === "M") {
                    return sortValue(({ modified }) => modified ?? 0);
                  }

                  if (column === "D") {
                    return sortValue(({ description }) => description ?? "");
                  }

                  return 0;
                })
                .sort(
                  (a, b) =>
                    Number(b.icon === "folder") - Number(a.icon === "folder")
                );

              iframeRef.current?.addEventListener(
                "load",
                () => {
                  try {
                    contentWindow.document.body
                      .querySelectorAll("a")
                      .forEach((a) => {
                        a.addEventListener("click", (event) => {
                          event.preventDefault();

                          const target =
                            event.currentTarget as HTMLAnchorElement;
                          const isDir =
                            target.getAttribute("type") === "folder";
                          const { origin, pathname, search } = new URL(
                            target.href
                          );

                          if (search) {
                            goToLink(
                              `${origin}${encodeURI(directory)}${search}`
                            );
                          } else if (isDir) {
                            goToLink(target.href);
                          } else if (fs && target.href) {
                            getInfoWithExtension(
                              fs,
                              decodeURI(pathname),
                              getExtension(pathname),
                              ({ pid, url: infoUrl }) => {
                                open(pid || "OpenWith", { url: infoUrl });

                                if (pid && infoUrl) {
                                  updateRecentFiles(infoUrl, pid);
                                }
                              }
                            );
                          }
                        });
                      });
                  } catch {
                    // Ignore failure to add click event listeners
                  }
                },
                ONE_TIME_PASSIVE_EVENT
              );

              newSrcDoc = createDirectoryIndex(
                directory,
                processedUrl.origin,
                searchParams,
                directory === "/"
                  ? dirStats
                  : [
                      {
                        href: resolve(directory, ".."),
                        icon: "back",
                      },
                      ...dirStats,
                    ]
              );

              newTitle = `Index of ${directory}`;
            }

            setSrcDoc(newSrcDoc);
            prependFileToTitle(newTitle);
            setTabs((prev) =>
              prev.map((tab) =>
                tab.id === activeTabId
                  ? { ...tab, title: newTitle, url: addressInput }
                  : tab
              )
            );
          } else {
            const addressUrl = PROXIES[proxyState]
              ? await PROXIES[proxyState](processedUrl.href)
              : processedUrl.href;

            changeIframeWindowLocation(addressUrl, contentWindow);

            let pageTitle = initialTitle;
            if (addressUrl.startsWith(GOOGLE_SEARCH_QUERY)) {
              pageTitle = `${addressInput} - Google Search`;
            } else {
              const { name } =
                bookmarks?.find(
                  ({ url: bookmarkUrl }) => bookmarkUrl === addressInput
                ) || {};
              if (name) pageTitle = name;
              else {
                try {
                  pageTitle = new URL(addressUrl).hostname.replace(
                    /^www\./,
                    ""
                  );
                } catch {
                  pageTitle = addressInput;
                }
              }
            }

            prependFileToTitle(pageTitle);
            setTabs((prev) =>
              prev.map((tab) =>
                tab.id === activeTabId
                  ? { ...tab, title: pageTitle, url: addressInput }
                  : tab
              )
            );

            if (addressInput.startsWith("ipfs://")) {
              setIcon(id, "/System/Icons/Favicons/ipfs.webp");
            } else {
              const favicon = new Image();
              const faviconUrl = `${
                new URL(addressUrl).origin
              }${FAVICON_BASE_PATH}`;

              favicon.addEventListener(
                "error",
                () => {
                  const { icon } =
                    bookmarks?.find(
                      ({ url: bookmarkUrl }) => bookmarkUrl === addressUrl
                    ) || {};

                  if (icon) {
                    setIcon(id, icon);
                    setTabs((prev) =>
                      prev.map((tab) =>
                        tab.id === activeTabId ? { ...tab, icon } : tab
                      )
                    );
                  }
                },
                ONE_TIME_PASSIVE_EVENT
              );
              favicon.addEventListener(
                "load",
                () => {
                  setIcon(id, faviconUrl);
                  setTabs((prev) =>
                    prev.map((tab) =>
                      tab.id === activeTabId
                        ? { ...tab, icon: faviconUrl }
                        : tab
                    )
                  );
                },
                ONE_TIME_PASSIVE_EVENT
              );
              favicon.decoding = "async";
              favicon.src = faviconUrl;
            }
          }
        }
      }
    },
    [
      activeTabId,
      exists,
      fs,
      goToLink,
      id,
      initialTitle,
      open,
      prependFileToTitle,
      proxyState,
      readFile,
      readdir,
      setIcon,
      stat,
      updateRecentFiles,
    ]
  );

  const supportsCredentialless = useMemo(
    () => "credentialless" in HTMLIFrameElement.prototype,
    []
  );

  useEffect(() => {
    if (hasProcess(process) && history[position] !== currentUrl.current) {
      currentUrl.current = history[position];
      setUrl(history[position]);
    }
  }, [history, position, process, setUrl]);

  useEffect(() => {
    if (iframeRef.current) {
      linkElement(id, "peekElement", iframeRef.current);
    }
  }, [id, linkElement]);

  const currentActiveUrl = history[position] || initialUrl;
  const isStartPage =
    currentActiveUrl === "safari:startpage" || currentActiveUrl === "";
  const isYouTube =
    currentActiveUrl === "safari:youtube" ||
    currentActiveUrl.toLowerCase().includes("youtube.com") ||
    currentActiveUrl.toLowerCase().includes("youtu.be");

  const displayUrlInfo = useMemo(() => {
    if (isStartPage) {
      return { domain: "Trang bắt đầu", isStartPage: true };
    }
    if (isYouTube) {
      return { domain: "youtube.com", isStartPage: false };
    }
    try {
      const parsed = new URL(currentActiveUrl);
      if (parsed.protocol === "chrome:") {
        return { domain: currentActiveUrl, isStartPage: false };
      }
      const domain = parsed.hostname.replace(/^www\./, "");
      const path =
        parsed.pathname !== "/" || parsed.search
          ? `${parsed.pathname}${parsed.search}`
          : "";
      return {
        domain,
        isStartPage: false,
        path: path.length > 28 ? `${path.slice(0, 28)}...` : path,
      };
    } catch {
      return { domain: currentActiveUrl, isStartPage: false };
    }
  }, [currentActiveUrl, isStartPage]);

  // Tab management
  const handleAddNewTab = () => {
    const newTabId = `tab-${Date.now()}`;
    const newTab: Tab = {
      icon: "/System/Icons/safari.svg",
      id: newTabId,
      title: "Trang bắt đầu",
      url: "safari:startpage",
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTabId);
    goToLink("safari:startpage", "Trang bắt đầu");
  };

  const handleCloseTab = (e: React.MouseEvent, closeId: string) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      setTabs([
        {
          icon: "/System/Icons/safari.svg",
          id: "tab-reset",
          title: "Trang bắt đầu",
          url: "safari:startpage",
        },
      ]);
      setActiveTabId("tab-reset");
      goToLink("safari:startpage", "Trang bắt đầu");
      return;
    }
    const remaining = tabs.filter((t) => t.id !== closeId);
    setTabs(remaining);
    if (activeTabId === closeId) {
      const nextTab = remaining[remaining.length - 1];
      setActiveTabId(nextTab.id);
      goToLink(nextTab.url, nextTab.title);
    }
  };

  const handleSelectTab = (tab: Tab) => {
    setActiveTabId(tab.id);
    goToLink(tab.url, tab.title);
  };

  const handleShare = () => {
    try {
      navigator.clipboard?.writeText(history[position] || initialUrl);
      setShowToast("Đã sao chép liên kết vào bộ nhớ tạm");
      setTimeout(() => setShowToast(""), 2200);
    } catch {
      // Ignore failure
    }
  };

  return (
    <StyledBrowser
      $hasSrcDoc={Boolean(srcDoc)}
      $sidebarOpen={sidebarOpen}
    >
      {/* 1. Safari Top Toolbar */}
      <nav aria-label="Safari Toolbar" className="safari-toolbar">
        {/* Left Toolbar Group */}
        <div className="toolbar-group left">
          <Button
            className={`safari-tool-btn ${sidebarOpen ? "active" : ""}`}
            onClick={() => setSidebarOpen((prev) => !prev)}
            {...label(sidebarOpen ? "Ẩn thanh bên" : "Hiện thanh bên")}
          >
            <SafariSidebarIcon />
          </Button>
          <Button
            className="safari-tool-btn"
            disabled={!canGoBack}
            onClick={() => changeHistory(-1)}
            {...label("Quay lại trang trước", "Back")}
            {...backMenu}
          >
            <SafariChevronLeft />
          </Button>
          <Button
            className="safari-tool-btn"
            disabled={!canGoForward}
            onClick={() => changeHistory(1)}
            {...label("Đi tới trang tiếp", "Forward")}
            {...forwardMenu}
          >
            <SafariChevronRight />
          </Button>
        </div>

        {/* Center: Safari Smart Search Address Capsule */}
        <div
          className={`safari-address-capsule ${isInputFocused ? "is-focused" : ""}`}
          onClick={() => {
            if (!isInputFocused) {
              setIsInputFocused(true);
              setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
              }, 30);
            }
          }}
        >
          <div
            className={`capsule-icon-left ${!displayUrlInfo.isStartPage ? "secure" : ""}`}
          >
            {!displayUrlInfo.isStartPage ? (
              <SafariLockIcon />
            ) : (
              <SafariShieldIcon />
            )}
          </div>

          {isInputFocused ? (
            <input
              ref={inputRef}
              aria-label="Address and search bar"
              className="safari-address-input"
              defaultValue={currentActiveUrl}
              onBlur={() => setIsInputFocused(false)}
              onKeyDown={({ key }) => {
                if (inputRef.current && key === "Enter") {
                  const val = inputRef.current.value.trim();
                  changeUrl(id, val);
                  if (currentUrl.current === val) {
                    setUrl(val);
                  }
                  window.getSelection()?.removeAllRanges();
                  setIsInputFocused(false);
                }
              }}
              {...ADDRESS_INPUT_PROPS}
            />
          ) : (
            <div className="capsule-display">
              <span className="domain-bold">{displayUrlInfo.domain}</span>
              {displayUrlInfo.path && (
                <span className="path-dimmed">{displayUrlInfo.path}</span>
              )}
            </div>
          )}

          <Button
            className="capsule-action-btn"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              setUrl(history[position]);
            }}
            onContextMenu={haltEvent}
            {...label("Tải lại trang này", "Reload")}
          >
            {loading ? (
              <div className="spin-loader">
                <SafariReloadIcon />
              </div>
            ) : isStartPage ? (
              <SafariReloadIcon />
            ) : (
              <SafariReloadIcon />
            )}
          </Button>
        </div>

        {/* Right Toolbar Group */}
        <div className="toolbar-group right">
          <Button
            className="safari-tool-btn"
            onClick={() => {
              const current = history[position];
              if (current && !current.startsWith("safari:")) {
                window.open(current, "_blank");
              } else if (isYouTube) {
                window.open("https://www.youtube.com", "_blank");
              }
            }}
            {...label("Mở trên tab trình duyệt ngoài ↗")}
          >
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>↗</span>
          </Button>
          <Button
            className="safari-tool-btn"
            onClick={handleShare}
            {...label("Chia sẻ trang này")}
          >
            <SafariShareIcon />
          </Button>
          <Button
            className="safari-tool-btn"
            onClick={handleAddNewTab}
            {...label("Mở tab mới")}
          >
            <SafariPlusIcon />
          </Button>
          <Button
            className="safari-tool-btn"
            onClick={() => goToLink("safari:startpage", "Trang bắt đầu")}
            {...label("Xem tất cả tab / Trang bắt đầu")}
          >
            <SafariTabOverviewIcon />
          </Button>
          <Button
            className="safari-tool-btn"
            onClick={proxyMenu.onContextMenuCapture}
            onContextMenu={haltEvent}
            {...label("Cài đặt Proxy & Mạng")}
          >
            <SafariShieldIcon />
          </Button>
        </div>
      </nav>

      {/* 2. Safari Tabs Bar */}
      <div className="safari-tabs-bar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              className={`safari-tab ${isActive ? "active" : ""}`}
              onClick={() => handleSelectTab(tab)}
              title={tab.title}
            >
              <div className="tab-favicon">
                {tab.icon ? (
                  <img src={tab.icon} alt="" />
                ) : (
                  <span className="default-icon">🧭</span>
                )}
              </div>
              <span className="tab-title">{tab.title}</span>
              <button
                className="tab-close-btn"
                onClick={(e) => handleCloseTab(e, tab.id)}
                title="Đóng tab"
                type="button"
              >
                <SafariCloseIcon />
              </button>
            </div>
          );
        })}
        <button
          className="safari-add-tab-btn"
          onClick={handleAddNewTab}
          title="Mở tab mới"
          type="button"
        >
          <SafariPlusIcon />
        </button>
      </div>

      {/* 3. Safari Favorites Bar */}
      <nav aria-label="Safari Favorites" className="safari-favorites-bar">
        {SAFARI_BOOKMARKS.map(({ icon, name, url: bookmarkUrl }) => (
          <button
            key={name}
            className="favorite-pill"
            onClick={() => goToLink(bookmarkUrl, name)}
            title={name}
            type="button"
          >
            <img src={icon} alt="" />
            <span>{name}</span>
          </button>
        ))}
      </nav>

      {/* 4. Main Body: Sidebar + Web View */}
      <div className="safari-main-body">
        {/* Safari Sidebar */}
        <aside className="safari-sidebar">
          <div className="sidebar-header">Mục ưa thích</div>
          {SAFARI_BOOKMARKS.map((bm) => (
            <button
              key={bm.name}
              className="sidebar-item"
              onClick={() => goToLink(bm.url, bm.name)}
              type="button"
            >
              <img src={bm.icon} alt="" />
              <span>{bm.name}</span>
            </button>
          ))}

          <div className="sidebar-divider" />
          <div className="sidebar-header">Lịch sử duyệt web</div>
          {history.slice(-8).reverse().map((histUrl, i) => {
            let labelText = histUrl;
            try {
              labelText = new URL(histUrl).hostname.replace(/^www\./, "");
            } catch {
              labelText = histUrl;
            }
            return (
              <button
                key={`${histUrl}-${i}`}
                className="sidebar-item"
                onClick={() => goToLink(histUrl, labelText)}
                type="button"
              >
                <SafariBookOpenIcon />
                <span>{labelText}</span>
              </button>
            );
          })}
        </aside>

        {/* Web Content Area */}
        <div className="safari-content-area">
          {isStartPage ? (
            <SafariStartPage onNavigate={goToLink} />
          ) : isYouTube ? (
            <SafariYouTube onOpenExternal={(u) => window.open(u, "_blank")} />
          ) : (
            <iframe
              ref={iframeRef}
              aria-busy={loading || undefined}
              onLoad={() => {
                try {
                  iframeRef.current?.contentWindow?.addEventListener(
                    "focus",
                    () => setForegroundId(id)
                  );
                } catch {
                  // Ignore failure to add focus event listener
                }

                if (loading) setLoading(false);
              }}
              srcDoc={srcDoc || undefined}
              title={id}
              {...IFRAME_CONFIG}
              credentialless={
                supportsCredentialless ? "credentialless" : undefined
              }
            />
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && <div className="safari-toast">{showToast}</div>}
    </StyledBrowser>
  );
};

export default memo(Browser);
