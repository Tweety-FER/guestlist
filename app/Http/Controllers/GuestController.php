<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Guest;
use Validator;
use App\Http\Requests;
use Chrisbjr\ApiGuard\Models\ApiKey;
use App\User;

class GuestController extends Controller
{

    public function __construct()
    {
      $this->middleware('auth.api');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Guest::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->checkAdmin($request);

        $validator = Validator::make($request->all(), [
            'fullName' => 'required|max:255',
            'referrer' => 'max:255'
        ]);

        if($validator->fails()) {
          abort(500, 'Validation failure');
        }

        $guest = Guest::create([
            'fullName' => $request->input('fullName'),
            'referrer' => $request->input('referrer')
        ]);

        return ['id' => $guest->id];
    }

    /**
    * Store multiple guests with the same referrer in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */
    public function storeMany(Request $request)
    {
      $this->checkAdmin($request);

      $validator = Validator::make($request->all(), [
          'fullNames' => 'required|max:1000',
          'referrer' => 'max:255'
      ]);

      if($validator->fails()) {
        abort(500, 'Validation failure');
      }

      $names = preg_split("/\s*[,;]\s*/", $request->input('fullNames'));
      $results = [];

      foreach($names as $name) {
          $results[] = Guest::create([
            'fullName' => $name,
            'referrer' => $request->input('referrer')
          ])->id;
      }

      return $results;
    }

    public function update($id, Request $request)
    {
      $guest = Guest::findOrFail($id);

      $validator = Validator::make($request->all(), [
          'fullName' => 'required|max:255',
          'referrer' => 'max:255',
          'checked' => 'required'
      ]);

      if($validator->fails()) {
        abort(500, 'Validation failure');
      }

      if(\Auth::user()->admin) {
          $guest->fullName = $request->input('fullName');
          $guest->referrer = $request->input('referrer');
      }

      $guest->checked = $request->input('checked');

      if($guest->save()) {
          return ['id' => $guest->id];
      }

      abort(500, 'Could not update the user!');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Guest::findOrFail($id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        $this->checkAdmin($request);
        Guest::findOrFail($id)->delete();
        return ['id' => $id];
    }

    protected function checkAdmin(Request $request)
    {
      $key = $request->header('token');

      if(empty($key)) {
        abort(401, 'Ej, ej, nisi admin!');
      }

      $apiKeyModel = new ApiKey;
      $apiKey = $apiKeyModel->getByKey($key);

      if(empty($apiKey)) {
        abort(401, 'Ej, ej, nisi admin!');
      }

      $user = User::find($apiKey->user_id);

      if(empty($user)) {
        abort(401, 'Ej, ej, nisi admin!');
      }

      if(!$user->admin) {
        abort(401, 'Ej, ej, nisi admin!');
      }
    }
}
