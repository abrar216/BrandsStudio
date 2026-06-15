import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function CourseShow({ course, userProgress }) {
    const totalLessons = course.lessons.length;
    const completedLessons = Object.values(userProgress).filter(p => p.is_completed).length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <Link href={route('academy.index')} className="text-brand-accent text-sm font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
                            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            Back to Academy
                        </Link>
                        <h2 className="text-4xl font-bold tracking-tight text-gray-900 animate-in fade-in slide-in-from-left-4 duration-700">
                            {course.title}
                        </h2>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-gray-500 text-xs font-black uppercase tracking-widest">Your Progress</span>
                        <div className="flex items-center gap-4 w-64 md:w-80">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-brand-accent transition-all duration-1000 shadow-sm" 
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                            <span className="text-gray-900 font-bold text-lg min-w-[3rem] text-right">{progressPercentage}%</span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={course.title} />

            <div className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Course Info */}
                         <div className="lg:col-span-1 space-y-8">
                            <div className="bg-brand-surface p-8 rounded-2xl border border-white/10 shadow-sm">
                                <h3 className="text-lg font-bold text-white mb-4">Course Overview</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-6">
                                    {course.description}
                                </p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-brand-border">
                                        <span className="text-white/50 text-xs uppercase font-bold">Difficulty</span>
                                        <span className="text-brand-accent font-bold uppercase text-xs tracking-widest px-2 py-1 bg-brand-accent/10 rounded border border-brand-accent/20">{course.level}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                                        <span className="text-white/50 text-xs uppercase font-bold">Total Lessons</span>
                                        <span className="text-white font-bold">{totalLessons}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-white/50 text-xs uppercase font-bold">Duration</span>
                                        <span className="text-white font-bold">{course.duration}</span>
                                    </div>
                                </div>
                            </div>

                            {course.lessons.length > 0 && (
                                <Link 
                                    href={route('academy.lesson', {
                                        course: course.slug, 
                                        lesson: course.lessons.find((_, i) => !userProgress[course.lessons[i].id]?.is_completed)?.slug || course.lessons[0].slug
                                    })}
                                    className="w-full bg-brand-accent hover:brightness-110 text-white font-black py-4 rounded-2xl shadow-lg shadow-brand-accent/10 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center"
                                >
                                    Resume Learning
                                </Link>
                            )}
                        </div>

                        {/* Lessons List */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="h-2 w-8 bg-brand-accent rounded-full"></span>
                                Curriculum
                            </h3>
                            <div className="space-y-4">
                                {course.lessons.map((lesson, index) => {
                                    const isCompleted = userProgress[lesson.id]?.is_completed;
                                    const isNext = !isCompleted && (index === 0 || userProgress[course.lessons[index-1].id]?.is_completed);

                                    return (
                                        <Link 
                                            key={lesson.id} 
                                            href={route('academy.lesson', {course: course.slug, lesson: lesson.slug})}
                                            className="group block"
                                        >
                                            <div className={`bg-brand-surface p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-sm ${isCompleted ? 'border-brand-accent/20 bg-brand-accent/10' : isNext ? 'border-brand-accent/30 scale-[1.01] shadow-md' : 'border-white/10 opacity-80 hover:opacity-100'}`}>
                                                <div className="flex items-center gap-6">
                                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-xl border ${isCompleted ? 'bg-brand-accent text-white border-brand-accent shadow-sm' : isNext ? 'bg-white/10 text-white border-white/20' : 'bg-white/5 text-white/40 border-white/5'}`}>
                                                        {isCompleted ? '✓' : index + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-bold transition-colors group-hover:text-brand-accent ${isCompleted ? 'text-white/30 line-through' : 'text-white'}`}>
                                                            {lesson.title}
                                                        </h4>
                                                        <span className="text-xs text-white/40 font-bold uppercase tracking-widest">{lesson.duration}</span>
                                                    </div>
                                                </div>
                                                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white transition-all duration-300 shadow-sm border border-white/10">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
