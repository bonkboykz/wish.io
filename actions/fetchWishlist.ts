'use server'

import { toast } from "@/hooks/use-toast";

export async function fetchWishlist (wishlistId:string){
    if(!wishlistId) return null;
    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;
    try {
        const response = await fetch(`${API_BASE_URL}/api/wishlists/${wishlistId}`);
        if (!response.ok) {
          throw new Error("Ошибка загрузки списка желаемого");
        }

      return response.json();
      } catch (error) {
        console.error("Ошибка при загрузке:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список желаемого",
        });
      } 
}