<?php

namespace App\Http\Controllers;

use App\Enums\StatusEnums;
use App\Http\Requests\JurusanStoreRequest;
use App\Http\Requests\JurusanUpdateRequest;
use App\Models\Jurusan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class JurusanController extends Controller
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
       
        

    
        $query = Jurusan::query()->orderByDesc('updated_at')->withCount('kelases')->withCount('siswas');
    
    
       
      
    
    
        if ($search) {
            $query->where(function($q) use ($search) {
                $searchLower = strtolower($search);
                $q->whereRaw('LOWER(nama_jurusan) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(kode_jurusan) LIKE ?', ["%{$searchLower}%"]);
            });
        }
    
     
        if ($status) {
            if (is_array($status)) {
                $query->whereIn('status', $status);
            } elseif (is_string($status)) {
                $statusArray = explode(',', $status);
                $query->whereIn('status', $statusArray);
            }
        }
    
   
    
        $jurusan = $query
            ->paginate($perPage, ['*'], 'page', $page);
    
    
        $jurusan->through(function ($item) {
           
    
            return [
                ...$item->toArray(),
             
              
              
            ];
        });
        return Inertia::render('dashboard/jurusan/index',[
            'status' => true,
            'message' => 'jurusan retrieved successfully',
            'data' => [
                'jurusan' => $jurusan->items() ?? [],
            ],
            'meta' => [
                'filters' => [
                    'search' => $search ?? '',
                    'status' => $status ?? [],
                ],
                'pagination' => [
                    'total' => $jurusan->total(),
                    'currentPage' => $jurusan->currentPage(),
                    'perPage' => $jurusan->perPage(),
                    'lastPage' => $jurusan->lastPage(),
                    'hasMore' => $jurusan->currentPage() < $jurusan->lastPage(),
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


          public function json_data(Request $request)
    {
        $perPage = $request->input('perPage', 10); // ubah default jadi 10
        $search = $request->input('search', ''); // tambah default empty string
        $page = $request->input('page', 1);

        $query = Jurusan::select(['id', 'nama_jurusan', 'kode_jurusan']) // tambah kode_jurusan
            ->where('status', StatusEnums::Aktif->value);

        // Search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $searchLower = strtolower($search);
                $q->whereRaw('LOWER(nama_jurusan) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(kode_jurusan) LIKE ?', ["%{$searchLower}%"]);
            });
        }

        $Jurusan = $query->orderByDesc('updated_at') // ubah order by
            ->paginate($perPage, ['*'], 'page', $page);

        // PERBAIKI: Return struktur yang benar
        return response()->json([
            'status' => true,
            'message' => 'Jurusan retrieved successfully',
            'data' => $Jurusan->items(), // ← LANGSUNG ITEMS, bukan nested
            'meta' => [
                'filters' => [
                    'search' => $search,
                    'perPage' => $perPage,
                ],
                'pagination' => [
                    'total' => $Jurusan->total(),
                    'currentPage' => $Jurusan->currentPage(),
                    'perPage' => $Jurusan->perPage(),
                    'lastPage' => $Jurusan->lastPage(),
                    'hasMore' => $Jurusan->hasMorePages(),
                ],
            ],
        ]);
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
   public function update(JurusanUpdateRequest $request, Jurusan $jurusan)
    {
        try {

      
     
            DB::beginTransaction();

            $validatedData = $request->validated();

          

            // Update jurusan data (showcase_images will be handled by observer)
            $jurusan->update($validatedData);

            DB::commit();
     
     return redirect()->route('dashboard.jurusan.index')
                ->with('success');

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Jurusan update error: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Failed to update jurusan: ' . $e->getMessage()
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
            return redirect()->route('dashboard.jurusan.index')
                ->with('error', 'Tidak ada event yang dipilih untuk dihapus.');
        }

        // Validasi apakah semua ID milik user yang sedang login
        $jurusan = Jurusan::whereIn('id', $ids)->get();
        if ($jurusan->count() !== count($ids)) {
            return redirect()->route('dashboard.jurusan.index')
                ->with('error', 'Unauthorized access atau event tidak ditemukan.');
        }

        try {
            DB::beginTransaction();
              
            // SOLUSI: Delete satu per satu agar Observer terpicu
            foreach ($jurusan as $event) {
                // if ($event->gambar && Storage::disk('public')->exists(str_replace('storage/', '', $event->gambar))) {
                //     Storage::disk('public')->delete(str_replace('storage/', '', $event->gambar));
                // }
        
                $event->delete(); // Ini akan trigger observer jurusan
            }
            
            DB::commit();

            $deletedCount = $jurusan->count();
            return redirect()->route('dashboard.jurusan.index')
                ->with('success', "{$deletedCount} Jurusan berhasil dihapus beserta semua file terkait.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Jurusan deletion error: ' . $e->getMessage());
            return redirect()->route('dashboard.jurusan.index')
                ->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }

    public function statusUpdate(Request $request)
    {
        
        $ids = $request->input('ids');
        $value = $request->input('value');
        $colum = $request->input('colum');
        
        if (empty($ids)) {
            return redirect()->route('dashboard.jurusan.index')
                ->with('error', 'Tidak ada event yang dipilih untuk dihapus.');
        }

        // Validasi apakah semua ID milik user yang sedang login
        $jurusan = Jurusan::whereIn('id', $ids)->get();
        if ($jurusan->count() !== count($ids)) {
            return redirect()->route('dashboard.jurusan.index')
                ->with('error', 'Unauthorized access atau event tidak ditemukan.');
        }

        try {
            DB::beginTransaction();
              
             foreach ($jurusan as $event) {
                $event->update([$colum => $value]);
            }

   

            
            
            DB::commit();
            

            $deletedCount = $jurusan->count();
            return redirect()->route('dashboard.jurusan.index')
                ->with('success', "{$deletedCount} Jurusan berhasil dihapus beserta semua file terkait.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Jurusan deletion error: ' . $e->getMessage());
            return redirect()->route('dashboard.jurusan.index')
                ->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }
}
