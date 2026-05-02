<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $table = 'projects';
    
    protected $fillable = [
        'titre',
        'description',
        'slug',
        'cathegorie',
        'outils',
        'prix',
        'is_featured',
        'is_published',
        'external_link',
        'views',
        'image'
    ];

    protected $casts = [
        'outils' => 'array',  // Important : convertit automatiquement JSON <=> array
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'prix' => 'decimal:2',
    ];

    public function images()
    {
        return $this->hasMany(ProjectImage::class);
    }
}