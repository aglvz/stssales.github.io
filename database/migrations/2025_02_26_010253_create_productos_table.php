<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id('idproducto')->autoIncrement()->uniqid();
            $table->string('clave',50)->nullable();
            $table->string('producto')->nullable();
            $table->string('descripcion')->nullable();
            $table->float('precio', precision: 23)->nullable();
            $table->smallInteger('stock')->nullable();
            $table->mediumText('image')->charset('binary')->nullable();
            $table->smallInteger('idcategoria')->nullable();
            $table->smallInteger('idmarca')->nullable();
            $table->smallInteger('idproveedor')->nullable();
            $table->boolean('estado')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
