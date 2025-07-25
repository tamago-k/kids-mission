<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string',
        ]);
        $badge = Category::create($data);
        return response()->json($badge, 201);
    }

    public function show(Category $badge)
    {
        return $badge;
    }

    public function update(Request $request, Category $badge)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string',
        ]);
        $badge->update($data);
        return response()->json($badge);
    }

    public function destroy(Category $badge)
    {
        $badge->delete();
        return response()->noContent();
    }
}
