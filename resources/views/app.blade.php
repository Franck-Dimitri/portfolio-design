{{-- resources/views/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    

    <title inertia>{{ config('app.name', 'Portfolio') }}</title>

    {{-- ── Google Fonts : Outfit ──────────────────────────────── --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
    >

    {{-- ── Favicon ────────────────────────────────────────────── --}}
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    {{-- ── Vite Assets ─────────────────────────────────────────── --}}
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])

    {{-- ── Inertia Head ─────────────────────────────────────────── --}}
    @inertiaHead

    {{-- ══════════════════════════════════════════════════════════
         ANTI-FOUC : applique le thème AVANT le premier rendu
         pour éviter le flash blanc → noir ou inverse
         ══════════════════════════════════════════════════════════ --}}
    <script>
        (function () {
            const stored = localStorage.getItem('portfolio-theme')
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

            let theme = stored === 'dark' || stored === 'light'
                ? stored
                : (prefersDark ? 'dark' : 'light')

            document.documentElement.classList.add(theme)
        })()
    </script>
</head>

<body class="font-sans antialiased bg-base text-base-primary">
    @inertia
</body>
</html>