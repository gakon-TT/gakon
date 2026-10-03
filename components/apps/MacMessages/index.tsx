import { type FC, memo, useCallback, useState } from "react";
import styled from "styled-components";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";

const Container = styled.div`
  background: #1c1c1e;
  color: #f5f5f7;
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
    Roboto, sans-serif;
  height: 100%;
  user-select: none;
  width: 100%;
`;

const Sidebar = styled.div`
  background: rgba(36, 36, 40, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  min-width: 250px;
  width: 250px;

  .search-box {
    padding: 12px 14px 8px;

    input {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      color: #fff;
      font-size: 13px;
      outline: none;
      padding: 6px 10px;
      width: 100%;

      &::placeholder {
        color: #8e8e93;
      }
    }
  }

  .chat-list {
    flex: 1;
    overflow-y: auto;
  }
`;

const ChatItem = styled.div<{ $active: boolean }>`
  align-items: center;
  background: ${({ $active }) => ($active ? "#007aff" : "transparent")};
  cursor: pointer;
  display: flex;
  gap: 10px;
  padding: 10px 14px;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? "#007aff" : "rgba(255, 255, 255, 0.06)"};
  }

  .avatar {
    align-items: center;
    border-radius: 50%;
    display: flex;
    font-size: 20px;
    height: 40px;
    justify-content: center;
    min-width: 40px;
    width: 40px;
  }

  .info {
    flex: 1;
    min-width: 0;

    .top-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;

      .name {
        font-size: 13px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .time {
        color: ${({ $active }) =>
          $active ? "rgba(255,255,255,0.8)" : "#8e8e93"};
        font-size: 11px;
      }
    }

    .preview {
      color: ${({ $active }) =>
        $active ? "rgba(255,255,255,0.85)" : "#8e8e93"};
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

const ChatArea = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  min-width: 0;

  .header {
    align-items: center;
    background: rgba(30, 30, 34, 0.7);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    padding: 8px 16px;

    .title {
      font-size: 13px;
      font-weight: 600;
    }

    .status {
      color: #8e8e93;
      font-size: 11px;
    }
  }

  .messages {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    padding: 16px 20px;

    .msg-row {
      display: flex;
      flex-direction: column;

      &.sent {
        align-items: flex-end;

        .bubble {
          background: #007aff;
          border-radius: 18px 18px 4px 18px;
          color: #ffffff;
        }
      }

      &.received {
        align-items: flex-start;

        .bubble {
          background: #3a3a3c;
          border-radius: 18px 18px 18px 4px;
          color: #f5f5f7;
        }
      }

      .bubble {
        font-size: 13px;
        line-height: 1.4;
        max-width: 65%;
        padding: 8px 14px;
        word-break: break-word;
      }
    }
  }

  .input-bar {
    align-items: center;
    background: rgba(30, 30, 34, 0.9);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    gap: 10px;
    padding: 10px 16px;

    input {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      color: #fff;
      flex: 1;
      font-size: 13px;
      outline: none;
      padding: 8px 14px;

      &::placeholder {
        color: #8e8e93;
      }
    }

    button {
      align-items: center;
      background: #007aff;
      border: none;
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      display: flex;
      height: 32px;
      justify-content: center;
      transition: opacity 0.15s ease;
      width: 32px;

      &:hover {
        opacity: 0.9;
      }

      svg {
        fill: currentColor;
        height: 14px;
        width: 14px;
      }
    }
  }
`;

type Message = {
  id: number;
  sender: "me" | "them";
  text: string;
};

type ContactData = {
  avatar: string;
  avatarBg: string;
  id: string;
  messages: Message[];
  name: string;
  replies: string[];
  time: string;
};

