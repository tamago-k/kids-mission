<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class ChildController extends Controller
{
    public function index()
    {
        $children = User::where('role', 'child')
                        ->orderBy('id', 'asc')
                        ->get();

        $formatted = $children->map(function ($child) {
            return [
                'id' => $child->id,
                'name' => $child->name,
                'colorTheme' => $child->theme,
                'icon' => $child->avatar,
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


        $child->name = $request->name ?? $child->name;
        $child->password = $request->password ?? $child->password;
        $child->avatar = $request->icon ?? $child->avatar;
        $child->theme = $request->colorTheme ?? $child->theme;

        $child->save();

        return response()->json([
            'id' => $child->id,
            'name' => $child->name,
            'colorTheme' => $child->theme,
            'icon' => $child->avatar,
            'password' => $child->password,
        ]);
    }

    public function store(Request $request)
    {
        $child = User::create([
            'name' => $request->name,
            'password' => $request->password,
            'avatar' => $request->icon,
            'theme' => $request->colorTheme,
            'role' => 'child',
        ]);

        // 返すときにフロントが使いやすい形に整形
        $response = [
            'id' => $child->id,
            'name' => $child->name,
            'colorTheme' => $child->theme ?? 'blue',
            'icon' => $child->avatar ?? '',
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
