'use client';

import { useState, useRef } from 'react';

interface ProfessionalPhotoUploaderProps {
  onPhotoUpload: (photoUrl: string) => void;
  currentPhoto?: string;
  className?: string;
}

export default function ProfessionalPhotoUploader({ 
  onPhotoUpload, 
  currentPhoto,
  className = '' 
}: ProfessionalPhotoUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentPhoto || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onPhotoUpload(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setPreview('');
    onPhotoUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`professional-photo-uploader ${className}`} style={{
      fontFamily: '"Inter", sans-serif'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: 'rgb(17, 24, 39)',
        margin: '0 0 16px 0'
      }}>
        Professional Photo
      </h3>
      
      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-start'
      }}>
        {/* Photo Preview */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid rgb(229, 231, 235)',
          backgroundColor: 'rgb(249, 250, 251)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {preview ? (
            <img 
              src={preview} 
              alt="Professional Photo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              textAlign: 'center',
              color: 'rgb(156, 163, 175)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👤</div>
              <div style={{ fontSize: '12px' }}>No Photo</div>
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div style={{ flex: 1 }}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            style={{
              border: dragActive 
                ? '2px dashed rgb(59, 130, 246)' 
                : '2px dashed rgb(209, 213, 219)',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: dragActive 
                ? 'rgb(239, 246, 255)' 
                : 'rgb(249, 250, 251)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              color: dragActive ? 'rgb(59, 130, 246)' : 'rgb(107, 114, 128)',
              fontSize: '48px',
              marginBottom: '12px'
            }}>
              📸
            </div>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'rgb(17, 24, 39)',
              margin: '0 0 8px 0'
            }}>
              {dragActive ? 'Drop your photo here' : 'Upload Professional Photo'}
            </p>
            <p style={{
              fontSize: '12px',
              color: 'rgb(107, 114, 128)',
              margin: '0'
            }}>
              Drag & drop or click to browse<br />
              JPG, PNG up to 5MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            style={{ display: 'none' }}
          />

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '16px'
          }}>
            <button
              onClick={handleClick}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid rgb(209, 213, 219)',
                backgroundColor: 'white',
                color: 'rgb(55, 65, 81)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Choose File
            </button>
            
            {preview && (
              <button
                onClick={removePhoto}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid rgb(239, 68, 68)',
                  backgroundColor: 'rgb(254, 242, 242)',
                  color: 'rgb(239, 68, 68)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Remove
              </button>
            )}
          </div>

          {/* Photo Guidelines */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: 'rgb(240, 249, 255)',
            borderRadius: '6px',
            border: '1px solid rgb(186, 230, 253)'
          }}>
            <h4 style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'rgb(7, 89, 133)',
              margin: '0 0 6px 0'
            }}>
              Photo Guidelines:
            </h4>
            <ul style={{
              fontSize: '11px',
              color: 'rgb(7, 89, 133)',
              margin: '0',
              paddingLeft: '16px',
              lineHeight: '1.4'
            }}>
              <li>High-quality headshot with good lighting</li>
              <li>Professional attire recommended</li>
              <li>Neutral background preferred</li>
              <li>Face should be clearly visible</li>
              <li>Square aspect ratio works best</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}