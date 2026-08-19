import { Link, useForm, usePage } from '@inertiajs/react';
import { User, CheckCircle2 } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="pb-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-500 font-bold mb-1">
                        <User size={14} />
                        <span>INFORMATIONS DU COMPTE</span>
                    </div>
                    <h2 className="text-base font-display font-bold uppercase tracking-wider text-white">
                        Données Personnelles & Email
                    </h2>
                </div>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-4 w-full font-mono text-xs">
                <div>
                    <label htmlFor="name" className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                        Nom d'affichage *
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                        Adresse Email *
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs">
                        <p>Votre adresse email n'est pas encore vérifiée.</p>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="underline hover:text-white mt-1"
                        >
                            Cliquez ici pour renvoyer l'email de confirmation.
                        </Link>
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors disabled:opacity-50"
                    >
                        {processing ? 'ENREGISTREMENT...' : 'SAUVEGARDER LES MODIFICATIONS'}
                    </button>

                    {recentlySuccessful && (
                        <span className="flex items-center gap-1 text-green-400 font-mono text-xs">
                            <CheckCircle2 size={14} /> Enregistré ✓
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
