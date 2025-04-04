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
        Schema::create('cotizaciones', function (Blueprint $table) {
            $table->id('idcotizacion');
            $table->string('nombre_cliente')->nullable();
            $table->string('rfc')->nullable();
            $table->string('telefono')->nullable();
            $table->string('correo_cliente')->nullable();
            $table->string('direccion')->nullable();
            $table->integer('idusuario')->nullable();
            $table->timestamps();
        });
        schema::create('cotizaciones_detalle', function (Blueprint $table) {
            $table->id('idcotdet');
            $table->integer('idcotizacion')->nullable();
            $table->integer('idproducto')->nullable();
            $table->integer('cantidad')->nullable();
            $table->decimal('precio', 10, 2)->nullable();
            $table->decimal('descuento', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cotizaciones');
        Schema::dropIfExists('cotizaciones_detalle');
    }
};
