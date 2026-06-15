import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Trophy, PlayCircle, ChevronLeft, ChevronRight, 
    ArrowRight, BookOpen, FileText, Download, 
    Activity, Star 
} from 'lucide-react';

export default function LessonShow({ course, lesson, progress }) {
    const { post, processing } = useForm();
    const currentIndex = course.lessons.findIndex(l => l.id === lesson.id);
    const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;

    const completeLesson = (e) => {
        e.preventDefault();
        post(route('academy.complete', lesson.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                            <Link href={route('academy.index')} className="hover:text-brand-accent transition-colors">Academy</Link>
                            <span className="opacity-20">/</span>
                            <Link href={route('academy.show', course.slug)} className="hover:text-brand-accent transition-colors truncate max-w-[150px]">{course.title}</Link>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter">
                            {lesson.title}
                        </h2>
                    </div>
                    {progress.is_completed && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-brand-accent/5 border border-brand-accent/10 rounded-xl text-brand-accent shadow-sm">
                            <Trophy size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Module Completed</span>
                        </div>
                    )}
                </div>
            }
        >
            <Head title={`${lesson.title} - ${course.title}`} />

            <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        
                        {/* Main Content Area */}
                        <div className="lg:col-span-3 space-y-8">
                            
                            {/* Professional Player Layout */}
                            <div className="space-y-6">
                                <div className="aspect-video bg-white rounded-[2.5rem] border border-brand-border overflow-hidden relative shadow-lg group">
                                    {lesson.video_path ? (
                                        <video 
                                            className="w-full h-full object-cover outline-none"
                                            controls
                                            src={lesson.video_path}
                                            controlsList="nodownload"
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (lesson.video_url?.includes('youtube.com') || lesson.video_url?.includes('youtu.be')) ? (
                                        <iframe 
                                            className="w-full h-full"
                                            src={lesson.video_url.includes('youtube.com') 
                                                ? lesson.video_url.replace('watch?v=', 'embed/') 
                                                : `https://www.youtube.com/embed/${lesson.video_url.split('/').pop()}`}
                                            title={lesson.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <div className="absolute inset-0 bg-brand-surface flex flex-col items-center justify-center p-12 text-center">
                                            <div className="h-24 w-24 rounded-full bg-brand-accent/5 border border-brand-accent/10 flex items-center justify-center backdrop-blur-3xl group-hover:scale-105 transition-transform duration-700 mb-6 shadow-sm">
                                                <PlayCircle size={48} className="text-brand-accent" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Secure Stream Ready</h3>
                                            <p className="text-white/40 text-sm font-bold uppercase tracking-widest max-w-sm">Encryption active. Select lesson from sidebar to begin transmission.</p>
                                            
                                            <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                                    <span>{lesson.duration} runtime</span>
                                                    <span className="h-1 w-1 bg-gray-200 rounded-full"></span>
                                                    <span>4K Ultra HDR</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {[1,2,3].map(i => <div key={i} className={`h-1 w-8 rounded-full ${i === 1 ? 'bg-brand-accent' : 'bg-gray-100'}`}></div>)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Navigation Bar */}
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex gap-2">
                                        {prevLesson ? (
                                            <Link 
                                                href={route('academy.lesson', {course: course.slug, lesson: prevLesson.slug})}
                                                className="px-6 py-3 bg-brand-surface border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:border-brand-accent/30 transition-all flex items-center gap-2 shadow-sm"
                                            >
                                                <ChevronLeft size={16} />
                                                Previous
                                            </Link>
                                        ) : (
                                            <div className="px-6 py-3 border border-brand-border rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-not-allowed bg-gray-50">
                                                Start of Course
                                            </div>
                                        )}
                                        {nextLesson && (
                                            <Link 
                                                href={route('academy.lesson', {course: course.slug, lesson: nextLesson.slug})}
                                                className="px-6 py-3 bg-gray-100 border border-brand-border rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-200 transition-all flex items-center gap-2 shadow-sm"
                                            >
                                                Next Lesson
                                                <ChevronRight size={16} />
                                            </Link>
                                        )}
                                    </div>
                                    
                                    {!progress.is_completed ? (
                                        <button 
                                            onClick={completeLesson}
                                            disabled={processing}
                                            className="px-8 py-4 bg-brand-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-brand-accent/10 flex items-center gap-3 group/btn"
                                        >
                                            {processing ? 'Processing...' : 'Mark Module Complete'}
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    ) : (
                                        <div className="px-8 py-4 bg-brand-accent/5 border border-brand-accent/10 rounded-2xl text-brand-accent font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-sm">
                                            <Trophy size={18} />
                                            Verification Success
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 bg-brand-surface p-10 rounded-[2rem] border border-white/10 space-y-8 shadow-sm">
                                    <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-accent">
                                            <BookOpen size={24} />
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Lesson Overview</h3>
                                    </div>
                                    <div className="prose max-w-none text-white/70 leading-relaxed space-y-6">
                                        <p className="text-lg">
                                            {lesson.content}
                                        </p>
                                        <p>
                                            In this specialized module, we dive deep into the technical frameworks and psychological states required to execute at an institutional level. This content is curated for traders who are serious about scaling their operations and achieving consistent market alpha.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-brand-surface p-8 rounded-[2rem] border border-white/10 space-y-6 shadow-sm">
                                        <h4 className="text-xs font-black text-brand-accent uppercase tracking-[0.2em] mb-4">Module Resources</h4>
                                        <div className="space-y-3">
                                            {lesson.pdf_path ? (
                                                <a href={lesson.pdf_path} target="_blank" rel="noreferrer" className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between group hover:bg-brand-accent/5 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 group-hover:text-brand-accent shadow-sm border border-white/10">
                                                            <FileText size={18} />
                                                        </div>
                                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Lesson Resources (PDF)</span>
                                                    </div>
                                                    <Download size={14} className="text-gray-600" />
                                                </a>
                                            ) : (
                                                <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-2xl border border-brand-border">No additional resources uploaded for this lesson.</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-8 bg-brand-accent/5 rounded-[2rem] border border-brand-accent/10 space-y-4">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black text-brand-accent uppercase tracking-widest">
                                            <Star size={14} />
                                            Expert Insight
                                        </h4>
                                        <p className="text-xs text-brand-accent font-medium italic leading-relaxed">
                                            "Remember, markets don't reward intelligence, they reward discipline. Stick to the methodology taught in this lesson."
                                        </p>
                                        <div className="pt-4 mt-4 border-t border-brand-accent/10">
                                            <Link 
                                                href={route('trading.index')} 
                                                className="w-full py-4 bg-white/10 hover:bg-white/20 border border-brand-accent/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all"
                                            >
                                                <Activity size={14} />
                                                Practice Strategy
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Curriculum (Professional List) */}
                        <div className="lg:col-span-1">
                            <div className="bg-brand-surface rounded-[2rem] border border-white/10 sticky top-24 overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 text-white">
                                    <div className="flex items-center gap-3">
                                        <PlayCircle size={20} className="text-brand-accent" />
                                        <span className="font-black text-xs uppercase tracking-widest">Curriculum</span>
                                    </div>
                                    <span className="text-[10px] text-white/40 font-black uppercase tracking-tighter">
                                        {currentIndex + 1} / {course.lessons.length}
                                    </span>
                                </div>
                                <div className="max-h-[700px] overflow-y-auto custom-scrollbar">
                                    {course.lessons.map((l, i) => (
                                        <Link 
                                            key={l.id} 
                                            href={route('academy.lesson', {course: course.slug, lesson: l.slug})}
                                            className={`flex items-start gap-4 p-6 hover:bg-gray-50 transition-all border-b border-brand-border last:border-0 ${l.id === lesson.id ? 'bg-brand-accent/5 border-l-4 border-l-brand-accent' : ''}`}
                                        >
                                            <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-black text-[10px] shrink-0 shadow-sm ${l.id === lesson.id ? 'bg-brand-accent text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                {String(i + 1).padStart(2, '0')}
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`text-xs font-black uppercase tracking-tight leading-tight mb-1 ${l.id === lesson.id ? 'text-brand-accent' : 'text-white/70 group-hover:text-white'}`}>
                                                    {l.title}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">{l.duration}</span>
                                                    {l.id === lesson.id && <span className="h-1 w-1 bg-brand-accent rounded-full animate-pulse"></span>}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
