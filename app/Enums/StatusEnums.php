<?php

namespace App\Enums;

enum StatusEnums: string
{
    case Aktif = 'aktif';
    case NonAktif = 'nonaktif';
  
  
  
       public static function values(): array
      {
          return array_map(fn(self $s) => $s->value, self::cases());
      }
}
