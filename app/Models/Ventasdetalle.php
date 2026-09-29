<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ventasdetalle extends Model
{
    protected $table = 'ventas_detalle';
    protected $primaryKey = 'idventadet';
    protected $fillable = [
        'idventa',
        'idproducto',
        'cantidad',
        'precio',
        'descuento',
    ];

    public function venta()
    {
        return $this->belongsTo(Ventas::class, 'idventa', 'idventa');
    }
}