const INITIAL_CONTACTS: ContactData[] = [
  {
    avatar: "",
    avatarBg: "#000",
    id: "tim",
    messages: [
      { id: 1, sender: "them", text: "Chào bạn! Chào mừng đến với giao diện macOS." },
      { id: 2, sender: "them", text: "Bạn thấy trải nghiệm hệ điều hành trên trình duyệt này thế nào?" },
    ],
    name: "Tim Cook",
    replies: [
      "Thật tuyệt vời! Chúng tôi rất tự hào về thiết kế mượt mà này.",
      "Bạn có muốn nâng cấp lên chip M4 Max không? 😄",
      "One more thing... Đừng quên thử các app khác trên Dock nhé!",
    ],
    time: "09:41",
  },
  {
    avatar: "✨",
    avatarBg: "#1a73e8",
    id: "gemini",
    messages: [
      { id: 1, sender: "them", text: "Chào bạn, tôi là Gemini AI!" },
      { id: 2, sender: "them", text: "Tôi có thể hỗ trợ lập trình, tùy biến giao diện hoặc trò chuyện cùng bạn." },
    ],
    name: "Gemini AI Assistant",
    replies: [
      "Tôi luôn sẵn sàng giúp bạn hoàn thiện hệ thống này!",
      "macOS có phong cách thiết kế rất sang trọng và công thái học.",
      "Gợi ý: Bạn có thể mở System Settings để đổi hình nền hoặc chế độ sáng/tối.",
    ],
    time: "Vừa xong",
  },
  {
    avatar: "🧑‍💻",
    avatarBg: "#ff9500",
    id: "craig",
    messages: [
      { id: 1, sender: "them", text: "Hair Force One báo cáo! Hiệu ứng Dock và cửa sổ mượt quá!" },
    ],
    name: "Craig Federighi",
    replies: [
      "Metal 3 và WebAssembly phối hợp quá đỉnh!",
      "Hãy kiểm tra thanh Menu Bar trên cùng xem, rất chuẩn macOS đấy!",
    ],
    time: "Hôm qua",
  },
];

const MacMessages: FC<ComponentProcessProps> = () => {
  const [contacts, setContacts] = useState<ContactData[]>(INITIAL_CONTACTS);
  const [activeId, setActiveId] = useState<string>("tim");
  const [inputText, setInputText] = useState<string>("");

  const activeContact = contacts.find((c) => c.id === activeId) || contacts[0];

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "me",
      text: inputText.trim(),
    };

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            messages: [...c.messages, userMsg],
            time: "Vừa xong",
          };
        }
        return c;
      })
    );

    const sentText = inputText;
    setInputText("");

    // Simulate smart auto-reply
    setTimeout(() => {
      setContacts((prev) =>
        prev.map((c) => {
          if (c.id === activeId) {
            const randomReply =
              c.replies[Math.floor(Math.random() * c.replies.length)];
            const replyMsg: Message = {
              id: Date.now() + 1,
              sender: "them",
              text: randomReply,
            };
            return {
              ...c,
              messages: [...c.messages, replyMsg],
              time: "Vừa xong",
            };
          }
          return c;
        })
      );
    }, 1000);
  }, [activeId, inputText]);

  return (
    <Container>
      <Sidebar>
        <div className="search-box">
          <input placeholder="Tìm kiếm tin nhắn..." type="text" />
        </div>
        <div className="chat-list">
          {contacts.map((contact) => {
            const lastMsg =
              contact.messages[contact.messages.length - 1]?.text || "";
            return (
              <ChatItem
                key={contact.id}
                $active={contact.id === activeId}
                onClick={() => setActiveId(contact.id)}
              >
                <div
                  className="avatar"
                  style={{ background: contact.avatarBg }}
                >
                  {contact.avatar}
                </div>
                <div className="info">
                  <div className="top-row">
                    <span className="name">{contact.name}</span>
                    <span className="time">{contact.time}</span>
                  </div>
                  <div className="preview">{lastMsg}</div>
                </div>
              </ChatItem>
            );
          })}
        </div>
      </Sidebar>

      <ChatArea>
        <div className="header">
          <div className="title">{activeContact.name}</div>
          <div className="status">iMessage</div>
        </div>

        <div className="messages">
          {activeContact.messages.map((m) => (
            <div key={m.id} className={`msg-row ${m.sender}`}>
              <div className="bubble">{m.text}</div>
            </div>
          ))}
        </div>

        <div className="input-bar">
          <input
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="iMessage..."
            type="text"
            value={inputText}
          />
          <button onClick={handleSend} type="button">
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </ChatArea>
    </Container>
  );
};

export default memo(MacMessages);
