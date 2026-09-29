<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Productos;
use App\Models\Ventas;
use App\Models\Ventasdetalle;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Yajra\DataTables\DataTables;

class VentasController extends Controller
{
    public function index()
    {
        $productos = Productos::select('idproducto as value', 'producto as label', 'precio')->where('estado', 1)->get();
        return Inertia::render('Productos/Ventas', [
            'productos' => $productos
        ]);
    }

    public function allventas(Request $request)
    {
        if ($request->ajax()) {
            $data = Ventas::select('idventa','numero_venta','nombre_cliente','total','estado','created_at')->get();
            return DataTables::of($data)
                ->editColumn('total', function($row) {
                    return '$' . number_format($row->total, 2, '.', ',');
                })
                ->editColumn('estado', function($row) {
                    $badge = $row->estado === 'completada' ? 'success' : ($row->estado === 'pendiente' ? 'warning' : 'danger');
                    return '<span class="badge bg-' . $badge . '">' . ucfirst($row->estado) . '</span>';
                })
                ->editColumn('created_at', function($row) {
                    return $row->created_at->format('d/m/Y H:i');
                })
                ->addColumn('acciones', function($row) {
                    return '';
                })
                ->rawColumns(['estado'])
                ->make(true);
        }
    }

    public function store(Request $request)
    {
        $venta = Ventas::updateOrCreate(
            ['idventa' => $request->idventa],
            [
                'nombre_cliente' => $request->nombre_cliente,
                'rfc' => $request->rfc,
                'telefono' => $request->telefono,
                'correo_cliente' => $request->correo_cliente,
                'direccion' => $request->direccion,
                'idusuario' => Auth::user()->id,
                'estado' => 'pendiente'
            ]
        );

        if ($request->idventa == null) {
            $data = ['message' => 'Venta creada correctamente', 'idventa' => $venta->idventa];
        } else {
            $data = ['message' => 'Venta actualizada correctamente', 'idventa' => $venta->idventa];
        }
        return response()->json($data);
    }

    public function detalle(Request $request)
    {
        $ventadet = Ventasdetalle::create([
            'idventa' => $request->idventa,
            'idproducto' => $request->idproducto,
            'cantidad' => $request->cantidad,
            'precio' => $request->precio,
            'descuento' => $request->descuento
        ]);
        
        // Calcular el total de la venta
        $total = Ventasdetalle::where('idventa', $request->idventa)
            ->selectRaw('SUM((cantidad * precio) - descuento) as total')
            ->value('total');
        
        // Actualizar el total en la venta
        Ventas::where('idventa', $request->idventa)->update(['total' => $total]);
        
        $detalles = Ventasdetalle::where('idventa', $request->idventa)
                                    ->select(
                                        'idventadet',
                                        'idventa',
                                        'idproducto',
                                        'cantidad',
                                        'precio',
                                        'descuento',
                                        DB::raw('(select clave from productos where idproducto=ventas_detalle.idproducto) as clave'),
                                        DB::raw('(select producto from productos where idproducto=ventas_detalle.idproducto) as producto')
                                    )
                                    ->get();
        
        return response()->json(['message' => 'Detalle guardado correctamente', 'detalle'=> $detalles]);
    }

    public function edit($id)
    {
        $venta = Ventas::find($id);
        return response()->json($venta);
    }

    public function update(Request $request, $id)
    {
        $venta = Ventas::findOrFail($id);
        
        $total = 0;
        if ($request->productos) {
            foreach ($request->productos as $producto) {
                $total += ($producto['cantidad'] * $producto['precio'] - $producto['descuento']);
            }
        }
        
        $venta->update([
            'nombre_cliente' => $request->nombre_cliente,
            'telefono' => $request->telefono,
            'correo_cliente' => $request->correo_cliente,
            'direccion' => $request->direccion,
            'total' => $total,
            'estado' => $request->estado ?? 'pendiente'
        ]);

        Ventasdetalle::where('idventa', $id)->delete();

        foreach ($request->productos as $producto) {
            Ventasdetalle::create([
                'idventa' => $venta->idventa,
                'idproducto' => $producto['id'],
                'cantidad' => $producto['cantidad'],
                'precio' => $producto['precio'],
                'descuento' => $producto['descuento']
            ]);
        }

        return response()->json(['message' => 'Venta actualizada correctamente']);
    }

    public function destroy($id)
    {
        $venta = Ventas::findOrFail($id);
        $venta->delete();
        Ventasdetalle::where('idventa', $id)->delete();

        return response()->json(['message' => 'Venta eliminada correctamente']);
    }

    public function destroydet($idventadet, $idventa)
    {
        $ventadet = Ventasdetalle::findOrFail($idventadet);
        $ventadet->delete();
        
        // Recalcular el total de la venta después de eliminar el detalle
        $total = Ventasdetalle::where('idventa', $idventa)
            ->selectRaw('SUM((cantidad * precio) - descuento) as total')
            ->value('total') ?? 0;
        
        // Actualizar el total en la venta
        Ventas::where('idventa', $idventa)->update(['total' => $total]);
        
        $detalles = Ventasdetalle::where('idventa', $idventa)
                                    ->select(
                                        'idventadet',
                                        'idventa',
                                        'idproducto',
                                        'cantidad',
                                        'precio',
                                        'descuento',
                                        DB::raw('(select producto from productos where idproducto=ventas_detalle.idproducto) as producto')
                                    )
                                    ->get();
        return response()->json(['message' => 'Detalle eliminado correctamente', 'detalle'=> $detalles]);
    }

    public function det($id)
    {
        $detalles = Ventasdetalle::where('idventa', $id)
                                    ->select(
                                        'idventadet',
                                        'idventa',
                                        'idproducto',
                                        'cantidad',
                                        'precio',
                                        'descuento',
                                        DB::raw('(select clave from productos where idproducto=ventas_detalle.idproducto) as clave'),
                                        DB::raw('(select producto from productos where idproducto=ventas_detalle.idproducto) as producto')
                                    )
                                    ->get();
        return response()->json($detalles);
    }

    public function generateVenta($id)
    {
        $venta = Ventas::find($id);
        $detalles = Ventasdetalle::where('idventa', $id)
                                    ->select(
                                        'idventadet',
                                        'idventa',
                                        'idproducto',
                                        'cantidad',
                                        'precio',
                                        'descuento',
                                        DB::raw('(select clave from productos where idproducto=ventas_detalle.idproducto) as clave'),
                                        DB::raw('(select producto from productos where idproducto=ventas_detalle.idproducto) as producto')
                                    )
                                    ->get();
        
        $pdf = Pdf::loadView('venta', ['venta' => $venta, 'detalles' => $detalles]);
        $pdf->render();
        return $pdf->stream('venta_' . $id . '.pdf');
    }

    public function markAsPaid($id)
    {
        $venta = Ventas::findOrFail($id);
        $venta->estado = 'completada';
        $venta->save();

        return response()->json(['message' => 'Venta marcada como pagada', 'estado' => $venta->estado]);
    }
}
