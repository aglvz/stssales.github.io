<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Productos;
use App\Models\Cotizaciones;
use App\Models\Cotizacionesdet;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Yajra\DataTables\DataTables;

class CotizacionesController extends Controller
{
    public function index()
    {
        return Inertia::render('Productos/Cotizaciones', [
            'cotizaciones' => null,
            'productos' => Productos::where('estado', 1)->select( DB::raw('idproducto value'), 
                                                                  DB::raw("clave|| ' ' || producto|| ' ' || cast(precio as varchar(10)) label"),
                                                                  'precio')
                                                        ->get()
        ]);
    }

    public function allcotizaciones(Request $request)
    {
        if ($request->ajax()) {
            $data = Cotizaciones::with('detalles')->select('idcotizacion','nombre_cliente','created_at')->get(); // Query your data
            return DataTables::of($data)
                ->make(true); // Return the DataTables-formatted JSON response
        }
    }

    public function store(Request $request)
    {
        $cotizacion = Cotizaciones::updateOrCreate(
            ['idcotizacion' => $request->idcotizacion],
            ['nombre_cliente' => $request->nombre_cliente,
            'rfc' => $request->rfc,
            'telefono' => $request->telefono,
            'correo_cliente' => $request->correo_cliente,
            'direccion' => $request->direccion,
            'idusuario' =>  Auth::user()->id
        ]);

        if ( $request->idcotizacion==null)
        {
            $data=['message' => 'Producto creado correctamente'];
        }
        else
        {
            $data=['message' => 'Producto actualizado correctamente'];
        }
        return response()->json($data);
    }

    public function detalle(Request $request)
    {
        $cotizaciondet=Cotizacionesdet::create([
            'idcotizacion' => $request->idcotizacion,
            'idproducto' => $request->idproducto,
            'cantidad' => $request->cantidad,
            'precio' => $request->precio,
            'descuento' => $request->descuento
        ]);
        $detalles = Cotizacionesdet::where('idcotizacion', $request->idcotizacion)
                                    ->select(
                                        'idcotdet',
                                        'idcotizacion',
                                        'idproducto',
                                        'cantidad',
                                        'precio',
                                        'descuento',
                                        'descripcion',
                                        DB::raw('(select clave from productos where idproducto=cotizaciones_detalle.idproducto) as clave'),
                                        DB::raw('(select producto from productos where idproducto=cotizaciones_detalle.idproducto) as producto'),
                                        DB::raw('(select descripcion from productos where idproducto=cotizaciones_detalle.idproducto) as descripcion')
                                    )
                                    ->get();
        
        return response()->json(['message' => 'Detalles guardados correctamente',
                                'detalle'=> $detalles]);
    }
    public function edit($id)
    {
        $cotizacion = Cotizaciones::find($id);
        return response()->json($cotizacion);
    }
    public function update(Request $request, $id)
    {
        $cotizacion = Cotizaciones::findOrFail($id);
        $cotizacion->update([
            'nombre' => $request->nombre,
            'telefono' => $request->telefono,
            'correo' => $request->correo,
            'direccion' => $request->direccion,
        ]);

        Cotizacionesdet::where('idcotizacion', $id)->delete();

        foreach ($request->productos as $producto) {
            Cotizacionesdet::create([
                'idcotizacion' => $cotizacion->idcotizacion,
                'idproducto' => $producto['id'],
                'cantidad' => $producto['cantidad'],
                'precio' => $producto['precio'],
                'descuento' => $producto['descuento']
            ]);
        }

        return redirect()->route('cotizaciones.index');
    }
    public function destroy($id)
    {
        $cotizacion = Cotizaciones::findOrFail($id);
        $cotizacion->delete();
        Cotizacionesdet::where('idcotizacion', $id)->delete();

        return redirect()->route('cotizaciones.index');
    }

    public function destroydet($idcotdet,$idcot)
    {
        $cotizaciondet = Cotizacionesdet::findOrFail($idcotdet);
        $cotizaciondet->delete();
        $detalles= Cotizacionesdet::where('idcotizacion', $idcot)
                                    ->select(
                                        'idcotdet',
                                        'idcotizacion',
                                        'idproducto',
                                        'cantidad',
                                        'precio',
                                        'descuento',
                                        DB::raw('(select producto from productos where idproducto=cotizaciones_detalle.idproducto) as producto')
                                    )
                                    ->get();
        return response()->json(['message' => 'Detalle eliminado correctamente',
                                'detalle'=> $detalles]);
    }
    public function det($id)
    {
        $detalles = Cotizacionesdet::where('idcotizacion', $id)
                                    ->select(
                                        'idcotdet',
                                        'idcotizacion',
                                        'idproducto',
                                        'cantidad',
                                        'precio',
                                        'descuento',
                                        DB::raw('(select clave from productos where idproducto=cotizaciones_detalle.idproducto) as clave'),
                                        DB::raw('(select producto from productos where idproducto=cotizaciones_detalle.idproducto) as producto'),
                                        DB::raw('(select descripcion from productos where idproducto=cotizaciones_detalle.idproducto) as descripcion')
                                    )
                                    ->get();
        return response()->json($detalles);
    }

    public function generateCot($id)
    {
        $data = Cotizacionesdet::where('idcotizacion', $id)
                                    ->select(
                                        'idcotdet',
                                        'idcotizacion',
                                        'idproducto',
                                        'cantidad',
                                        'precio',
                                        'descuento',
                                        DB::raw('(select clave from productos where idproducto=cotizaciones_detalle.idproducto) as clave'),
                                        DB::raw('(select producto from productos where idproducto=cotizaciones_detalle.idproducto) as producto'),
                                        DB::raw('(select descripcion from productos where idproducto=cotizaciones_detalle.idproducto) as descripcion')
                                    )
                                    ->get();
        $pdf= new PDF();
        $pdf = Pdf::loadView('cotizacion', ['data'=>$data]);
        $pdf->render();
        return $pdf->stream('cotizacion_' . $id . '.pdf'); // Stream to the browser
        // or return $pdf->download('invoice.pdf'); // Force download
    }
 
}
