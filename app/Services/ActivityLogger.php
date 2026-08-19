<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    /**
     * Enregistre un événement dans la table des logs d'audit.
     */
    public static function log(
        string $action,
        string $description,
        string $category = 'system',
        string $level = 'info',
        $subject = null,
        array $properties = []
    ): ?ActivityLog {
        try {
            $user = Auth::user();

            $subjectType = null;
            $subjectId = null;

            if ($subject) {
                if (is_object($subject)) {
                    $subjectType = get_class($subject);
                    $subjectId = $subject->id ?? null;
                } elseif (is_string($subject)) {
                    $subjectType = $subject;
                }
            }

            return ActivityLog::create([
                'user_id'      => $user?->id,
                'user_name'    => $user?->name ?: 'Invité / Système',
                'user_email'   => $user?->email,
                'user_role'    => $user?->role ?: 'guest',
                'action'       => $action,
                'category'     => $category,
                'level'        => $level,
                'description'  => $description,
                'subject_type' => $subjectType,
                'subject_id'   => $subjectId,
                'properties'   => !empty($properties) ? $properties : null,
                'ip_address'   => Request::ip(),
                'user_agent'   => Request::userAgent(),
                'created_at'   => now(),
            ]);
        } catch (\Exception $e) {
            \Log::error("Erreur lors de l'enregistrement de l'audit log: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Helpers rapides pour chaque catégorie
     */
    public static function auth(string $action, string $description, string $level = 'info', array $properties = []): ?ActivityLog
    {
        return self::log($action, $description, 'auth', $level, null, $properties);
    }

    public static function order(string $action, string $description, $subject = null, string $level = 'info', array $properties = []): ?ActivityLog
    {
        return self::log($action, $description, 'order', $level, $subject, $properties);
    }

    public static function payment(string $action, string $description, $subject = null, string $level = 'success', array $properties = []): ?ActivityLog
    {
        return self::log($action, $description, 'payment', $level, $subject, $properties);
    }

    public static function client(string $action, string $description, $subject = null, string $level = 'info', array $properties = []): ?ActivityLog
    {
        return self::log($action, $description, 'client', $level, $subject, $properties);
    }

    public static function catalog(string $action, string $description, $subject = null, string $level = 'info', array $properties = []): ?ActivityLog
    {
        return self::log($action, $description, 'catalog', $level, $subject, $properties);
    }
}
