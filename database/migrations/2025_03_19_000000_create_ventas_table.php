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
        Schema::create('ventas', function (Blueprint $table) {
            $table->id('idventa');
            $table->string('numero_venta')->nullable();
            $table->string('nombre_cliente');
            $table->string('rfc')->nullable();
            $table->string('telefono')->nullable();
            $table->string('correo_cliente')->nullable();
            $table->text('direccion')->nullable();
            $table->foreignId('idusuario')->constrained('users', 'id')->onDelete('cascade');
            $table->enum('estado', ['pendiente', 'completada', 'cancelada'])->default('pendiente');
            $table->decimal('total', 10, 2)->default(0);
            $table->decimal('descuento_total', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};
