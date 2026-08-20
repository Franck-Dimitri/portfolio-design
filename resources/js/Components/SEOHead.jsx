// resources/js/Components/SEOHead.jsx
import { Head } from '@inertiajs/react'

/**
 * Composant SEO universel pour le portfolio DCA
 * Gère : title, meta description, Open Graph, Twitter Card, Schema.org JSON-LD
 */
export default function SEOHead({
    title,
    description = "Studio de Design Graphique, UI/UX & Identité de Marque. Conception de logos, plateformes web modernes et direction artistique sur mesure.",
    image = '/og-default.jpg',
    url,
    type = 'website',
    // Données spécifiques aux projets / blogs
    projectName,
    projectCategory,
    publishedAt,
    // Schema.org
    schema,
}) {
    const siteName  = "Dim's Creative Academy — Franck Dimitri"
    const siteUrl   = typeof window !== 'undefined' ? window.location.origin : 'https://dimscreative.com'
    const canonical = url ? `${siteUrl}${url}` : siteUrl
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`
    const fullTitle = title ? `${title} — ${siteName}` : siteName

    /* ── Schema.org par défaut : Person + WebSite ──────────────── */
    const defaultSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                '@id': `${siteUrl}/#person`,
                name: 'Franck Dimitri Kouongme',
                url: siteUrl,
                jobTitle: 'Designer Graphique & Directeur Artistique',
                description,
                image: `${siteUrl}/images/franck_dimitri_portrait.jpg`,
                sameAs: [
                    'https://behance.net/franckdimitri',
                    'https://linkedin.com/in/franckdimitri',
                    'https://dribbble.com/franckdimitri',
                    'https://instagram.com/dimscreative',
                    'https://github.com/mr-dims-tech'
                ],
            },
            {
                '@type': 'WebSite',
                '@id': `${siteUrl}/#website`,
                url: siteUrl,
                name: siteName,
                description,
                publisher: { '@id': `${siteUrl}/#person` },
            },
            {
                '@type': 'WebPage',
                '@id': `${canonical}/#webpage`,
                url: canonical,
                name: fullTitle,
                isPartOf: { '@id': `${siteUrl}/#website` },
                about: { '@id': `${siteUrl}/#person` },
            },
        ],
    }

    /* ── Schema.org pour un projet ─────────────────────────────── */
    const projectSchema = projectName ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: projectName,
        creator: { '@id': `${siteUrl}/#person` },
        genre: projectCategory,
        datePublished: publishedAt,
        url: canonical,
        image: fullImage,
    } : null

    const jsonLd = schema || projectSchema || defaultSchema

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />

            {/* Canonical Link */}
            <link rel="canonical" href={canonical} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </script>
        </Head>
    )
}