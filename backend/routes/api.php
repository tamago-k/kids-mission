<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Illuminate\Support\Facades\Auth;

Route::middleware(['api', EnsureFrontendRequestsAreStateful::class])->group(function () {
    // 認証済みユーザー情報取得（親・子共通）
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return response()->json([
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'role' => $request->user()->role, 
        ]);
    });

    // ログアウト
    Route::middleware(['auth:sanctum'])->post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'ログアウトしました']);
    });

    // 親ログイン（name + password）
    Route::post('/parent-login', [AuthenticatedSessionController::class, 'store']);

    // 子ログイン（name + pin）
    Route::post('/child-login', [AuthenticatedSessionController::class, 'store']);
});
