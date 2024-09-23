<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CocheController;
use App\Http\Controllers\CompraCocheController;
use App\Http\Controllers\tiendaCoche;
use App\Http\Controllers\AuthEmpresa;

Route::get('coches/{matricula?}', [CocheController::class, 'obtenerCoches']);
Route::get('tiendaCoches', [tiendaCoche::class, 'extraerDatosCoches']);
Route::get('refresh', [AuthController::class, 'refrescarToken'])->middleware('auth:api');
Route::get('esAdmin', [AuthController::class, 'esAdmin'])->middleware('auth:api');

Route::post('login', [AuthController::class, 'login']);
Route::post('registrar', [AuthController::class, 'registro']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
Route::post('compraCoche',[CompraCocheController::class, 'registroCompra']);
Route::post('registroEmpresa',[AuthEmpresa::class, 'registrarEmpresa']);
