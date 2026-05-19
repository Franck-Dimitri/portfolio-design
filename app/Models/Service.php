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
        'outils',        // ← AJOUTER
        'livrables',     // ← AJOUTER
        'features',      // ← AJOUTER
        'is_featured',
        'is_published',
        'is_active',
    ];

    protected $casts = [
        'outils' => 'array',
        'livrables' => 'array',
        'features' => 'array',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'is_active' => 'boolean',
        'prix' => 'integer',
        'starting_price' => 'integer',
    ];
}