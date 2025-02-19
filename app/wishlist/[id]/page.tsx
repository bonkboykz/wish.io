"use client";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddGift from "@/components/AddGift";
import { toast } from "@/hooks/use-toast";
import SharedLink from "@/components/Sharing";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useChange } from "@/hooks/useIsChange";

interface Wish {
  id: string;
  title: string;
  description: string;
  price?: number;
  link?: string;
  status: "RESERVED" | "UNRESERVED";
  image?: string;
}

interface Wishlist {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  wishes: { wish: Wish }[];
}

export default function WishlistPage() {
  const params = useParams();
  const wishlistId = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id || "";
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [unReservedMap, setUnReservedMap] = useState<{
    [key: string]: boolean;
  }>({});
  const { isChangeFetch } = useChange();

  const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch(`/api/wishlists/${wishlistId}`);
        if (!response.ok) {
          throw new Error("Ошибка загрузки списка желаемого");
        }

        const data: Wishlist = await response.json();
        setWishlist(data);
        console.log(wishlist);
      } catch (error) {
        console.error("Ошибка при загрузке:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список желаемого",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isChangeFetch, wishlist, wishlistId]);

  if (loading) {
    return <p className="text-center text-gray-500">Загрузка...</p>;
  }

  if (!wishlist) {
    return (
      <p className="text-center text-red-500">Список желаемого не найден</p>
    );
  }

  const wishes = wishlist.wishes
    .slice()
    .reverse()
    .map((item) => item.wish);

  const filteredWishes = wishes
    ? wishes.filter((wish: Wish) => {
        if (activeTab === "all") return true;
        if (activeTab === "UNRESERVED") return wish.status === "UNRESERVED";
        if (activeTab === "RESERVED") return wish.status === "RESERVED";
      })
    : [];

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
    } catch (e) {
      toast({
        title: "Резерв владельцем",
        description: "Вы не можете зарезервировать свой подарок",
      });
      console.error("Ошибка при резерве", e);
      throw e;
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
    } catch (e) {
      toast({
        title: "Отмена резерва другим пользователем ",
        description: "Вы не можете отменить резерв другого пользователя",
      });
      console.error("Ошибка при резерве", e);
      throw e;
    }
  };

  const toggleReserveStatus = (
    wishId: string,
    wishStatus: "RESERVED" | "UNRESERVED"
  ) => {
    setUnReservedMap((prev) => {
      if (wishStatus === "RESERVED") {
        return { ...prev, [wishId]: false };
      } else if (wishStatus === "UNRESERVED") {
        return { ...prev, [wishId]: true };
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* <div className="flex items-center justify-center font-semibold">
          Владелец списка: {wishlist.userId}
        </div> */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{wishlist.title}</h1>
            <p className="text-gray-600">{wishlist.description}</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <SharedLink />
            <AddGift />
          </div>
          <div className="block md:hidden">
            <div className="relative p-2">
              <SharedLink />
            </div>
            <div className="relative p-2">
              <AddGift />
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          className="mb-8"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList>
            <TabsTrigger value="all">Все подарки</TabsTrigger>
            <TabsTrigger value="UNRESERVED">Доступные</TabsTrigger>
            <TabsTrigger value="RESERVED">Зарезервированные</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWishes.length > 0 ? (
            filteredWishes.map((wish: Wish) => (
              <Card key={wish.id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={wish.image || "/placeholder.png"}
                    alt={wish.title || ""}
                    fill
                    className="mx-auto"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "";
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle>{wish.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{wish.description}</p>
                  <p className="text-lg font-semibold mt-2">{wish.price} тг</p>
                  <span className="text-lg font-semibold mt-2 hover:underline">
                    <Link href={`https://${wish.link}`}> {wish.link} </Link>
                  </span>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {unReservedMap[wish.id] || wish.status === "RESERVED" ? (
                    <Button
                      className="bg-gray-300 text-gray-700 hover:bg-red-500"
                      variant="outline"
                      onClick={async () => {
                        try {
                          await unReserveWish(wish.id);
                          toggleReserveStatus(wish.id, "RESERVED");
                        } catch (e) {
                          console.error("error", e);
                        }
                      }}
                    >
                      Зарезервировано
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={async () => {
                        try {
                          await reserveWish(wish.id);
                          toggleReserveStatus(wish.id, "UNRESERVED");
                        } catch (e) {
                          console.error("error", e);
                        }
                      }}
                    >
                      Зарезервировать
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3">
              <p className="text-center text-gray-600">Отсутствует</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
