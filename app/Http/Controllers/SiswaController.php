<?php

namespace App\Http\Controllers;

use App\Http\Requests\SiswaStoreRequest;
use App\Http\Requests\SiswaUpdateRequest;
use App\Models\Siswa;
use App\Services\FileUploadService; // ← TAMBAH INI
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SiswaController extends Controller
{
    protected FileUploadService $fileUploadService; // ← TAMBAH INI

    // ← TAMBAH CONSTRUCTOR
    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Store a newly created siswa
     */
    public function store(SiswaStoreRequest $request)
    {
        DB::beginTransaction();
        
        try {
            $validated = $request->validated();
            
            // ===== HANDLE FOTO UPLOAD =====
            $photoData = $this->fileUploadService->handlePhotoUpload($request, 'siswa'); // ← FIX INI
            
            if ($photoData) {
                $validated['foto'] = $photoData['foto'];
                $validated['raw_foto'] = $photoData['raw_foto'];
            }
            
            $validated['created_by'] = Auth::id();
            $validated['updated_by'] = Auth::id();
            
            $siswa = Siswa::create($validated);
            
            DB::commit();
            
            return redirect()
                ->route('dashboard.siswa.index')
                ->with('success', 'Siswa berhasil ditambahkan');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Siswa creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return redirect()
                ->back()
                ->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Update existing siswa
     */
    public function update(SiswaUpdateRequest $request, Siswa $siswa)
    {
        DB::beginTransaction();
        
        try {
            $validated = $request->validated();
            
            // ===== HANDLE FOTO UPLOAD (if new file) =====
            if ($request->hasFile('foto')) {
                // Delete old files
                $this->fileUploadService->deleteOldPhotos($request, 'siswa'); // ← FIX INI
                
                // Upload new files
                $photoData = $this->fileUploadService->handlePhotoUpload($request, 'siswa'); // ← FIX INI
                
                if ($photoData) {
                    $validated['foto'] = $photoData['foto'];
                    $validated['raw_foto'] = $photoData['raw_foto'];
                }
            }
            
            $validated['updated_by'] = Auth::id();
            
            $siswa->update($validated);
            
            DB::commit();
            
            return redirect()
                ->route('dashboard.siswa.index')
                ->with('success', 'Siswa berhasil diperbarui');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Siswa update failed', [
                'siswa_id' => $siswa->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return redirect()
                ->back()
                ->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()])
                ->withInput();
        }
    }

 

/**
 * Display a listing of siswa with advanced filtering
 * Supports: enum filters (status, agama, jenis_kelamin), 
 * relation filters (jurusan, kelas, tahun_ajar), date range, search
 */
public function index(Request $request)
{
    $perPage = $request->input('perPage', 10);
    $search = $request->input('search');
    $page = $request->input('page', 1);
    
    // Initialize query with relations and counts
    $query = Siswa::orderByDesc('updated_at')
        ->with(['jurusan', 'tahunMasuk', 'kelasAktif', 'kelas']);

    // ==========================================
    // SEARCH FILTER
    // ==========================================
    if ($search) {
        $query->where(function($q) use ($search) {
            $searchLower = strtolower($search);
            $q->whereRaw('LOWER(nama_lengkap) LIKE ?', ["%{$searchLower}%"])
              ->orWhereRaw('LOWER(nisn) LIKE ?', ["%{$searchLower}%"])
              ->orWhereRaw('LOWER(nis) LIKE ?', ["%{$searchLower}%"]);
        });
    }

    // ==========================================
    // ENUM FILTERS (Multi-select arrays)
    // ==========================================
    
    // Status filter
    if ($request->filled('status')) {
        $statusArray = is_array($request->input('status')) 
            ? $request->input('status') 
            : explode(',', $request->input('status'));
        $query->whereIn('status', $statusArray);
    }

    // Agama filter
    if ($request->filled('agama')) {
        $agamaArray = is_array($request->input('agama')) 
            ? $request->input('agama') 
            : explode(',', $request->input('agama'));
        $query->whereIn('agama', $agamaArray);
    }

    // Jenis Kelamin filter
    if ($request->filled('jenis_kelamin')) {
        $jenisKelaminArray = is_array($request->input('jenis_kelamin')) 
            ? $request->input('jenis_kelamin') 
            : explode(',', $request->input('jenis_kelamin'));
        $query->whereIn('jenis_kelamin', $jenisKelaminArray);
    }

    // ==========================================
    // RELATION FILTERS (Dynamic multi-select)
    // ==========================================
    
    // Jurusan filter
    if ($request->filled('jurusan')) {

        $jurusanIds = (array) $request->input('jurusan');
        $query->whereIn('jurusan_id', $jurusanIds);
    }

    // Kelas filter
    if ($request->filled('kelas')) {
        $kelasIds = (array) $request->input('kelas');
        $query->whereIn('kelas_id', $kelasIds);
    }

    // Tahun Ajar filter
    if ($request->filled('tahun_ajar')) {
        $tahunAjarIds = (array) $request->input('tahun_ajar');
        $query->whereIn('tahun_ajar_id', $tahunAjarIds);
    }

    // ==========================================
    // DATE RANGE FILTER (created_at)
    // ==========================================
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

    // Paginate results
    $siswa = $query->paginate($perPage, ['*'], 'page', $page);

    // Transform foto URLs
    $siswa->through(function ($item) {
        return [
            ...$item->toArray(),
            'foto' => $item->foto ? url($item->foto) : null,
        ];
    });

    return Inertia::render('dashboard/siswa/index', [
        'status' => true,
        'message' => 'Siswa retrieved successfully',
        'data' => [
            'siswa' => $siswa->items() ?? [],
        ],
        'meta' => [
            'filters' => [
                'search' => $search ?? '',
                'status' => $request->input('status', []),
                'agama' => $request->input('agama', []),
                'jenis_kelamin' => $request->input('jenis_kelamin', []),
                'jurusan' => $request->input('jurusan', []),
                'kelas' => $request->input('kelas', []),
                'tahun_ajar' => $request->input('tahun_ajar', []),
                'created_at' => [
                    'from' => $request->input('created_at_from'),
                    'to' => $request->input('created_at_to'),
                ],
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
     * Show single siswa (for edit)
     */
    public function show(Siswa $siswa)
    {
        $siswa->load(['jurusan', 'kelas', 'tahunMasuk']);
        
        return response()->json([
            'status' => true,
            'data' => [
                ...$siswa->toArray(),
                'foto' => $siswa->foto ? url($siswa->foto) : null,
                'raw_foto' => $siswa->raw_foto 
                    ? $this->fileUploadService->transformRawFotoUrls($siswa->raw_foto) // ← FIX INI
                    : null,
            ],
        ]);
    }

    /**
     * Delete siswa
     */
    public function destroy(Request $request)
    {
        $ids = $request->input('ids');
        
        if (empty($ids)) {
            return redirect()
                ->route('dashboard.siswa.index')
                ->with('error', 'Tidak ada siswa yang dipilih untuk dihapus.');
        }

        $siswa = Siswa::whereIn('id', $ids)->get();
        
        if ($siswa->count() !== count($ids)) {
            return redirect()
                ->route('dashboard.siswa.index')
                ->with('error', 'Unauthorized access atau siswa tidak ditemukan.');
        }

        try {
            DB::beginTransaction();

            foreach ($siswa as $item) {
                // Delete photos
                $this->fileUploadService->deleteOldPhotos($item); // ← FIX INI
                
                // Delete siswa
                $item->delete();
            }

            DB::commit();

            $deletedCount = $siswa->count();
            
            return redirect()
                ->route('dashboard.siswa.index')
                ->with('success', "{$deletedCount} Siswa berhasil dihapus beserta file terkait.");

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Siswa deletion error', ['error' => $e->getMessage()]);
            
            return redirect()
                ->route('dashboard.siswa.index')
                ->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }

    /**
     * Update status siswa (bulk)
     */
    public function statusUpdate(Request $request)
    {
        $ids = $request->input('ids');
        $value = $request->input('value');
        $colum = $request->input('colum');
        
        if (empty($ids)) {
            return redirect()->back()
                ->with('error', 'Tidak ada siswa yang dipilih.');
        }

        $siswa = Siswa::whereIn('id', $ids)->get();
        
        if ($siswa->count() !== count($ids)) {
            return redirect()->back()
                ->with('error', 'Unauthorized access atau siswa tidak ditemukan.');
        }

        try {
            DB::beginTransaction();
              
            foreach ($siswa as $item) {
                $item->update([$colum => $value]);
            }
            
            DB::commit();

            $updatedCount = $siswa->count();
            return redirect()->back()
                ->with('success', "{$updatedCount} Siswa berhasil diperbarui.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Siswa status update error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}