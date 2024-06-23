<?php

namespace App\Http\Controllers;

use App\Events\SocketMessage;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageAttachmentResource;
use App\Http\Resources\MessageResource;
use App\Http\Resources\TaskResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    /**
     * @param User $user
     * @return \Inertia\Response|\Inertia\ResponseFactory
     */
    public function byUser(User $user )
    {
        $messages =Message::where ('sender_id',auth()->id())
            ->where ('receiver_id',$user->id)
            ->orWhere('sender_id',$user->id)
            ->where ('receiver_id',auth()->id())
            ->latest()
            ->paginate(10);
        $user = auth()->user();
        $totalPendingTasks = Task::query()
            ->where('status', 'pending')
            ->count();
        $myPendingTasks = Task::query()
            ->where('status', 'pending')
            ->where('assigned_user_id', $user->id)
            ->count();


        $totalProgressTasks = Task::query()
            ->where('status', 'in_progress')
            ->count();
        $myProgressTasks = Task::query()
            ->where('status', 'in_progress')
            ->where('assigned_user_id', $user->id)
            ->count();


        $totalCompletedTasks = Task::query()
            ->where('status', 'completed')
            ->count();
        $myCompletedTasks = Task::query()
            ->where('status', 'completed')
            ->where('assigned_user_id', $user->id)
            ->count();

        $activeTasks = Task::query()
            ->whereIn('status', ['pending', 'in_progress'])
            ->where('assigned_user_id', $user->id)
            ->limit(10)
            ->get();
        $activeTasks = TaskResource::collection($activeTasks);

        return inertia('Dashboard',[
            'selectedConversation'=>$user->toConversationArray(),
            'messages'=>MessageResource::collection($messages),
            'totalPendingTasks'=>$totalPendingTasks,
            'myPendingTasks'=>$myPendingTasks,
            'totalProgressTasks'=>$totalProgressTasks,
            'myProgressTasks'=>$myProgressTasks,
            'totalCompletedTasks'=>$totalCompletedTasks,
            'myCompletedTasks'=>$myCompletedTasks,
            'activeTasks'=>$activeTasks
        ]);
    }

    /**
     * @param Group $group
     * @return \Inertia\Response|\Inertia\ResponseFactory
     */
    public function byGroup(Group $group )
    {
        $messages =Message::where ('group_id',$group->id)
            ->latest()
            ->paginate(10);
        $user = auth()->user();
        $totalPendingTasks = Task::query()
            ->where('status', 'pending')
            ->count();
        $myPendingTasks = Task::query()
            ->where('status', 'pending')
            ->where('assigned_user_id', $user->id)
            ->count();


        $totalProgressTasks = Task::query()
            ->where('status', 'in_progress')
            ->count();
        $myProgressTasks = Task::query()
            ->where('status', 'in_progress')
            ->where('assigned_user_id', $user->id)
            ->count();


        $totalCompletedTasks = Task::query()
            ->where('status', 'completed')
            ->count();
        $myCompletedTasks = Task::query()
            ->where('status', 'completed')
            ->where('assigned_user_id', $user->id)
            ->count();

        $activeTasks = Task::query()
            ->whereIn('status', ['pending', 'in_progress'])
            ->where('assigned_user_id', $user->id)
            ->limit(10)
            ->get();
        $activeTasks = TaskResource::collection($activeTasks);
        return inertia('Dashboard',[
            'selectedConversation'=>$group->toConversationArray(),
            'messages'=>MessageResource::collection($messages),
            'totalPendingTasks'=>$totalPendingTasks,
            'myPendingTasks'=>$myPendingTasks,
            'totalProgressTasks'=>$totalProgressTasks,
            'myProgressTasks'=>$myProgressTasks,
            'totalCompletedTasks'=>$totalCompletedTasks,
            'myCompletedTasks'=>$myCompletedTasks,
            'activeTasks'=>$activeTasks
        ]);
    }

    /**
     * @param Message $message
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function loadOlder(Message $message)
    {
        if($message->group_id){
            $messages =Message::where('created_at','<',$message->created_at)
                ->where('group_id',$message->group_id)
                ->latest()
                ->paginate(10);
        }else{
            $messages =Message::where('created_at','<',$message->created_at)
                    ->where(function ($query) use($message){
                        $query->where('sender_id',$message->sender_id)
                            ->where('receiver_id',$message->receiver_id)
                            ->orWhere('sender_id',$message->receiver_id)
                            ->where('receiver_id',$message->sender_id);
                    })
                ->latest()
                ->paginate(10);
        }

        return MessageResource::collection($messages);
    }

    /**
     * @param StoreMessageRequest $request
     * @return MessageResource
     */

    public function store(StoreMessageRequest $request)
    {
        $data = $request->validate();
        $data['sender_id'] = auth()->id();
        $receiverId = $data['receiver_id'] ?? null;
        $groupId =$data['group_id'] ?? null;

        $files = $data['attachments'] ?? [];
        $message = Message::create($data);
        $attachments = [];
        if($files){
            foreach ($files as $file ){
                $directory = 'attachments/' .Str::random(32);
                Storage::makeDirectory($directory);
                $model =[
                    'message_id'=> $message->id,
                    'name'=> $file->getClientOriginalName(),
                    'mime'=> $file->getClientMimeType(),
                    'size'=> $file->getSize(),
                    'path' => $file->store($directory,'publie'),
                ];
                $attachment = MessageAttachment::create($model);
                $attachments[]= $attachment;
            }
            $message->attachments = $attachments;
        }
        if($receiverId){
            Conversation::updateConversationWithMessage($receiverId,auth()->id(),$message);
        }
        if($groupId){
            Group::updateGroupWithMessage($groupId,$message);
        }
        SocketMessage::dispatch($message);
        return new MessageResource($message);

    }

    /**
     * @param Message $message
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response

     */
    public function destroy(Message $message)
    {
        If($message->sender_id !=auth()->id){
            return response()->json(['message'=>'Forbidden'],403);
        }
        $message->delete();
        return response('',204);
    }
}
