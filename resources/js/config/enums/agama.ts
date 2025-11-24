import { OptionItem } from "@/types";
import {
 
  Home,
 
  Scroll,
  Flower,
  Flame,
  Zap,
  Heart,
  
} from "lucide-react";

 

export enum Agama {
  Islam = "islam",
  Kristen = "kristen",
  Katolik = "katolik",
  Hindu = "hindu",
  Buddha = "buddha",
  Konghucu = "konghucu",
}

export const AgamaOptions: OptionItem[] = [
  {
    value: Agama.Islam,
    label: "Islam",
    icon: Zap,
    subLabel: "Agama Islam",
    description: "Agama Islam",
  },
  {
    value: Agama.Kristen,
    label: "Kristen",
    icon: Flame,
    subLabel: "Agama Kristen",
    description: "Agama Kristen Protestan",
  },
  {
    value: Agama.Katolik,
    label: "Katolik",
    icon: Heart,
    subLabel: "Agama Katolik",
    description: "Agama Katolik",
  },
  {
    value: Agama.Hindu,
    label: "Hindu",
    icon: Flower,
    subLabel: "Agama Hindu",
    description: "Agama Hindu",
  },
  {
    value: Agama.Buddha,
    label: "Buddha",
    icon: Scroll,
    subLabel: "Agama Buddha",
    description: "Agama Buddha",
  },
  {
    value: Agama.Konghucu,
    label: "Konghucu",
    icon: Home,
    subLabel: "Agama Konghucu",
    description: "Agama Konghucu",
  },
];

export const AgamaValues: string[] = AgamaOptions.map((item) => item.value);

 