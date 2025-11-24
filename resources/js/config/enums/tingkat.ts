import { OptionItem } from "@/types";
import {
  
  Trophy,
 
  BookOpen,
 
  BarChart3,
 
} from "lucide-react";

 

export enum Tingkat {
  X = "X",
  XI = "XI",
  XII = "XII",
}

export const TingkatOptions: OptionItem[] = [
  {
    value: Tingkat.X,
    label: "Kelas X",
    icon: BookOpen,
    subLabel: "Tingkat 1",
    description: "Kelas 10 / Tingkat pertama",
  },
  {
    value: Tingkat.XI,
    label: "Kelas XI",
    icon: BarChart3,
    subLabel: "Tingkat 2",
    description: "Kelas 11 / Tingkat kedua",
  },
  {
    value: Tingkat.XII,
    label: "Kelas XII",
    icon: Trophy,
    subLabel: "Tingkat 3",
    description: "Kelas 12 / Tingkat ketiga",
  },
];

export const TingkatValues: string[] = TingkatOptions.map((item) => item.value);
 