<?php

namespace App\Http\Controllers;

use App\Models\Jurusan;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\TahunAjar;
use Illuminate\Http\Request;
 
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OverviewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
  public function index()
    {
  $recordTahunAjar = TahunAjar::all() ;
  
 
   $recordJurusan = Jurusan::all() ;
   $recordSiswa = Siswa::all() ;
   $recordKelas = Kelas::all() ;

        $tahunAjarCounts = TahunAjar::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as tahunAjar')) 
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get()
            ->keyBy('date');
        $siswaCounts = Siswa::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as siswa')) 
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get()
            ->keyBy('date');

        $jurusanCounts = Jurusan::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as jurusan')) 
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get()
            ->keyBy('date');
        $kelasCounts = Kelas::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as kelas')) 
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get()
            ->keyBy('date');

           $topJurusan = Jurusan::select('nama_jurusan')
            ->withCount('siswas')
            ->orderByDesc('siswas_count')
            ->take(5)
            ->get();


        // Gabungkan data tahunAjar dan jurusan berdasarkan tanggal
        $allDates = collect($tahunAjarCounts->keys())->merge($jurusanCounts->keys())->merge($siswaCounts->keys())->merge($kelasCounts->keys())->unique();
        
        $counts = $allDates->map(function ($date) use ($tahunAjarCounts, $jurusanCounts , $siswaCounts , $kelasCounts) {
            return [
                'date' => $date,
                'tahun_ajar' => $tahunAjarCounts->get($date)->tahunAjar ?? 0,
                'jurusan' => $jurusanCounts->get($date)->jurusan ?? 0,
                'siswa' => $siswaCounts->get($date)->siswa ?? 0,
                'kelas' => $kelasCounts->get($date)->kelas ?? 0,
               
            ];
        })->values();




$statusCount = $recordTahunAjar->groupBy('status')->map(function ($group) {
    return $group->count();   });
$StatusJurusanCount = $recordJurusan->groupBy('status')->map(function ($group) {
    return $group->count();   });
$siswaCounts = $recordSiswa->groupBy('status')->map(function ($group) {
    return $group->count();   });
$kelasCounts = $recordKelas->groupBy('status')->map(function ($group) {
    return $group->count();   });

 
 

          return Inertia::render('dashboard/index',[
                'reports' => [
                    'totalTahunAjar' => $recordTahunAjar->count(),
                    'totalJurusan' => $recordJurusan->count(),
                    'totalSiswa' => $recordSiswa->count(),
                    'totalKelas' => $recordKelas->count(),

                    'topJurusan' => $topJurusan,

                    'KelastatusCount' => $kelasCounts,
                    'SiswastatusCount' => $siswaCounts,
                    'TahunAjarstatusCount' => $statusCount,
                    'StatusJurusanCount' => $StatusJurusanCount,
                    'countsByDate' => $counts,
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
