<?php

namespace App\Http\Controllers;


use App\Models\Coche;
use App\Models\FotoCoche;
use Illuminate\Support\Facades\Log;
class tiendaCoche extends Controller

{   public function extraerDatosCoches()
    {
        // Carga los coches junto con sus fotos
        $coches = Coche::with('fotos')->get();

        // Log de los datos extraídos
        Log::debug('Coches y fotos extraídas', ['coches' => $coches]);

        return response()->json($coches);
    }
}
