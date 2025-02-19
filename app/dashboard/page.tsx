"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CreateWishlist from "@/components/CreateWishlist";
import Filters from "@/components/ui/filter";
import { useFilter } from "@/hooks/useFilter";
import VerticalMenu from "@/components/VerticalMenu";
import { useChange } from "@/hooks/useIsChange";
import { GET } from "../api/wishlists/route";
import { NextResponse, NextRequest } from "next/server";

interface WishlistItem {
  id: string;
  title: string;
  date: string;
  itemCount: number;
  status: "active" | "archived";
  lastModified: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [wishlists, setWishlists] = useState<WishlistItem[]>([]);
  const { isChangeFetch } = useChange();

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const response = await fetch("/api/wishlists");

        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch wishlists");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedWishlists = data.map((wishlist) => ({
            id: wishlist.id,
            title: wishlist.title,
            date: new Date(wishlist.deadline).toISOString().split("T")[0],
            itemCount: wishlist.wishes.length || 0,
            status: wishlist.status.toLowerCase() as "active" | "archived",
            lastModified: new Date(wishlist.updatedAt).toLocaleString(),
          }));

          setWishlists(formattedWishlists);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching wishlists:", error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить данные списков желаемого",
        });
      }
    };

    if (session?.user?.email) {
      fetchWishlists();
    }
  }, [session?.user?.email, isChangeFetch]);

  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredWishlists = wishlists.filter((wishlist) => {
    if (activeTab === "all") return true;
    return wishlist.status === activeTab;
  });
  const { togglePanel } = useFilter();
  const ButtonHandleHidingFilter = () => {
    return (
      <Button variant="outline" onClick={togglePanel}>
        <Filter className="h-4 w-4 mr-2" />
        Фильтры
      </Button>
    );
  };

  const handleMenuAction = (actionId: number, wishlistId: string) => {
    alert(`действие ${actionId} выполнено для ${wishlistId}`);
    console.log("Действие для", wishlistId);
  };
  const { isOpen } = useFilter();

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar (компонент Filters остаётся без изменений) */}
      <div
        className={`hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "-translate-x-180" : "-translate-x-full"
        }
        w-64 = "true"
         border-r = "true"
        bg-white = "true"
        p-6 = "true" md:block`}
      >
        <Filters
          data={wishlists}
          onSort={(sortedData) => setWishlists(sortedData)}
        />
      </div>

      {/* Основной контент */}
      <div className="flex-1 bg-gray-50">
        <div className="p-4 md:p-6 min-h-full">
          {/* Заголовок и действия */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 className="text-xl sm:text-2xl font-bold">
              Мои списки желаний
            </h1>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <ButtonHandleHidingFilter />
              <CreateWishlist />
            </div>
          </div>

          {/* Вкладки */}
          <Tabs
            defaultValue="all"
            className="mb-4"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList>
              <TabsTrigger value="all">Все списки</TabsTrigger>
              <TabsTrigger value="active">Активные</TabsTrigger>
              <TabsTrigger value="archived">Архивные</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Таблица */}
          <div className="bg-white rounded-lg shadow flex-grow w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Дата события</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Количество подарков
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Последнее изменение
                  </TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWishlists.length > 0 ? (
                  <>
                    {filteredWishlists.map((wishlist) => (
                      <TableRow key={wishlist.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/wishlist/${wishlist.id}`}
                            className="font-medium hover:underline"
                          >
                            {wishlist.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-500">{wishlist.date}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {wishlist.itemCount}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {wishlist.lastModified}
                        </TableCell>
                        <TableCell>
                          {wishlist.status === "active" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Активный
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Архивный
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <VerticalMenu
                            onAction={(actionId) =>
                              handleMenuAction(actionId, wishlist.id)
                            }
                            title={wishlist.title}
                            wishlistId={wishlist.id}
                            deadline={wishlist.date}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Пустая строка для растяжения списка */}
                    <TableRow>
                      <TableCell colSpan={7} className="block py-20" />
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-4 text-gray-500"
                    >
                      Нет данных
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {isOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
              onClick={togglePanel}
            ></div>
          )}

          <div
            className={`fixed top-0 left-0 transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    w-4/5 max-w-sm h-full bg-white shadow-xl p-6 md:hidden z-50`}
            onClick={togglePanel}
          >
            <Filters
              data={wishlists}
              onSort={(sortedData) => setWishlists(sortedData)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
