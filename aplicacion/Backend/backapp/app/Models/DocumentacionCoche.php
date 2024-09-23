<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentacionCoche extends Model
{
    // Nombre de la tabla en la base de datos
    protected $table = 'documentacion_coche';

    // Clave primaria de la tabla
    protected $primaryKey = 'id_documentacion';

    // Si tu tabla no usa timestamps, puedes desactivar los timestamps
    public $timestamps = false;

    // Campos que pueden ser llenados masivamente
    protected $fillable = [
        'permiso_circulacion',
        'ficha_tecnica',
        'ficha_verde',
        'fecha_documentacion',
    ];

    // Relación con el modelo Coche
    public function coches()
    {
        return $this->hasMany(Coche::class, 'id_documentacionCoche', 'id_documentacion');
    }
}
