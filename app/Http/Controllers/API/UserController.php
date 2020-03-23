<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\User;

class UserController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    
    public function __construct() {
        $this->middleware('auth:api');

        //Unauthorize everything from anyon other the admin
        // $this->authorize('isAdmin');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $this->authorize('isAdmin');
        if (\Gate::allows('isAdmin') || \Gate::allows('isAuthor')) {
            return User::latest()->paginate(5);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //Validation
        $this->validate($request,[
            'name' => 'required|string|max:191',
            'email'=> 'required|string|email|max:191|unique:users',
            'bio' => 'max:200',
            'password'=>'required|string|min:6'
        ]);

        //User storage in DB
        return User::create([
            'name' => $request['name'],
            'email' => $request['email'],
            'type' => $request['type'],
            'password' => Hash::make($request['password']),
            'bio' => $request['bio'],
            'photo' => $request['photo'],
        ]
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    public function profile()
    {
        return auth('api')->user();
    }

    public function updateProfile(Request $request) {
        
        $user = auth('api')->user();

        //validation
        $this->validate($request,[
            'name' => 'required|string|max:191',
            //keep the email of the current user or change it
            'email'=> 'required|string|email|max:191|unique:users,email,'.$user->id,
            //'bio' => 'max:200',
            'password'=>'sometimes|required|min:6'
        ]);

        //current photo from db
        $currentPhoto = $user->photo;
        //if the to-be uploaded photo is not the same as the one in db
        if($request->photo != $currentPhoto) {
            $name = time().'.' . explode('/', explode(':', substr($request->photo, 0, strpos($request->photo, ';')))[1])[1];

            \Image::make($request->photo)->save(public_path('img/profile/').$name);

            //assigning the $name to the uploaded photo
            $request->merge(['photo' => $name]);

            $userPhoto = public_path('img/profile/').$currentPhoto;
            if(file_exists($userPhoto)) {
                @unlink($userPhoto);
            }

        }

        if(!empty($request->password)) {
            $request->merge(['password' => Hash::make($request['password'])]);
        }

        //update the updated photo with the new $name
        $user->update($request->all());

        return ['message' => 'Updating...'];
        // return redirect('api/profile/')
        //     ->with('warning', 'File too large');

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {   
        //retrieve the user here
        $user = User::findOrFail($id);
    
        //Validation
        $this->validate($request,[
            'name' => 'required|string|max:191',
            //keep the email of the current user or change it
            'email'=> 'required|string|email|max:191|unique:users,email,'.$user->id,
            'bio' => 'max:200',
            'password'=>'sometimes|min:6'
        ]);

        //updating user information
        $user -> update($request->all());

        return ['message' => 'updating...'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //authorizing deletion
        $this->authorize('isAdmin');

        //retrieve the user here
        $user = User::findOrFail($id);

        //delete
        $user -> delete();

        //return a message to console from server
        return['message' => 'User deleted'];
    }
}
