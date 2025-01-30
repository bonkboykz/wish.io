import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Секция компании */}
          <div>
            <h2 className="text-3xl font-bold mb-4">Wishio</h2>
            <p>Делайте подарки, которые действительно нужны.</p>
          </div>

          {/* Секция ссылок */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ссылки</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "О нас" },
                { href: "/how-it-works", label: "Как это работает" },
                { href: "/privacy", label: "Конфиденциальность" },
                { href: "/terms", label: "Условия использования" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Секция контактов */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <p>
              Email:{" "}
              <a
                href="mailto:support@wishio.com"
                className="hover:text-gray-400"
              >
                support@wishio.com
              </a>
            </p>
            <p>
              Телефон:{" "}
              <a href="tel:+79991234567" className="hover:text-gray-400">
                +7 (999) 123-45-67
              </a>
            </p>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Wishio. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
