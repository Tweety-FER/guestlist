<?php

namespace App\Http\Middleware;

use Closure;
use Chrisbjr\ApiGuard\Models\ApiKey;

class ApiAuth
{

    public function __construct()
    {
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $key = $request->header('token');

        if(empty($key)) {
          return response('Unauthorized.', 401);
        }

        $apiKeyModel = new ApiKey;
        $apiKey = $apiKeyModel->getByKey($key);

        if(empty($apiKey)) {
          return response('Unauthorized.', 401);
        }

        return $next($request);
    }
}
