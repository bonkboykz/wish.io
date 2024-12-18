"use client";
import { useState } from "react";
import Image from "next/image";

type Wish = {
  id: number;
  title: string;
  isReserved: boolean;
  imageUrl?: string;
};

function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>([
    {
      id: 1,
      title: "Хочу айфон 16",
      isReserved: false,
      imageUrl:
        "https://dictionary.cambridge.org/ru/images/thumb/circle_noun_001_02738.jpg?version=6.0.42",
    },
    {
      id: 2,
      title: "Хочу книгу по программированию",
      isReserved: true,
      imageUrl:
        "https://dictionary.cambridge.org/ru/images/thumb/circle_noun_001_02738.jpg?version=6.0.42",
    },
    {
      id: 3,
      title: "Путешествие в Японию",
      isReserved: false,
      imageUrl:
        "https://dictionary.cambridge.org/ru/images/thumb/circle_noun_001_02738.jpg?version=6.0.42",
    },
  ]);

  const toggleReservation = (id: number, newStatus: boolean) => {
    const updatedWishes = wishes.map((wish) =>
      wish.id === id ? { ...wish, isReserved: newStatus } : wish
    );
    setWishes(updatedWishes);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {wishes.map((wish) => (
        <div
          key={wish.id}
          className="relative bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col justify-between"
        >
          <Image
            src={wish.imageUrl || "/images/placeholder.png"}
            alt={wish.title}
            width={150}
            height={150}
            className="w-full h-32 object-cover rounded-t-lg mb-4"
          />

          <p className="text-lg font-medium text-gray-800 text-center mb-4">
            {wish.title}
          </p>

          <div className="flex justify-between gap-2 mt-auto">
            <button
              onClick={() => toggleReservation(wish.id, false)}
              className={`flex-1 py-2 px-4 rounded-md border transition ${
                wish.isReserved
                  ? "bg-gray-300 text-gray-600 hover:bg-gray-400"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Доступно
            </button>

            <button
              onClick={() => toggleReservation(wish.id, true)}
              className={`flex-1 py-2 px-4 rounded-md border transition ${
                wish.isReserved
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-600 hover:bg-gray-400"
              }`}
            >
              Зарезервировано
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Wishes;
