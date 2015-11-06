<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\User;

class ListUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Lists all the user (grep through it)';


    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $headers = ['ID', 'Name', 'Is Admin'];
        $users = User::all(['id', 'name', 'admin']);

        $this->table($headers, $users);
    }
}
