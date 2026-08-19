import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { KeyRound, CheckCircle2 } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="pb-4 border-b border-gray-800">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-500 font-bold mb-1">
                    <KeyRound size={14} />
                    <span>SÉCURITÉ & AUTHENTIFICATION</span>
                </div>
                <h2 className="text-base font-display font-bold uppercase tracking-wider text-white">
                    Modifier le Mot de Passe
                </h2>
                <p className="text-xs font-mono text-gray-400 mt-1">
                    Assurez-vous d'utiliser un mot de passe robuste d'au moins 8 caractères.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-4 w-full font-mono text-xs">
                <div>
                    <label htmlFor="current_password" className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                        Mot de passe actuel *
                    </label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                        autoComplete="current-password"
                    />
                    {errors.current_password && <p className="text-red-400 text-xs mt-1">{errors.current_password}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                        Nouveau mot de passe *
                    </label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                        autoComplete="new-password"
                    />
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                        Confirmer le nouveau mot de passe *
                    </label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && <p className="text-red-400 text-xs mt-1">{errors.password_confirmation}</p>}
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors disabled:opacity-50"
                    >
                        {processing ? 'MISE À JOUR...' : 'METTRE À JOUR LE MOT DE PASSE'}
                    </button>

                    {recentlySuccessful && (
                        <span className="flex items-center gap-1 text-green-400 font-mono text-xs">
                            <CheckCircle2 size={14} /> Mot de passe mis à jour ✓
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
