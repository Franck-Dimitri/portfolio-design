<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'titre',
        'description',
        'slug',
        'cathegorie',
        'outils',
        'prix',
        'image',
        'is_featured',
        'is_published'
    ];

    public function images(){
        return $this->hasMany(ProjectIMage::class);
        
    }
}
