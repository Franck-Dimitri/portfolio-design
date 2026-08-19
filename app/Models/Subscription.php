<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'user_id',
        'service_package_id',
        'service_id',
        'duration_months',
        'status',
        'statut_production',
        'starts_at',
        'ends_at',
        'notes_admin',
        'date_debut_production',
        'date_livraison_estimee',
        'livre_le',
        'besoins',
        'client_nom',
        'client_email',
        'client_telephone',
        'client_whatsapp'
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'date_debut_production' => 'datetime',
        'date_livraison_estimee' => 'datetime',
        'livre_le' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function ($sub) {
            if (empty($sub->reference)) {
                $sub->reference = 'DCA-' . strtoupper(Str::random(6));
            }
            if (empty($sub->statut_production)) {
                $sub->statut_production = 'non_demarre';
            }
            if (empty($sub->client_nom) && $sub->user) {
                $sub->client_nom = $sub->user->name;
            }
            if (empty($sub->client_email) && $sub->user) {
                $sub->client_email = $sub->user->email;
            }
        });

        static::created(function ($sub) {
            $sub->logActivity('order_created', 'Commande initiée sur la plateforme');
        });
    }

    // ── Relations ─────────────────────────────────────────────
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function servicePackage()
    {
        return $this->belongsTo(ServicePackage::class, 'service_package_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class)->latestOfMany();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function livrables()
    {
        return $this->hasMany(Livrable::class, 'souscription_id');
    }

    public function messages()
    {
        return $this->hasMany(SubscriptionMessage::class)->with('user')->oldest();
    }

    public function activities()
    {
        return $this->hasMany(SubscriptionActivity::class)->latest();
    }

    public function logActivity(string $type, string $description, ?array $meta = null): SubscriptionActivity
    {
        return $this->activities()->create([
            'type' => $type,
            'description' => $description,
            'meta' => $meta,
            'created_at' => now(),
        ]);
    }

    // ── Scopes ────────────────────────────────────────────────
    public function scopePaye($query)
    {
        return $query->where(function ($q) {
            $q->where('status', 'active')
              ->orWhereHas('payment', function ($pq) {
                  $pq->where('status', 'success');
              });
        });
    }

    public function scopeEnProduction($query)
    {
        return $query->whereIn('statut_production', ['en_cours', 'en_revision']);
    }

    // ── Accessors & Helpers ───────────────────────────────────
    public function isActive()
    {
        return $this->status === 'active' && 
               ($this->ends_at === null || $this->ends_at->isFuture());
    }

    public function isExpired()
    {
        return $this->ends_at !== null && $this->ends_at->isPast();
    }

    public function getTotalAmount()
    {
        if ($this->servicePackage) {
            return (int) $this->servicePackage->prix * ($this->duration_months ?: 1);
        }
        if ($this->service) {
            return (int) ($this->service->prix ?: $this->service->starting_price ?: 0);
        }
        return 0;
    }

    public function getMontantAttribute()
    {
        return $this->getTotalAmount();
    }

    public function getMontantFormateAttribute(): string
    {
        return number_format($this->montant, 0, ',', ' ') . ' FCFA';
    }

    public function getStatutPaiementAttribute(): string
    {
        if ($this->status === 'active') {
            return 'paye';
        }
        if ($this->payment) {
            return match ($this->payment->status) {
                'success' => 'paye',
                'pending' => 'initie',
                'failed'  => 'echoue',
                default   => 'en_attente',
            };
        }
        return $this->status === 'pending' ? 'en_attente' : $this->status;
    }
}