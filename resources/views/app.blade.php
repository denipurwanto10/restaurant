<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Saveur — Crafted with Passion, Served with Soul</title>
    <meta name="description" content="Saveur fine dining restaurant. Explore our menu, order online, and find our branches. Crafted with Passion, Served with Soul.">
    <meta property="og:title" content="Saveur Restaurant">
    <meta property="og:description" content="Crafted with Passion, Served with Soul. Order online, explore menus and branches.">
    <meta property="og:type" content="website">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300..800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/build/assets/leaflet/leaflet.css">
    <link rel="stylesheet" href="/build/assets/app.css">
    <script>
        // Apply saved theme before first paint (avoids flash).
        try {
            var t = localStorage.getItem('saveur_theme');
            if (t !== 'dark' && t !== 'light') {
                t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            if (t === 'dark') document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = t;
        } catch (e) { /* ignore */ }
    </script>
    <script type="importmap">
    {!! file_exists(public_path('build/importmap.json')) ? file_get_contents(public_path('build/importmap.json')) : '{"imports":{}}' !!}
    </script>
    <script type="module" src="/build/js/app.js"></script>
</head>
<body>
    <div id="app"></div>
</body>
</html>
