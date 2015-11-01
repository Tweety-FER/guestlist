<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('index');
});

Route::group(['prefix' => 'api'], function() {
    Route::get('guest', 'GuestController@index');
    Route::get('guest/{id}', 'GuestController@show');
    Route::post('guest', 'GuestController@store');
    Route::post('guests', 'GuestController@storeMany');
    Route::put('guest/{id}', 'GuestController@update');
    Route::delete('guest/{id}', 'GuestController@destroy');

    Route::get('me', 'Auth\AuthController@me');

    Route::post('register', 'Auth\AuthController@postRegister');
    Route::post('login', 'Auth\AuthController@postLogin');
});
