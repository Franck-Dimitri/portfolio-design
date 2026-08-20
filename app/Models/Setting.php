<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
        'label',
        'description',
    ];

    /**
     * Obtenir la valeur d'un paramètre avec cache
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::remember("setting_{$key}", 86400, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Mettre à jour ou créer un paramètre
     */
    public static function set(string $key, mixed $value, ?string $group = 'general', ?string $type = 'text', ?string $label = null, ?string $description = null): self
    {
        $setting = static::updateOrCreate(
            ['key' => $key],
            array_filter([
                'value' => is_bool($value) ? ($value ? '1' : '0') : (string) $value,
                'group' => $group,
                'type' => $type,
                'label' => $label,
                'description' => $description,
            ], fn($v) => !is_null($v))
        );

        Cache::forget("setting_{$key}");
        Cache::forget('all_settings_grouped');

        return $setting;
    }

    /**
     * Obtenir tous les paramètres groupés
     */
    public static function getAllGrouped(): array
    {
        return Cache::remember('all_settings_grouped', 86400, function () {
            $settings = static::all();
            $grouped = [];
            foreach ($settings as $setting) {
                $grouped[$setting->group][$setting->key] = [
                    'value' => $setting->type === 'boolean' ? ($setting->value === '1' || $setting->value === 'true') : $setting->value,
                    'type' => $setting->type,
                    'label' => $setting->label,
                    'description' => $setting->description,
                ];
            }
            return $grouped;
        });
    }

    /**
     * Effacer le cache lors des modifications
     */
    protected static function booted()
    {
        static::saved(function ($setting) {
            Cache::forget("setting_{$setting->key}");
            Cache::forget('all_settings_grouped');
        });

        static::deleted(function ($setting) {
            Cache::forget("setting_{$setting->key}");
            Cache::forget('all_settings_grouped');
        });
    }
}
