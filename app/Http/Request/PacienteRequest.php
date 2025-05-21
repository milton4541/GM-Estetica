<?php
// namespace App\Http\Requests;

// use Illuminate\Foundation\Http\FormRequest;

// class StorePacienteRequest extends FormRequest
// {
//     public function authorize()
//     {
//         return true; // o lógica de autorización
//     }

//     public function rules(): array
//     {
//         return [
//             'dni_paciente' => 'required|string|max:20|unique:pacientes',
//             'nombre'       => 'required|string|max:100',
//             'apellido'     => 'required|string|max:100',
//             'email'        => 'required|email|unique:pacientes',
//             'telefono'     => 'required|string|max:20',
//             'obra_social'  => 'required|string|max:100',
//         ];
//     }

//     public function messages(): array
//     {
//         return [
//             'dni_paciente.required' => 'El DNI es obligatorio.',
//             // otros mensajes personalizados…
//         ];
//     }
// }
