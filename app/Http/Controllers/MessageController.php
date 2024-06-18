<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * @param User $user
     * @return void
     */
    public function byUser(User $user )
    {

    }

    /**
     * @param Group $group
     * @return void
     */
    public function byGroup(Group $group )
    {

    }

    /**
     * @param Message $message
     * @return void
     */
    public function loadOlder(Message $message)
    {

    }

    /**
     * @param StoreMessageRequest $request
     * @return void
     */

    public function store(StoreMessageRequest $request)
    {

    }

    /**
     * @param Message $message
     * @return void
     */
    public function destroy(Message $message)
    {

    }
}
