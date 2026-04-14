// resources/js/Components/SEOHead.jsx
import { Head } from '@inertiajs/react'

/**
 * Composant SEO universel pour le portfolio
 * Gère : title, meta description, Open Graph, Twitter Card, Schema.org JSON-LD
 *
 * Usage :
 *   <SEOHead
 *     title="Accueil"
 *     description="Designer graphique freelance..."
 *     image="/og-home.jpg"
 *     type="website"
 *   />
 */
export default function SEOHead({
    title,
    description = 'Designer graphique freelance spécialisé en identité visuelle, branding et direction artistique. Basé à Yaoundé, disponible dans le monde entier.',
    image = '/og-default.jpg',
    url,
    type = 'website',
    // Données spécifiques aux projets
    projectName,
    projectCategory,
    publishedAt,
    // Schema.org
    schema,
}) {
    const siteName  = 'Dim\'s Design — Kouongme Mbouom Franck Dimitri'
    const siteUrl   = 'https://votreportfolio.com' // ← à remplacer
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
                name: 'Kouongme Mbouom Franck Dimitri', // ← à remplacer
                url: siteUrl,
                jobTitle: 'Designer Graphique & Directeur Artistique',
                description,
                image: `${siteUrl}/photo.jpg`,
                sameAs: [
                    'https://behance.net/votreprofil',   // ← à remplacer
                    'https://linkedin.com/in/votreprofil', // ← à remplacer
                    'https://dribbble.com/votreprofil',   // ← à remplacer
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
        <Head title={fullTitle}>
            <meta name="description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <link rel="canonical" href={canonical} />
        </Head>
    )
}