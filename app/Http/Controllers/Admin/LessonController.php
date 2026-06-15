<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function create(\App\Models\Course $course)
    {
        return \Inertia\Inertia::render('Admin/Lessons/Create', ['course' => $course]);
    }

    public function store(Request $request, \App\Models\Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video_url' => 'nullable|url',
            'video_file' => 'nullable|file|mimetypes:video/mp4,video/x-m4v,video/*|max:102400',
            'pdf_file' => 'nullable|file|mimes:pdf|max:20480',
            'duration' => 'nullable|string|max:255',
            'order' => 'required|integer|min:0',
        ]);

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
        $validated['course_id'] = $course->id;

        if ($request->hasFile('video_file')) {
            $path = $request->file('video_file')->store('lessons/videos', 'public');
            $validated['video_path'] = '/storage/' . $path;
        }

        if ($request->hasFile('pdf_file')) {
            $path = $request->file('pdf_file')->store('lessons/pdfs', 'public');
            $validated['pdf_path'] = '/storage/' . $path;
        }

        unset($validated['video_file']);
        unset($validated['pdf_file']);

        \App\Models\Lesson::create($validated);

        return redirect()->route('admin.courses.show', $course)->with('success', 'Lesson created successfully.');
    }

    public function edit(\App\Models\Course $course, \App\Models\Lesson $lesson)
    {
        return \Inertia\Inertia::render('Admin/Lessons/Edit', [
            'course' => $course,
            'lesson' => $lesson
        ]);
    }

    public function update(Request $request, \App\Models\Course $course, \App\Models\Lesson $lesson)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video_url' => 'nullable|url',
            'video_file' => 'nullable|file|mimetypes:video/mp4,video/x-m4v,video/*|max:102400',
            'pdf_file' => 'nullable|file|mimes:pdf|max:20480',
            'duration' => 'nullable|string|max:255',
            'order' => 'required|integer|min:0',
        ]);

        if ($validated['title'] !== $lesson->title) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
        }

        if ($request->hasFile('video_file')) {
            $path = $request->file('video_file')->store('lessons/videos', 'public');
            $validated['video_path'] = '/storage/' . $path;
        }

        if ($request->hasFile('pdf_file')) {
            $path = $request->file('pdf_file')->store('lessons/pdfs', 'public');
            $validated['pdf_path'] = '/storage/' . $path;
        }

        unset($validated['video_file']);
        unset($validated['pdf_file']);

        $lesson->update($validated);

        return redirect()->route('admin.courses.show', $course)->with('success', 'Lesson updated successfully.');
    }

    public function destroy(\App\Models\Course $course, \App\Models\Lesson $lesson)
    {
        $lesson->delete();
        return redirect()->route('admin.courses.show', $course)->with('success', 'Lesson deleted successfully.');
    }
}
