<?php

namespace App\Http\Controllers;

use App\Http\Requests\JurusanStoreRequest;
use App\Models\Jurusan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class JurusanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('dashboard/jurusan/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(JurusanStoreRequest $request)
    {
        try {
            $product = Jurusan::create([
                ...$request->validated(),
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
                    
            ]);

            $fileCount = count($product->showcase_images ?? []);
            $message = $fileCount > 0 
                ? "Jurusan berhasil ditambahkan dengan {$fileCount} file."
                : "Jurusan berhasil ditambahkan.";

            return redirect()->route('dashboard.jurusan.index')
                ->with('success', $message);

        } catch (\Exception $e) {
            Log::error('Jurusan creation error: ' . $e->getMessage());
            
            return back()->withErrors([
                'error' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Jurusan $jurusan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Jurusan $jurusan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Jurusan $jurusan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Jurusan $jurusan)
    {
        //
    }
}
