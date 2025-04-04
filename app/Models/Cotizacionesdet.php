<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cotizacionesdet extends Model
{
    protected $table = 'cotizaciones_detalle';
    protected $primaryKey = 'idcotdet';
    protected $fillable = [
        'idcotizacion',
        'idproducto',
        'cantidad',
        'precio',
        'descuento',
    ];

    public function cotizacion()
    {
        return $this->belongsTo(Cotizaciones::class, 'idcotizacion', 'idcotizacion');
    }
}
