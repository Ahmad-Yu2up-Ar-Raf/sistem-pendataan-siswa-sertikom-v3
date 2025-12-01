<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class FileUploadService
{
    /**
     * Handle photo upload - hanya simpan 1 file (cropped) di 1 folder
     * 
     * @param Request $request
     * @param string $baseDir Directory path (e.g., 'siswa', 'users', 'posts')
     * @return array|null ['foto' => string, 'raw_foto' => array] or null
     */
    public function handlePhotoUpload(Request $request, string $baseDir = 'uploads'): ?array
    {
        if (!$request->hasFile('foto')) {
            return null;
        }
        
        $disk = 'public';
        
        // ===== 1. UPLOAD CROPPED FILE SAJA (main foto) =====
        $croppedFile = $request->file('foto');
        
        // Validate it's an image
        if (!$this->isValidImage($croppedFile)) {
            throw new \RuntimeException('Invalid image file');
        }
        
        // Simpan langsung di folder baseDir (tanpa subfolder)
        $croppedFilename = Str::uuid() . '.jpg';
        $croppedPath = $croppedFile->storeAs($baseDir, $croppedFilename, $disk);
        $croppedUrl = Storage::url($croppedPath);
        
        // ===== 2. PARSE CROP METADATA (optional, untuk info aja) =====
        $cropMetadata = null;
        
        if ($request->has('foto_crop_data')) {
            try {
                $cropMetadata = json_decode($request->input('foto_crop_data'), true);
            } catch (\Exception $e) {
                Log::warning('Failed to parse foto_crop_data', ['error' => $e->getMessage()]);
            }
        }
        
        // ===== 3. BUILD raw_foto STRUCTURE (simplified) =====
        $rawFoto = [
            'url' => $croppedUrl,
            'path' => $croppedPath,
            'cropData' => $cropMetadata['cropData'] ?? null,
            'original_name' => $croppedFile->getClientOriginalName(),
            'size' => $croppedFile->getSize(),
            'mime' => $croppedFile->getMimeType(),
        ];
        
        return [
            'foto' => $croppedUrl,
            'raw_foto' => $rawFoto,
        ];
    }

    /**
     * Validate uploaded file is a real image
     * 
     * @param UploadedFile|null $file
     * @return bool
     */
    public function isValidImage($file): bool
    {
        if (!$file instanceof UploadedFile) {
            return false;
        }

        $validMimes = ['image/jpeg', 'image/jpg', 'image/png'];
        
        if (!in_array($file->getMimeType(), $validMimes)) {
            return false;
        }
        
        try {
            $imageInfo = @getimagesize($file->getRealPath());
            return $imageInfo !== false;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Delete old photo files dari model (FIXED - hapus semua file)
     * 
     * @param mixed $model Model dengan foto & raw_foto properties
     * @return void
     */
    public function deleteOldPhotos($model): void
    {
        $disk = 'public';
        
        // ===== 1. DELETE MAIN FOTO =====
        if ($model->foto) {
            $path = str_replace('/storage/', '', $model->foto);
            
            if (Storage::disk($disk)->exists($path)) {
                Storage::disk($disk)->delete($path);
                Log::info("✅ Deleted main photo: {$path}");
            } else {
                Log::warning("⚠️ Main photo not found: {$path}");
            }
        }
        
        // ===== 2. DELETE FILE DARI RAW_FOTO (jaga-jaga kalo ada struktur lama) =====
        if ($model->raw_foto) {
            $rawFoto = is_array($model->raw_foto) 
                ? $model->raw_foto 
                : json_decode($model->raw_foto, true);
            
            // Struktur baru (1 file)
            if (isset($rawFoto['path'])) {
                if (Storage::disk($disk)->exists($rawFoto['path'])) {
                    Storage::disk($disk)->delete($rawFoto['path']);
                    Log::info("✅ Deleted photo from raw_foto: {$rawFoto['path']}");
                }
            }
            
            // Struktur lama (2 files) - backward compatibility
            if (isset($rawFoto['file']['path'])) {
                if (Storage::disk($disk)->exists($rawFoto['file']['path'])) {
                    Storage::disk($disk)->delete($rawFoto['file']['path']);
                    Log::info("✅ Deleted original photo: {$rawFoto['file']['path']}");
                }
            }
            
            if (isset($rawFoto['croppedBlob']['path'])) {
                if (Storage::disk($disk)->exists($rawFoto['croppedBlob']['path'])) {
                    Storage::disk($disk)->delete($rawFoto['croppedBlob']['path']);
                    Log::info("✅ Deleted cropped photo: {$rawFoto['croppedBlob']['path']}");
                }
            }
        }
    }

    /**
     * Transform raw_foto paths to full URLs untuk frontend
     * 
     * @param mixed $rawFoto
     * @return array|null
     */
    public function transformRawFotoUrls($rawFoto): ?array
    {
        if (!$rawFoto) {
            return null;
        }

        if (!is_array($rawFoto)) {
            $rawFoto = json_decode($rawFoto, true);
        }

        if (!is_array($rawFoto)) {
            return null;
        }

        // Transform URL (struktur baru)
        if (isset($rawFoto['url']) && !str_starts_with($rawFoto['url'], 'http')) {
            $rawFoto['url'] = url($rawFoto['url']);
        }

        // Backward compatibility untuk struktur lama
        if (isset($rawFoto['file']['url']) && !str_starts_with($rawFoto['file']['url'], 'http')) {
            $rawFoto['file']['url'] = url($rawFoto['file']['url']);
        }

        if (isset($rawFoto['croppedBlob']['url']) && !str_starts_with($rawFoto['croppedBlob']['url'], 'http')) {
            $rawFoto['croppedBlob']['url'] = url($rawFoto['croppedBlob']['url']);
        }

        if (isset($rawFoto['preview']) && !str_starts_with($rawFoto['preview'], 'http')) {
            $rawFoto['preview'] = url($rawFoto['preview']);
        }

        return $rawFoto;
    }
}