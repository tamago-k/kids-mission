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
        $taskCategory = TaskCategory::create($data);
        return response()->json($taskCategory, 201);
    }

    public function show(TaskCategory $taskCategory)
    {
        return $taskCategory;
    }

    public function update(Request $request, TaskCategory $taskCategory)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string',
        ]);
        $taskCategory->update($data);
        return response()->json($taskCategory);
    }

    public function destroy(TaskCategory $taskCategory)
    {
        $taskCategory->delete();
        return response()->noContent();
    }
}
