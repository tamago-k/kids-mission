<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class ChildController extends Controller
{
    // 子どもの一覧取得
    public function index()
    {
        // roleがchildのユーザーをid順に取得
        $children = User::where('role', 'child')
                        ->orderBy('id', 'asc')
                        ->get();

        // 取得した子どもユーザーをフロントで使いやすい形に整形
        $formatted = $children->map(function ($child) {
            return [
                'id' => $child->id,
                'name' => $child->name,
                'theme' => $child->theme,
                'avatar' => $child->avatar,
                'password' => $child->password,
            ];
        });

        // jsonレスポンスでchildを返す
        return response()->json($formatted);
    }

    // 子どもを新規作成
    public function store(Request $request)
    {
        // 新しいレコードをDBに追加
        //　パスワードは今回は平文
        $child = User::create([
            'name' => $request->name,
            'password' => $request->password,
            'avatar' => $request->icon,
            'theme' => $request->colorTheme,
            'role' => 'child',
        ]);


        // jsonレスポンスでchildを返す
        return response()->json($child, 201);
    }

    // 子どもを更新
    public function update(Request $request, User $child)
    {
        // requestのバリデーションチェック。必須や型など
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'password' => 'sometimes|required|string|min:4',
            'avatar' => 'sometimes|required|string',
            'theme' => 'sometimes|required|string',
        ]);

        // 更新
        $child->update($validated);

        // レスポンスを整形して返す
        return response()->json($child);
    }

    // 子どもを削除
    public function destroy(User $child)
    {
        // 削除
        $child->delete();

        // messageをjsonレスポンスで返す
        return response()->json(['message' => '削除しました'], 200);
    }
    
}
