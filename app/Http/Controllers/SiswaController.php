<?php

namespace App\Http\Controllers;

use App\Enums\StatusEnums;
use App\Http\Requests\SiswaStoreRequest;
use App\Http\Requests\SiswaUpdateRequest;
use App\Models\Siswa;
use App\Models\TahunAjar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SiswaController extends Controller
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
        $agama = $request->input('agama');
        $jenis_kelamin = $request->input('jenis_kelamin');
        

    
        $query = Siswa::orderByDesc('updated_at')->with('jurusan')->with('tahunMasuk')->with('kelasAktif')->with('kelas')->with('kelasAktif');
    
    
       
      
    
    
        if ($search) {
            $query->where(function($q) use ($search) {
                $searchLower = strtolower($search);
                $q->whereRaw('LOWER(nama_lengkap) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(nisn) LIKE ?', ["%{$searchLower}%"]);
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
    
       
        if ($agama) {
            if (is_array($agama)) {
                $query->whereIn('agama', $agama);
            } elseif (is_string($agama)) {
                $agamaArray = explode(',', $agama);
                $query->whereIn('agama', $agamaArray);
            }
        }
        if ($jenis_kelamin) {
            if (is_array($jenis_kelamin)) {
                $query->whereIn('jenis_kelamin', $jenis_kelamin);
            } elseif (is_string($jenis_kelamin)) {
                $jenis_kelaminArray = explode(',', $jenis_kelamin);
                $query->whereIn('jenis_kelamin', $jenis_kelaminArray);
            }
        }
    
    
        $siswa = $query
            ->paginate($perPage, ['*'], 'page', $page);
    
    
        $siswa->through(function ($item) {
           
    
            return [
                ...$item->toArray(),
                'foto' => $item->foto ? url($item->foto) : null,
              
              
            ];
        });
        return Inertia::render('dashboard/siswa/index',[
            'status' => true,
            'message' => 'Siswa retrieved successfully',
            'data' => [
                'siswa' => $siswa->items() ?? [],
            ],
            'meta' => [
                'filters' => [
                    'search' => $search ?? '',
                    'status' => $status ?? [],
                    'agama' => $agama ?? [],
                    'jenis_kelamin' => $jenis_kelamin ?? [],
                ],
                'pagination' => [
                    'total' => $siswa->total(),
                    'currentPage' => $siswa->currentPage(),
                    'perPage' => $siswa->perPage(),
                    'lastPage' => $siswa->lastPage(),
                    'hasMore' => $siswa->currentPage() < $siswa->lastPage(),
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
public function store(SiswaStoreRequest $request)
{
    DB::beginTransaction();
    try {
        // Ambil validated data sekali saja
        $validated = $request->validated();
        
        // ===== Handle foto: 3 kemungkinan =====
        // 1) UploadedFile via multipart/form-data ($request->hasFile('foto'))
        // 2) Frontend mengirim object/file metadata (array) yang berisi base64 -> $validated['foto']['base64Data']
        // 3) Tidak ada foto (optional)

        if ($request->hasFile('foto')) {
            $file = $request->file('foto'); // instance of UploadedFile
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('siswa/', $filename, 'public');
            $validated['foto'] = 'storage/' . $path;
        } elseif (isset($validated['foto']) && is_array($validated['foto'])) {
            // contoh struktur dari frontend: ['file' => {...}, 'base64Data' => 'data:image/png;base64,....', 'preview'=>..., ...]
            if (!empty($validated['foto']['base64Data'])) {
                $base64 = $validated['foto']['base64Data'];
                // Jika termasuk prefix data:, strip header
                if (preg_match('/^data:\s*image\/(\w+);base64,/', $base64, $m)) {
                    $ext = $m[1];
                    $base64 = substr($base64, strpos($base64, ',') + 1);
                } else {
                    // default ext
                    $ext = 'png';
                }

                $decoded = base64_decode($base64);
                if ($decoded === false) {
                    throw new \RuntimeException("Invalid base64 image data");
                }

                $filename = Str::uuid() . '.' . $ext;
                $path = 'siswa/' . $filename;
                Storage::disk('public')->put($path, $decoded);
                $validated['foto'] = 'storage/' . $path;
            } elseif (!empty($validated['foto']['file']) && $validated['foto']['file'] instanceof \Illuminate\Http\UploadedFile) {
                // in case the front sent a file object in validated (rare)
                $file = $validated['foto']['file'];
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('siswa/', $filename, 'public');
                $validated['foto'] = 'storage/' . $path;
            } else {
                // tidak ada foto usable, hapus agar tidak masuk DB sebagai array
                unset($validated['foto']);
            }
        } else {
            // tidak ada foto, pastikan tidak passing a non-scalar
            if (isset($validated['foto'])) {
                unset($validated['foto']);
            }
        }

        // ===== crop_data: simpan sebagai JSON string atau simpan ke kolom terpisah (recommended: json column) =====
        if (isset($validated['crop_data'])) {
            // simpan ke kolom json, pastikan migration punya kolom 'foto_crop_data' json nullable
            // contoh: $validated['foto_crop_data'] = json_encode($validated['crop_data']);
            // atau jika tabel punya kolom 'crop_data' bertipe json, langsung biarkan sebagai array (Eloquent cast akan handle)
            // Di kasus sekarang kita pindahkan ke 'foto_crop_data' dan hapus 'crop_data'
            $validated['foto_crop_data'] = $validated['crop_data']; // keep as array if model casts to array
            unset($validated['crop_data']);
        }

        // Tambah created_by / updated_by
        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();

        // Pastikan numeric/string types sesuai migration, cast jika perlu:
        // contoh: if nisn should be string, cast: $validated['nisn'] = (string) $validated['nisn'];

        // Create siswa menggunakan $validated yang sudah dimodifikasi (penting)
        $siswa = Siswa::create($validated);

        DB::commit();

        return redirect()->back()->with('success', 'Siswa berhasil ditambahkan');
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Error creating siswa: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString(),
            'validated' => isset($validated) ? $validated : null,
        ]);
        return redirect()
            ->back()
            ->withErrors(['error' => 'Terjadi kesalahan saat menambahkan siswa: ' . $e->getMessage()])
            ->withInput();
    }
}


    /**
     * Display the specified resource.
     */
    public function show(Siswa $siswa)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Siswa $siswa)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(SiswaUpdateRequest $request, Siswa $siswa)
    {
        try {

       
     
            DB::beginTransaction();

            $validatedData = $request->validated();

             if (request()->hasFile('foto')) {
                // Delete old cover image if exists
                if ($siswa->foto && Storage::disk('public')->exists(str_replace('storage/', '', $siswa->foto))) {
                    Storage::disk('public')->delete(str_replace('storage/', '', $siswa->foto));
                }

                $file = request()->file('foto');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('siswa/', $filename, 'public');
                $validatedData['foto'] = 'storage/' . $path;
            }

            // Update siswa data (showcase_images will be handled by observer)
            $siswa->update($validatedData);

            DB::commit();
     
     return redirect()->route('dashboard.siswa.index')
                ->with('success');

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Siswa update error: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Failed to update siswa: ' . $e->getMessage()
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
            return redirect()->route('dashboard.siswa.index')
                ->with('error', 'Tidak ada event yang dipilih untuk dihapus.');
        }

        // Validasi apakah semua ID milik user yang sedang login
        $siswa = Siswa::whereIn('id', $ids)->get();
        if ($siswa->count() !== count($ids)) {
            return redirect()->route('dashboard.siswa.index')
                ->with('error', 'Unauthorized access atau event tidak ditemukan.');
        }

        try {
            DB::beginTransaction();
              
            // SOLUSI: Delete satu per satu agar Observer terpicu
            foreach ($siswa as $event) {
                if ($event->foto && Storage::disk('public')->exists(str_replace('storage/', '', $event->foto))) {
                    Storage::disk('public')->delete(str_replace('storage/', '', $event->foto));
                }
        
                $event->delete(); // Ini akan trigger observer siswa
            }
            
            DB::commit();

            $deletedCount = $siswa->count();
            return redirect()->route('dashboard.siswa.index')
                ->with('success', "{$deletedCount} Siswa berhasil dihapus beserta semua file terkait.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Siswa deletion error: ' . $e->getMessage());
            return redirect()->route('dashboard.siswa.index')
                ->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }

    public function statusUpdate(Request $request)
    {
        
        $ids = $request->input('ids');
        $value = $request->input('value');
        $colum = $request->input('colum');
        
        if (empty($ids)) {
            return redirect()->route('dashboard.siswa.index')
                ->with('error', 'Tidak ada event yang dipilih untuk dihapus.');
        }

        // Validasi apakah semua ID milik user yang sedang login
        $siswa = Siswa::whereIn('id', $ids)->get();
        if ($siswa->count() !== count($ids)) {
            return redirect()->route('dashboard.siswa.index')
                ->with('error', 'Unauthorized access atau event tidak ditemukan.');
        }

        try {
            DB::beginTransaction();
              
             foreach ($siswa as $event) {
                $event->update([$colum => $value]);
            }

   

            
            
            DB::commit();
            

            $deletedCount = $siswa->count();
            return redirect()->route('dashboard.siswa.index')
                ->with('success', "{$deletedCount} Siswa berhasil dihapus beserta semua file terkait.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Siswa deletion error: ' . $e->getMessage());
            return redirect()->route('dashboard.siswa.index')
                ->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }
}
