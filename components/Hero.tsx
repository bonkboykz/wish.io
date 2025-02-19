import { Button } from "../components/ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Создавайте списки желаний и{" "}
            <span className="gradient-text">дарите радость</span>
          </h1>
          <p className="text-xl mb-8">
            Wishio помогает вам создавать и делиться списками желаний для любого
            случая. Делайте подарки, которые действительно нужны!
          </p>
          <Button size="lg" className="gradient-bg text-white">
            Начать бесплатно
          </Button>
        </div>
        <div className="md:w-1/3">
          <Image
            src="/Reserved.jpg"
            alt="Wishio illustration"
            width={600}
            height={350}
            className="hidden md:block md:rounded-lg md:shadow-lg md:min-w-[600px] md:max-h-[350px] md:w-full md:object-cover"
          />
          <Image
            src="/Reserved.jpg"
            alt="wishio illutration mobile"
            width={320}
            height={560}
            className="rounded-lg shadow-lg md:hidden"
          />
        </div>
      </div>
    </section>
  );
}
