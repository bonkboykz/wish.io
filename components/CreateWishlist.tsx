"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useChange } from "@/hooks/useIsChange";

export default function CreateWishlist() {
  const { isChangeFetch, setIsChangeFetch } = useChange();
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDeadline(today);
  }, []);
  useEffect(() => {
    if (!dialogOpen) {
      setTitle("");
      setDeadline(new Date().toISOString().split("T")[0]);
      setDescription("");
    }
  }, [dialogOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/wishlists", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          deadline,
          description,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка при создании");
      }
      await setIsChangeFetch(!isChangeFetch);
      toast({
        title: "Список создан",
        description: "Ваш список успешно создан",
      });
      setDialogOpen(false);
    } catch (e) {
      console.error("Error create wishlist", e);
      toast({
        title: "Ошибка при создании списка",
        description: "Попробуйте еще раз",
      });
    } finally {
      setLoading(false);
    }
    // Здесь будет логика создания списка желаний
    console.log("Create wishlist:", title, deadline, description);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Создать список</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать список желаний</DialogTitle>
          <DialogDescription>
            Создайте новый список желаний для особого случая
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Название
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="Например: День рождения 2024"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Дата
              </Label>
              <Input
                id="date"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Описание
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Добавьте описание или сообщение к вашему списку желаний"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Создание..." : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
