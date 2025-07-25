<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\ChildController;
use App\Http\Controllers\Api\RewardController;
use App\Http\Controllers\Api\BadgeController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TaskCommentController;
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

        // categories
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::get('/categories/{id}', [CategoryController::class, 'show']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // comment
        Route::get('/tasks/{taskId}/comments', [TaskCommentController::class, 'index']);
        Route::post('/tasks/{taskId}/comments', [TaskCommentController::class, 'store']);

        //rewards
        Route::get('/rewards', [RewardController::class, 'index']);
        Route::post('/rewards', [RewardController::class, 'store']);
        Route::get('/rewards/{reward}', [RewardController::class, 'show']);
        Route::put('/rewards/{reward}', [RewardController::class, 'update']);
        Route::delete('/rewards/{reward}', [RewardController::class, 'destroy']);

        //badges
        Route::get('/badges', [BadgeController::class, 'index']);
        Route::post('/badges', [BadgeController::class, 'store']);
        Route::get('/badges/{badge}', [BadgeController::class, 'show']);
        Route::put('/badges/{badge}', [BadgeController::class, 'update']);
        Route::delete('/badges/{badge}', [BadgeController::class, 'destroy']);
        Route::patch('/badges/{badge}', [BadgeController::class, 'update']);
    });

});
