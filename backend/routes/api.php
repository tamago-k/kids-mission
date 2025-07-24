<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\ChildController;
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

    // 子
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/children', [ChildController::class, 'index']);
        Route::post('/children', [ChildController::class, 'store']);
        Route::put('/children/{child}', [ChildController::class, 'update']);
        Route::delete('/children/{child}', [ChildController::class, 'destroy']);
    });

    // task
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/tasks', [TaskController::class, 'index']);
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::get('/tasks/{id}', [TaskController::class, 'show']);
        Route::put('/tasks/{id}', [TaskController::class, 'update']);
        Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    });
});
