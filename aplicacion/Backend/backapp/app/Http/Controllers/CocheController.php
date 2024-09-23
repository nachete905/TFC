<?php

namespace App\Http\Controllers;

use App\Models\Coche;
use App\Models\Propietario;
use Illuminate\Http\Request;

class CocheController extends Controller
{
    public function obtenerCoches($matricula = null){
        if ($matricula) {
            $coche = Coche::with(['documentacion', 'propietario'])->where('matricula', $matricula)->first();
            return response()->json($coche);
        } else {
            $coches = Coche::with(['documentacion', 'propietario'])->get();
            return response()->json($coches);
        }
    }


}
