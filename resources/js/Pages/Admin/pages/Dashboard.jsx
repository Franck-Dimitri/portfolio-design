import AdminLayout from '@/Layouts/AdminLayout'
import {
    FolderGit2,
    Eye,
    Users,
    TrendingUp,
    BarChart3,
    Plus,
    Settings,
    Pencil,
    Trash2,
} from 'lucide-react'

export default function Dashboard() {
    return (
        <AdminLayout>
            <div className="space-y-8">

                {/* HEADER HERO */}
                <div className="card p-6 bg-gradient-orange-soft border-primary-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>
                            <h1 className="text-3xl font-bold text-base-primary">
                                Dashboard
                            </h1>
                            <p className="text-base-muted mt-1">
                                Overview of your portfolio performance
                            </p>
                        </div>

                        <button className="btn btn-primary btn-lg">
                            <Plus size={18} />
                            New Project
                        </button>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {[
                        {
                            label: 'Projects',
                            value: '24',
                            icon: FolderGit2,
                            trend: '+3 this month',
                            color: 'text-primary-500'
                        },
                        {
                            label: 'Views',
                            value: '12.5K',
                            icon: Eye,
                            trend: '+12% increase',
                            color: 'text-green-500'
                        },
                        {
                            label: 'Visitors',
                            value: '3,847',
                            icon: Users,
                            trend: '+8% weekly',
                            color: 'text-blue-500'
                        },
                        {
                            label: 'Growth',
                            value: '4.2%',
                            icon: TrendingUp,
                            trend: '+0.5% boost',
                            color: 'text-emerald-500'
                        },
                    ].map((stat, i) => {
                        const Icon = stat.icon

                        return (
                            <div key={i} className="card p-5 hover-lift">
                                <div className="flex items-center justify-between">
                                    <Icon className={stat.color} size={22} />

                                    <span className="text-xs px-2 py-1 rounded-full bg-base-muted text-base-secondary">
                                        {stat.trend}
                                    </span>
                                </div>

                                <p className="text-base-muted text-sm mt-4">
                                    {stat.label}
                                </p>

                                <p className="text-2xl font-bold text-base-primary mt-1">
                                    {stat.value}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* ANALYTICS + QUICK ACTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* CHART */}
                    <div className="lg:col-span-2 card p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-base-primary flex items-center gap-2">
                                <BarChart3 size={18} />
                                Analytics
                            </h2>

                            <select className="input text-sm w-auto py-2 px-3">
                                <option>7 days</option>
                                <option>30 days</option>
                                <option>90 days</option>
                            </select>
                        </div>

                        <div className="h-64 rounded-xl bg-gradient-orange-soft flex items-center justify-center">
                            <p className="text-base-muted">
                                Analytics chart here
                            </p>
                        </div>
                    </div>

                    {/* QUICK ACTION */}
                    <div className="space-y-4">

                        <div className="card p-5">
                            <h3 className="font-bold text-base-primary mb-4">
                                Quick Actions
                            </h3>

                            <div className="space-y-2">
                                <button className="btn btn-secondary w-full justify-start">
                                    <Pencil size={16} />
                                    Edit Profile
                                </button>

                                <button className="btn btn-secondary w-full justify-start">
                                    <Settings size={16} />
                                    Settings
                                </button>

                                <button className="btn btn-secondary w-full justify-start">
                                    <BarChart3 size={16} />
                                    Analytics
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RECENT PROJECTS */}
                <div className="card overflow-hidden">

                    <div className="p-5 border-b border-base flex items-center justify-between">
                        <h2 className="font-bold text-base-primary">
                            Recent Projects
                        </h2>

                        <button className="btn btn-ghost btn-sm">
                            View all
                        </button>
                    </div>

                    <table className="w-full text-sm">

                        <thead className="bg-base-muted text-base-secondary text-xs uppercase">
                            <tr>
                                <th className="text-left p-4">Project</th>
                                <th>Status</th>
                                <th>Progress</th>
                                <th>Date</th>
                                <th className="text-right p-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {[
                                { name: 'Logo System', status: 'In Progress', progress: 70, date: 'Jan 15' },
                                { name: 'Brand Identity', status: 'Completed', progress: 100, date: 'Jan 10' },
                                { name: 'UI Kit', status: 'Planning', progress: 30, date: 'Jan 05' },
                            ].map((p, i) => (
                                <tr key={i} className="border-t border-base hover:bg-base-muted transition">

                                    <td className="p-4 font-medium text-base-primary">
                                        {p.name}
                                    </td>

                                    <td>
                                        <span className={`badge ${
                                            p.status === 'Completed'
                                                ? 'bg-green-100 text-green-700'
                                                : p.status === 'In Progress'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {p.status}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="w-28 h-2 bg-base-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary-500"
                                                style={{ width: `${p.progress}%` }}
                                            />
                                        </div>
                                    </td>

                                    <td className="text-base-muted">
                                        {p.date}
                                    </td>

                                    <td className="text-right p-4 space-x-2">
                                        <button className="btn btn-ghost btn-sm">
                                            <Pencil size={14} />
                                        </button>
                                        <button className="btn btn-ghost btn-sm text-red-500">
                                            <Trash2 size={14} />
                                        </button>
                                    </td>

                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>

            </div>
        </AdminLayout>
    )
}