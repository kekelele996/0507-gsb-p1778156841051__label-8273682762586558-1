<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index()
    {
        return Message::with('user:id,name')->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
            'nickname' => 'nullable|string|max:50',
        ]);

        $data = [
            'content' => $request->content,
            'nickname' => $request->nickname,
        ];

        if ($user = Auth::guard('sanctum')->user()) {
            $data['user_id'] = $user->id;
            $data['nickname'] = $user->name; // Override nickname with user name if logged in
        }

        $message = Message::create($data);

        return response()->json($message->load('user:id,name'), 201);
    }
}
