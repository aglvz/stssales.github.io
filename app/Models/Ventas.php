<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Ventas extends Model
{
    protected $table = 'ventas';
    protected $primaryKey = 'idventa';
    protected $fillable = [
        'numero_venta',
        'nombre_cliente',
        'rfc',
        'telefono',
        'correo_cliente',
        'direccion',
        'idusuario',
        'estado',
        'total',
        'descuento_total',
    ];

    public function detalles()
    {
        return $this->hasMany(Ventasdetalle::class, 'idventa', 'idventa')
                    ->select(
                        'idventadet',
                        'idventa',
                        'idproducto',
                        'cantidad',
                        'precio',
                        'descuento',
                    );
    }
}
