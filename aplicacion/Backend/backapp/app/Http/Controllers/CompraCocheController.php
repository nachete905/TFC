<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Propietario;
use App\Models\DocumentacionCoche;
use App\Models\Coche;
use App\Models\FotoCoche;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class CompraCocheController extends Controller
{
    public function registroCompra(Request $request)
    {

        // Validar los datos de la solicitud
        try {
            $request->validate([
                'nombre' => 'required|string',
                'apellido' => 'required|string',
                'email' => 'required|email',
                'telefono' => 'required|string',
                'permisoCirculacion' => 'required|string',
                'fichaTecnica' => 'required|string',
                'fichaVerde' => 'required|string',
                'fechaDocumentacion' => 'required|date',
                'matricula' => 'required|string',
                'marca' => 'required|string',
                'modelo' => 'required|string',
                'tipo_combustible' => 'required|string',
                'tipo_cambio' => 'required|string',
                'kilometraje' => 'required|integer',
                'año_matriculacion' => 'required|date',
                'fotos' => 'required|array|min:6',
                'fotos.*' => 'string',
            ]);
            Log::debug('Validación exitosa.');
        } catch (\Exception $e) {
            Log::error('Validación fallida.', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Validación fallida'], 400);
        }
          // Comenzamos una transacción
          DB::beginTransaction();

        // Procesar la documentación
        $documentacionData = [];
        foreach (['permisoCirculacion', 'fichaTecnica', 'fichaVerde'] as $doc) {
            $docBase64 = $request->input($doc);

            if ($docBase64) {
                Log::debug("Procesando documentación: $doc");

                // Extraer la parte base64 del string (si incluye el encabezado de datos)
                $docBase64 = preg_replace('/^data:image\/\w+;base64,/', '', $docBase64);
                $docBase64 = str_replace(' ', '+', $docBase64);

                // Decodificar la imagen
                $docData = base64_decode($docBase64);

                // Generar un nombre único para la imagen
                $nombreArchivo = time() . '_' . $doc . '.webp';

                // Guardar la imagen en el almacenamiento público
                Storage::disk('public')->put($nombreArchivo, $docData);

                // Guardar la ruta de la imagen
                $documentacionData[$doc] = 'storage/' . $nombreArchivo;

            }
        }

        // Guardar la documentación del coche
        $documentacionCoche = DocumentacionCoche::create([
            'permiso_circulacion' => $documentacionData['permisoCirculacion'] ?? null,
            'ficha_tecnica' => $documentacionData['fichaTecnica'] ?? null,
            'ficha_verde' => $documentacionData['fichaVerde'] ?? null,
            'fecha_documentacion' => $request->fechaDocumentacion,
        ]);

        // Crear el coche
        $coche = Coche::create([
            'matricula' => $request->matricula,
            'marca' => $request->marca,
            'modelo' => $request->modelo,
            'tipo_combustible' => $request->tipo_combustible,
            'tipo_cambio' => $request->tipo_cambio,
            'kilometraje' => $request->kilometraje,
            'año_matriculacion' => $request->año_matriculacion,
            'id_documentacionCoche' => $documentacionCoche->id_documentacion,
        ]);

        // Verificar que el coche ha sido creado antes de insertar fotos
        if (!$coche) {
            return response()->json(['error' => 'No se pudo crear el coche.'], 500);
        }

        // Crear el propietario
        $propietario = Propietario::create([
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'email' => $request->email,
            'telefono' => $request->telefono,
            'matricula' => $request->matricula,
        ]);

         // Procesar las fotos del coche
         $fotosBase64 = $request->input('fotos', []);
         if (is_array($fotosBase64)) {
             foreach ($fotosBase64 as $index => $fotoBase64) {
                 Log::debug("Procesando foto $index.");
     
                 // Extraer el formato de la imagen (e.g., png, jpeg)
                 if (preg_match('/^data:image\/(\w+);base64,/', $fotoBase64, $type)) {
                     $extension = strtolower($type[1]); // jpg, png, gif, etc.
     
                     // Verificar si la extensión es válida
                     if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                         return response()->json(['error' => 'Formato de imagen no soportado.'], 400);
                     }
     
                     // Eliminar la cabecera base64 para obtener solo los datos
                     $fotoBase64 = preg_replace('/^data:image\/\w+;base64,/', '', $fotoBase64);
                     $fotoBase64 = str_replace(' ', '+', $fotoBase64);
     
                     // Decodificar la imagen
                     $fotoData = base64_decode($fotoBase64);
     
                     // Generar un nombre único para la imagen
                     $nombreArchivo = 'foto_' . time() . '_' . $index . '.' . $extension;
     
                     Storage::disk('public')->put($nombreArchivo, $fotoData);
     
                     // Guardar la ruta de la imagen en la base de datos
                     FotoCoche::create([
                         'matricula' => $request->matricula,
                         'foto' => 'storage/' . $nombreArchivo, // Guardar la ruta completa
                     ]);
     
                 } else {
                     return response()->json(['error' => 'No se pudo determinar el formato de la imagen.'], 400);
                 }
             }
         } else {
             return response()->json(['error' => 'No se recibieron fotos válidas.'], 400);
         }
         DB::commit();
        return response()->json([
            'message' => 'Datos del coche y propietario guardados con éxito.',
            'coche' => $coche,
            'propietario' => $propietario
        ]);
    }
}
