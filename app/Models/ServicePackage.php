<?php
// ══════════════════════════════════════════════════════════════
// app/Models/ServicePackage.php
// ══════════════════════════════════════════════════════════════
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class ServicePackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre', 'slug', 'description', 'description_courte',
        'prix', 'prix_barre', 'devise',
        'nombre_design', 'delai_livraison', 'nombre_revision',
        'features', 'livrables', 'services', 'non_inclus',
        'couleur_badge', 'icone', 'is_populaire', 'is_active', 'ordre',
    ];

    protected $casts = [
        'features'    => 'array',
        'livrables'   => 'array',
        'services'    => 'array',
        'non_inclus'  => 'array',
        'is_populaire'=> 'boolean',
        'is_active'   => 'boolean',
    ];

    // ── Auto-slug ─────────────────────────────────────────────
    protected static function booted(): void
    {
        static::creating(function ($pack) {
            if (empty($pack->slug)) {
                $pack->slug = Str::slug($pack->titre);
            }
        });
    }

    // ── Scopes ────────────────────────────────────────────────
    public function scopeActif($query)
    {
        return $query->where('is_active', true)->orderBy('ordre');
    }

    // ── Accessors ─────────────────────────────────────────────
    public function getPrixFormatteAttribute(): string
    {
        return number_format($this->prix, 0, ',', ' ') . ' ' . $this->devise;
    }

    public function getNombreDesignLabelAttribute(): string
    {
        return $this->nombre_design ? $this->nombre_design . ' designs' : 'Illimité';
    }

    // ── Relations ─────────────────────────────────────────────
    public function souscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}


