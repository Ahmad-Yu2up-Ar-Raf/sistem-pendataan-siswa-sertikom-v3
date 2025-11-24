<?php

namespace App\Enums;

enum AgamaEnums: string
{
    case Islam = 'islam';
    case Kristen = 'kristen';
    case Katolik = 'katolik';
    case Hindu = 'hindu';
    case Buddha = 'buddha';
    case Konghucu = 'konghucu';



    
     public static function values(): array
    {
        return array_map(fn(self $s) => $s->value, self::cases());
    }
}
