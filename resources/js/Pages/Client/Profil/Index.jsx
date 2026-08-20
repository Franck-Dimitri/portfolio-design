import { Head, useForm } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import {
    User,
    Mail,
    Phone,
    Lock,
    Save,
    CheckCircle2,
    Shield,
    Calendar,
    Smartphone
} from 'lucide-react'

export default function Index({
    user = {},
    whatsappNumber = "237690112233"
}) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        whatsapp: user.whatsapp || user.phone || '',
        password: '',
        password_confirmation: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        patch(route('client.profil.update'), {
            preserveScroll: true,
        })
    }

    return (
        <ClientLayout title="Mon Profil & Paramètres">
            <Head title="Mon Profil — Espace Client" />

            <div className="max-w-4xl space-y-8">

                {/* ══════════════════════════════════════════════════
                    § 1 – HEADER BANNER PROFIL
                ══════════════════════════════════════════════════ */}
                <div className="p-6 md:p-8 rounded-3xl bg-[#14171F] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
                            {user.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                                {user.name}
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Client DCA depuis le {user.created_at || '—'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>Compte Client Actif</span>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 2 – FORMULAIRE DE MODIFICATION
                ══════════════════════════════════════════════════ */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Informations Personnelles */}
                    <div className="p-6 md:p-8 rounded-3xl bg-[#14171F] border border-slate-800/80 space-y-6">
                        <div className="border-b border-slate-800 pb-4">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <User size={18} className="text-amber-400" />
                                <span>Coordonnées Personnelles & Professionnelles</span>
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Vos coordonnées sont utilisées pour la facturation et les notifications de livraison.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-300">
                                    Nom complet ou Raison Sociale
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-white text-xs placeholder-slate-500 focus:ring-0 transition-colors"
                                    required
                                />
                                {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-300">
                                    Adresse Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-white text-xs placeholder-slate-500 focus:ring-0 transition-colors"
                                    required
                                />
                                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-300">
                                    Numéro de Téléphone
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+237 690 11 22 33"
                                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-white text-xs placeholder-slate-500 focus:ring-0 transition-colors"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-300">
                                    Numéro WhatsApp pour alertes de livrables
                                </label>
                                <input
                                    type="text"
                                    value={data.whatsapp}
                                    onChange={(e) => setData('whatsapp', e.target.value)}
                                    placeholder="+237 690 11 22 33"
                                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-white text-xs placeholder-slate-500 focus:ring-0 transition-colors"
                                />
                                <p className="text-[10px] text-slate-500">
                                    Nous vous envoyons un message WhatsApp automatique dès qu'un fichier est prêt.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sécurité & Mot de Passe */}
                    <div className="p-6 md:p-8 rounded-3xl bg-[#14171F] border border-slate-800/80 space-y-6">
                        <div className="border-b border-slate-800 pb-4">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Lock size={18} className="text-indigo-400" />
                                <span>Sécurité du Compte & Mot de Passe</span>
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Laissez ces champs vides si vous ne souhaitez pas modifier votre mot de passe.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-300">
                                    Nouveau Mot de Passe
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-white text-xs placeholder-slate-500 focus:ring-0 transition-colors"
                                />
                                {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-300">
                                    Confirmer le Nouveau Mot de Passe
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-white text-xs placeholder-slate-500 focus:ring-0 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action de sauvegarde */}
                    <div className="flex items-center justify-between">
                        {recentlySuccessful ? (
                            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-2 rounded-xl">
                                <CheckCircle2 size={15} /> Informations enregistrées avec succès !
                            </span>
                        ) : <span></span>}

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Save size={15} />
                            <span>{processing ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                        </button>
                    </div>

                </form>

            </div>
        </ClientLayout>
    )
}
