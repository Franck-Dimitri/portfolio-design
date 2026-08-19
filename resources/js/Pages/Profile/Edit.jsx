import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, Terminal, Shield, KeyRound, AlertTriangle } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminLayout title="Mon Profil & Paramètres">
            <div className="space-y-8 w-full">
                
                {/* ── HEADER ── */}
                <div className="relative border border-gray-800 bg-[#0E0E0E] p-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary-500"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary-500"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary-500"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary-500"></div>

                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-1">
                        <Terminal size={12} />
                        <span>GESTION DU COMPTE ADMINISTRATEUR</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                        PROFIL & <span className="text-primary-500">SÉCURITÉ</span>
                    </h1>
                    <p className="text-xs font-mono text-gray-400 mt-1">
                        Gérez vos identifiants d'accès, votre mot de passe et vos informations administratives.
                    </p>
                </div>

                {/* ── SECTIONS ── */}
                <div className="space-y-6">
                    {/* Informations du Profil */}
                    <div className="border border-gray-800 bg-[#0E0E0E] p-6 relative">
                        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-primary-500"></div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    {/* Modification du Mot de Passe */}
                    <div className="border border-gray-800 bg-[#0E0E0E] p-6 relative">
                        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-primary-500"></div>
                        <UpdatePasswordForm />
                    </div>

                    {/* Zone Dangereuse / Suppression */}
                    <div className="border border-red-500/30 bg-[#0E0E0E] p-6 relative">
                        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-red-500"></div>
                        <DeleteUserForm />
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
