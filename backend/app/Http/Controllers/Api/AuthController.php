<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    // requestを受け取ってログイン処理
    public function login(Request $request)
    {
        // requestにnameとpasswordがあることを確認。どちらも必須。passwordは今回平文。
        $credentials = $request->validate([
            'name' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        // DBからnameが該当するユーザーを検索。
        $user = User::where('name', $credentials['name'])->first();

        //ユーザーがない、もしくはパスワードが違う場合は401を返す。
        if (!$user || $user->password !== $credentials['password']) {
            return response()->json(['message' => '認証失敗'], 401);
        }
        
        // ログイン成功したら、tokenを返す
        $token = $user->createToken('api-token')->plainTextToken;

        // 成功レスポンスをreturn
        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }
}
