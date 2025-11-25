<?php

namespace App\Http\Controllers;

use App\Enums\StatusEnums;
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



    public function json_data(Request $request)
    {
        $perPage = $request->input('perPage', 5);
        $search = $request->input('search');
      
        $page = $request->input('page', 1);


        $query = TahunAjar::select(['nama_tahun_ajar', 'id'])->where('status' , StatusEnums::Aktif->value);
    
    
       
      
    
    
        if ($search) {
            $query->where(function($q) use ($search) {
                $searchLower = strtolower($search);
                $q->whereRaw('LOWER(nama_tahun_ajar) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(kode_tahun_ajar) LIKE ?', ["%{$searchLower}%"]);
            });
        }
    
     
     
    
    
        $tahun_ajar = $query->orderByDesc('created_at')
            ->paginate($perPage, ['*'], 'page', $page);
    
    
        $tahun_ajar->through(function ($item) {
           
    
            return [
                ...$item->toArray(),
                // 'foto' => $item->cover_image ? url($item->cover_image) : null,
              
              
            ];
        });
        return response()->json([
            'status' => true,
            'message' => 'Siswa retrieved successfully',
            'data' => [
                'tahun_ajar' => $tahun_ajar->items() ?? [],
            ],
            'meta' => [
                'filters' => [
                    'search' => $search ?? '',
                    'status' => $status ?? [],
                ],
                'pagination' => [
                    'total' => $tahun_ajar->total(),
                    'currentPage' => $tahun_ajar->currentPage(),
                    'perPage' => $tahun_ajar->perPage(),
                    'lastPage' => $tahun_ajar->lastPage(),
                    'hasMore' => $tahun_ajar->currentPage() < $tahun_ajar->lastPage(),
                ],
            ],
        ]);
    
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
