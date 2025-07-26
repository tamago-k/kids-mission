<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TaskCategory;

class TaskCategoryController extends Controller
{
    public function index()
    {
        return TaskCategory::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string',
        ]);
        $badge = TaskCategory::create($data);
        return response()->json($badge, 201);
    }

    public function show(TaskCategory $badge)
    {
        return $badge;
    }

    public function update(Request $request, TaskCategory $badge)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string',
        ]);
        $badge->update($data);
        return response()->json($badge);
    }

    public function destroy(TaskCategory $badge)
    {
        $badge->delete();
        return response()->noContent();
    }
}
