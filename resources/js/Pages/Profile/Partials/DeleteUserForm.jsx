import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="pb-4 border-b border-gray-800">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-red-500 font-bold mb-1">
                    <AlertTriangle size={14} />
                    <span>ZONE DANGEREUSE // SUPPRESSION DU COMPTE</span>
                </div>
                <h2 className="text-base font-display font-bold uppercase tracking-wider text-white">
                    Supprimer Définitivement le Compte
                </h2>
                <p className="text-xs font-mono text-gray-400 mt-1">
                    Une fois votre compte supprimé, toutes ses ressources et données seront définitivement effacées.
                </p>
            </header>

            <button
                onClick={confirmUserDeletion}
                className="px-6 py-2.5 bg-red-600/20 border border-red-500 text-red-400 hover:bg-red-600 hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
            >
                <Trash2 size={14} />
                SUPPRIMER LE COMPTE
            </button>

            {confirmingUserDeletion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0E0E0E] border border-red-500/50 w-full max-w-md p-6 relative">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
                            <h3 className="font-display font-bold text-white uppercase text-base text-red-400 flex items-center gap-2">
                                <AlertTriangle size={16} /> Confirmation Requise
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        <p className="text-xs font-mono text-gray-300 leading-relaxed mb-4">
                            Êtes-vous absolument certain de vouloir supprimer ce compte ? Veuillez saisir votre mot de passe pour confirmer l'opération.
                        </p>

                        <form onSubmit={deleteUser} className="space-y-4 font-mono text-xs">
                            <div>
                                <label htmlFor="password" className="block text-[10px] uppercase text-gray-400 mb-1">
                                    Mot de passe de confirmation
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-red-500 focus:outline-none"
                                    placeholder="Mot de passe..."
                                />
                                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-700 text-gray-300 uppercase tracking-widest text-[10px]"
                                >
                                    ANNULER
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-red-500 disabled:opacity-50"
                                >
                                    {processing ? 'SUPPRESSION...' : 'CONFIRMER LA SUPPRESSION'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
