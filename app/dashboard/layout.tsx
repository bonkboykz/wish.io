import { FilterProvider } from "@/hooks/useFilter";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FilterProvider>{children}</FilterProvider>
    </>
  );
}
