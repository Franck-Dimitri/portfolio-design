<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'titre',
        'slug',
        'sous_titre',
        'courte_description',
        'contenue',
        'image',
        'temps_lecture',
        'is_published',
        'published_at'
    ];

    protected $casts = [
        'cathegorie' => 'array',
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id');
    }
}
