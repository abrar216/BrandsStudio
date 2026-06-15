import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Upload, CheckCircle2, Video, FileText, Link as LinkIcon } from 'lucide-react';

export default function Create({ auth, course }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        duration: '',
        order: course.lessons_count ? course.lessons_count + 1 : 1, // Default to next order
        video_url: '',
        video_file: null,
        pdf_file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.courses.lessons.store', course.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Lesson to {course.title}</h2>}
        >
            <Head title={`Admin - Add Lesson`} />

            <div className="py-12 bg-brand-bg min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex items-center gap-4 mb-8">
                        <Link href={route('admin.courses.show', course.id)} className="h-10 w-10 bg-white/5 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                                <Plus className="hidden" /> Add New Lesson
                            </h1>
                            <p className="text-gray-500 font-medium">Adding lesson to: <span className="text-brand-accent">{course.title}</span></p>
                        </div>
                    </div>

                    <div className="glass-dark border border-white/5 rounded-3xl p-8 mb-8">
                        <form onSubmit={submit} className="space-y-8">
                            
                            <div className="space-y-6 pb-6 border-b border-white/10">
                                <h3 className="text-xl font-bold text-white mb-4">1. Basic Details</h3>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Lesson Title</label>
                                    <input 
                                        type="text" 
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl focus:border-brand-accent focus:ring-brand-accent/20 p-3"
                                        placeholder="e.g. Introduction to Options Trading"
                                    />
                                    {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Lesson Content (Text)</label>
                                    <textarea 
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl focus:border-brand-accent focus:ring-brand-accent/20 p-3 h-48 font-mono text-sm"
                                        placeholder="Add written content, HTML, or markdown here..."
                                    ></textarea>
                                    {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Duration</label>
                                        <input 
                                            type="text" 
                                            value={data.duration}
                                            onChange={e => setData('duration', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl focus:border-brand-accent focus:ring-brand-accent/20 p-3"
                                            placeholder="e.g. 15m 30s"
                                        />
                                        {errors.duration && <div className="text-red-500 text-sm mt-1">{errors.duration}</div>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Order / Lesson Number</label>
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={data.order}
                                            onChange={e => setData('order', e.target.value)}
                                            className="w-full bg-[#111] border border-white/10 text-white rounded-xl focus:border-brand-accent focus:ring-brand-accent/20 p-3"
                                        />
                                        {errors.order && <div className="text-red-500 text-sm mt-1">{errors.order}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pb-6 border-b border-white/10">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Video className="text-brand-accent" size={24} /> 2. Video Content
                                </h3>
                                
                                <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 mb-4">
                                    <p className="text-sm text-brand-accent font-medium">You can provide a YouTube URL OR upload a local video file. If both are provided, the local video file will take precedence.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                                        <LinkIcon size={16} /> YouTube URL
                                    </label>
                                    <input 
                                        type="url" 
                                        value={data.video_url}
                                        onChange={e => setData('video_url', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl focus:border-brand-accent focus:ring-brand-accent/20 p-3"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    {errors.video_url && <div className="text-red-500 text-sm mt-1">{errors.video_url}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                                        <Upload size={16} /> Local Video Upload (Max 100MB)
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="space-y-1 text-center flex flex-col items-center w-full">
                                            {data.video_file ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircle2 className="text-brand-accent" size={32} />
                                                    <span className="text-white font-medium">{data.video_file.name}</span>
                                                    <span className="text-gray-400 text-xs text-center break-all">{(data.video_file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                                    <button type="button" onClick={() => setData('video_file', null)} className="text-xs text-brand-danger mt-1">Remove</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <Video className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-400">
                                                        <label htmlFor="video-upload" className="relative cursor-pointer rounded-md font-medium text-brand-accent hover:text-brand-accent/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-accent">
                                                            <span>Upload a video</span>
                                                            <input id="video-upload" name="video_file" type="file" className="sr-only" onChange={e => setData('video_file', e.target.files[0])} accept="video/mp4,video/x-m4v,video/*" />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">MP4, WebM up to 100MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {errors.video_file && <div className="text-red-500 text-sm mt-1">{errors.video_file}</div>}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <FileText className="text-yellow-400" size={24} /> 3. PDF Resources
                                </h3>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Attach PDF (Max 20MB)</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="space-y-1 text-center flex flex-col items-center w-full">
                                            {data.pdf_file ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircle2 className="text-brand-accent" size={32} />
                                                    <span className="text-white font-medium">{data.pdf_file.name}</span>
                                                    <span className="text-gray-400 text-xs text-center break-all">{(data.pdf_file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                                    <button type="button" onClick={() => setData('pdf_file', null)} className="text-xs text-brand-danger mt-1">Remove</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-400">
                                                        <label htmlFor="pdf-upload" className="relative cursor-pointer rounded-md font-medium text-brand-accent hover:text-brand-accent/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-accent">
                                                            <span>Upload a PDF</span>
                                                            <input id="pdf-upload" name="pdf_file" type="file" className="sr-only" onChange={e => setData('pdf_file', e.target.files[0])} accept="application/pdf" />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PDF up to 20MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {errors.pdf_file && <div className="text-red-500 text-sm mt-1">{errors.pdf_file}</div>}
                                </div>
                            </div>

                            <div className="pt-8 flex justify-end items-center gap-4">
                                <Link 
                                    href={route('admin.courses.show', course.id)}
                                    className="text-gray-400 hover:text-white px-4 py-2 font-bold transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-brand-accent hover:bg-brand-accent/90 text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(30,195,212,0.3)] disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Lesson'}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
