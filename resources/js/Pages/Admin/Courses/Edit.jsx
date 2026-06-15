import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { BookOpen, ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';

export default function Edit({ auth, course }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: course.title || '',
        description: course.description || '',
        level: course.level || 'beginner',
        duration: course.duration || '',
        is_active: course.is_active === 1 || course.is_active === true,
        thumbnail: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.courses.update', course.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Course</h2>}
        >
            <Head title={`Admin - Edit ${course.title}`} />

            <div className="py-12 bg-brand-bg min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex items-center gap-4 mb-8">
                        <Link href={route('admin.courses.index')} className="h-10 w-10 bg-white/5 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                                Edit Course
                            </h1>
                            <p className="text-gray-500 font-medium">Update the details for {course.title}</p>
                        </div>
                    </div>

                    <div className="glass-dark border border-white/5 rounded-3xl p-8">
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Course Title</label>
                                <input 
                                    type="text" 
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl focus:border-brand-accent focus:ring-brand-accent/20 p-3"
                                    placeholder="e.g. Advanced Crypto Trading"
                                />
                                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Description</label>
                                <textarea 
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl focus:border-brand-accent focus:ring-brand-accent/20 p-3 h-32"
                                    placeholder="Describe what the student will learn..."
                                ></textarea>
                                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Difficulty Level</label>
                                    <select 
                                        value={data.level}
                                        onChange={e => setData('level', e.target.value)}
                                        className="w-full bg-[#111] border border-white/10 text-white rounded-xl focus:border-brand-accent focus:ring-brand-accent/20 p-3"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                        <option value="Beginner">Beginner (Capitalized)</option>
                                        <option value="Intermediate">Intermediate (Capitalized)</option>
                                        <option value="Advanced">Advanced (Capitalized)</option>
                                    </select>
                                    {errors.level && <div className="text-red-500 text-sm mt-1">{errors.level}</div>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Estimated Duration</label>
                                    <input 
                                        type="text" 
                                        value={data.duration}
                                        onChange={e => setData('duration', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl focus:border-brand-accent focus:ring-brand-accent/20 p-3"
                                        placeholder="e.g. 5 hours 30 mins"
                                    />
                                    {errors.duration && <div className="text-red-500 text-sm mt-1">{errors.duration}</div>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Course Thumbnail</label>
                                {course.thumbnail && !data.thumbnail && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-2">Current Thumbnail:</p>
                                        <img src={course.thumbnail} className="w-32 h-32 object-cover rounded-xl border border-white/10" alt="Current thumbnail" />
                                    </div>
                                )}
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="space-y-1 text-center flex flex-col items-center">
                                        {data.thumbnail ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <CheckCircle2 className="text-brand-accent" size={32} />
                                                <span className="text-white font-medium">{data.thumbnail.name}</span>
                                                <button type="button" onClick={() => setData('thumbnail', null)} className="text-xs text-brand-danger">Remove</button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-400">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-brand-accent hover:text-brand-accent/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-accent">
                                                        <span>Upload a new file</span>
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={e => setData('thumbnail', e.target.files[0])} accept="image/*" />
                                                    </label>
                                                    <p className="pl-1">to replace current</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {errors.thumbnail && <div className="text-red-500 text-sm mt-1">{errors.thumbnail}</div>}
                            </div>

                            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-4">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-brand-accent focus:ring-brand-accent focus:ring-offset-gray-800"
                                />
                                <label htmlFor="is_active" className="ml-3 block text-sm font-bold text-white">
                                    Course is active
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-brand-accent hover:bg-brand-accent/90 text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(30,195,212,0.3)] disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
