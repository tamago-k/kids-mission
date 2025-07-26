<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskSubmissionController extends Controller
{
    public function store(Request $request, Task $task)
    {
        $user = Auth::user();

        if ($user->role !== 'child' || $task->child_id !== $user->id) {
            return response()->json(['message' => '許可されていません'], 403);
        }

        $alreadyPending = TaskSubmission::where('task_id', $task->id)
            ->where('submitted_by', $user->id)
            ->where('status', 'pending')
            ->exists();

        if ($alreadyPending) {
            return response()->json(['message' => 'すでに申請中です'], 422);
        }

        $submission = TaskSubmission::create([
            'task_id' => $task->id,
            'submitted_by' => $user->id,
            'status' => 'pending',
            'submitted_at' => now(),
        ]);

        return response()->json($submission, 201);
    }
}