<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TaskCategory;

class TaskCategoryController extends Controller
{
    //　タスクカテゴリ一覧取得
    public function index()
    {
        //全件を取得
        return TaskCategory::all();
    }

    // タスクカテゴリを新規追加
    public function store(Request $request)
    {
        // requestのバリデーションチェック。必須や型など
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string',
        ]);

        // タスクカテゴリのレコード追加
        $task_category = TaskCategory::create($validated);

        // jsonレスポンスでtask_categoryを返す
        return response()->json($task_category, 201);
    }

    // タスクカテゴリ1件だけ取得
    public function show(TaskCategory $task_category)
    {
        return $task_category;
    }

    // タスクカテゴリを更新
    public function update(Request $request, TaskCategory $task_category)
    {
        // requestのバリデーションチェック。必須や型など
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string',
        ]);

        // タスクカテゴリのレコード更新
        $task_category->update($validated);

        // jsonレスポンスでtask_categoryを返す
        return response()->json(['message' => 'Updated successfully']);
    }

    // タスクカテゴリを削除
    public function destroy(TaskCategory $task_category)
    {
        // 削除
        $task_category->delete();

        // messageをjsonレスポンスで返す
        return response()->json(['message' => '削除しました']);
    }
}
