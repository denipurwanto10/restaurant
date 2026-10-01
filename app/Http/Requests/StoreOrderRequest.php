<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'order_type' => ['required', 'in:dine_in,take_away,delivery'],
            'branch_id' => ['required', Rule::exists('branches', 'id')->where('is_active', true)],
            'table_number' => ['nullable', 'string', 'max:20'],
            'delivery_address' => ['required_if:order_type,delivery', 'nullable', 'string'],
            'delivery_city' => ['required_if:order_type,delivery', 'nullable', 'string', 'max:100'],
            'delivery_postal_code' => ['nullable', 'string', 'max:20'],
            'delivery_note' => ['nullable', 'string'],
            'promo_code' => ['nullable', 'string', 'exists:promos,code'],
            'payment_method' => ['required', 'string', 'exists:payment_methods,code'],
            'bank_code' => ['nullable', 'string', 'max:20'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_id' => ['required', 'exists:menus,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:50'],
            'items.*.addon_ids' => ['nullable', 'array'],
            'items.*.addon_ids.*' => ['exists:menu_addons,id'],
            'items.*.note' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'delivery_address.required_if' => 'Delivery address is required for delivery orders.',
            'delivery_city.required_if' => 'City is required for delivery orders.',
        ];
    }
}
