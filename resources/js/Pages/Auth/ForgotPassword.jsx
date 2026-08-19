import { Head, Link, useForm } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import { Terminal, Mail, ArrowRight, ArrowLeft } from 'lucide-react'

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    })

    const submit = (e) => {
        e.preventDefault()
        post(route('password.email'))
    }

    return (
        <GuestLayout title="Mot de passe oublié">
            <Head title="Réinitialiser le mot de passe | DCA" />

            <div className="space-y-6">

                {/* ── TITRE SECTION ── */}
                <div className="border-b border-gray-800 pb-4">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-primary-500 font-bold uppercase tracking-widest mb-1">
                        <Terminal size={12} />
                        <span>RÉCUPÉRATION DE COMPTE</span>
                    </div>
                    <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white">
                        MOT DE PASSE <span className="text-primary-500">OUBLIÉ ?</span>
                    </h2>
                    <p className="text-xs font-mono text-gray-400 mt-1">
                        Renseignez votre email pour recevoir les instructions de réinitialisation.
                    </p>
                </div>

                {status && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-xs">
                        {status}
                    </div>
                )}

                {/* ── FORMULAIRE ── */}
                <form onSubmit={submit} className="space-y-4 font-mono text-xs">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 flex items-center gap-1.5">
                            <Mail size={11} className="text-primary-500" />
                            <span>VOTRE ADRESSE EMAIL</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
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

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full mt-2 py-3 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span>{processing ? 'ENVOI DU LIEN...' : 'ENVOYER LE LIEN DE RÉINITIALISATION'}</span>
                        <ArrowRight size={14} />
                    </button>
                </form>

                <div className="pt-4 border-t border-gray-800/80 text-center font-mono text-xs">
                    <Link
                        href={route('login')}
                        className="text-gray-500 hover:text-primary-500 inline-flex items-center gap-1.5 transition-colors uppercase"
                    >
                        <ArrowLeft size={12} /> Retour à la connexion
                    </Link>
                </div>

            </div>
        </GuestLayout>
    )
}
