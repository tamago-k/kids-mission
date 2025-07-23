<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class ChildController extends Controller
{
    public function index()
    {
        $children = User::where('parent_id', auth()->id())
                        ->orderBy('id', 'asc')
                        ->get();
                        
        $formatted = $children->map(function ($child) {
            return [
                'id' => $child->id,
                'name' => $child->name,
                'age' => $child->age,
                'colorTheme' => $child->theme,
                'icon' => $child->avatar,
                'points' => 100, // 仮のポイント（本来はDBに持たせる or 計算）
                'completedTasks' => 5,  // 仮データ
                'totalTasks' => 10,     // 仮データ
                'password' => $child->password,
            ];
        });

        return response()->json($formatted);
    }

    public function update(Request $request, $id)
    {
        $child = User::find($id);
        if (!$child) {
            return response()->json(['message' => '子どもが見つかりません'], 404);
        }

        // 親IDが一致しているかも確認（セキュリティ対策）
        if ($child->parent_id !== auth()->id()) {
            return response()->json(['message' => '不正な操作です'], 403);
        }

        $child->name = $request->name ?? $child->name;
        $child->age = $request->age ?? $child->age;
        $child->password = $request->password ?? $child->password;
        $child->avatar = $request->icon ?? $child->avatar;
        $child->theme = $request->colorTheme ?? $child->theme;

        $child->save();

        return response()->json([
            'id' => $child->id,
            'name' => $child->name,
            'age' => $child->age,
            'colorTheme' => $child->theme,
            'icon' => $child->avatar,
            'password' => $child->password,
        ]);
    }

    public function store(Request $request)
    {
        $child = User::create([
            'name' => $request->name,
            'age' => $request->age,
            'password' => $request->password,
            'avatar' => $request->icon,
            'theme' => $request->colorTheme,
            'role' => 'child',
            'parent_id' => auth()->id(),
        ]);

        // 返すときにフロントが使いやすい形に整形
        $response = [
            'id' => $child->id,
            'name' => $child->name,
            'age' => $child->age,
            'colorTheme' => $child->theme ?? 'blue',
            'icon' => $child->avatar ?? '👦',
            'points' => 100,         // 仮データ
            'completedTasks' => 0,   // 新規なので0にしたほうが自然
            'totalTasks' => 0,       // 仮データ
            'password' => $child->password,
        ];

        return response()->json($response, 201);
    }

    public function destroy($id)
    {
        $child = User::find($id);

        if (!$child) {
            return response()->json(['message' => '子どもが見つかりません'], 404);
        }

        $child->delete();

        return response()->json(['message' => '削除しました'], 200);
    }
}
