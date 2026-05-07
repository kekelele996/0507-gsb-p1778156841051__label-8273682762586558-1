<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AnimalController extends Controller
{
    private function ensureAdmin(Request $request): void
    {
        $user = $request->user();

        if (!$user || !$user->is_admin) {
            throw new HttpException(403, '仅管理员可新增、编辑和删除动物信息。');
        }
    }

    private function validatePayload(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'name' => [$required, 'string', 'max:255'],
            'species' => [$required, 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image_url' => [$required, 'url'],
            'status' => [$required, 'in:available,adopted'],
            'category' => [$required, 'in:mammal,bird,reptile,amphibian,aquatic'],
            'habitat' => [$required, 'in:savanna,rainforest,arctic,ocean,desert,wetland'],
            'likes' => ['sometimes', 'integer', 'min:0'],
        ]);
    }

    public function index()
    {
        return Animal::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $this->ensureAdmin($request);

        $validated = $this->validatePayload($request);
        $animal = Animal::create($validated);

        return response()->json($animal, 201);
    }

    public function show($id)
    {
        return Animal::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $this->ensureAdmin($request);

        $animal = Animal::findOrFail($id);
        $validated = $this->validatePayload($request, true);
        $animal->update($validated);
        return response()->json($animal);
    }

    public function destroy(Request $request, $id)
    {
        $this->ensureAdmin($request);

        Animal::destroy($id);
        return response()->json(['message' => '动物已删除']);
    }
}
