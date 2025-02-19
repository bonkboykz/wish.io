import { useState, useRef, useEffect } from "react";
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
import { Gift } from "lucide-react"; // Добавляем иконку
import { useParams } from "next/navigation";
import { useChange } from "@/hooks/useIsChange";

export default function AddWishlistItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isChangeFetch, setIsChangeFetch } = useChange();

  const params = useParams();
  const wishlistId = params?.id || "";

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newPrice = value === "" ? 0 : parseInt(value, 10);
    setPrice(newPrice);
  };

  useEffect(() => {
    if (!dialogOpen) {
      setTitle("");
      setDescription("");
      setPrice(0);
      setLink("");
      setPreviewUrl("");
      setSelectedFile(null);
    }
  }, [dialogOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 5MB",
      });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Ошибка",
        description: "Допустимые форматы: JPEG, PNG, WebP",
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(file.name);
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let formattedLink = link;
    if (formattedLink.startsWith("https://")) {
      formattedLink = formattedLink.slice(8);
    } else if (formattedLink.startsWith("http://")) {
      formattedLink = formattedLink.slice(7);
    }

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price.toString());
      formData.append("link", formattedLink);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      const response = await fetch(`/api/wishlists/${wishlistId}/wishes`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка при создании");
      }

      toast({
        title: "Список создан",
        description: "Ваш список успешно создан",
      });
      await setIsChangeFetch(!isChangeFetch);
      setDialogOpen(false);
    } catch (e) {
      console.error("Ошибка при создании списка:", e);
      toast({ title: "Ошибка", description: "Попробуйте еще раз" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Gift className="mr-2 h-4 w-4" />
          Добавить подарок
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить подарок</DialogTitle>
          <DialogDescription>
            Добавьте новый подарок в ваш список желаний
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Название*
              </Label>
              <Input
                id="name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="Назовите свой подарок"
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
                placeholder="Опишите свой подарок"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Цена
              </Label>
              <div className="flex col-span-3 items-center gap-2">
                <Input
                  id="price"
                  type="number"
                  value={price === 0 ? "" : price}
                  onChange={handlePriceChange}
                  className="w-full"
                  placeholder="Укажите цену"
                />
                <span className="text-gray-700">тг</span>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Ссылка
              </Label>
              <Input
                id="link"
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="col-span-3"
                placeholder="Вставьте ссылку с marketplace"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Изображение
              </Label>
              <div className="col-span-3 flex flex-col items-start">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                />
                {previewUrl && (
                  <div className="mt-2 text-gray-700">
                    Файл: <span className="font-semibold">{previewUrl}</span>
                  </div>
                )}
                <Button
                  type="button"
                  onClick={handleImageClick}
                  disabled={loading}
                >
                  {loading ? "Загрузка..." : "Выбрать картинку"}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Добавление..." : "Добавить подарок"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
