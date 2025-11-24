<?php

namespace App\Enums;

enum JenisKelaminEnums: string
{
    case LakiLaki = 'laki_laki';
    case Perempuan = 'perempuan';
   
   
   
   
        public static function values(): array
       {
           return array_map(fn(self $s) => $s->value, self::cases());
       }
}
