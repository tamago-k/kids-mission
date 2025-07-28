<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\ChildController;
use App\Http\Controllers\Api\RewardController;
use App\Http\Controllers\Api\RewardBalanceController;
use App\Http\Controllers\Api\RewardRequestController;
use App\Http\Controllers\Api\BadgeController;
use App\Http\Controllers\Api\TaskCategoryController;
use App\Http\Controllers\Api\TaskCommentController;
use App\Http\Controllers\Api\TaskSubmissionController;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

Route::middleware(['web', 'api', EnsureFrontendRequestsAreStateful::class])->group(function () {
    // 認証済みユーザー情報取得（親・子共通）
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return response()->json([
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'role' => $request->user()->role, 
        ]);
    });

    // ログアウト
    Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
        Auth::guard('web')->logout(); 
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'ログアウトしました']);
    });

    // 親ログイン（name + password）
    Route::post('/parent-login', [AuthenticatedSessionController::class, 'store']);

    // 子ログイン（name + pin）
    Route::post('/child-login', [AuthenticatedSessionController::class, 'store']);

    Route::middleware(['auth:sanctum'])->group(function () {
        // children
        Route::get('/children', [ChildController::class, 'index']);
        Route::post('/children', [ChildController::class, 'store']);
        Route::put('/children/{child}', [ChildController::class, 'update']);
        Route::delete('/children/{child}', [ChildController::class, 'destroy']);

        // task
        Route::get('/tasks', [TaskController::class, 'index']);
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::get('/tasks/{id}', [TaskController::class, 'show']);
        Route::put('/tasks/{id}', [TaskController::class, 'update']);
        Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);

        // task-categories
        Route::get('/task-categories', [TaskCategoryController::class, 'index']);
        Route::post('/task-categories', [TaskCategoryController::class, 'store']);
        Route::get('/task-categories/{id}', [TaskCategoryController::class, 'show']);
        Route::put('/task-categories/{id}', [TaskCategoryController::class, 'update']);
        Route::delete('/task-categories/{id}', [TaskCategoryController::class, 'destroy']);

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

        //badges
        Route::get('/badges', [BadgeController::class, 'index']);
        Route::post('/badges', [BadgeController::class, 'store']);
        Route::get('/badges/{badge}', [BadgeController::class, 'show']);
        Route::put('/badges/{badge}', [BadgeController::class, 'update']);
        Route::delete('/badges/{badge}', [BadgeController::class, 'destroy']);
        Route::patch('/badges/{badge}', [BadgeController::class, 'update']);

        //badge_assignments
        Route::post('/badges/{id}/grant', [BadgeController::class, 'grant'])->middleware('auth');

    });

});
