<?php

namespace App\Enums;

enum SemesterEnums: string
{
    case Ganjil = 'ganjil';
    case Genap = 'genap';




     public static function values(): array
    {
        return array_map(fn(self $s) => $s->value, self::cases());
    }
}
