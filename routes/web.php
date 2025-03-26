<?php

use App\Http\Controllers\ProductosController;
use App\Http\Controllers\ProfileController;
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
    Route::get('/productos/all', [ProductosController::class, 'allproductos'])->name('productos.allproductos');
    Route::get('/productos/create', [ProductosController::class, 'create'])->name('productos.create');
    Route::post('/productos', [ProductosController::class, 'store'])->name('productos.store');
    Route::get('/productos/show/{productos}', [ProductosController::class, 'show'])->name('productos.show');
    Route::get('/productos/{productos}/edit', [ProductosController::class, 'edit'])->name('productos.edit');
    Route::put('/productos/{productos}', [ProductosController::class, 'update'])->name('productos.update');
    Route::delete('/productos/{productos}', [ProductosController::class, 'destroy'])->name('productos.destroy');
    Route::get('/productos/combos', [ProductosController::class, 'combos'])->name('productos.combos');
});


require __DIR__.'/auth.php';
