import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, ArrowLeft, Plus, Edit, Trash2, Video, FileText, LayoutList } from 'lucide-react';

export default function Show({ auth, course }) {
    
    const deleteLesson = (lessonId) => {
        if (confirm('Are you sure you want to delete this lesson?')) {
            router.delete(route('admin.courses.lessons.destroy', { course: course.id, lesson: lessonId }));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{course.title} - Lessons</h2>}
        >
            <Head title={`Admin - ${course.title}`} />

            <div className="py-12 bg-brand-bg min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <Link href={route('admin.courses.index')} className="h-10 w-10 bg-white/5 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                                    <BookOpen className="text-brand-accent" size={32} />
                                    {course.title}
                                </h1>
                                <p className="text-gray-500 font-medium">Manage lessons within this course.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('admin.courses.lessons.create', course.id)}
                                className="bg-brand-accent hover:bg-brand-accent/90 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                            >
                                <Plus size={16} /> Add Lesson
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="md:col-span-1 glass-dark border border-white/5 rounded-3xl p-6 h-fit">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full aspect-video object-cover rounded-2xl mb-6 bg-white/5" />
                            ) : (
                                <div className="w-full aspect-video rounded-2xl bg-white/5 mb-6 flex items-center justify-center text-gray-500">
                                    <BookOpen size={48} />
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                            <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                            
                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Level:</span>
                                    <span className="text-white font-medium uppercase">{course.level}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Duration:</span>
                                    <span className="text-white font-medium">{course.duration || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Status:</span>
                                    <span className={`font-medium ${course.is_active ? 'text-green-400' : 'text-red-400'}`}>
                                        {course.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-white/5">
                                <Link 
                                    href={route('admin.courses.edit', course.id)}
                                    className="w-full bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                                >
                                    <Edit size={16} /> Edit Course Details
                                </Link>
                            </div>
                        </div>
                        
                        <div className="md:col-span-2 glass-dark border border-white/5 rounded-3xl overflow-hidden self-start">
                            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <LayoutList size={18} className="text-brand-accent" />
                                    Course Modules & Lessons
                                </h3>
                                <span className="text-xs font-black uppercase tracking-widest text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
                                    {course.lessons.length} Lessons
                                </span>
                            </div>
                            
                            <div className="divide-y divide-white/5">
                                {course.lessons.map((lesson) => (
                                    <div key={lesson.id} className="p-6 hover:bg-white/[0.02] transition-colors group flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-full bg-white/5 text-gray-400 flex items-center justify-center font-black text-xs shrink-0 self-start mt-1">
                                                {lesson.order}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg group-hover:text-brand-accent transition-colors">{lesson.title}</h4>
                                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                                    {lesson.duration && <span>{lesson.duration}</span>}
                                                    {lesson.video_url && <span className="flex items-center gap-1 text-red-400"><Video size={12}/> YouTube</span>}
                                                    {lesson.video_path && <span className="flex items-center gap-1 text-brand-accent"><Video size={12}/> Local Video</span>}
                                                    {lesson.pdf_path && <span className="flex items-center gap-1 text-yellow-400"><FileText size={12}/> PDF</span>}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-white/5 sm:border-0">
                                            <Link 
                                                href={route('admin.courses.lessons.edit', {course: course.id, lesson: lesson.id})}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-1 p-2 rounded-lg bg-white/5 text-brand-accent hover:bg-brand-accent/10 transition-all text-xs font-bold"
                                            >
                                                <Edit size={14} /> Edit
                                            </Link>
                                            <button 
                                                onClick={() => deleteLesson(lesson.id)}
                                                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                title="Delete Lesson"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                {course.lessons.length === 0 && (
                                    <div className="py-12 text-center">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-gray-600 mb-3">
                                            <LayoutList size={24} />
                                        </div>
                                        <h4 className="text-white font-bold mb-1">No lessons yet</h4>
                                        <p className="text-gray-500 text-sm">Add lessons to complete the course curriculum.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
