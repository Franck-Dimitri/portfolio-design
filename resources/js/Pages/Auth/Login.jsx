import { Head, Link, useForm } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import { Terminal, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const submit = (e) => {
        e.preventDefault()
        post(route('login'), {
            onFinish: () => reset('password'),
        })
    }

    return (
        <GuestLayout title="Connexion">
            <Head title="Connexion | DCA" />

            <div className="space-y-6">

                {/* ── TITRE SECTION ── */}
                <div className="border-b border-gray-800 pb-4">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-primary-500 font-bold uppercase tracking-widest mb-1">
                        <Terminal size={12} />
                        <span>MODULE : AUTHENTIFICATION</span>
                    </div>
                    <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white">
                        ESPACE <span className="text-primary-500">CLIENT & ADMIN</span>
                    </h2>
                    <p className="text-xs font-mono text-gray-400 mt-1">
                        Connectez-vous pour piloter vos projets et accéder à vos livrables.
                    </p>
                </div>

                {status && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-xs">
                        {status}
                    </div>
                )}

                {/* ── FORMULAIRE ── */}
                <form onSubmit={submit} className="space-y-4 font-mono text-xs">
                    
                    {/* Champ Email */}
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 flex items-center gap-1.5">
                            <Mail size={11} className="text-primary-500" />
                            <span>ADRESSE EMAIL</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nom@exemple.com"
                            required
                            className="w-full bg-[#141414] border border-gray-800 text-white px-3.5 py-2.5 text-xs focus:border-primary-500 focus:outline-none transition-colors"
                        />
                        {errors.email && (
                            <p className="text-red-400 text-[10px] mt-1.5">{errors.email}</p>
                        )}
                    </div>

                    {/* Champ Mot de passe */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                <Lock size={11} className="text-primary-500" />
                                <span>MOT DE PASSE</span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-[10px] text-gray-500 hover:text-primary-500 transition-colors"
                                >
                                    Oublié ?
                                </Link>
                            )}
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••••••"
                            required
                            className="w-full bg-[#141414] border border-gray-800 text-white px-3.5 py-2.5 text-xs focus:border-primary-500 focus:outline-none transition-colors"
                        />
                        {errors.password && (
                            <p className="text-red-400 text-[10px] mt-1.5">{errors.password}</p>
                        )}
                    </div>

                    {/* Se souvenir de moi */}
                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-3.5 h-3.5 rounded-none bg-[#141414] border-gray-800 text-primary-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="text-[11px] text-gray-400">
                                Mémoriser ma session
                            </span>
                        </label>
                    </div>

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full mt-2 py-3 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span>{processing ? 'CONNEXION EN COURS...' : 'SE CONNECTER'}</span>
                        <ArrowRight size={14} />
                    </button>
                </form>

                {/* ── LIEN CRÉATION COMPTE ── */}
                <div className="pt-4 border-t border-gray-800/80 text-center font-mono text-xs">
                    <p className="text-gray-500">
                        Nouveau sur la plateforme ?{' '}
                        <Link
                            href={route('register')}
                            className="text-primary-500 hover:underline font-bold uppercase tracking-wider"
                        >
                            Créer un compte
                        </Link>
                    </p>
                </div>

            </div>
        </GuestLayout>
    )
}