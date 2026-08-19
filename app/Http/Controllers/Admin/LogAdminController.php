<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;

class LogAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::latest();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('user_name', 'like', "%{$search}%")
                  ->orWhere('user_email', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        $allLogs = ActivityLog::all();
        $todayLogs = ActivityLog::whereDate('created_at', today())->count();
        $errorLogs = ActivityLog::whereIn('level', ['error', 'critical', 'warning'])->count();
        $authLogs = ActivityLog::where('category', 'auth')->count();
        $orderLogs = ActivityLog::where('category', 'order')->count();

        return Inertia::render('Admin/pages/Logs/Index', [
            'logs'    => $query->paginate(25)->withQueryString(),
            'filters' => $request->only(['category', 'level', 'search']),
            'stats'   => [
                'total'       => $allLogs->count(),
                'aujourdhui'  => $todayLogs,
                'alertes'     => $errorLogs,
                'auth'        => $authLogs,
                'commandes'   => $orderLogs,
            ]
        ]);
    }

    public function exportCsv(): StreamedResponse
    {
        $fileName = 'dca_audit_logs_' . date('Y-m-d_His') . '.csv';
        $logs = ActivityLog::latest()->take(2000)->get();

        $headers = [
            "Content-type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        return response()->stream(function () use ($logs) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF)); // BOM UTF-8

            fputcsv($handle, [
                'ID',
                'Date & Heure',
                'Niveau',
                'Catégorie',
                'Action',
                'Description',
                'Utilisateur',
                'Email',
                'Rôle',
                'Adresse IP',
                'User Agent'
            ], ';');

            foreach ($logs as $log) {
                fputcsv($handle, [
                    $log->id,
                    $log->created_at->format('d/m/Y H:i:s'),
                    strtoupper($log->level),
                    strtoupper($log->category),
                    $log->action,
                    $log->description,
                    $log->user_name,
                    $log->user_email ?: '—',
                    $log->user_role ?: '—',
                    $log->ip_address ?: '—',
                    $log->user_agent ?: '—',
                ], ';');
            }

            fclose($handle);
        }, 200, $headers);
    }

    public function clearOld()
    {
        $count = ActivityLog::where('created_at', '<', now()->subDays(30))->delete();

        ActivityLogger::log(
            'system.logs_pruned',
            "Purge automatique des logs : {$count} anciens enregistrements (> 30 jours) supprimés.",
            'system',
            'warning'
        );

        return back()->with('success', "{$count} logs anciens ont été purgés.");
    }
}
