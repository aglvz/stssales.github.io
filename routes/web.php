<?php

use App\Http\Controllers\CotizacionesController;
use App\Http\Controllers\ProductosController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VentasController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/productos', [ProductosController::class, 'index'])->name('productos.index');
    Route::post('/productos', [ProductosController::class, 'store'])->name('productos.store');
    Route::get('/productos/allproductos', [ProductosController::class, 'allproductos'])->name('productos.allproductos');
    Route::get('/productos/{productos}/edit', [ProductosController::class, 'edit'])->name('productos.edit');
    Route::put('/productos/{productos}', [ProductosController::class, 'update'])->name('productos.update');
    Route::delete('/productos/{productos}', [ProductosController::class, 'destroy'])->name('productos.destroy');
    Route::get('/productos/combos', [ProductosController::class, 'combos'])->name('productos.combos');
});

Route::middleware('auth')->group(function () {
    Route::get('/cotizaciones', [CotizacionesController::class, 'index'])->name('cotizaciones.index');
    Route::post('/cotizaciones', [CotizacionesController::class, 'store'])->name('cotizaciones.store');
    Route::get('/cotizaciones/allcotizaciones', [CotizacionesController::class, 'allcotizaciones'])->name('cotizaciones.allcotizaciones');
    Route::post('/cotizaciones/detalle', [CotizacionesController::class, 'detalle'])->name('cotizaciones.detalle');
    Route::get('/cotizaciones/{cotizacion}/edit', [CotizacionesController::class, 'edit'])->name('cotizaciones.edit');
    Route::get('/cotizaciones/{cotizacion}/det', [CotizacionesController::class, 'det'])->name('cotizaciones.det');
    Route::put('/cotizaciones/{cotizacion}', [CotizacionesController::class, 'update'])->name('cotizaciones.update');
    Route::delete('/cotizaciones/{cotizacion}', [CotizacionesController::class, 'destroy'])->name('cotizaciones.destroy');
    Route::delete('/cotizaciones/det/{idcotdet}/{idcot}', [CotizacionesController::class, 'destroydet'])->name('cotizaciones.destroydet');
    Route::get('/cotizaciones/pdf/{id}', [CotizacionesController::class, 'generateCot'])->name('cotizaciones.generateCot');
});

Route::middleware('auth')->group(function () {
    Route::get('/ventas', [VentasController::class, 'index'])->name('ventas.index');
    Route::post('/ventas', [VentasController::class, 'store'])->name('ventas.store');
    Route::get('/ventas/allventas', [VentasController::class, 'allventas'])->name('ventas.allventas');
    Route::post('/ventas/detalle', [VentasController::class, 'detalle'])->name('ventas.detalle');
    Route::get('/ventas/{venta}/edit', [VentasController::class, 'edit'])->name('ventas.edit');
    Route::get('/ventas/{venta}/det', [VentasController::class, 'det'])->name('ventas.det');
    Route::put('/ventas/{venta}', [VentasController::class, 'update'])->name('ventas.update');
    Route::delete('/ventas/{venta}', [VentasController::class, 'destroy'])->name('ventas.destroy');
    Route::delete('/ventas/det/{idventadet}/{idventa}', [VentasController::class, 'destroydet'])->name('ventas.destroydet');
    Route::get('/ventas/pdf/{id}', [VentasController::class, 'generateVenta'])->name('ventas.generateVenta');
    Route::post('/ventas/{venta}/pagada', [VentasController::class, 'markAsPaid'])->name('ventas.markAsPaid');
});

require __DIR__.'/auth.php';
