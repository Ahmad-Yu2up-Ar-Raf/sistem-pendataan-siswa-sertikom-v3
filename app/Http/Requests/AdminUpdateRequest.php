<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
class AdminUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {   

                $routeAdmin = $this->route('admin'); 

    $ignoreId = null;
    if ($routeAdmin instanceof \App\Models\User) {
        $ignoreId = $routeAdmin->id;
    } else {
        // jika route memberi '1112' (string), pakai langsung
        $ignoreId = $routeAdmin;
    }

    return [
        'name' => 'required|string|max:255',
        'email' => [
            'required','string','email','max:255',
            Rule::unique('users')->ignore($ignoreId),
        ],
        'password' => ['nullable','confirmed', Rules\Password::defaults()],
        'roles' => 'nullable|string|exists:roles,name',
        'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        'foto_original' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
        'foto_crop_data' => 'nullable|string',

        // tambahan:
        'generate_temp_password' => 'nullable|boolean',
        'send_reset_link' => 'nullable|boolean',
    ];
    }
}
