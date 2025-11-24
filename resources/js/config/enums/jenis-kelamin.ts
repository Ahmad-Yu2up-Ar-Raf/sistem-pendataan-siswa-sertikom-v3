import { OptionItem } from "@/types";
import {

  Mars,
  Venus,

} from "lucide-react";



// ==========================================
// JENIS KELAMIN ENUM
// ==========================================

export enum JenisKelamin {
  LakiLaki = "laki_laki",
  Perempuan = "perempuan",
}

export const JenisKelaminOptions: OptionItem[] = [
  {
    value: JenisKelamin.LakiLaki,
    label: "Laki-Laki",
    icon: Mars,
    subLabel: "Pria",
    description: "Jenis kelamin laki-laki",
  },
  {
    value: JenisKelamin.Perempuan,
    label: "Perempuan",
    icon: Venus,
    subLabel: "Wanita",
    description: "Jenis kelamin perempuan",
  },
];

export const JenisKelaminValues: string[] = JenisKelaminOptions.map(
  (item) => item.value
);

