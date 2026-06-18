<?php


// ══════════════════════════════════════════════════════════════
// app/Models/Livrable.php
// ══════════════════════════════════════════════════════════════
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Livrable extends Model
{
    protected $fillable = [
        'souscription_id', 'nom', 'fichier_path', 'fichier_nom_original',
        'mime_type', 'taille', 'type',
        'notifie_whatsapp', 'notifie_email', 'envoye_le', 'message',
    ];

    protected $casts = [
        'notifie_whatsapp' => 'boolean',
        'notifie_email'    => 'boolean',
        'envoye_le'        => 'datetime',
    ];

    public function souscription() { return $this->belongsTo(Souscription::class); }

    public function getUrlAttribute(): string
    {
        return Storage::url($this->fichier_path);
    }

    public function getTailleFormatteAttribute(): string
    {
        $kb = $this->taille / 1024;
        if ($kb < 1024) return round($kb, 1) . ' Ko';
        return round($kb / 1024, 1) . ' Mo';
    }
}