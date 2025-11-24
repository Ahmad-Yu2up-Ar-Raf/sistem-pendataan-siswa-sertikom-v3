<?php

namespace App\Enums;

enum StatusKelasEnums: string
{
    case Aktif = 'aktif';
    case NaikKelas = 'naik_kelas';
    case TinggalKelas = 'tinggal_kelas';
    case PindahKelas = 'pindah_kelas';
    case Lulus = 'lulus';
    case Keluar = 'keluar';




     public static function values(): array
    {
        return array_map(fn(self $s) => $s->value, self::cases());
    }
}
