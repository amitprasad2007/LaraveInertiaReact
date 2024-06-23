<?php

use Illuminate\Support\Facades\Broadcast;
use  App\Http\Resources\UserResource;

Broadcast::channel('online', function (\App\Models\User $user) {
    return  $user ? new UserResource($user):null;
});
Broadcast::channel('message.user.{userId1}-{userId2}',function (\App\Models\User $user, int $userId1,int $userId2){
        return $user->id===$userId1||$user->id===$userId2 ? $user:null;
});

Broadcast::channel('message.group.{groupId}',function (\App\Models\User $user, int $groupId){
    return $user->groups->contains('id',$groupId) ? $user :null;
});

