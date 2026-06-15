<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\UserProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademyController extends Controller
{
    public function index()
    {
        $courses = Course::where('is_active', true)
            ->withCount('lessons')
            ->withCount(['lessons as completed_lessons_count' => function ($query) {
                $query->whereHas('userProgress', function ($q) {
                    $q->where('user_id', auth()->id())
                      ->where('is_completed', true);
                });
            }])
            ->get();

        $stats = [
            'total_courses' => $courses->count(),
            'total_lessons' => $courses->sum('lessons_count'),
            'completed_lessons' => $courses->sum('completed_lessons_count'),
        ];

        return Inertia::render('Academy/Index', [
            'courses' => $courses,
            'stats' => $stats,
        ]);
    }

    public function show(Course $course)
    {
        $course->load(['lessons' => function ($query) {
            $query->orderBy('order');
        }]);

        $userProgress = UserProgress::where('user_id', auth()->id())
            ->whereIn('lesson_id', $course->lessons->pluck('id'))
            ->get()
            ->keyBy('lesson_id');

        return Inertia::render('Academy/CourseShow', [
            'course' => $course,
            'userProgress' => $userProgress,
        ]);
    }

    public function lesson(Course $course, Lesson $lesson)
    {
        // Ensure lesson belongs to the course
        if ($lesson->course_id !== $course->id) {
            abort(404);
        }

        $course->load('lessons');
        $lesson->load('course');
        
        $progress = UserProgress::firstOrCreate([
            'user_id' => auth()->id(),
            'lesson_id' => $lesson->id,
        ]);

        $progress->update(['last_watched_at' => now()]);

        return Inertia::render('Academy/LessonShow', [
            'course' => $course,
            'lesson' => $lesson,
            'progress' => $progress,
        ]);
    }

    public function training()
    {
        $brokers = [
            ['id' => 1, 'name' => 'AKD Securities', 'logo' => 'https://akdsecurities.net/Content/images/logo.png', 'rating' => 4.8, 'description' => 'Leading brokerage house in Pakistan. Offering a wide range of financial services including equity trading and research.'],
        ];

        return Inertia::render('Academy/Training', [
            'brokers' => $brokers,
        ]);
    }

    public function complete(Request $request, Lesson $lesson)
    {
        $progress = UserProgress::updateOrCreate(
            ['user_id' => auth()->id(), 'lesson_id' => $lesson->id],
            ['is_completed' => true]
        );

        return back()->with('status', 'Lesson marked as completed!');
    }
}
