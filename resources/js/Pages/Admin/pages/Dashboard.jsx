import AdminLayout from '@/Layouts/AdminLayout'
import { Link } from '@inertiajs/react'
import {
    FolderGit2,
    Eye,
    Users,
    TrendingUp,
    BarChart3,
    Plus,
    FileText,
    ArrowUpRight,
    Terminal,
    Crosshair,
    Clock,
    DollarSign,
    CheckCircle2,
    AlertCircle,
    Package,
    Mail,
    ChevronRight,
    Sparkles,
    Box
} from 'lucide-react'
import { useState } from 'react'

export default function Dashboard({ stats = {}, chart = { labels: [], revenue: [], orders: [] }, recentSubscriptions = [], recentProjects = [], recentContacts = [] }) {
    const [chartMode, setChartMode] = useState('revenue');

    const maxRev = Math.max(...(chart.revenue?.length ? chart.revenue : [100000]), 100000);
    const maxOrd = Math.max(...(chart.orders?.length ? chart.orders : [10]), 10);

    const getStatutBadge = (status) => {
        switch (status) {
            case 'paye':
            case 'active':
                return <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/30">PAYÉ ✓</span>;
            case 'initie':
            case 'en_attente':
            case 'pending':
                return <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">EN ATTENTE</span>;
            case 'echoue':
                return <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/30">ÉCHOUÉ</span>;
            default:
                return <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-gray-500/10 text-gray-400 border border-gray-500/30">{status}</span>;
        }
    };

    const getProdBadge = (status) => {
        switch (status) {
            case 'termine':
                return <span className="flex items-center gap-1 text-[10px] font-mono text-green-400"><CheckCircle2 size={10} /> TERMINÉ</span>;
            case 'en_cours':
                return <span className="flex items-center gap-1 text-[10px] font-mono text-blue-400"><Clock size={10} className="animate-spin" /> EN COURS</span>;
            case 'en_revision':
                return <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400"><Sparkles size={10} /> RÉVISION</span>;
            default:
                return <span className="flex items-center gap-1 text-[10px] font-mono text-gray-500"><AlertCircle size={10} /> NON DÉMARRÉ</span>;
        }
    };

    return (
        <AdminLayout title="Tableau de Bord">
            <div className="space-y-8">

                {/* ══════════════════════════════════════════════════
                    § 1 – HERO SYSTEM STATUS
                ══════════════════════════════════════════════════ */}
                <div className="relative border border-gray-800 bg-[#0E0E0E] p-6 md:p-8 overflow-hidden">
                    {/* Blueprint Corner Accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary-500"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary-500"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary-500"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary-500"></div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-2">
                                <Terminal size={13} />
                                <span>CENTRE DE COMMANDE ET D'ANALYSE DCA</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-white">
                                TABLEAU DE <span className="text-primary-500">BORD OPÉRATIONNEL</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-400 mt-2 max-w-xl">
                                Synthèse en direct des flux financiers, commandes de design, avancement de production et performance du portfolio.
                            </p>
                        </div>

                        {/* Actions Rapides */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/admin/projects"
                                className="inline-flex items-center gap-2 bg-primary-500 text-black px-4 py-2.5 font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors"
                            >
                                <Plus size={14} /> NOUVEAU PROJET
                            </Link>
                            <Link
                                href="/admin/blogs/create"
                                className="inline-flex items-center gap-2 border border-gray-700 hover:border-primary-500 text-gray-300 hover:text-white px-4 py-2.5 font-mono font-bold text-xs uppercase tracking-widest bg-[#141414] transition-colors"
                            >
                                <FileText size={14} /> ÉCRIRE ARTICLE
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 2 – GRILLE DES 4 MÉTRIQUES PRINCIPALES
                ══════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* CHIFFRE D'AFFAIRES */}
                    <div className="border border-gray-800 bg-[#0E0E0E] p-5 relative group hover:border-primary-500/50 transition-colors">
                        <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                            <span>01 // FINANCE</span>
                            <DollarSign size={16} className="text-primary-500" />
                        </div>
                        <p className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
                            {stats.ca_total_formate || '0 FCFA'}
                        </p>
                        <p className="text-[11px] font-mono text-gray-400">
                            Chiffre d'affaires cumulé
                        </p>
                    </div>

                    {/* SOUSCRIPTIONS EN COURS */}
                    <div className="border border-gray-800 bg-[#0E0E0E] p-5 relative group hover:border-primary-500/50 transition-colors">
                        <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                            <span>02 // PRODUCTION</span>
                            <Users size={16} className="text-blue-500" />
                        </div>
                        <p className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
                            {stats.in_progress_subscriptions ?? 0}
                            <span className="text-xs font-mono text-gray-500 ml-2">/ {stats.total_subscriptions ?? 0} total</span>
                        </p>
                        <p className="text-[11px] font-mono text-gray-400">
                            Commandes actives en cours
                        </p>
                    </div>

                    {/* PROJETS PORTFOLIO */}
                    <div className="border border-gray-800 bg-[#0E0E0E] p-5 relative group hover:border-primary-500/50 transition-colors">
                        <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                            <span>03 // PORTFOLIO</span>
                            <FolderGit2 size={16} className="text-amber-500" />
                        </div>
                        <p className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
                            {stats.published_projects ?? 0}
                            <span className="text-xs font-mono text-gray-500 ml-2">/ {stats.total_projects ?? 0}</span>
                        </p>
                        <p className="text-[11px] font-mono text-gray-400">
                            Projets publiés en ligne
                        </p>
                    </div>

                    {/* VUES & VISIBILITÉ */}
                    <div className="border border-gray-800 bg-[#0E0E0E] p-5 relative group hover:border-primary-500/50 transition-colors">
                        <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                            <span>04 // VISIBILITÉ</span>
                            <Eye size={16} className="text-green-500" />
                        </div>
                        <p className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
                            {parseInt(stats.total_views ?? 0).toLocaleString()}
                        </p>
                        <p className="text-[11px] font-mono text-gray-400">
                            Vues cumulées Projets & Blog
                        </p>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 3 – ANALYTIQUE & FLUX DES 6 DERNIERS MOIS
                ══════════════════════════════════════════════════ */}
                <div className="border border-gray-800 bg-[#0E0E0E] p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-1">
                                <BarChart3 size={14} />
                                <span>FLUX D'ACTIVITÉ HISTORIQUE</span>
                            </div>
                            <h2 className="text-lg font-display font-bold uppercase tracking-wider text-white">
                                Performance Mensuelle (6 Derniers Mois)
                            </h2>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setChartMode('revenue')}
                                className={`px-3 py-1.5 font-mono text-[10px] uppercase font-bold tracking-widest border transition-colors ${
                                    chartMode === 'revenue' 
                                        ? 'bg-primary-500 text-black border-primary-500' 
                                        : 'border-gray-800 text-gray-400 hover:text-white'
                                }`}
                            >
                                Chiffre d'Affaires (FCFA)
                            </button>
                            <button
                                onClick={() => setChartMode('orders')}
                                className={`px-3 py-1.5 font-mono text-[10px] uppercase font-bold tracking-widest border transition-colors ${
                                    chartMode === 'orders' 
                                        ? 'bg-primary-500 text-black border-primary-500' 
                                        : 'border-gray-800 text-gray-400 hover:text-white'
                                }`}
                            >
                                Commandes
                            </button>
                        </div>
                    </div>

                    {/* Chart Bars (Blueprint CSS visualization) */}
                    <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 pt-8 px-2 border-b border-gray-800/80">
                        {(chart.labels?.length > 0 ? chart.labels : ['M-5', 'M-4', 'M-3', 'M-2', 'M-1', 'Ce mois']).map((label, idx) => {
                            const val = chartMode === 'revenue' 
                                ? (chart.revenue?.[idx] || 0)
                                : (chart.orders?.[idx] || 0);
                            const max = chartMode === 'revenue' ? maxRev : maxOrd;
                            const heightPct = Math.max(Math.round((val / max) * 100), 4);

                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                    <span className="text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {chartMode === 'revenue' ? `${val.toLocaleString()} F` : `${val} cmd`}
                                    </span>
                                    <div className="w-full max-w-[48px] bg-gray-900 border border-gray-800 rounded-t relative overflow-hidden group-hover:border-primary-500 transition-colors" style={{ height: `${heightPct}%` }}>
                                        <div 
                                            className={`w-full h-full ${
                                                chartMode === 'revenue' 
                                                    ? 'bg-gradient-to-t from-primary-500/40 to-primary-500' 
                                                    : 'bg-gradient-to-t from-blue-500/40 to-blue-500'
                                            }`}
                                        />
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider text-center mt-2 truncate w-full">
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 4 – TABLEAU DES DERNIÈRES SOUSCRIPTIONS
                ══════════════════════════════════════════════════ */}
                <div className="border border-gray-800 bg-[#0E0E0E]">
                    <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold">
                                <Crosshair size={12} />
                                <span>DERNIÈRES COMMANDES</span>
                            </div>
                            <h2 className="text-base font-display font-bold uppercase tracking-wider text-white mt-0.5">
                                Souscriptions Récentes
                            </h2>
                        </div>

                        <Link
                            href="/admin/souscriptions"
                            className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 hover:text-primary-500 transition-colors"
                        >
                            TOUT VOIR ({stats.total_subscriptions || 0}) <ArrowUpRight size={12} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-[#141414] text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800">
                                <tr>
                                    <th className="p-4">RÉFÉRENCE</th>
                                    <th className="p-4">CLIENT</th>
                                    <th className="p-4">PRESTATION</th>
                                    <th className="p-4">MONTANT</th>
                                    <th className="p-4">PAIEMENT</th>
                                    <th className="p-4">PRODUCTION</th>
                                    <th className="p-4 text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60">
                                {recentSubscriptions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-gray-500 text-xs">
                                            Aucune souscription enregistrée pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    recentSubscriptions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-[#141414] transition-colors">
                                            <td className="p-4 font-bold text-primary-500">
                                                {sub.reference}
                                            </td>
                                            <td className="p-4 text-gray-300">
                                                <div className="font-bold">{sub.client_nom}</div>
                                                <div className="text-[10px] text-gray-500">{sub.client_email}</div>
                                            </td>
                                            <td className="p-4 text-gray-400">
                                                <span className="px-1.5 py-0.5 border border-gray-800 bg-[#161616] text-[9px] uppercase mr-1">
                                                    {sub.type}
                                                </span>
                                                {sub.titre}
                                            </td>
                                            <td className="p-4 font-bold text-white">
                                                {sub.montant_formate}
                                            </td>
                                            <td className="p-4">
                                                {getStatutBadge(sub.statut_paiement)}
                                            </td>
                                            <td className="p-4">
                                                {getProdBadge(sub.statut_production)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Link
                                                    href={`/admin/souscriptions/${sub.id}`}
                                                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary-500 hover:text-primary-400 border border-primary-500/30 px-2.5 py-1 bg-primary-500/5 hover:bg-primary-500/10 transition-colors"
                                                >
                                                    GÉRER <ChevronRight size={10} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 5 – PROJETS RÉCENTS & MESSAGES DE CONTACT
                ══════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* DERNIERS PROJETS */}
                    <div className="border border-gray-800 bg-[#0E0E0E]">
                        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-500 font-bold">
                                    <FolderGit2 size={12} />
                                    <span>PORTFOLIO</span>
                                </div>
                                <h3 className="text-base font-display font-bold uppercase tracking-wider text-white mt-0.5">
                                    Projets Récents
                                </h3>
                            </div>
                            <Link
                                href="/admin/projects"
                                className="text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-primary-500 transition-colors"
                            >
                                GÉRER →
                            </Link>
                        </div>

                        <div className="divide-y divide-gray-800/60 p-2">
                            {recentProjects.length === 0 ? (
                                <p className="p-6 text-center text-xs font-mono text-gray-500">Aucun projet créé.</p>
                            ) : (
                                recentProjects.map((p) => (
                                    <div key={p.id} className="p-3 flex items-center justify-between gap-4 hover:bg-[#141414] transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 border border-gray-800 bg-gray-900 flex-shrink-0 overflow-hidden">
                                                {p.images?.[0] ? (
                                                    <img src={`/storage/${p.images[0].path}`} alt={p.titre} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600"><Box size={14} /></div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-white uppercase truncate">{p.titre}</h4>
                                                <p className="text-[10px] font-mono text-gray-500 uppercase">{p.cathegorie}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-right">
                                            <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                                                <Eye size={11} /> {p.views || 0}
                                            </span>
                                            {p.is_published ? (
                                                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/30 uppercase">EN LIGNE</span>
                                            ) : (
                                                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-gray-800 text-gray-400 uppercase">BROUILLON</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* DERNIERS MESSAGES DE CONTACT */}
                    <div className="border border-gray-800 bg-[#0E0E0E]">
                        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold">
                                    <Mail size={12} />
                                    <span>CONTACTS ENTRANTS</span>
                                </div>
                                <h3 className="text-base font-display font-bold uppercase tracking-wider text-white mt-0.5">
                                    Messages Récents
                                </h3>
                            </div>
                            <Link
                                href="/admin/contacts"
                                className="text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-primary-500 transition-colors"
                            >
                                GÉRER →
                            </Link>
                        </div>

                        <div className="divide-y divide-gray-800/60 p-2">
                            {recentContacts.length === 0 ? (
                                <p className="p-6 text-center text-xs font-mono text-gray-500">Aucun message reçu pour le moment.</p>
                            ) : (
                                recentContacts.map((c) => (
                                    <div key={c.id} className="p-3 flex items-center justify-between gap-4 hover:bg-[#141414] transition-colors">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs font-bold text-white uppercase truncate">{c.name}</h4>
                                                {!c.is_read && (
                                                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse shrink-0" title="Non lu" />
                                                )}
                                            </div>
                                            <p className="text-[10px] font-mono text-gray-400 truncate mt-0.5">{c.subject || c.message}</p>
                                        </div>
                                        <Link
                                            href="/admin/contacts"
                                            className="text-[10px] font-mono text-primary-500 hover:text-primary-400 whitespace-nowrap"
                                        >
                                            LIRE →
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </AdminLayout>
    )
}