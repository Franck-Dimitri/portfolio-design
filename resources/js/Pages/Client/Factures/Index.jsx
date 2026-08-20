import { Link, Head } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import {
    Receipt,
    FileText,
    CheckCircle2,
    Clock,
    CreditCard,
    ShieldCheck
} from 'lucide-react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export default function Index({
    subscriptions = [],
    totalSpent = 0,
    defaultCurrency = "FCFA",
    whatsappNumber = "237690112233"
}) {
    return (
        <ClientLayout title="Mes Factures & Reçus">
            <Head title="Mes Factures — Espace Client" />

            <div className="w-full space-y-6">

                {/* ══════════════════════════════════════════════════
                    § 1 – HEADER & BANNER
                ══════════════════════════════════════════════════ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            Mes Factures & Reçus Officiels
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            Consultez et téléchargez vos factures certifiées munies de code de vérification.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 flex items-center gap-3 shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                            <Receipt size={20} />
                        </div>
                        <div>
                            <span className="text-[11px] text-neutral-400 font-semibold block">Total Réglé</span>
                            <span className="text-lg font-bold text-neutral-900 dark:text-white">{formatPrix(totalSpent)}</span>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 2 – LISTE DES FACTURES
                ══════════════════════════════════════════════════ */}
                {subscriptions.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                            <Receipt size={24} />
                        </div>
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white">Aucune facture enregistrée</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                            Vos reçus et factures officielles apparaîtront ici dès vos premiers règlements de commande.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-neutral-50 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase text-[11px] font-bold tracking-wider">
                                    <tr>
                                        <th className="p-4 pl-6">N° Facture & Date</th>
                                        <th className="p-4">Prestation / Pack</th>
                                        <th className="p-4">Montant TTC</th>
                                        <th className="p-4">Mode de Paiement</th>
                                        <th className="p-4">Statut</th>
                                        <th className="p-4 pr-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                    {subscriptions.map((sub) => {
                                        const isPaid = sub.status === 'active' || sub.payment?.status === 'success'
                                        const amount = sub.payment?.amount || sub.montant || sub.servicePackage?.prix || sub.service?.prix
                                        const payMethod = sub.payment?.payment_method?.toUpperCase() || 'MOBILE MONEY'

                                        return (
                                            <tr key={sub.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                                <td className="p-4 pl-6">
                                                    <div className="font-bold text-neutral-900 dark:text-white font-mono">
                                                        FAC-{sub.reference}
                                                    </div>
                                                    <div className="text-[11px] text-neutral-400 mt-0.5">
                                                        {formatDate(sub.created_at)}
                                                    </div>
                                                </td>

                                                <td className="p-4">
                                                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                        {sub.servicePackage?.titre || sub.service?.titre || 'Design'}
                                                    </div>
                                                    <div className="text-[11px] text-neutral-400">
                                                        Réf: #{sub.reference}
                                                    </div>
                                                </td>

                                                <td className="p-4">
                                                    <span className="font-extrabold text-primary-500">
                                                        {formatPrix(amount)}
                                                    </span>
                                                </td>

                                                <td className="p-4">
                                                    <span className="inline-flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-medium">
                                                        <CreditCard size={13} className="text-neutral-400" />
                                                        {payMethod}
                                                    </span>
                                                </td>

                                                <td className="p-4">
                                                    {isPaid ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                            <CheckCircle2 size={12} /> Payé
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                                                            <Clock size={12} /> En attente
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="p-4 pr-6 text-right">
                                                    <a
                                                        href={`/invoices/${sub.id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-primary-500 hover:text-white text-neutral-800 dark:text-neutral-200 font-bold transition-all shadow-xs"
                                                    >
                                                        <FileText size={13} />
                                                        <span>Voir & Imprimer</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Info Sécurité */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 shadow-xs">
                    <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                    <span>
                        Toutes les factures émises par Dims Creative Academy sont certifiées conformes et téléchargeables au format PDF pour votre comptabilité.
                    </span>
                </div>

            </div>
        </ClientLayout>
    )
}
