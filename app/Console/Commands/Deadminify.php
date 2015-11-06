<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\User;

class Deadminify extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:deadminify {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Takes a user id and strips that user of admin privileges';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
      $user = User::findOrFail($this->argument('id'));
      $user->admin = false;
      $user->save();
      $this->info("User $user->name is no longer an administrator");
    }
}
