"use client";

import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import EditWishlist from "./EditWishlist";
import { useChange } from "@/hooks/useIsChange";

interface MenuItemType {
  id: number;
  name: string;
  action: () => void;
}

export default function VerticalMenu({
  title,
  deadline,
  wishlistId,
}: {
  title: string;
  deadline: string;
  onAction: (id: number) => void;
  wishlistId: string;
}) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const { isChangeFetch, setIsChangeFetch } = useChange();

  const handleSendToArchive = async (wishlistId: string) => {
    console.log("Send to archive:", wishlistId);
    try {
      const response = await fetch(`/api/wishlists/${wishlistId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: "description",
          deadline: deadline,
          status: "ARCHIVED",
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка при отправке в архив");
      }
      toast({
        title: "Отправлено в архив",
        description: "Список успешно отправлен в архив",
      });
      await setIsChangeFetch(!isChangeFetch);
    } catch (e) {
      console.error("Ошибка при отправке в архив:", e);
      toast({ title: "Ошибка", description: "Попробуйте еще раз" });
    } finally {
      console.log("handlesendtoarchive завершен");
    }
  };
  const handleEdit = (wishlistId: string) => {
    console.log("Редактируем:", wishlistId);
    setEditOpen(true);
    console.log(editOpen);
    handleClose();
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setMenuPosition({
      top: event.currentTarget.offsetTop + event.currentTarget.offsetHeight,
      left: event.currentTarget.offsetLeft,
    });
    setMenuOpen((prev) => !prev);
  };

  const handleClose = (): void => {
    setMenuOpen(false);
    setMenuPosition(null);
  };

  const handleDelete = async (wishlistId: string) => {
    console.log("Удаляем:", wishlistId);
    try {
      const response = await fetch(`/api/wishlists/${wishlistId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка при удалении");
      }
      toast({
        title: "Удалено",
        description: "Список успешно удален",
      });
      await setIsChangeFetch(!isChangeFetch);
    } catch (e) {
      console.error("Ошибка при удалении:", e);
      toast({ title: "Ошибка", description: "Попробуйте еще раз" });
    } finally {
      console.log("handledelete завершен");
    }
  };

  const items: MenuItemType[] = [
    {
      id: 1,
      name: "Отправить в архив",
      action: () => handleSendToArchive(wishlistId),
    },
    {
      id: 2,
      name: "Редактировать и активировать",
      action: () => handleEdit(wishlistId),
    },
    { id: 3, name: "Удалить", action: () => handleDelete(wishlistId) },
  ];

  return (
    <div className="flex flex-col w-40 p-4 rounded-lg relative">
      <button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className="w-10 text-left mb-2 text-gray-950 text-3xl px-4 py-2 rounded items-end p-0 hover:bg-gray-200"
      >
        ⋮
      </button>
      {menuOpen && menuPosition && (
        <div
          className="absolute z-10 bg-white shadow-lg rounded-lg p-2 border"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    item.action();
                    handleClose();
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <EditWishlist
        open={editOpen}
        onOpenChange={setEditOpen}
        wishlistId={wishlistId}
        initialTitle={title}
        initialDeadline={deadline}
      />
    </div>
  );
}
