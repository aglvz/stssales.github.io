<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Categoria;
use App\Models\Marca;
use App\Models\Proveedores;
use Inertia\Inertia;
use App\Models\Productos;
use Illuminate\Http\Request;

class ProductosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categorias = Categoria::select('idcategoria as value', 'categoria as label')->get();
        $marca = Marca::select('idmarca as value', 'marca as label')->get();
        $proveedor = Proveedores::select('idproveedor as value', 'nombre as label')->get();
        $data = [
            'categoria' => $categorias,
            'marca' => $marca,
            'proveedor' => $proveedor
        ];
        return Inertia::render('Productos/Productos', [
            'productos' => Productos::where('estado',1)->get(),
            'combos' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function allproductos()
    {
        return response()->json(['data' => Productos::where('estado',1)->get()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if($request->file('imagen')==null)
        {
            $file = Productos::where('idproducto', $request->idproducto)->first();
            $file = $file->image;
        }
        else
        {
            $file = base64_encode(file_get_contents($request->file('imagen')));
        }
        Productos::updateOrCreate(
            ['idproducto'=> $request->idproducto],
            ['producto' => $request->producto,
            'clave' => $request->clave,
            'descripcion' => $request->descripcion,
            'precio' => $request->precio,
            'stock' => $request->stock,
            'idcategoria' => $request->idcategoria,
            'idmarca' => $request->idmarca,
            'idproveedor' => $request->idproveedor,
            'image' => $file,
            'estado' => 1,
        ]);
        if ( $request->idproducto==0)
        {
            $data=['message' => 'Producto creado correctamente'];
        }
        else
        {
            $data=['message' => 'Producto actualizado correctamente'];
        }
        return response()->json($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Productos $productos)
    {
        return Inertia::render('Productos/Show', [
            'productos' => $productos
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($idproducto)
    {
        $producto = Productos::select(
            'idproducto',
            'clave',
            'producto',
            'descripcion',
            'precio',
            'stock',
            'image',
            'idcategoria',
            DB::raw('(select categoria from categorias where idcategoria=productos.idcategoria) as categoria'),
            'idmarca',
            DB::raw('(select marca from marcas where idmarca=productos.idmarca) as marca'),
            'idproveedor',
            DB::raw('(select nombre from proveedores where idproveedor=productos.idproveedor) as proveedor')
        )->where('idproducto', $idproducto)->first();

        return response()->json($producto);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Productos $productos)
    {
        $productos->update([
            'descripcion' => $request->descripcion,
            'precio' => $request->precio
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Productos $productos)
    {
        //$productos->delete();
        $productos->estado=0;
        $productos->save();
        return response()->json(['message' => 'Producto eliminado correctamente']);
    }

    public function combos()
    {
        $categorias = Categoria::select('idcategoria as value', 'categoria as label')->get();
        $marca = Marca::select('idmarca as value', 'marca as label')->get();
        $proveedor = Proveedores::select('idproveedor as value', 'nombre as label')->get();
        $data = [
            'categoria' => $categorias,
            'marca' => $marca,
            'proveedor' => $proveedor
        ];
        return response()->json(['combos' => $data]);
    }
}
