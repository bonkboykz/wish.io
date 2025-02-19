"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "@/hooks/use-toast";
import { useChange } from "@/hooks/useIsChange";

interface User {
  email: string;
  name: string;
}

interface WishlistOfUser {
  id: string;
  user: User;
}
interface WishlistsOfUser {
  id: string;
  wishList: WishlistOfUser;
}
interface Wish {
  id: string;
  title: string;
  description: string;
  price?: number;
  link?: string;
  status: "RESERVED" | "UNRESERVED";
  image?: string;
  reservedBy?: string;
  wishLists?: WishlistsOfUser[];
}

interface Wishlist {
  id: string;
  title: string;
  description: string;
  wishes?: Wish[];
}

export default function MyReservePage() {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [unReservedMap, setUnReservedMap] = useState<{
    [key: string]: boolean;
  }>({});
  const { isChangeFetch } = useChange();

  const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

  useEffect(() => {
    const fetchWishlist = async (attempt = 1, maxAttempts = 5) => {
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/api/wishes/reserved`);
        if (!response.ok) {
          throw new Error("Ошибка загрузки списка желаемого");
        }

        const data: Wish[] = await response.json();
        console.log(data);

        if (!Array.isArray(data) || data.length === 0) {
          console.log(
            `Попытка ${attempt}: данные не получены, повторный запрос...`
          );

          if (attempt < maxAttempts) {
            setTimeout(() => fetchWishlist(attempt + 1, maxAttempts), 2000);
          } else {
            console.error("Максимальное количество попыток достигнуто.");
            setWishlist(null);
            toast({
              title: "Ошибка",
              description: "Не удалось загрузить список желаемого",
            });
          }
        } else {
          setWishlist({
            id: "reserved-wishlist",
            title: "Мои зарезервированные желания",
            description: "Список желаемого, которое я зарезервировал",
            wishes: data,
          });
          console.log(wishlist);
        }
      } catch (error) {
        console.error("Ошибка при загрузке:", error);

        if (attempt < maxAttempts) {
          setTimeout(() => fetchWishlist(attempt + 1, maxAttempts), 2000);
        } else {
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить список желаемого",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    if (!wishlist) {
      fetchWishlist();
    }
  }, [isChangeFetch, API_BASE_URL, wishlist]);

  if (loading) {
    return <p className="text-center text-gray-500">Загрузка...</p>;
  }

  if (!wishlist) {
    return (
      <p className="text-center text-red-500">Список желаемого не найден</p>
    );
  }

  const reserveWish = async (wishId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/wishes/${wishId}/reserve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "RESERVED",
          }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка резерва");
      }

      toast({
        title: "Зарезервировано",
        description: "Ваш подарок успешно зарезервирован",
      });
      console.log(response);
    } catch (e) {
      toast({
        title: "Резерв владельцем",
        description: "Вы не можете зарезервировать свой подарок",
      });
      console.error("Ошибка при резерве", e);
    }
  };

  const unReserveWish = async (wishId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/wishes/${wishId}/reserve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "UNRESERVED",
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка резерва");
      }

      toast({
        title: "Резерв отменен",
        description: "Резерв подарка отменен",
      });

      setWishlist((prev) => {
        if (!prev || !prev.wishes) return prev;
        return {
          ...prev,
          wishes: prev.wishes.map((wish) =>
            wish.id === wishId ? { ...wish, status: "UNRESERVED" } : wish
          ),
        };
      });
    } catch (e) {
      toast({
        title: "Ошибка",
        description: "Вы не можете отменить резерв другого пользователя",
      });
      console.error("Ошибка при резерве", e);
    }
  };
  const toggleReserveStatus = (wishId: string) => {
    setUnReservedMap((prev) => ({
      ...prev,
      [wishId]: !prev[wishId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {wishlist?.title || "Зарезервированные желания"}
            </h1>
            <p className="text-gray-600">
              {wishlist?.description || "Ваши зарезервированные подарки"}
            </p>
          </div>
          <div className="flex items-center space-x-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist?.wishes?.map((wish) => (
            <Card key={wish.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={wish.image || "/placeholder.png"}
                  alt={wish.title || "Без названия"}
                  fill
                  className="mx-auto"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/placeholder.png";
                  }}
                />
              </div>

              <CardHeader>
                <CardTitle>{wish.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600">{wish.description}</p>
                <p className="text-lg font-semibold mt-2">
                  {wish.price ? `${wish.price} тг` : "Цена не указана"}
                </p>
                {wish.link && (
                  <span className="text-lg font-semibold mt-2 hover:underline">
                    <Link
                      href={
                        wish.link.startsWith("http")
                          ? wish.link
                          : `https://${wish.link}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {wish.link}
                    </Link>
                  </span>
                )}
              </CardContent>
              <CardContent>
                {" "}
                <p className="mt-2 text-sm text-gray-500">
                  Подарок для:{" "}
                  {(wish?.wishLists?.length ?? 0 > 0)
                    ? wish?.wishLists
                        ?.map((wishItem) => wishItem.wishList?.user?.name)
                        .join(", ")
                    : "Неизвестный пользователь"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                {unReservedMap[wish.id] ? (
                  <Button
                    variant="outline"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={async () => {
                      try {
                        await reserveWish(wish.id);
                        toggleReserveStatus(wish.id);
                      } catch (e) {
                        console.error("error", e);
                      }
                    }}
                  >
                    Зарезервировать
                  </Button>
                ) : (
                  <Button
                    className="bg-gray-300 text-gray-700 hover:bg-red-500"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await unReserveWish(wish.id);
                        toggleReserveStatus(wish.id);
                      } catch (e) {
                        console.error("error", e);
                      }
                    }}
                  >
                    Зарезервировано
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
