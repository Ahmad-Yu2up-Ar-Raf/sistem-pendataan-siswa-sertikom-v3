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
     * Handle photo upload - processes cropped & original files
     * 
     * @param Request $request
     * @param string $baseDir Directory path where files will be stored (e.g., 'siswa', 'users', 'posts')
     * @return array|null ['foto' => string, 'raw_foto' => array] or null
     */
    public function handlePhotoUpload(Request $request, string $baseDir = 'uploads'): ?array
    {
        if (!$request->hasFile('foto')) {
            return null;
        }
        
        $disk = 'public';
        
        // ===== 1. UPLOAD CROPPED FILE (main foto) =====
        $croppedFile = $request->file('foto');
        
        // Validate it's an image
        if (!$this->isValidImage($croppedFile)) {
            throw new \RuntimeException('Invalid image file');
        }
        
        $croppedFilename = Str::uuid() . '.jpg';
        $croppedPath = $croppedFile->storeAs($baseDir . '/cropped', $croppedFilename, $disk);
        $croppedUrl = Storage::url($croppedPath);
        
        // ===== 2. UPLOAD ORIGINAL FILE (backup) =====
        $originalFile = $request->file('foto_original');
        $originalData = null;
        
        if ($originalFile && $this->isValidImage($originalFile)) {
            $originalExt = $originalFile->getClientOriginalExtension();
            $originalFilename = Str::uuid() . '.' . $originalExt;
            $originalPath = $originalFile->storeAs($baseDir . '/original', $originalFilename, $disk);
            $originalUrl = Storage::url($originalPath);
            
            $originalData = [
                'url' => $originalUrl,
                'path' => $originalPath,
                'original_name' => $originalFile->getClientOriginalName(),
                'size' => $originalFile->getSize(),
                'mime' => $originalFile->getMimeType(),
            ];
        }
        
        // ===== 3. PARSE CROP METADATA =====
        $cropMetadata = null;
        
        if ($request->has('foto_crop_data')) {
            try {
                $cropMetadata = json_decode($request->input('foto_crop_data'), true);
            } catch (\Exception $e) {
                Log::warning('Failed to parse foto_crop_data', ['error' => $e->getMessage()]);
            }
        }
        
        // ===== 4. BUILD raw_foto STRUCTURE =====
        $rawFoto = [
            'file' => $originalData,
            'croppedBlob' => [
                'url' => $croppedUrl,
                'path' => $croppedPath,
            ],
            'cropData' => $cropMetadata['cropData'] ?? null,
            'preview' => $croppedUrl,
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
     * Delete old photo files from any model
     * 
     * @param mixed $model Model with foto & raw_foto properties
     * @return void
     */
    public function deleteOldPhotos($model): void
    {
        $disk = 'public';
        
        // Delete main foto
        if ($model->foto) {
            $path = str_replace('/storage/', '', $model->foto);
            
            if (Storage::disk($disk)->exists($path)) {
                Storage::disk($disk)->delete($path);
                Log::info("Deleted main photo: {$path}");
            }
        }
        
        // Delete original & cropped from raw_foto
        if ($model->raw_foto) {
            $rawFoto = is_array($model->raw_foto) 
                ? $model->raw_foto 
                : json_decode($model->raw_foto, true);
            
            if (isset($rawFoto['file']['path']) && Storage::disk($disk)->exists($rawFoto['file']['path'])) {
                Storage::disk($disk)->delete($rawFoto['file']['path']);
                Log::info("Deleted original photo: {$rawFoto['file']['path']}");
            }
            
            if (isset($rawFoto['croppedBlob']['path']) && Storage::disk($disk)->exists($rawFoto['croppedBlob']['path'])) {
                Storage::disk($disk)->delete($rawFoto['croppedBlob']['path']);
                Log::info("Deleted cropped photo: {$rawFoto['croppedBlob']['path']}");
            }
        }
    }

    /**
     * Transform raw_foto paths to full URLs for frontend
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