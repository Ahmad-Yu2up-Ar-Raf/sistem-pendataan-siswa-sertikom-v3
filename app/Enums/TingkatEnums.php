<?php

namespace App\Enums;

enum TingkatEnums: string
{
    case X = 'X';
    case XI = 'XI';
    case XII = 'XII';





     public static function values(): array
    {
        return array_map(fn(self $s) => $s->value, self::cases());
    }
}
