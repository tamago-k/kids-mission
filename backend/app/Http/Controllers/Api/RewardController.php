<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reward;

class RewardController extends Controller
{
    public function index()
    {
        return Reward::latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'required|string',
            'need_reward' => 'required|integer|min:0',
        ]);
        $reward = Reward::create($data);
        return response()->json($reward, 201);
    }

    public function show(Reward $reward)
    {
        return $reward;
    }

    public function update(Request $request, Reward $reward)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'icon' => 'sometimes|required|string',
            'need_reward' => 'sometimes|required|integer|min:0',
        ]);
        $reward->update($data);
        return response()->json($reward);
    }

    public function destroy(Reward $reward)
    {
        $reward->delete();
        return response()->noContent();
    }
}
