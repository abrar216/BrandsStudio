import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, Trophy, Clock, PlayCircle, Star, Filter, ArrowRight, Plus, Activity } from 'lucide-react';
import { useState } from 'react';

export default function Index({ courses, stats }) {
    const user = usePage().props.auth.user;
    const [filter, setFilter] = useState('All');
    
    const filteredCourses = filter === 'All' 
        ? courses 
        : courses.filter(c => c.level === filter);

    const progressPercentage = stats.total_lessons > 0 
        ? Math.round((stats.completed_lessons / stats.total_lessons) * 100) 
        : 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-left-4 duration-700">
                                Trading <span className="text-brand-accent italic">Academy</span>
                            </h2>
                            {(user.is_admin === 1 || user.is_admin === true) && (
                                <Link
                                    href={route('admin.courses.create')}
                                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-brand-accent/20 text-brand-emerald-light hover:bg-brand-accent hover:text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border border-brand-accent/30"
                                >
                                    <Plus size={14} />
                                    New Course
                                </Link>
                            )}
                        </div>
                        <p className="text-white/60 text-sm">Professional institutional-grade trading education.</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="bg-brand-surface px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shadow-sm">
                            <div className="h-10 w-10 rounded-xl bg-brand-accent/5 flex items-center justify-center text-brand-accent">
                                <Trophy size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest leading-none mb-1">Total Progress</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-black text-white">{progressPercentage}%</span>
                                    <div className="h-1.5 w-12 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-accent shadow-sm" style={{ width: `${progressPercentage}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Academy Dashboard" />

            <div className="py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Demo Trading / Practice Section */}
                    <div className="relative mb-12 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent to-brand-emerald rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-brand-surface rounded-[2.5rem] border border-white/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[100px] rounded-full"></div>
                            <div className="flex-1 space-y-4 relative z-10 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-emerald/10 rounded-full border border-brand-emerald/20 text-brand-emerald">
                                    <div className="h-1.5 w-1.5 rounded-full bg-brand-emerald animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Live Market Connect</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Practice Terminal <span className="text-brand-accent">&</span> Demo Trading</h2>
                                <p className="text-white/60 text-sm max-w-xl leading-relaxed">
                                    Master the markets without risk. Use your <span className="text-white font-bold">$100,000 Virtual Capital</span> to practice trades in real-time. Gain experience, test strategies, and climb the leaderboard.
                                </p>
                            </div>
                            <div className="relative z-10 w-full md:w-auto">
                                <Link 
                                    href={route('trading.index')} 
                                    className="px-10 py-5 bg-brand-emerald hover:bg-emerald-400 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-[0_12px_24px_-8px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Activity size={18} />
                                    Launch Demo Trading
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Featured / Welcome Section */}
                    {progressPercentage === 0 && courses.length > 0 && (
                        <div className="relative bg-brand-surface rounded-[2.5rem] border border-white/10 overflow-hidden mb-12 p-1 group shadow-sm">
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/10 via-brand-accent/5 to-transparent"></div>
                            <div className="relative bg-brand-surface/50 backdrop-blur-sm rounded-[2.25rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
                                <div className="flex-1 space-y-8 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/5 rounded-full border border-brand-accent/10">
                                        <Star size={14} className="text-brand-accent fill-brand-accent" />
                                        <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">New Curriculum 2024</span>
                                    </div>
                                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                                        Start Your Journey <br />
                                        To <span className="text-brand-accent">Financial Freedom</span>
                                    </h1>
                                    <p className="text-lg text-white/70 max-w-xl leading-relaxed">
                                        Access our institutional-grade trading modules. From blockchain fundamentals to advanced technical analysis and institutional risk management.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link href={route('academy.show', courses[0].slug)} className="px-8 py-4 bg-brand-accent text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-brand-accent/10 flex items-center justify-center gap-3 group/btn">
                                            Begin First Module
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 aspect-square relative hidden lg:block">
                                    <div className="absolute inset-0 bg-brand-accent/10 rounded-full animate-pulse"></div>
                                    <div className="absolute inset-4 border-2 border-dashed border-brand-accent/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <BookOpen size={120} className="text-white opacity-20" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filter Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                                <Filter size={18} />
                            </div>
                            <div className="flex bg-brand-surface p-1 rounded-2xl border border-white/10">
                                {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                                    <button
                                        key={lvl}
                                        onClick={() => setFilter(lvl)}
                                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === lvl ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/10' : 'text-gray-500 hover:text-brand-accent'}`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="text-sm font-bold text-white/50 uppercase tracking-widest">
                            Showing <span className="text-white">{filteredCourses.length}</span> Professional Modules
                        </div>
                    </div>

                    {/* Course Listing */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCourses.map((course) => (
                            <Link 
                                key={course.id} 
                                href={route('academy.show', course.slug)}
                                className="group block"
                            >
                                <div className="bg-brand-surface h-full overflow-hidden rounded-[2rem] border border-white/10 transition-all duration-500 hover:border-brand-accent/30 hover:shadow-2xl hover:shadow-brand-accent/5 hover:-translate-y-2 flex flex-col shadow-sm">
                                    <div className="aspect-[16/10] w-full bg-gray-50 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent flex items-center justify-center">
                                            <div className="h-16 w-16 rounded-3xl bg-white/50 backdrop-blur-xl border border-brand-border flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-sm">
                                                <PlayCircle size={32} />
                                            </div>
                                        </div>
                                        <div className="absolute top-6 left-6 flex gap-2">
                                            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-brand-accent border border-brand-border tracking-widest">
                                                {course.level}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-brand-accent transition-colors duration-300">
                                            {course.title}
                                        </h3>
                                        <p className="mt-4 text-sm text-white/60 line-clamp-2 leading-relaxed">
                                            {course.description}
                                        </p>
                                        
                                        <div className="mt-auto pt-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Clock size={14} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{course.duration}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <PlayCircle size={14} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{course.lessons_count} Lessons</span>
                                                    </div>
                                                </div>
                                                {course.completed_lessons_count > 0 && (
                                                    <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">
                                                        {Math.round((course.completed_lessons_count / course.lessons_count) * 100)}% Done
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Progress Bar */}
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-brand-accent transition-all duration-1000 shadow-sm" 
                                                    style={{ width: `${(course.completed_lessons_count / course.lessons_count) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="py-20 text-center bg-brand-surface rounded-[3rem] border border-white/10 shadow-xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent"></div>
                            <div className="relative z-10 space-y-6">
                                <div className="h-20 w-20 bg-brand-accent/10 rounded-3xl flex items-center justify-center mx-auto text-brand-accent">
                                    <BookOpen size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight">Expand Your Knowledge</h3>
                                <p className="text-white/50 max-w-sm mx-auto">Our professional trading modules are being updated. In the meantime, visit our Training Hub for quick start guides.</p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                    <Link 
                                        href={route('academy.training')}
                                        className="px-8 py-4 bg-brand-accent text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
                                    >
                                        Visit Training Hub
                                        <ArrowRight size={16} />
                                    </Link>
                                    <button onClick={() => setFilter('All')} className="px-8 py-4 bg-white/5 text-white/70 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">
                                        View All Categories
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
