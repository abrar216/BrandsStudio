import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { useState } from 'react';

export default function Index({ auth, courses }) {
    const [search, setSearch] = useState('');

    const deleteCourse = (id) => {
        if (confirm('Are you sure you want to delete this course? All associated lessons will also be deleted.')) {
            router.delete(route('admin.courses.destroy', id));
        }
    };

    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Course Management</h2>}
        >
            <Head title="Admin - Course Management" />

            <div className="py-12 bg-brand-bg min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                                <BookOpen className="text-brand-accent" size={32} />
                                Course Management
                            </h1>
                            <p className="text-gray-500 font-medium">Manage Academy courses and lessons.</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Search courses..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white pl-10 pr-4 py-2 rounded-xl focus:border-brand-accent focus:ring-brand-accent/20 w-full md:w-64"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            </div>
                            <Link
                                href={route('admin.courses.create')}
                                className="bg-brand-accent hover:bg-brand-accent/90 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                            >
                                <Plus size={16} /> New Course
                            </Link>
                        </div>
                    </div>

                    <div className="glass-dark border border-white/5 rounded-3xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Course</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Level</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Lessons</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {course.thumbnail ? (
                                                    <img src={course.thumbnail} alt={course.title} className="w-12 h-12 rounded-lg object-cover bg-white/5" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-gray-500">
                                                        <BookOpen size={20} />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">{course.title}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex py-1 px-3 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 text-gray-400 border border-white/10">
                                                {course.level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-300 font-medium">
                                                {course.lessons_count || 0} Lessons
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex py-1 px-3 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                course.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                                {course.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    href={route('admin.courses.show', course.id)}
                                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                                    title="View Lessons"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link 
                                                    href={route('admin.courses.edit', course.id)}
                                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-brand-accent hover:bg-brand-accent/10 transition-all"
                                                    title="Edit Course"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button 
                                                    onClick={() => deleteCourse(course.id)}
                                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filteredCourses.length === 0 && (
                            <div className="py-20 text-center">
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-gray-600 mb-4">
                                    <BookOpen size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-white">No courses found</h3>
                                <p className="text-gray-500 text-sm">Create a course to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
