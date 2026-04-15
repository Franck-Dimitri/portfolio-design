<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicePackages extends Model
{
    protected $fillable = [
        'titre',
        'slug',
        'description',
        'prix',
        'nombre_design',
        'delaie_livraison',
        'is_active',
    ];

    protected $cast = [
        'features' => 'array',
        'livrables' => 'array',
        'services' => 'array',
    ];
}
