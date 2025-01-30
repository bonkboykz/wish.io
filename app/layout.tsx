import { Providers } from "./providers";

import Header from "@/components/Header";

import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <title>Wishio</title>
        <meta
          name="description"
          content="Описание страницы или проекта для SEO"
        />
      </head>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            {children}
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
