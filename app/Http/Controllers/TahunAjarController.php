<?php

namespace App\Http\Controllers;

use App\Enums\StatusEnums;
use App\Http\Requests\TahunAjarStoreRequest as RequestsTahunAjarStoreRequest;
use App\Http\Requests\TahunAjarUpdateRequest;
use App\Models\TahunAjar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TahunAjarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
 

public function index(Request $request)
{
    $perPage = $request->input('perPage', 10);
    $search = $request->input('search');
    $page = $request->input('page', 1);
    $status = $request->input('status');

    $query = TahunAjar::query()
        ->orderByDesc('updated_at')
        ->withCount(['kelases', 'siswas'])
      ;

    // Search filter
    if ($search) {
        $query->where(function($q) use ($search) {
            $searchLower = strtolower($search);
            $q->whereRaw('LOWER(nama_tahun_ajar) LIKE ?', ["%{$searchLower}%"])
              ->orWhereRaw('LOWER(kode_tahun_ajar) LIKE ?', ["%{$searchLower}%"]);
        });
    }

    // Status enum filter (multi-select)
    if ($request->filled('status')) {
        $statusArray = is_array($status) ? $status : explode(',', $status);
        $query->whereIn('status', $statusArray);
    }

   

    // Date range filter: created_at
    if ($request->filled('created_at_from') || $request->filled('created_at_to')) {
        $from = $request->input('created_at_from');
        $to = $request->input('created_at_to');
        
        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }
    }

    $tahunAjar = $query->paginate($perPage, ['*'], 'page', $page);

    $tahunAjar->through(function ($item) {
        return [
            ...$item->toArray(),
        ];
    });

    return Inertia::render('dashboard/tahun_ajar', [
        'status' => true,
        'message' => 'Tahun Ajar retrieved successfully',
        'data' => [
            'tahunAjar' => $tahunAjar->items() ?? [],
        ],
        'meta' => [
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? [],
                'jurusan' => $request->input('jurusan', []),
                'kelas' => $request->input('kelas', []),
                'created_at' => [
                    'from' => $request->input('created_at_from'),
                    'to' => $request->input('created_at_to'),
                ],
            ],
            'pagination' => [
                'total' => $tahunAjar->total(),
                'currentPage' => $tahunAjar->currentPage(),
                'perPage' => $tahunAjar->perPage(),
                'lastPage' => $tahunAjar->lastPage(),
                'hasMore' => $tahunAjar->currentPage() < $tahunAjar->lastPage(),
            ],
        ],
    ]);
}




    public function json_data(Request $request)
    {
        $perPage = $request->input('perPage', 10); // ubah default jadi 10
        $search = $request->input('search', ''); // tambah default empty string
        $page = $request->input('page', 1);

        $query = TahunAjar::select(['id', 'nama_tahun_ajar', 'kode_tahun_ajar']) // tambah kode_tahun_ajar
            ->where('status', StatusEnums::Aktif->value);

        // Search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $searchLower = strtolower($search);
                $q->whereRaw('LOWER(nama_tahun_ajar) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(kode_tahun_ajar) LIKE ?', ["%{$searchLower}%"]);
            });
        }

        $tahunAjar = $query->orderByDesc('updated_at') // ubah order by
            ->paginate($perPage, ['*'], 'page', $page);

        // PERBAIKI: Return struktur yang benar
        return response()->json([
            'status' => true,
            'message' => 'Tahun Ajar retrieved successfully',
            'data' => $tahunAjar->items(), // ← LANGSUNG ITEMS, bukan nested
            'meta' => [
                'filters' => [
                    'search' => $search,
                    'perPage' => $perPage,
                ],
                'pagination' => [
                    'total' => $tahunAjar->total(),
                    'currentPage' => $tahunAjar->currentPage(),
                    'perPage' => $tahunAjar->perPage(),
                    'lastPage' => $tahunAjar->lastPage(),
                    'hasMore' => $tahunAjar->hasMorePages(),
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
            $tahun_ajar = TahunAjar::create([
                ...$request->validated(),
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
                    
            ]);

          
            return redirect()->route('dashboard.tahun_ajar.index')
                ->with('success', "Data Tahun Ajar Berhasil Di buat");

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
 public function update(TahunAjarUpdateRequest $request, TahunAjar $tahun_ajar)
    {
        
        try {
            DB::beginTransaction();
            
            $validatedData = $request->validated();
            
          

            // Update tahun_ajar data (showcase_images will be handled by observer)
            $tahun_ajar->update($validatedData);

            DB::commit();
     
     return redirect()->route('dashboard.tahun_ajar.index')
                ->with('success');

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Tahun Ajar update error: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Failed to update tahun_ajar: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
 public function destroy(Request $request)
    {
        
        $ids = $request->input('ids');
        if (empty($ids)) {
            return redirect()->route('dashboard.tahun_ajar.index')
                ->with('error', 'Tidak ada event yang dipilih untuk dihapus.');
        }

        // Validasi apakah semua ID milik user yang sedang login
        $tahun_ajar = TahunAjar::whereIn('id', $ids)->get();
        if ($tahun_ajar->count() !== count($ids)) {
            return redirect()->route('dashboard.tahun_ajar.index')
                ->with('error', 'Unauthorized access atau event tidak ditemukan.');
        }

        try {
            DB::beginTransaction();
              
            // SOLUSI: Delete satu per satu agar Observer terpicu
            foreach ($tahun_ajar as $event) {
                // if ($event->gambar && Storage::disk('public')->exists(str_replace('storage/', '', $event->gambar))) {
                //     Storage::disk('public')->delete(str_replace('storage/', '', $event->gambar));
                // }
        
                $event->delete(); // Ini akan trigger observer tahun_ajar
            }
            
            DB::commit();

            $deletedCount = $tahun_ajar->count();
            return redirect()->route('dashboard.tahun_ajar.index')
                ->with('success', "{$deletedCount} TahunAjar berhasil dihapus beserta semua file terkait.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('TahunAjar deletion error: ' . $e->getMessage());
            return redirect()->route('dashboard.tahun_ajar.index')
                ->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }

    public function statusUpdate(Request $request)
    {
        
        $ids = $request->input('ids');
        $value = $request->input('value');
        $colum = $request->input('colum');
        
        if (empty($ids)) {
            return redirect()->route('dashboard.tahun_ajar.index')
                ->with('error', 'Tidak ada event yang dipilih untuk dihapus.');
        }

        // Validasi apakah semua ID milik user yang sedang login
        $tahun_ajar = TahunAjar::whereIn('id', $ids)->get();
        if ($tahun_ajar->count() !== count($ids)) {
            return redirect()->route('dashboard.tahun_ajar.index')
                ->with('error', 'Unauthorized access atau event tidak ditemukan.');
        }

        try {
            DB::beginTransaction();
              
             foreach ($tahun_ajar as $event) {
                $event->update([$colum => $value]);
            }

   

            
            
            DB::commit();
            

            $deletedCount = $tahun_ajar->count();
            return redirect()->route('dashboard.tahun_ajar.index')
                ->with('success', "{$deletedCount} TahunAjar berhasil dihapus beserta semua file terkait.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('TahunAjar deletion error: ' . $e->getMessage());
            return redirect()->route('dashboard.tahun_ajar.index')
                ->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }
}
