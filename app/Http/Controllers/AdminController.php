<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdminStoreRequest;
use App\Http\Requests\AdminUpdateRequest;
use App\Models\User;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class AdminController extends Controller
{
    protected FileUploadService $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->input('perPage', 10);
        $search = $request->input('search');
        $page = (int) $request->input('page', 1);

        $query = User::with(['roles' => function($q) {
            $q->select('roles.id', 'roles.name', 'roles.guard_name');
        }])->orderByDesc('updated_at');

        if (!empty($search)) {
            $searchLower = strtolower($search);
            $query->where(function ($q) use ($searchLower) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(email) LIKE ?', ["%{$searchLower}%"]);
            });
        }

        if ($request->filled('roles')) {
            $roleArray = is_array($request->input('roles')) ? $request->input('roles') : explode(',', $request->input('roles'));
            $query->whereHas('roles', function ($q) use ($roleArray) {
                $q->whereIn('name', $roleArray);
            });
        }

        if ($request->filled('created_at_from')) {
            $query->whereDate('created_at', '>=', $request->input('created_at_from'));
        }
        if ($request->filled('created_at_to')) {
            $query->whereDate('created_at', '<=', $request->input('created_at_to'));
        }

        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

        $paginator->getCollection()->transform(function ($item) {
            $roles = $item->roles->pluck('name')->toArray();
            return [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'foto' => $item->foto ? url($item->foto) : null,
                'roles' => $roles,
                'primary_role' => $roles[0] ?? null,
                'created_at' => optional($item->created_at)->toDateTimeString(),
                'updated_at' => optional($item->updated_at)->toDateTimeString(),
            ];
        });

        return Inertia::render('dashboard/admin/index', [
            'message' => 'User retrieved successfully',
            'data' => [
                'users' => $paginator->items(),
            ],
            'meta' => [
                'pagination' => [
                    'total' => $paginator->total(),
                    'currentPage' => $paginator->currentPage(),
                    'perPage' => $paginator->perPage(),
                    'lastPage' => $paginator->lastPage(),
                ],
            ],
        ]);
    }

    /**
     * Get roles data for select/dropdown
     */
    public function json_data_role(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $page = $request->input('page', 1);

        $query = Role::select(['id', 'name', 'guard_name']);

        if ($search) {
            $query->where(function($q) use ($search) {
                $searchLower = strtolower($search);
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(guard_name) LIKE ?', ["%{$searchLower}%"]);
            });
        }

        $roles = $query->orderByDesc('updated_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'status' => true,
            'message' => 'Role retrieved successfully',
            'data' => $roles->items(),
            'meta' => [
                'filters' => [
                    'search' => $search,
                    'perPage' => $perPage,
                ],
                'pagination' => [
                    'total' => $roles->total(),
                    'currentPage' => $roles->currentPage(),
                    'perPage' => $roles->perPage(),
                    'lastPage' => $roles->lastPage(),
                    'hasMore' => $roles->hasMorePages(),
                ],
            ],
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(AdminStoreRequest $request)
    {
 
        return DB::transaction(function () use ($request) {
            // Handle photo upload with 'users' directory
            $data = $request->validated();
            $photoData = $this->fileUploadService->handlePhotoUpload($request, 'users');
            
            $user = User::create([
                ...$data,
              
                'password' => Hash::make($data['password']),
                'foto' => $photoData['foto'] ?? null,
                'raw_foto' => $photoData['raw_foto'] ?? null,
            ]);

            // Assign role
            $user->assignRole($data['roles']);

            // Send password reset link
            Password::sendResetLink(['email' => $user->email]);

            return redirect()->back()->with('success', 'User berhasil dibuat. Link reset password telah dikirim.');
        });
    }

    /**
     * Display the specified user
     */
    public function show(string $id)
    {
        $user = User::with(['roles' => function($q) {
            $q->select('roles.id', 'roles.name', 'roles.guard_name');
        }])->findOrFail($id);

        // Transform raw_foto URLs if exists
        $rawFoto = $user->raw_foto ? $this->fileUploadService->transformRawFotoUrls($user->raw_foto) : null;

        return Inertia::render('dashboard/admin/show', [
            'message' => 'User retrieved successfully',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => optional($user->email_verified_at)->toDateTimeString(),
                    'foto' => $user->foto ? url($user->foto) : null,
                    'raw_foto' => $rawFoto,
                    'roles' => $user->roles->pluck('name')->toArray(),
                    'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
                    'created_at' => optional($user->created_at)->toDateTimeString(),
                    'updated_at' => optional($user->updated_at)->toDateTimeString(),
                ],
            ],
        ]);
    }

    /**
     * Update the specified user
     */
