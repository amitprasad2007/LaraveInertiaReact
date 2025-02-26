<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\Project;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Carbon\Carbon;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Zura',
            'email' => 'zura@example.com',
            'password' => bcrypt('123.321A'),
            'email_verified_at' => time()
        ]);
        User::factory()->create([
            'name' => 'Amit',
            'email' => 'amitprasad.ots@gmail.com',
            'password' => bcrypt('123456789'),
            'email_verified_at' => time(),
            'is_admin'=> true
        ]);
        User::factory(10)->create();

        for($i=0; $i<5; $i++ ){
            $group = Group::factory()->create([
                'owner_id'=> 1,
                'name'=> array_rand(['group1','group2','group3','group4','group5','group6']),

            ]);
            $users = User::inRandomOrder()->limit(rand(2,5))->pluck('id');
            $group->users()->attach(array_unique([1,...$users]));
        }

        Message::factory(1000)->create();
        $messages = Message::whereNull('group_id')->orderBy('created_at')->get();
        $conversactions = $messages->groupBy(
            function ($messages){
             return collect([$messages->sender_id,$messages->receiver_id])->sort()->implode('_');
            })->map( function ($groupedMessages){
                return [
                    'user_id1' => $groupedMessages->first()->sender_id,
                    'user_id2' => $groupedMessages->first()->receiver_id,
                    'last_message_id' => $groupedMessages->last()->id,
                    'created_at'=> new Carbon(),
                    'updated_at'=> new Carbon(),
                ];
        } )->values();
        Conversation::insertOrIgnore($conversactions->toArray());
        Project::factory()
            ->count(30)
            ->hasTasks(30)
            ->create();
    }
}
