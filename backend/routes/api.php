<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\ChildController;
use App\Http\Controllers\Api\RewardController;
use App\Http\Controllers\Api\RewardBalanceController;
use App\Http\Controllers\Api\RewardRequestController;
use App\Http\Controllers\Api\BadgeController;
use App\Http\Controllers\Api\BadgeAssignmentController;
use App\Http\Controllers\Api\TaskCategoryController;
use App\Http\Controllers\Api\TaskCommentController;
use App\Http\Controllers\Api\TaskSubmissionController;
use App\Http\Controllers\Api\AuthController;


// ログイン
Route::post('/login', [AuthController::class, 'login']);

// 認証済みユーザー情報取得（親・子共通）
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
// ログアウト
Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'トークンログアウトしました']);
});

Route::middleware(['auth:api'])->group(function () {
    // children
    Route::get('/children', [ChildController::class, 'index']);
    Route::post('/children', [ChildController::class, 'store']);
    Route::put('/children/{child}', [ChildController::class, 'update']);
    Route::delete('/children/{child}', [ChildController::class, 'destroy']);

    // task
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::get('/tasks/today', [TaskController::class, 'todayTasks']);
    Route::get('/tasks/weekday', [TaskController::class, 'weekdayTasks']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);

    // task-categories
    Route::get('/task-categories', [TaskCategoryController::class, 'index']);
    Route::post('/task-categories', [TaskCategoryController::class, 'store']);
    Route::get('/task-categories/{task_category}', [TaskCategoryController::class, 'show']);
    Route::put('/task-categories/{task_category}', [TaskCategoryController::class, 'update']);
    Route::delete('/task-categories/{task_category}', [TaskCategoryController::class, 'destroy']);

    // task-submission
    Route::post('/task/{task}/submit', [TaskSubmissionController::class, 'store']);
    Route::patch('/task-submissions/{taskId}/approve', [TaskSubmissionController::class, 'approve']);
    Route::put('/task-submissions/{taskId}/reject', [TaskSubmissionController::class, 'reject']);

    // comment
    Route::get('/tasks/{taskId}/comments', [TaskCommentController::class, 'index']);
    Route::post('/tasks/{taskId}/comments', [TaskCommentController::class, 'store']);

    //rewards
    Route::get('/rewards', [RewardController::class, 'index']);
    Route::post('/rewards', [RewardController::class, 'store']);
    Route::get('/rewards/{reward}', [RewardController::class, 'show']);
    Route::put('/rewards/{reward}', [RewardController::class, 'update']);
    Route::delete('/rewards/{reward}', [RewardController::class, 'destroy']);

    //reward-requests
    Route::get('/reward-requests', [RewardRequestController::class, 'index']);
    Route::post('/reward-requests', [RewardRequestController::class, 'store']);
    Route::post('/reward-requests/{id}/approve', [RewardRequestController::class, 'approve']);
    Route::post('/reward-requests/{id}/reject', [RewardRequestController::class, 'reject']);

    //reward-balance
    Route::get('/reward-balance', [RewardBalanceController::class, 'index']);
    Route::get('/reward-balances', [RewardBalanceController::class, 'listAll']);

    //badges
    Route::get('/badges', [BadgeController::class, 'index']);
    Route::post('/badges', [BadgeController::class, 'store']);
    Route::get('/badges/{badge}', [BadgeController::class, 'show']);
    Route::put('/badges/{badge}', [BadgeController::class, 'update']);
    Route::delete('/badges/{badge}', [BadgeController::class, 'destroy']);
    Route::patch('/badges/{badge}', [BadgeController::class, 'update']);
    Route::post('/badges/{id}/grant', [BadgeController::class, 'grant']);

    //badge_assignments
    Route::get('/badge-assignments', [BadgeAssignmentController::class, 'index']);
    Route::post('/badge-assignments/{id}/receive', [BadgeAssignmentController::class, 'receive']);

    //calendar
    Route::get('/calendar-tasks', [TaskController::class, 'calendarTasks']);

});

