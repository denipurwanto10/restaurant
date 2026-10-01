<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable', 'string', 'max:255',
                Rule::unique('menus', 'slug')->ignore($this->route('menu')),
            ],
            'description' => ['nullable', 'string'],
            'ingredients' => ['nullable', 'string'],
            'price' => ['required', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'max:2048'],
            'is_available' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'is_popular' => ['nullable', 'boolean'],
            'is_new' => ['nullable', 'boolean'],
            'is_vegetarian' => ['nullable', 'boolean'],
            'is_spicy' => ['nullable', 'boolean'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'branch_ids' => ['nullable', 'array'],
            'branch_ids.*' => ['exists:branches,id'],
        ];
    }
}
