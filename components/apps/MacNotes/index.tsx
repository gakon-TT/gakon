import { type FC, memo, useCallback, useState } from "react";
import styled from "styled-components";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";

const Container = styled.div`
  background: #1e1e20;
  color: #f5f5f7;
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
    Roboto, sans-serif;
  height: 100%;
  user-select: none;
  width: 100%;
`;

const Sidebar = styled.div`
  background: rgba(32, 32, 36, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  min-width: 180px;
  padding: 12px 8px;
  width: 180px;

  .header {
    color: #8e8e93;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 6px;
    padding: 0 8px;
    text-transform: uppercase;
  }

  .folder-item {
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    font-size: 13px;
    gap: 8px;
    padding: 6px 10px;
    transition: background 0.15s ease;

    &.active {
      background: rgba(255, 255, 255, 0.15);
      font-weight: 500;
    }

    &:hover:not(.active) {
      background: rgba(255, 255, 255, 0.08);
    }
  }
`;

const NotesList = styled.div`
  background: rgba(28, 28, 30, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  min-width: 240px;
  width: 240px;

  .toolbar {
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;

    .count {
      color: #8e8e93;
      font-size: 12px;
    }

    button {
      align-items: center;
      background: #ff9f0a;
      border: none;
      border-radius: 6px;
      color: #000;
      cursor: pointer;
      display: flex;
      font-size: 12px;
      font-weight: 600;
      gap: 4px;
      padding: 5px 10px;
      transition: opacity 0.15s ease;

      &:hover {
        opacity: 0.9;
      }
    }
  }

  .list {
    flex: 1;
    overflow-y: auto;
  }
`;

const NoteItem = styled.div<{ $active: boolean }>`
  background: ${({ $active }) =>
    $active ? "rgba(255, 159, 10, 0.25)" : "transparent"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  cursor: pointer;
  padding: 10px 14px;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? "rgba(255, 159, 10, 0.25)" : "rgba(255, 255, 255, 0.05)"};
  }

  .title {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .date-preview {
    align-items: center;
    color: #8e8e93;
    display: flex;
    font-size: 12px;
    gap: 6px;

    .date {
      color: #aeaeb2;
      font-size: 11px;
    }

    .preview {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

const Editor = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 20px 28px;

  .note-date {
    color: #8e8e93;
    font-size: 12px;
    margin-bottom: 12px;
    text-align: center;
  }

  input.title-input {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 16px;
    outline: none;
    width: 100%;
  }

  textarea.content-input {
    background: transparent;
    border: none;
    color: #e5e5ea;
    flex: 1;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.6;
    outline: none;
    resize: none;
    width: 100%;
  }
`;

type Note = {
  content: string;
  date: string;
  id: number;
  title: string;
};

const INITIAL_NOTES: Note[] = [
  {
    content:
      "Giao diện macOS trên Web đã hoàn thiện!\n\n- Thanh TopBar kính mờ tích hợp Apple Menu\n- Dock nổi bo cong với icon chuẩn Apple\n- Cửa sổ ứng dụng có Traffic Lights (Đỏ, Vàng, Xanh lá)\n- Hỗ trợ đầy đủ ứng dụng mô phỏng",
    date: "14:20",
    id: 1,
    title: "Ý tưởng thiết kế macOS Web",
  },
  {
    content:
      "1. Cáp Thunderbolt 4\n2. Bàn phím Magic Keyboard\n3. Chuột Magic Mouse màu đen\n4. Màn hình Studio Display 5K",
    date: "Hôm qua",
    id: 2,
    title: "Danh sách thiết bị yêu thích",
  },
  {
    content:
      "Dự án daedalOS là desktop environment mã nguồn mở tuyệt vời mô phỏng toàn bộ trải nghiệm máy tính trên trình duyệt thông qua WebAssembly, React và Next.js.",
    date: "28 Th09",
    id: 3,
    title: "Ghi chú về daedalOS",
  },
];

const MacNotes: FC<ComponentProcessProps> = () => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [activeId, setActiveId] = useState<number>(1);

  const activeNote = notes.find((n) => n.id === activeId) || notes[0];

  const updateTitle = useCallback(
    (newTitle: string) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === activeId ? { ...n, title: newTitle } : n))
      );
    },
    [activeId]
  );

  const updateContent = useCallback(
    (newContent: string) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === activeId ? { ...n, content: newContent } : n))
      );
    },
    [activeId]
  );

  const addNewNote = useCallback(() => {
    const newNote: Note = {
      content: "",
      date: "Vừa xong",
      id: Date.now(),
      title: "Ghi chú mới",
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
  }, []);

  return (
    <Container>
      <Sidebar>
        <div className="header">iCloud</div>
        <div className="folder-item active">
          <span>📁</span> Tất cả ghi chú
        </div>
        <div className="folder-item">
          <span>⚡️</span> Ghi chú nhanh
        </div>
        <div className="folder-item">
          <span>💼</span> Công việc
        </div>
        <div className="folder-item">
          <span>👤</span> Cá nhân
        </div>
      </Sidebar>

      <NotesList>
        <div className="toolbar">
          <span className="count">{notes.length} ghi chú</span>
          <button onClick={addNewNote} type="button">
            + Viết mới
          </button>
        </div>
        <div className="list">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              $active={note.id === activeId}
              onClick={() => setActiveId(note.id)}
            >
              <div className="title">{note.title || "Không có tiêu đề"}</div>
              <div className="date-preview">
                <span className="date">{note.date}</span>
                <span className="preview">
                  {note.content.split("\n")[0] || "Chưa có nội dung"}
                </span>
              </div>
            </NoteItem>
          ))}
        </div>
      </NotesList>

      <Editor>
        <div className="note-date">Hôm nay lúc {activeNote?.date || "10:00"}</div>
        <input
          className="title-input"
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Tiêu đề..."
          type="text"
          value={activeNote?.title || ""}
        />
        <textarea
          className="content-input"
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Bắt đầu viết ghi chú tại đây..."
          value={activeNote?.content || ""}
        />
      </Editor>
    </Container>
  );
};

export default memo(MacNotes);
