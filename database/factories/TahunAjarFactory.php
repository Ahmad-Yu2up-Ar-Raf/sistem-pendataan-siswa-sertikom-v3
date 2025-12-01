<?php

namespace Database\Factories;

use App\Enums\StatusEnums;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TahunAjar>
 */
class TahunAjarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $mulai = $this->faker->dateTimeBetween('-3 years', '+1 year');
        $selesai = (clone $mulai)->modify('+1 year');

        return [
            'kode_tahun_ajar' => $this->faker->unique()->numerify('####/####'),
            'nama_tahun_ajar' => $this->faker->unique()->numberBetween(2020, 9026) . '/' . $this->faker->unique()->numberBetween(2021, 9027),
            'tanggal_mulai' => $mulai,
            'tanggal_selesai' => $selesai,
            'status' => StatusEnums::Aktif->value,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => StatusEnums::NonAktif->value ?? 'nonaktif',
        ]);
    }
}
