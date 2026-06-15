<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Stock;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q');

        if (empty($query) || strlen($query) < 2) {
            return response()->json([]);
        }

        $results = collect();

        // Search Courses
        $courses = Course::where('is_active', true)
            ->where(function($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            })
            ->limit(5)
            ->get()
            ->map(function ($course) {
                return [
                    'id' => 'course-' . $course->id,
                    'title' => $course->title,
                    'subtitle' => $course->level . ' • ' . $course->duration,
                    'type' => 'Lesson',
                    'url' => route('academy.show', $course->slug),
                    'category' => 'Academy'
                ];
            });
        
        $results = $results->concat($courses);

        // Search Stocks
        $stocks = Stock::where('name', 'like', "%{$query}%")
            ->orWhere('symbol', 'like', "%{$query}%")
            ->limit(5)
            ->get()
            ->map(function ($stock) {
                return [
                    'id' => 'stock-' . $stock->id,
                    'title' => $stock->name,
                    'subtitle' => $stock->symbol . ' • Rs. ' . number_format($stock->current_price, 2),
                    'type' => 'TrendingUp',
                    'url' => route('trading.index'),
                    'category' => 'Trading'
                ];
            });

        $results = $results->concat($stocks);

        return response()->json($results);
    }
}
