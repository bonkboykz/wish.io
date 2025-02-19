"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

export default function Profile() {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        const { user } = data;

        setName(user.name || "");
        setEmail(user.email || "");
        setImageUrl(user.image || "");
        setPreviewUrl(user.image || "");

        // Форматируем дату в формат YYYY-MM-DD для input type="date"
        if (user.birthdate) {
          const date = new Date(user.birthdate);
          const formattedDate = date.toISOString().split("T")[0];
          setBirthdate(formattedDate);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Ошибка загрузки профиля",
          description: "Не удалось загрузить данные профиля",
        });
      }
    };

    if (session?.user?.email) {
      fetchProfile();
    }
  }, [session]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера файла
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 5MB",
      });
      return;
    }

    // Проверка типа файла
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Ошибка",
        description: "Допустимые форматы: JPEG, PNG, WebP",
      });
      return;
    }

    setSelectedFile(file);
    // Создаем локальный URL для предпросмотра
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let uploadedImageUrl = imageUrl;

      // Загружаем файл, если он был выбран
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.error || "Error uploading image");
        }

        const { publicUrl } = await uploadResponse.json();
        uploadedImageUrl = publicUrl;
      }

      // Обновляем профиль
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image: uploadedImageUrl,
          birthdate,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error updating profile");
      }

      setImageUrl(uploadedImageUrl);
      setSelectedFile(null);
      await updateSession();

      toast({
        title: "Профиль успешно обновлен",
        description: "Ваши изменения сохранены",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Ошибка при обновлении профиля",
        description: "Попробуйте еще раз",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Профиль пользователя</CardTitle>
          <CardDescription>Управляйте своей личной информацией</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar
              className="w-20 h-20 cursor-pointer"
              onClick={handleImageClick}
            >
              <AvatarImage
                src={previewUrl || "/placeholder.png"}
                alt="Profile picture"
              />
              <AvatarFallback>
                {name?.slice(0, 2).toUpperCase() || "ИИ"}
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
            />
            <Button onClick={handleImageClick} disabled={isLoading}>
              {isLoading ? "Загрузка..." : "Изменить фото"}
            </Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  required
                />
              </div>
              <div>
                <Label htmlFor="birthdate">Дата рождения</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                />
              </div>
            </div>
            <CardFooter className="px-0 pt-6">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
