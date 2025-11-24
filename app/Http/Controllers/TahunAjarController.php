<?php

namespace App\Http\Controllers;

use App\Http\Requests\TahunAjarStoreRequest as RequestsTahunAjarStoreRequest;

use App\Models\TahunAjar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TahunAjarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('dashboard/tahun_ajar');
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
    public function store(RequestsTahunAjarStoreRequest $request)
    {
        try {
            $product = TahunAjar::create([
                ...$request->validated(),
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
                    
            ]);

            $fileCount = count($product->showcase_images ?? []);
            $message = $fileCount > 0 
                ? "Tahun Ajar berhasil ditambahkan dengan {$fileCount} file."
                : "Tahun Ajar berhasil ditambahkan.";

            return redirect()->route('dashboard.tahun_ajar.index')
                ->with('success', $message);

        } catch (\Exception $e) {
            Log::error('Tahun Ajar creation error: ' . $e->getMessage());
            
            return back()->withErrors([
                'error' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(TahunAjar $tahunAjar)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TahunAjar $tahunAjar)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TahunAjar $tahunAjar)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TahunAjar $tahunAjar)
    {
        //
    }
}
