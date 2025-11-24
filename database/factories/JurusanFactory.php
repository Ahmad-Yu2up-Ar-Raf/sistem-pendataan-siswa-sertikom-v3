<?php

namespace Database\Factories;

use App\Enums\StatusEnums;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Jurusan>
 */
class JurusanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jurusans = [
            ['kode' => 'RPL', 'nama' => 'Rekayasa Perangkat Lunak'],
            ['kode' => 'TKJ', 'nama' => 'Teknik Komputer dan Jaringan'],
            ['kode' => 'AKL', 'nama' => 'Akuntansi dan Keuangan Lembaga'],
            ['kode' => 'OTKP', 'nama' => 'Otomatisasi dan Tata Kelola Perkantoran'],
            ['kode' => 'BDP', 'nama' => 'Bisnis Daring dan Pemasaran'],
            ['kode' => 'MM', 'nama' => 'Multimedia'],
        ];

        $jurusan = fake()->unique()->randomElement($jurusans);

        return [
            'kode_jurusan' => $jurusan['kode'],
            'nama_jurusan' => $jurusan['nama'],
            'deskripsi' => fake()->optional()->sentence(),
           'status' => fake()->randomElement(StatusEnums::cases()),
          'created_by' => User::factory(), // Will be set by seeder

            'updated_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the jurusan is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'aktif',
        ]);
    }

    /**
     * Indicate that the jurusan is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'nonaktif',
        ]);
    }
}