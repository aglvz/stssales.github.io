<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Cotizaciones extends Model
{
    protected $table = 'cotizaciones';
    protected $primaryKey = 'idcotizacion';
    protected $fillable = [
        'nombre_cliente',
        'rfc',
        'telefono',
        'correo_cliente',
        'direccion',
        'idusuario',
    ];

    public function detalles()
    {
        return $this->hasMany(Cotizacionesdet::class, 'idcotizacion', 'idcotizacion')
                    ->select(
                        'idcotdet',
                        'idcotizacion',
                        'idproducto',
                        'cantidad',
                        'precio',
                        'descuento',
                        DB::raw('(select producto from productos where idproducto=cotizaciones_detalle.idproducto) as producto')
                    );
    }
}
