import { Head, Link, useForm } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import { Terminal, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const submit = (e) => {
        e.preventDefault()
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        })
    }

    return (
        <GuestLayout title="Inscription">
            <Head title="Créer un compte | DCA" />

            <div className="space-y-6">

                {/* ── TITRE SECTION ── */}
                <div className="border-b border-gray-800 pb-4">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-primary-500 font-bold uppercase tracking-widest mb-1">
                        <Terminal size={12} />
                        <span>MODULE : NOUVELLE INSCRIPTION</span>
                    </div>
                    <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white">
                        CRÉER VOTRE <span className="text-primary-500">COMPTE CLIENT</span>
                    </h2>
                    <p className="text-xs font-mono text-gray-400 mt-1">
                        Rejoignez DCA pour commander vos packs et suivre vos créations.
                    </p>
                </div>

                {/* ── FORMULAIRE ── */}
                <form onSubmit={submit} className="space-y-4 font-mono text-xs">
                    
                    {/* Champ Nom complet */}
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 flex items-center gap-1.5">
                            <User size={11} className="text-primary-500" />
                            <span>NOM COMPLET / ENTREPRISE</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            autoComplete="name"
                            autoFocus
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ex: Alexandre Kamga"
                            required
                            className="w-full bg-[#141414] border border-gray-800 text-white px-3.5 py-2.5 text-xs focus:border-primary-500 focus:outline-none transition-colors"
                        />
                        {errors.name && (
                            <p className="text-red-400 text-[10px] mt-1.5">{errors.name}</p>
                        )}
                    </div>

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
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 flex items-center gap-1.5">
                            <Lock size={11} className="text-primary-500" />
                            <span>MOT DE PASSE</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Minimum 8 caractères"
                            required
                            className="w-full bg-[#141414] border border-gray-800 text-white px-3.5 py-2.5 text-xs focus:border-primary-500 focus:outline-none transition-colors"
                        />
                        {errors.password && (
                            <p className="text-red-400 text-[10px] mt-1.5">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirmation Mot de passe */}
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 flex items-center gap-1.5">
                            <Lock size={11} className="text-primary-500" />
                            <span>CONFIRMER LE MOT DE PASSE</span>
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Répétez le mot de passe"
                            required
                            className="w-full bg-[#141414] border border-gray-800 text-white px-3.5 py-2.5 text-xs focus:border-primary-500 focus:outline-none transition-colors"
                        />
                        {errors.password_confirmation && (
                            <p className="text-red-400 text-[10px] mt-1.5">{errors.password_confirmation}</p>
                        )}
                    </div>

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full mt-2 py-3 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span>{processing ? 'CRÉATION EN COURS...' : 'CRÉER MON COMPTE'}</span>
                        <ArrowRight size={14} />
                    </button>
                </form>

                {/* ── LIEN CONNEXION ── */}
                <div className="pt-4 border-t border-gray-800/80 text-center font-mono text-xs">
                    <p className="text-gray-500">
                        Vous avez déjà un compte ?{' '}
                        <Link
                            href={route('login')}
                            className="text-primary-500 hover:underline font-bold uppercase tracking-wider"
                        >
                            Se connecter
                        </Link>
                    </p>
                </div>

            </div>
        </GuestLayout>
    )
}