public function update(AdminUpdateRequest $request, string $id)
{
    $user = User::findOrFail($id);

    return DB::transaction(function () use ($request, $user) {
        $data = $request->validated();

        // HANDLE FOTO (sama seperti implementasimu)
        if ($request->hasFile('foto')) {
            $this->fileUploadService->deleteOldPhotos($user);
            $photoData = $this->fileUploadService->handlePhotoUpload($request, 'users');
            if (!empty($photoData)) {
                $data['foto'] = $photoData['foto'] ?? null;
                $data['raw_foto'] = $photoData['raw_foto'] ?? null;
            }
        }

        // HANDLE PASSWORD MANUAL (admin memasukkan password baru)
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        // AMBIL DAN HAPUS ROLES DARI PAYLOAD
        $roles = $data['roles'] ?? null;
        unset($data['roles']);

        // Update user fields
        $user->update($data);

        // SYNC ROLES jika ada
        if ($roles) {
            $rolesArray = is_array($roles)
                ? $roles
                : array_filter(array_map('trim', explode(',', $roles)));
            $user->syncRoles($rolesArray);
        }

        // Opsi: generate temporary password (kembalikan plain sekali)
        if ($request->boolean('generate_temp_password')) {
            $plain = Str::random(10); // atau gunakan length custom
            $user->password = Hash::make($plain);
            $user->save();

            // optional: simpan log/audit di sini

            // kembalikan plain password sekali (flash) — tampilkan di UI, jangan simpan di DB
            return redirect()->back()->with('success', 'User berhasil diperbarui.')
                                   ->with('temp_password', $plain);
        }

        // Opsi: kirim reset link (lebih aman)
        if ($request->boolean('send_reset_link')) {
            $status = Password::sendResetLink(['email' => $user->email]);

            if ($status === Password::RESET_LINK_SENT) {
                return redirect()->back()->with('success', 'Reset link dikirim ke email user.');
            } else {
                return redirect()->back()->with('error', 'Gagal mengirim reset link.');
            }
        }

        return redirect()->back()->with('success', 'User berhasil diperbarui.');
    });
}

    /**
     * Remove the specified users (bulk delete)
     */
    public function destroy(Request $request)
    {
        $ids = $request->input('ids');
        
        if (empty($ids)) {
            return redirect()
                ->route('dashboard.admin.index')
                ->with('error', 'Tidak ada users yang dipilih untuk dihapus.');
        }

        $users = User::whereIn('id', $ids)->get();
        
        if ($users->count() !== count($ids)) {
            return redirect()
                ->route('dashboard.admin.index')
                ->with('error', 'Unauthorized access atau users tidak ditemukan.');
        }

        try {
            DB::beginTransaction();

            foreach ($users as $user) {
                // Delete photos
                $this->fileUploadService->deleteOldPhotos($user);
                
                // Delete user
                $user->delete();
            }

            DB::commit();

            $deletedCount = $users->count();
            
            return redirect()
                ->route('dashboard.admin.index')
                ->with('success', "{$deletedCount} Users berhasil dihapus beserta file terkait.");

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Users deletion error', ['error' => $e->getMessage()]);
            
            return redirect()
                ->route('dashboard.admin.index')
                ->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }

    /**
     * Update roles for multiple users (bulk operation)
     */
    public function bulkUpdateRoles(Request $request)
    {
        $actor = $request->user();
        if (!$actor || (!$actor->hasRole('super_admin') && !$actor->hasPermissionTo('users.edit'))) {
            return redirect()->back()->with('error', 'Anda tidak mempunyai hak untuk melakukan aksi ini.');
        }

        $ids = $request->input('ids', []);
        $rolesInput = $request->input('roles');

        if (empty($ids) || !is_array($ids)) {
            return redirect()->back()->with('error', 'Tidak ada users yang dipilih atau format ids salah.');
        }

        if (empty($rolesInput)) {
            return redirect()->back()->with('error', 'Role belum diberikan.');
        }

        $rolesArray = is_array($rolesInput) ? $rolesInput : array_map('trim', explode(',', $rolesInput));

        $existingRoles = Role::whereIn('name', $rolesArray)->pluck('name')->toArray();
        $missing = array_diff($rolesArray, $existingRoles);

        if (!empty($missing)) {
            return redirect()->back()->with('error', 'Role tidak ditemukan: ' . implode(', ', $missing));
        }

        $users = User::whereIn('id', $ids)->get();

        if ($users->count() !== count($ids)) {
            return redirect()->back()->with('error', 'Beberapa user tidak ditemukan atau unauthorized access.');
        }

        try {
            DB::beginTransaction();

            foreach ($users as $user) {
                $user->syncRoles($rolesArray);
            }

            DB::commit();

            return redirect()->back()->with('success', $users->count() . ' user berhasil diperbarui role-nya.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("bulkUpdateRoles error: {$e->getMessage()}", [
                'actor_id' => $actor?->id,
                'ids' => $ids,
                'roles' => $rolesArray,
            ]);

            return redirect()->back()->with('error', 'Terjadi kesalahan saat mengupdate role: ' . $e->getMessage());
        }
    }
}