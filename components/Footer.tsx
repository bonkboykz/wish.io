import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [emailSubmit, setEmailSubmit] = useState("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailSubmit(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmit("");
  };
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">Wishio</h2>
            <p>Делайте подарки, которые действительно нужны.</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Ссылки</h3>
            <ul className="space-y-2">
              <li className="hover:underline">
                <Link href="/about">О нас</Link>
              </li>
              <li className="hover:underline">
                <Link href="/how-it-works">Как это работает</Link>
              </li>
              <li className="hover:underline">
                <Link href="/privacy">Конфиденциальность</Link>
              </li>
              <li className="hover:underline">
                <Link href="/terms">Условия использования</Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <p>Email: support@wishio.com</p>
            <p>Телефон: +7 (999) 123-45-67</p>
          </div>
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-4">
              Подписаться на новости
            </h3>
            <form className="flex" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Ваш email"
                value={emailSubmit}
                onChange={handleEmailChange}
                className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Подписаться
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2023 Wishio. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
