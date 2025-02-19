import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilter } from "@/hooks/useFilter";
import { useSession } from "next-auth/react";

interface WishlistItem {
  id: string;
  title: string;
  date: string;
  itemCount: number;
  status: "active" | "archived";
  lastModified: string;
}

interface FiltersProps {
  data: WishlistItem[];
  onSort: (sortedData: WishlistItem[]) => void;
}

const Filters: React.FC<FiltersProps> = ({ data, onSort }) => {
  const { data: session } = useSession();
  const [sortOptions, setSortOptions] = useState({
    byDate: false,
    byName: false,
  });

  const handleSortChange = (option: "byDate" | "byName") => {
    const updateOptions = { ...sortOptions, [option]: !sortOptions[option] };

    // Убедимся, что только один чекбокс может быть активен
    if (option === "byDate" && updateOptions.byDate) {
      updateOptions.byName = false;
    }
    if (option === "byName" && updateOptions.byName) {
      updateOptions.byDate = false;
    }

    setSortOptions(updateOptions);

    // Выполняем сортировку
    const sortedData = [...data];
    if (updateOptions.byDate) {
      sortedData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } else if (updateOptions.byName) {
      sortedData.sort((a, b) => a.title.localeCompare(b.title));
    }

    onSort(sortedData);
  };
  useEffect(() => {
    // Предположим, что при каждом обновлении сессии
    // нужно сбросить чекбоксы
    if (session) {
      setSortOptions({ byDate: false, byName: false });
    }
  }, [session]);

  const { isOpen } = useFilter();

  return (
    <div
      className={`transition-transform duration-300 ease-in-out ${
        isOpen ? "-translate-x-180" : "-translate-x-full"
      }`}
      w-64="true"
      border-r="true"
      bg-white="true"
      p-6="true"
    >
      <div className="font-semibold mb-4">Фильтры</div>
      <div className="space-y-4">
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={sortOptions.byDate}
            onCheckedChange={() => handleSortChange("byDate")}
          />
          <span className="text-sm">По дате события</span>
        </label>
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={sortOptions.byName}
            onCheckedChange={() => handleSortChange("byName")}
          />
          <span className="text-sm">По названию</span>
        </label>
      </div>
    </div>
  );
};

export default Filters;
