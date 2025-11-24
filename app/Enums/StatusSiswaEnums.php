<?php

namespace App\Enums;

enum StatusSiswaEnums: string
{
    case Aktif = 'aktif';
    case Lulus = 'lulus';
    case Pindah = 'pindah';
    case Keluar = 'keluar';
    case Dropout = 'dropout';




     public static function values(): array
    {
        return array_map(fn(self $s) => $s->value, self::cases());
    }
}
