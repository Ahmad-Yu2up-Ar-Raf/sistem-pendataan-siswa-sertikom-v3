<?php

namespace App\Enums;

enum RoleEnums: string
{
 
    case SuperAdmin = 'super_admin';
    case Admin = 'admin';
    case Guru = 'guru';
    case Siswa = 'siswa';
 
   
   
   
        public static function values(): array
       {
           return array_map(fn(self $s) => $s->value, self::cases());
       }
}
