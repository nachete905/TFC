<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Propietario extends Model
{
    protected $table = 'propietario';
    protected $primaryKey = 'id_propietario';
    public $timestamps = false;
    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'telefono',
        'matricula'
        
    ];

    public function coche()
    {
        return $this->belongsTo(Coche::class, 'matricula', 'matricula');
    }
}
