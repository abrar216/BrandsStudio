<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = \App\Models\Course::withCount('lessons')->latest()->get();
        return \Inertia\Inertia::render('Admin/Courses/Index', ['courses' => $courses]);
    }

    public function create()
    {
        return \Inertia\Inertia::render('Admin/Courses/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'level' => 'required|in:beginner,intermediate,advanced,Beginner,Intermediate,Advanced',
            'duration' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'thumbnail' => 'nullable|image|max:5120',
        ]);

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('courses/thumbnails', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        }

        \App\Models\Course::create($validated);

        return redirect()->route('admin.courses.index')->with('success', 'Course created successfully.');
    }

    public function show(\App\Models\Course $course)
    {
        $course->load('lessons');
        return \Inertia\Inertia::render('Admin/Courses/Show', ['course' => $course]);
    }

    public function edit(\App\Models\Course $course)
    {
        return \Inertia\Inertia::render('Admin/Courses/Edit', ['course' => $course]);
    }

    public function update(Request $request, \App\Models\Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'level' => 'required|in:beginner,intermediate,advanced,Beginner,Intermediate,Advanced',
            'duration' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'thumbnail' => 'nullable|image|max:5120',
        ]);

        if ($validated['title'] !== $course->title) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
        }

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('courses/thumbnails', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        }

        $course->update($validated);

        return redirect()->route('admin.courses.index')->with('success', 'Course updated successfully.');
    }

    public function destroy(\App\Models\Course $course)
    {
        $course->delete();
        return redirect()->route('admin.courses.index')->with('success', 'Course deleted successfully.');
    }
}
