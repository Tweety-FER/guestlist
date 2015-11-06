<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\User;
use Chrisbjr\ApiGuard\Models\ApiKey;


class CreateUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description =
      'Takes a user e-mail and creates a new user through console interaction';

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
        $email = $this->argument('email');

        if(is_null($email)) {
          $this->error('No e-email address given! Aborting');
          return false;
        }

        while(empty($name)) {
          $name = $this->ask('What is your name?');
        }

        $password = $this->secret('Enter a password');
        $confirm = $this->secret('Confirm the password');

        if($password !== $confirm) {
          $this->error('The passwords do not match. Aborting');
          return false;
        }

        $admin = $this->confirm('Is this user an admin? [y/N]');

        //Actually create the user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => bcrypt($password),
            'admin' => $admin
        ]);

        $apiKey = new ApiKey;
        $apiKey->key = $apiKey->generateKey();
        $apiKey->user_id = $user->id;
        $apiKey->save();

        $this->info("User successfully created with ID $user->id");
    }
}
