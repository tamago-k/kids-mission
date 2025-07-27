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
            ->where('status', 'submitted')
            ->exists();

        if ($alreadyPending) {
            return response()->json(['message' => 'すでに申請中です'], 422);
        }

        $submission = TaskSubmission::create([
            'task_id' => $task->id,
            'submitted_by' => $user->id,
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        return response()->json($submission, 201);
    }

    public function approve($taskId)
    {
        // そのtask_idの中で status='submitted' の最新の申請を取得
        $submission = TaskSubmission::where('task_id', $taskId)
            ->where('status', 'submitted')
            ->latest('submitted_at')
            ->first();

        if (!$submission) {
            return response()->json(['message' => '申請が見つかりません'], 404);
        }

        $submission->status = 'approved';
        $submission->save();

        return response()->json($submission);
    }

    public function reject($taskId)
    {
        $submission = TaskSubmission::where('task_id', $taskId)
            ->where('status', 'submitted')
            ->latest('submitted_at')
            ->first();

        if (!$submission) {
            return response()->json(['message' => '申請が見つかりません'], 404);
        }

        $submission->status = 'rejected';
        $submission->save();

        return response()->json($submission);
    }

}