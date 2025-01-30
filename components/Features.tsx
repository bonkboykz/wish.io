import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Gift, Share2, UserPlus } from "lucide-react";

const features = [
  {
    title: "Создавайте списки желаний",
    description: "Добавляйте подарки, которые вы действительно хотите получить",
    icon: Gift,
  },
  {
    title: "Делитесь с друзьями",
    description: "Отправляйте свои списки желаний друзьям и семье",
    icon: Share2,
  },
  {
    title: "Анонимное резервирование",
    description: "Друзья могут анонимно резервировать подарки из вашего списка",
    icon: UserPlus,
  },
];

export default function Features() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold leading-tight mb-12">
          Как работает Wishio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 shadow-lg border border-gray-200">
              <CardHeader className="flex flex-col items-center">
                <feature.icon className="w-12 h-12  mb-4" />
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 text-center">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
