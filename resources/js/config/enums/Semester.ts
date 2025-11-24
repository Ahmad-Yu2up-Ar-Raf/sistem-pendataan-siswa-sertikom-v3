import { OptionItem } from "@/types";
import {
  
  CalendarDays,
 
  Calendar,
  
} from "lucide-react";

 
 
// ==========================================
// SEMESTER ENUM
// ==========================================

export enum Semester {
  Ganjil = "ganjil",
  Genap = "genap",
}

export const SemesterOptions: OptionItem[] = [
  {
    value: Semester.Ganjil,
    label: "Semester Ganjil",
    icon: Calendar,
    subLabel: "Semester 1, 3, 5",
    description: "Semester ganjil (1, 3, atau 5)",
  },
  {
    value: Semester.Genap,
    label: "Semester Genap",
    icon: CalendarDays,
    subLabel: "Semester 2, 4, 6",
    description: "Semester genap (2, 4, atau 6)",
  },
];

export const SemesterValues: string[] = SemesterOptions.map(
  (item) => item.value
);

 
 