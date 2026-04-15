<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'post_id',
        'nom',
        'email',
        'commentaire',
        'parent_id'
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // réponses
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    // likes
    public function likes()
    {
        return $this->hasMany(CommentLike::class);
    }
}
