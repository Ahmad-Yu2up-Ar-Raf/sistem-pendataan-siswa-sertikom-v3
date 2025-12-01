<?php

namespace App\Http\Controllers;
use App\Http\Requests\KelasDetailStoreRequest;
use App\Http\Requests\KelasDetailUpdateStore;
use App\Models\KelasDetail;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class KelasDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(KelasDetailStoreRequest $request)
    {   

           DB::beginTransaction();
        try {


              $validated =   $request->validated();
            
              $user = Siswa::findOrFail($validated["siswa_id"]);
            


            $user->update([
                'tahun_ajar_id' => $validated['tahun_ajar_id'],
                'kelas_id' => $validated['kelas_id'],
            ]);

            KelasDetail::create([
                ...$validated,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
                    
            ]);

                     
            DB::commit();
            return redirect()->back()
                ->with('success', "Data Kelas Detail Berhasil Di Buat");

        } catch (\Exception $e) {
              DB::rollBack();
            Log::error('Kelas Detail creation error: ' . $e->getMessage());
            
            return back()->withErrors([
                'error' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()
            ]);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(KelasDetail $kelasDetail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(KelasDetail $kelasDetail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(KelasDetailUpdateStore $request, KelasDetail $kelasDetail)
    {
        try {

      
     
            DB::beginTransaction();

            $validatedData = $request->validated();

          
     $user = Siswa::findOrFail($validatedData["siswa_id"]);
            


            $user->update([
                'tahun_ajar_id' => $validatedData['tahun_ajar_id'],
                'kelas_id' => $validatedData['kelas_id'],
            ]);
 
            $kelasDetail->update($validatedData);

            DB::commit();
     
     return redirect()->back()
                ->with('success');

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Kelas Detail update error: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Failed to update kelas detail: ' . $e->getMessage()
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
            return redirect()->route('dashboard.kelasDetail.index')
                ->with('error', 'Tidak ada event yang dipilih untuk dihapus.');
        }

        // Validasi apakah semua ID milik user yang sedang login
        $kelasDetail = KelasDetail::whereIn('id', $ids)->get();
        if ($kelasDetail->count() !== count($ids)) {
            return redirect()->route('dashboard.kelasDetail.index')
                ->with('error', 'Unauthorized access atau event tidak ditemukan.');
        }

        try {
            DB::beginTransaction();
              
            // SOLUSI: Delete satu per satu agar Observer terpicu
            foreach ($kelasDetail as $event) {
        
        
                $event->delete();  
            }
            
            DB::commit();

            $deletedCount = $kelasDetail->count();
            return redirect()->route('dashboard.kelasDetail.index')
                ->with('success', "{$deletedCount} KelasDetail berhasil dihapus beserta semua file terkait.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('KelasDetail deletion error: ' . $e->getMessage());
            return redirect()->route('dashboard.kelasDetail.index')
                ->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }
}
