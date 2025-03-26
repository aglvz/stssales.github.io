<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Productos>
 */
class ProductosFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'descripcion' => fake()->name(),
            'precio' => fake()->randomFloat(2, 0, 1000),
            'stock' => fake()->randomNumber(2),
            'image' => fake()->image(),
            'idcategoria' => fake()->randomNumber(2),
            'idmarca' => fake()->randomNumber(2),
            'idproveedor' => fake()->randomNumber(2),
            'estado' => fake()->boolean(),
        ];
    }
}
