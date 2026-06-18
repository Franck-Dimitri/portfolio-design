<?php
// ══════════════════════════════════════════════════════════════
// app/Models/Souscription.php
// ══════════════════════════════════════════════════════════════
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Souscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'service_package_id', 'reference',
        'client_nom', 'client_email', 'client_telephone',
        'client_whatsapp', 'client_entreprise', 'besoins',
        'montant', 'devise',
        'cinetpay_transaction_id', 'cinetpay_payment_token',
        'statut_paiement', 'paye_le', 'cinetpay_response',
        'statut_production', 'notes_admin',
        'date_debut_production', 'date_livraison_estimee', 'livre_le',
    ];

    protected $casts = [
        'cinetpay_response'       => 'array',
        'paye_le'                 => 'datetime',
        'date_debut_production'   => 'datetime',
        'date_livraison_estimee'  => 'datetime',
        'livre_le'                => 'datetime',
    ];

    // ── Auto-reference ────────────────────────────────────────
    protected static function booted(): void
    {
        static::creating(function ($s) {
            if (empty($s->reference)) {
                $s->reference = 'PACK-' . date('Y') . '-' . str_pad(
                    static::whereYear('created_at', date('Y'))->count() + 1,
                    5, '0', STR_PAD_LEFT
                );
            }
        });
    }

    // ── Scopes ────────────────────────────────────────────────
    public function scopePaye($query)       { return $query->where('statut_paiement', 'paye'); }
    public function scopeEnAttente($query)  { return $query->where('statut_paiement', 'en_attente'); }

    // ── Accessors ─────────────────────────────────────────────
    public function getMontantFormatteAttribute(): string
    {
        return number_format($this->montant, 0, ',', ' ') . ' ' . $this->devise;
    }

    public function getStatutPaiementLabelAttribute(): string
    {
        return match($this->statut_paiement) {
            'en_attente' => 'En attente',
            'initie'     => 'Initié',
            'paye'       => 'Payé',
            'echoue'     => 'Échoué',
            'rembourse'  => 'Remboursé',
            default      => $this->statut_paiement,
        };
    }

    public function getStatutProductionLabelAttribute(): string
    {
        return match($this->statut_production) {
            'non_demarre' => 'Non démarré',
            'en_cours'    => 'En cours',
            'en_revision' => 'En révision',
            'termine'     => 'Terminé',
            'archive'     => 'Archivé',
            default       => $this->statut_production,
        };
    }

    // ── Relations ─────────────────────────────────────────────
    public function user()           { return $this->belongsTo(User::class); }
    public function servicePackage() { return $this->belongsTo(ServicePackage::class); }
    public function livrables()      { return $this->hasMany(Livrable::class); }
}
