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
        $task_category = TaskCategory::create($data);
        return response()->json($task_category, 201);
    }

    public function show(TaskCategory $task_category)
    {
        return $task_category;
    }

    public function update(Request $request, TaskCategory $task_category)
    {

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string',
        ]);

        $task_category->update($data);

        return response()->json(['message' => 'Updated successfully']);
    }

    public function destroy(TaskCategory $task_category)
    {
        $task_category->delete();
        return response()->noContent();
    }
}
