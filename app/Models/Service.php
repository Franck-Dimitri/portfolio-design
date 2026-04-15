<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'titre',
        'slug',
        'description',
        'cathegorie',
        'prix',
        'starting_price',
        'delaie_livraison',
        'is_active',
        'is_featured',
    ];

    protected $casts = [
        'outils' => 'array',
        'livrables' => 'array', // ex: ["Design unique", "Livraison rapide", "Fichiers HD"]
        'features' => 'array',
    ];
}
