<?php

namespace App\Http\Controllers;

use App\Enums\StatusEnums;
use App\Http\Requests\KelasStoreRequest;
use App\Http\Requests\KelasUpdateRequest;
use App\Models\Kelas;
use App\Models\TahunAjar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class KelasController extends Controller
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
        $tingkat = $request->input('tingkat');
       
        

    
        $query = Kelas::query()->orderByDesc('updated_at')->with(['jurusan' , 'tahunAjar'])->withCount(['siswasAktif' , 'siswa']);
    
        
   

    
        if ($search) {
            $query->where(function($q) use ($search) {
                $searchLower = strtolower($search);
                $q->whereRaw('LOWER(nama_kelas) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(wali_kelas) LIKE ?', ["%{$searchLower}%"]);
            });
        }
    
     
          if ($request->filled('status')) {
        $statusArray = is_array($status) ? $status : explode(',', $status);
        $query->whereIn('status', $statusArray);
    }
          if ($request->filled('tingkat')) {
        $tingkatArray = is_array($tingkat) ? $tingkat : explode(',', $tingkat);
        $query->whereIn('tingkat', $tingkatArray);
    }

   
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
        $kelas = $query
            ->paginate($perPage, ['*'], 'page', $page);
    
    
        $kelas->through(function ($item) {
           
    
            return [
                ...$item->toArray(),
             
              
              
            ];
        });
        return Inertia::render('dashboard/kelas/index',[
            'status' => true,
            'message' => 'kelas retrieved successfully',
            'data' => [
                'kelas' => $kelas->items() ?? [],
            ],
            'meta' => [
                'filters' => [
                    'search' => $search ?? '',
                    'status' => $status ?? [],
                ],
                'pagination' => [
                    'total' => $kelas->total(),
                    'currentPage' => $kelas->currentPage(),
                    'perPage' => $kelas->perPage(),
                    'lastPage' => $kelas->lastPage(),
                    'hasMore' => $kelas->currentPage() < $kelas->lastPage(),
                ],
            ],
        ]);
    
    }



        public function json_data(Request $request)
    {
        $perPage = $request->input('perPage', 10); // ubah default jadi 10
        $search = $request->input('search', ''); // tambah default empty string
        $page = $request->input('page', 1);

        $query = Kelas::select(['id', 'nama_kelas', 'tingkat']) 
            ->where('status', StatusEnums::Aktif->value);

        // Search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $searchLower = strtolower($search);
                $q->whereRaw('LOWER(nama_kelas) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(tingkat) LIKE ?', ["%{$searchLower}%"]);
            });
        }

        $Kelas = $query->orderByDesc('updated_at') // ubah order by
            ->paginate($perPage, ['*'], 'page', $page);

        // PERBAIKI: Return struktur yang benar
        return response()->json([
            'status' => true,
            'message' => 'Kelas retrieved successfully',
            'data' => $Kelas->items(), // ← LANGSUNG ITEMS, bukan nested
            'meta' => [
                'filters' => [
                    'search' => $search,
                    'perPage' => $perPage,
                ],
                'pagination' => [
                    'total' => $Kelas->total(),
                    'currentPage' => $Kelas->currentPage(),
                    'perPage' => $Kelas->perPage(),
                    'lastPage' => $Kelas->lastPage(),
                    'hasMore' => $Kelas->hasMorePages(),
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
  public function store(KelasStoreRequest $request)
    {
        try {
            $product = Kelas::create([
                ...$request->validated(),
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
                    
            ]);

        

            return redirect()->route('dashboard.kelas.index')
                ->with('success', "Data Kelas Berhasil Di buat");

        } catch (\Exception $e) {
            Log::error('Kelas creation error: ' . $e->getMessage());
            
            return back()->withErrors([
                'error' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Kelas $kelas)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kelas $kelas)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(KelasUpdateRequest $request, Kelas $kelas)
    {
        try {

       
     
            DB::beginTransaction();

            $validatedData = $request->validated();

          

            // Update kelas data (showcase_images will be handled by observer)
            $kelas->update($validatedData);

            DB::commit();
     
     return redirect()->route('dashboard.kelas.index')
                ->with('success');

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Kelas update error: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Failed to update kelas: ' . $e->getMessage()
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
            return redirect()->route('dashboard.kelas.index')
                ->with('error', 'Tidak ada event yang dipilih untuk dihapus.');
        }

        // Validasi apakah semua ID milik user yang sedang login
        $kelas = Kelas::whereIn('id', $ids)->get();
        if ($kelas->count() !== count($ids)) {
            return redirect()->route('dashboard.kelas.index')
                ->with('error', 'Unauthorized access atau event tidak ditemukan.');
        }

        try {
            DB::beginTransaction();
              
            // SOLUSI: Delete satu per satu agar Observer terpicu
            foreach ($kelas as $event) {
                // if ($event->gambar && Storage::disk('public')->exists(str_replace('storage/', '', $event->gambar))) {
                //     Storage::disk('public')->delete(str_replace('storage/', '', $event->gambar));
                // }
        
                $event->delete(); // Ini akan trigger observer kelas
            }
            
            DB::commit();

            $deletedCount = $kelas->count();
            return redirect()->route('dashboard.kelas.index')
                ->with('success', "{$deletedCount} Kelas berhasil dihapus beserta semua file terkait.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Kelas deletion error: ' . $e->getMessage());
            return redirect()->route('dashboard.kelas.index')
                ->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }

    public function statusUpdate(Request $request)
    {
   
        $ids = $request->input('ids');
        $value = $request->input('value');
        $colum = $request->input('colum');
        
        if (empty($ids)) {
            return redirect()->route('dashboard.kelas.index')
                ->with('error', 'Tidak ada event yang dipilih untuk dihapus.');
        }

        // Validasi apakah semua ID milik user yang sedang login
        $kelas = Kelas::whereIn('id', $ids)->get();
        if ($kelas->count() !== count($ids)) {
            return redirect()->route('dashboard.kelas.index')
                ->with('error', 'Unauthorized access atau event tidak ditemukan.');
        }

        try {
            DB::beginTransaction();
              
             foreach ($kelas as $event) {
                $event->update([$colum => $value]);
            }

   

            
            
            DB::commit();
            

            $deletedCount = $kelas->count();
            return redirect()->route('dashboard.kelas.index')
                ->with('success', "{$deletedCount} Kelas berhasil dihapus beserta semua file terkait.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Kelas deletion error: ' . $e->getMessage());
            return redirect()->route('dashboard.kelas.index')
                ->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }
}
