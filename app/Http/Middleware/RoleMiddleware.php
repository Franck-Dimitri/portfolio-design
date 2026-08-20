<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Si des rôles spécifiques sont requis
        if (!empty($roles)) {
            // Si le rôle requis est admin et que l'utilisateur est client
            if (in_array('admin', $roles) && $user->role !== 'admin') {
                // Rediriger le client vers son propre espace avec un message clair
                return redirect()->route('client.dashboard')->with('error', 'Accès réservé aux administrateurs.');
            }

            // Si le rôle requis est client et que l'utilisateur n'est ni client ni admin
            if (in_array('client', $roles) && !in_array($user->role, ['client', 'admin'])) {
                return redirect()->route('home')->with('error', 'Accès non autorisé.');
            }
        }

        return $next($request);
    }
}
