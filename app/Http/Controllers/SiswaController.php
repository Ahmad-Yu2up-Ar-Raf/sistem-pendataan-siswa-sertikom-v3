<?php

namespace App\Http\Controllers;

use App\Enums\StatusEnums;
use App\Models\Siswa;
use App\Models\TahunAjar;
use Illuminate\Http\Request;
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
        $jenis_kelamin = $request->input('jenis_kelamin');
        

    
        $query = Siswa::query();
    
    
       
      
    
    
        if ($search) {
            $query->where(function($q) use ($search) {
                $searchLower = strtolower($search);
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$searchLower}%"]);
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
    
        if ($jenis_kelamin) {
            if (is_array($jenis_kelamin)) {
                $query->whereIn('jenis_kelamin', $jenis_kelamin);
            } elseif (is_string($jenis_kelamin)) {
                $jenis_kelaminArray = explode(',', $jenis_kelamin);
                $query->whereIn('jenis_kelamin', $jenis_kelaminArray);
            }
        }
    
    
        $siswa = $query->orderBy('created_at', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);
    
    
        $siswa->through(function ($item) {
           
    
            return [
                ...$item->toArray(),
                'foto' => $item->cover_image ? url($item->cover_image) : null,
              
              
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
    public function store(Request $request)
    {
        //
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
    public function update(Request $request, Siswa $siswa)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Siswa $siswa)
    {
        //
    }
}
