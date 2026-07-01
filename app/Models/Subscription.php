<?php
// app/Models/Subscription.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service_package_id',
        'service_id',
        'duration_months',
        'status',
        'starts_at',
        'ends_at'
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    // Relations
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
        return $this->belongsTo(Service::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    // Vérifier si la souscription est active
    public function isActive()
    {
        return $this->status === 'active' && 
               ($this->ends_at === null || $this->ends_at->isFuture());
    }

    // Vérifier si la souscription est expirée
    public function isExpired()
    {
        return $this->ends_at !== null && $this->ends_at->isPast();
    }

    // Obtenir le montant total
    public function getTotalAmount()
    {
        if ($this->service_package_id) {
            return $this->servicePackage->prix * $this->duration_months;
        }
        return $this->service->prix;
    }
}