import { useState, useEffect, useRef } from 'react';
import { portalAPI } from '../../utils/auth';
import { FolderOpen, Loader, Upload, X, Image as ImageIcon, FileText, File, Trash2, Plus, CheckCircle2, AlertCircle, Download, CheckSquare, Square } from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [selectedAssets, setSelectedAssets] = useState(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const fileInputRef = useRef(null);
  const successTimeoutRef = useRef(null);
  
  // Store multiple files with their metadata
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // Default metadata that applies to all files (can be overridden per file)
  const [defaultMetadata, setDefaultMetadata] = useState({
    type: 'image',
    category: 'logo',
    description: ''
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await portalAPI.getAssets();
      if (process.env.NODE_ENV === 'development') {
        console.log('Fetched assets:', data.assets);
        // Log each asset's URL to debug
        if (data.assets && data.assets.length > 0) {
          data.assets.forEach((asset, index) => {
            console.log(`Asset ${index}:`, {
              name: asset.name,
              type: asset.type,
              urlLength: asset.url?.length,
              urlPreview: asset.url?.substring(0, 100),
              hasUrl: !!asset.url
            });
          });
        }
      }
      setAssets(data.assets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('File select event:', e.target.files);
    }
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.error('No file selected');
      }
      setError('No file selected. Please try again.');
      return;
    }
    
    // Process all files
    const processedFiles = [];
    for (const file of files) {
      if (file.size === 0) {
        continue; // Skip empty files
      }
      
      // Process each file
      try {
        const fileData = await processFileAsync(file);
        if (fileData) {
          processedFiles.push(fileData);
        }
      } catch (err) {
        console.error(`Error processing file ${file.name}:`, err);
      }
    }
    
    // Add to selected files
    setSelectedFiles(prev => [...prev, ...processedFiles]);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Async version of processFile that returns a promise
  const processFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
      console.log('Processing file:', file.name, file.type, file.size, 'bytes');
    }
      }
      
      // Validate file object
      if (!file) {
        reject(new Error('Invalid file object'));
        return;
      }
      
      const hasFileProperties = file.name !== undefined && 
                               file.size !== undefined && 
                               typeof file.size === 'number' &&
                               (file.type !== undefined || file.name !== undefined);
      
      if (!hasFileProperties) {
        reject(new Error('Invalid file type'));
        return;
      }
      
      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        reject(new Error(`File is too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(0)}MB`));
        return;
      }
      
      if (file.size === 0) {
        reject(new Error('File is empty'));
        return;
      }

      // Determine file type
      let fileType = 'document';
      if (file.type && file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type && file.type.startsWith('video/')) {
        fileType = 'video';
      } else if (file.type && (file.type.includes('pdf') || file.type === 'application/pdf')) {
        fileType = 'document';
      } else {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
          fileType = 'image';
        }
      }

      // Determine category
      let category = 'other';
      const fileName = file.name.toLowerCase();
      if (fileName.includes('logo')) {
        category = 'logo';
      } else if (fileName.includes('brand') || fileName.includes('identity')) {
        category = 'branding';
      } else if (fileName.includes('image') || fileName.includes('photo') || fileName.includes('picture')) {
        category = 'image';
      } else if (fileName.includes('document') || fileName.includes('doc') || fileName.includes('pdf')) {
        category = 'document';
      } else if (fileType === 'image') {
        category = 'image';
      }

      // Extract filename without extension
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');

      // Read file as base64
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const result = e.target.result;
          if (!result || result.length === 0) {
            reject(new Error('FileReader returned empty result'));
            return;
          }
          
          resolve({
            id: Date.now() + Math.random(), // Unique ID for React key
            file: file,
            name: fileNameWithoutExt || file.name,
            type: fileType,
            category: category,
            description: '',
            url: result,
            file_size: file.size,
            originalName: file.name
          });
        } catch (err) {
          reject(err);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  const processFile = (file) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Processing file:', file.name, file.type, file.size, 'bytes');
    }
    
    // Validate file object is still valid
    if (!file) {
      setError('Invalid file object. Please try selecting the file again.');
      return;
    }
    
    // Check if it's a valid File or Blob
    // Use property checks instead of instanceof to avoid errors
    const hasFileProperties = file.name !== undefined && 
                               file.size !== undefined && 
                               typeof file.size === 'number' &&
                               (file.type !== undefined || file.name !== undefined);
    
    if (!hasFileProperties) {
      setError('Invalid file type. Please select a valid file.');
      return;
    }
    
    // Check file size (limit to 10MB for base64 encoding)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(0)}MB. Please use a smaller file.`);
      return;
    }
    
    // Check if file is empty
    if (file.size === 0) {
      setError('File is empty. Please select a different file.');
      return;
    }

    // Determine file type
    let fileType = 'document';
    if (file.type && file.type.startsWith('image/')) {
      fileType = 'image';
    } else if (file.type && file.type.startsWith('video/')) {
      fileType = 'video';
    } else if (file.type && (file.type.includes('pdf') || file.type === 'application/pdf')) {
      fileType = 'document';
    } else if (file.type && file.type.includes('text')) {
      fileType = 'document';
    } else {
      // Fallback: check file extension if MIME type is not available
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
        fileType = 'image';
      }
    }

    // Determine category based on file name
    let category = 'other';
    const fileName = file.name.toLowerCase();
    if (fileName.includes('logo')) {
      category = 'logo';
    } else if (fileName.includes('brand') || fileName.includes('identity')) {
      category = 'branding';
    } else if (fileName.includes('image') || fileName.includes('photo') || fileName.includes('picture')) {
      category = 'image';
    } else if (fileName.includes('document') || fileName.includes('doc') || fileName.includes('pdf')) {
      category = 'document';
    } else if (fileType === 'image') {
      category = 'image'; // Default category for images
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('File type:', fileType, 'Category:', category);
    }

    // Convert file to base64 using FileReader
    // First, try to create a blob URL as a fallback
    let blobUrl = null;
    try {
      blobUrl = URL.createObjectURL(file);
      if (process.env.NODE_ENV === 'development') {
        console.log('Created blob URL:', blobUrl);
      }
    } catch (blobErr) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Could not create blob URL:', blobErr);
      }
    }

    try {
      const reader = new FileReader();
      
      // Set a timeout to detect if reading takes too long
      const timeout = setTimeout(() => {
        if (reader.readyState === FileReader.LOADING) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('FileReader taking too long, aborting...');
          }
          reader.abort();
          setError('File reading timed out. The file might be too large or corrupted. Please try a smaller file.');
        }
      }, 30000); // 30 second timeout
      
      reader.onload = (e) => {
        clearTimeout(timeout);
        try {
          const result = e.target.result;
          if (process.env.NODE_ENV === 'development') {
            console.log('File read complete, setting form data. Data URL length:', result?.length || 0);
          }
          
          if (!result || result.length === 0) {
            throw new Error('FileReader returned empty result');
          }
          
          // Clean up blob URL if we successfully read the file
          if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
          }
          
          // Extract filename without extension for better default name
          const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
          setUploadFormData({
            name: fileNameWithoutExt || file.name,
            type: fileType,
            category: category,
            description: '',
            url: result, // Base64 data URL
            file_size: file.size
          });
          setError(null); // Clear any previous errors
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error processing file result:', err);
          }
          setError('Failed to process file. Please try a different file.');
          if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
          }
        }
      };
      
      reader.onerror = (error) => {
        clearTimeout(timeout);
        if (process.env.NODE_ENV === 'development') {
          console.error('FileReader error event:', error);
          console.error('FileReader error details:', {
            error: reader.error,
            errorCode: reader.error?.code,
            errorName: reader.error?.name,
            readyState: reader.readyState,
            file: {
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified
            }
          });
        }
        
        // If it's a NotReadableError, try ArrayBuffer fallback
        const errorCode = reader.error?.code;
        const isNotReadable = errorCode === FileReader.ERROR_NOT_READABLE || 
                              errorCode === 0 || 
                              reader.error?.name === 'NotReadableError';
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Error code:', errorCode, 'Error name:', reader.error?.name, 'Is NotReadable:', isNotReadable);
        }
        
        if (isNotReadable) {
          if (process.env.NODE_ENV === 'development') {
            console.log('NotReadableError detected, trying ArrayBuffer fallback...');
          }
          
          // Validate file is still accessible
          if (!file || file.size === 0) {
            if (process.env.NODE_ENV === 'development') {
              console.error('File is no longer valid for fallback');
            }
            if (blobUrl) {
              URL.revokeObjectURL(blobUrl);
            }
            setError('File is no longer accessible. Please try selecting it again.');
            return;
          }
          
          // Try reading as ArrayBuffer as fallback
          try {
            const arrayBufferReader = new FileReader();
            
            arrayBufferReader.onload = (e) => {
              try {
                const arrayBuffer = e.target.result;
                if (!arrayBuffer || arrayBuffer.byteLength === 0) {
                  throw new Error('ArrayBuffer is empty');
                }
                
                const bytes = new Uint8Array(arrayBuffer);
                let binary = '';
                const chunkSize = 8192; // Process in chunks to avoid memory issues
                for (let i = 0; i < bytes.length; i += chunkSize) {
                  const chunk = bytes.subarray(i, i + chunkSize);
                  binary += String.fromCharCode.apply(null, chunk);
                }
                const base64 = btoa(binary);
                const dataUrl = `data:${file.type || 'application/octet-stream'};base64,${base64}`;
                
                if (process.env.NODE_ENV === 'development') {
                  console.log('File read via ArrayBuffer fallback, setting form data. Data URL length:', dataUrl.length);
                }
                // Extract filename without extension for better default name
                const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                setUploadFormData({
                  name: fileNameWithoutExt || file.name,
                  type: fileType,
                  category: category,
                  description: '',
                  url: dataUrl,
                  file_size: file.size
                });
                setError(null);
                
                if (blobUrl) {
                  URL.revokeObjectURL(blobUrl);
                }
              } catch (convertErr) {
                if (process.env.NODE_ENV === 'development') {
                  console.error('Error converting ArrayBuffer to base64:', convertErr);
                }
                if (blobUrl) {
                  URL.revokeObjectURL(blobUrl);
                }
                setError('Unable to read file. This might be due to browser security restrictions or file permissions. Please try: 1) Moving the file to Desktop, 2) Using a different browser, or 3) Checking file permissions.');
              }
            };
            
            arrayBufferReader.onerror = (err) => {
              if (process.env.NODE_ENV === 'development') {
                console.error('ArrayBuffer reader also failed:', err);
                console.error('ArrayBuffer reader error details:', {
                  error: arrayBufferReader.error,
                  errorCode: arrayBufferReader.error?.code,
                  errorName: arrayBufferReader.error?.name
                });
              }
              if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
              }
              
              // Both methods failed - this is a browser/OS security restriction
              setError(
                '⚠️ Unable to read file due to browser security restrictions.\n\n' +
                'This typically happens when files are in restricted locations (like Downloads folder on macOS).\n\n' +
                'Please try:\n' +
                '1. Move the file to your Desktop\n' +
                '2. Try a different browser (Chrome, Firefox, Safari)\n' +
                '3. Check that the file is not locked or in use\n' +
                '4. Grant file access permissions to your browser in System Settings'
              );
            };
            
            if (process.env.NODE_ENV === 'development') {
              console.log('Attempting to read file as ArrayBuffer...');
            }
            arrayBufferReader.readAsArrayBuffer(file);
            return; // Exit early, fallback will handle it
          } catch (fallbackErr) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to set up ArrayBuffer fallback:', fallbackErr);
            }
            // Continue to show error message below
          }
        }
        
        // Clean up blob URL on error
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
        }
        
        let errorMessage = 'Failed to read file. ';
        if (reader.error) {
          const errorCode = reader.error.code;
          if (errorCode === FileReader.ERROR_NOT_READABLE || errorCode === 0) {
            errorMessage = 
              '⚠️ File cannot be read due to browser security restrictions.\n\n' +
              'This usually happens when files are in restricted locations (like Downloads folder on macOS).\n\n' +
              'Solutions:\n' +
              '• Move the file to your Desktop and try again\n' +
              '• Try a different browser (Chrome, Firefox, Safari)\n' +
              '• Check file permissions in System Settings\n' +
              '• Ensure the file is not locked or in use by another app';
          } else if (errorCode === FileReader.ERROR_ABORT) {
            errorMessage += 'File reading was aborted.';
          } else {
            errorMessage += `Error code: ${errorCode}. Please try a different file.`;
          }
        } else {
          errorMessage += 'Please try a different file or check if the file is corrupted.';
        }
        setError(errorMessage);
      };
      
      reader.onabort = () => {
        clearTimeout(timeout);
        if (process.env.NODE_ENV === 'development') {
          console.error('FileReader aborted');
        }
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
        }
        setError('File reading was cancelled. Please try again.');
      };
      
      reader.onprogress = (e) => {
        if (e.lengthComputable && process.env.NODE_ENV === 'development') {
          const percentLoaded = Math.round((e.loaded / e.total) * 100);
          console.log(`File reading progress: ${percentLoaded}% (${e.loaded}/${e.total} bytes)`);
        }
      };
      
      // Validate file is still accessible before reading
      if (!file || file.size === 0) {
        throw new Error('File is no longer accessible. Please try selecting it again.');
      }
      
      // Start reading the file
      if (process.env.NODE_ENV === 'development') {
        console.log('Starting to read file as data URL...', {
          fileSize: file.size,
          fileType: file.type,
          fileName: file.name,
          fileLastModified: file.lastModified
        });
      }
      
      // Try readAsDataURL first, with fallback to readAsArrayBuffer
      try {
        // Check if file is still valid before reading
        if (!file || file.size === 0 || !file.name) {
          throw new Error('File object is invalid or empty');
        }
        
        // Use readAsDataURL for images and small files
        reader.readAsDataURL(file);
      } catch (readErr) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error calling readAsDataURL, trying ArrayBuffer fallback:', readErr);
        }
        
        // Fallback: Try reading as ArrayBuffer and converting to base64
        try {
          const arrayBufferReader = new FileReader();
          
          arrayBufferReader.onload = (e) => {
            try {
              const arrayBuffer = e.target.result;
              const bytes = new Uint8Array(arrayBuffer);
              let binary = '';
              for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64 = btoa(binary);
              const dataUrl = `data:${file.type || 'application/octet-stream'};base64,${base64}`;
              
              if (process.env.NODE_ENV === 'development') {
                console.log('File read via ArrayBuffer fallback, setting form data');
              }
              setUploadFormData({
                name: file.name,
                type: fileType,
                category: category,
                description: '',
                url: dataUrl,
                file_size: file.size
              });
              setError(null);
              
              if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
              }
            } catch (convertErr) {
              if (process.env.NODE_ENV === 'development') {
                console.error('Error converting ArrayBuffer to base64:', convertErr);
              }
              if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
              }
              setError('Failed to process file. This might be a browser security restriction. Please try a different file or browser.');
            }
          };
          
          arrayBufferReader.onerror = (err) => {
            if (process.env.NODE_ENV === 'development') {
              console.error('ArrayBuffer reader also failed:', err);
            }
            if (blobUrl) {
              URL.revokeObjectURL(blobUrl);
            }
            setError('Unable to read file. This might be due to browser security restrictions or file permissions. Please try: 1) Moving the file to Desktop, 2) Using a different browser, or 3) Checking file permissions.');
          };
          
          arrayBufferReader.readAsArrayBuffer(file);
        } catch (fallbackErr) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Fallback also failed:', fallbackErr);
          }
          if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
          }
          setError(`Failed to read file: ${readErr.message}. This might be a browser security restriction. Please try moving the file to Desktop or using a different browser.`);
        }
      }
      
    } catch (err) {
      console.error('Error setting up FileReader:', err);
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      setError(`Failed to initialize file reader: ${err.message}. Please try again.`);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    console.log('Drop event:', e.dataTransfer.files);
    
    const files = Array.from(e.dataTransfer.files || []);
    
    if (files.length === 0) {
      console.error('No files in drop event');
      setError('No file detected. Please try again.');
      return;
    }
    
    // Process all files
    const processedFiles = [];
    for (const file of files) {
      if (file.size === 0) {
        continue;
      }
      
      try {
        const fileData = await processFileAsync(file);
        if (fileData) {
          processedFiles.push(fileData);
        }
      } catch (err) {
        console.error(`Error processing file ${file.name}:`, err);
      }
    }
    
    // Add to selected files
    setSelectedFiles(prev => [...prev, ...processedFiles]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }

    // Validate all files have names
    const filesWithoutNames = selectedFiles.filter(f => !f.name || f.name.trim() === '');
    if (filesWithoutNames.length > 0) {
      setError('Please provide a name for all files');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccessMessage(null);

      let uploadedCount = 0;
      let failedCount = 0;

      // Upload all files
      for (const fileData of selectedFiles) {
        try {
          const assetData = {
            name: fileData.name,
            type: fileData.type,
            category: fileData.category,
            description: fileData.description || '',
            url: fileData.url,
            file_size: fileData.file_size
          };
          
          await portalAPI.uploadAsset(assetData);
          uploadedCount++;
        } catch (err) {
          console.error(`Failed to upload file ${fileData.name}:`, err);
          failedCount++;
        }
      }
      
      if (uploadedCount > 0) {
        const message = `Successfully uploaded ${uploadedCount} file${uploadedCount > 1 ? 's' : ''}!${failedCount > 0 ? ` (${failedCount} failed)` : ''}`;
        setSuccessMessage(message);
        
        // Auto-dismiss toast after 4 seconds
        if (successTimeoutRef.current) {
          clearTimeout(successTimeoutRef.current);
        }
        successTimeoutRef.current = setTimeout(() => {
          setSuccessMessage(null);
        }, 4000);
      } else {
        setError(`Failed to upload all files. ${failedCount} file${failedCount > 1 ? 's' : ''} failed.`);
      }
      
      setShowUploadModal(false);
      setSelectedFiles([]);
      setDefaultMetadata({
        type: 'image',
        category: 'logo',
        description: ''
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchAssets();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload assets. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleUpdateFileMetadata = (fileId, updates) => {
    setSelectedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, ...updates } : f
    ));
  };

  const handleApplyDefaultMetadata = () => {
    setSelectedFiles(prev => prev.map(f => ({
      ...f,
      type: defaultMetadata.type,
      category: defaultMetadata.category,
      description: defaultMetadata.description
    })));
  };

  const handleDeleteClick = (assetId) => {
    setAssetToDelete(assetId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setAssetToDelete(null);
  };

  const handleToggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      setSelectedAssets(new Set());
    }
  };

  const handleToggleAssetSelect = (assetId) => {
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedAssets.size === assets.length) {
      setSelectedAssets(new Set());
    } else {
      setSelectedAssets(new Set(assets.map(asset => asset.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedAssets.size === 0) return;
    setShowDeleteConfirm(true);
    setAssetToDelete(Array.from(selectedAssets));
  };

  const handleBulkDownload = async () => {
    if (selectedAssets.size === 0) return;

    const selectedAssetsList = assets.filter(asset => selectedAssets.has(asset.id));
    
    for (const asset of selectedAssetsList) {
      try {
        await handleDownload(asset);
        // Small delay between downloads to avoid browser blocking
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (err) {
        console.error(`Failed to download ${asset.name}:`, err);
      }
    }

    const message = `Downloaded ${selectedAssets.size} file${selectedAssets.size > 1 ? 's' : ''}!`;
    setSuccessMessage(message);
    
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    successTimeoutRef.current = setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const handleDeleteConfirm = async () => {
    if (!assetToDelete) return;

    const assetIds = Array.isArray(assetToDelete) ? assetToDelete : [assetToDelete];
    const isBulkDelete = assetIds.length > 1;

    try {
      setError(null);
      setSuccessMessage(null);
      
      let deletedCount = 0;
      let failedCount = 0;

      for (const assetId of assetIds) {
        try {
          await portalAPI.deleteAsset(assetId);
          deletedCount++;
        } catch (err) {
          console.error(`Failed to delete asset ${assetId}:`, err);
          failedCount++;
        }
      }

      const message = isBulkDelete 
        ? `Successfully deleted ${deletedCount} asset${deletedCount > 1 ? 's' : ''}!${failedCount > 0 ? ` (${failedCount} failed)` : ''}`
        : 'Asset deleted successfully';
      setSuccessMessage(message);
      
      // Auto-dismiss toast after 4 seconds
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      successTimeoutRef.current = setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
      
      setShowDeleteConfirm(false);
      setAssetToDelete(null);
      setSelectedAssets(new Set());
      setIsSelectMode(false);
      await fetchAssets();
    } catch (err) {
      setError(err.message || 'Failed to delete asset. Please try again.');
      setShowDeleteConfirm(false);
      setAssetToDelete(null);
    }
  };

  const handleDownload = (asset) => {
    if (!asset.url) {
      setError('No file available for download');
      return;
    }

    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = asset.url;
      
      // Use the renamed asset name for the download filename
      // Get the file extension from the original URL or type
      let extension = '';
      if (asset.url.includes('data:')) {
        // Extract extension from data URL MIME type
        const mimeMatch = asset.url.match(/data:([^;]+)/);
        if (mimeMatch) {
          const mimeType = mimeMatch[1];
          if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = '.jpg';
          else if (mimeType.includes('png')) extension = '.png';
          else if (mimeType.includes('gif')) extension = '.gif';
          else if (mimeType.includes('webp')) extension = '.webp';
          else if (mimeType.includes('pdf')) extension = '.pdf';
          else if (mimeType.includes('svg')) extension = '.svg';
        }
      }
      
      // Use renamed name with appropriate extension
      const downloadName = asset.name + extension;
      link.download = downloadName;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download file. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getAssetIcon = (type, category) => {
    if (category === 'logo' || type === 'image') {
      return ImageIcon;
    }
    if (type === 'document') {
      return FileText;
    }
    return File;
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Assets - Portal" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Assets - Portal" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Assets</h1>
            <p className="text-gray-400">Upload and manage your logos, images, and other files</p>
          </div>
          <div className="flex items-center gap-3">
            {isSelectMode && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {selectedAssets.size} selected
                </span>
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  {selectedAssets.size === assets.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            )}
            <button
              onClick={handleToggleSelectMode}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
                isSelectMode
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isSelectMode ? 'Cancel Selection' : 'Select'}
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Upload Asset
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Error: {error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Toast Notification */}
        {successMessage && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="bg-green-600/95 backdrop-blur-sm border border-green-500 rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-green-100 font-medium text-sm">{successMessage}</p>
              </div>
              <button
                onClick={() => {
                  if (successTimeoutRef.current) {
                    clearTimeout(successTimeoutRef.current);
                  }
                  setSuccessMessage(null);
                }}
                className="flex-shrink-0 p-1 rounded hover:bg-green-500/20 transition-colors"
              >
                <X className="w-4 h-4 text-green-300" />
              </button>
            </div>
          </div>
        )}

        {assets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => {
              const AssetIcon = getAssetIcon(asset.type, asset.category);
              // Debug: Log asset data
              if (asset.type === 'image') {
                console.log('Rendering image asset:', {
                  id: asset.id,
                  name: asset.name,
                  urlExists: !!asset.url,
                  urlType: asset.url?.substring(0, 20),
                  urlLength: asset.url?.length
                });
              }
              const isSelected = selectedAssets.has(asset.id);
              return (
                <div
                  key={asset.id}
                  className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border transition-colors ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      {isSelectMode && (
                        <button
                          onClick={() => handleToggleAssetSelect(asset.id)}
                          className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-6 h-6 text-orange-400" />
                          ) : (
                            <Square className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                      )}
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                        <AssetIcon className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{asset.name}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                            {asset.type}
                          </span>
                          {asset.category && (
                            <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">
                              {asset.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!isSelectMode && (
                      <button
                        onClick={() => handleDeleteClick(asset.id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                        title="Delete asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {asset.url && (
                    <div className="mb-4">
                      {asset.type === 'image' ? (
                        <div className="w-full h-48 rounded-lg mb-2 overflow-hidden bg-gray-900/50 flex items-center justify-center relative group cursor-pointer"
                          onClick={() => {
                            // Open preview on click
                            const newWindow = window.open();
                            if (newWindow) {
                              newWindow.document.write(`
                                <html>
                                  <head>
                                    <title>${asset.name}</title>
                                    <style>
                                      body {
                                        margin: 0;
                                        padding: 20px;
                                        background: #1a1a1a;
                                        color: white;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        min-height: 100vh;
                                      }
                                      img {
                                        max-width: 100%;
                                        max-height: 100vh;
                                        object-fit: contain;
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    <img src="${asset.url}" alt="${asset.name}" />
                                  </body>
                                </html>
                              `);
                            }
                          }}
                        >
                          {asset.url && asset.url.startsWith('data:') ? (
                            <img
                              key={`img-${asset.id}`}
                              src={asset.url}
                              alt={asset.name}
                              className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
                              style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', width: '100%', height: '100%' }}
                              loading="lazy"
                              onError={(e) => {
                                console.error('Image load error for asset:', asset.name);
                                console.error('URL length:', asset.url?.length);
                                console.error('URL starts with data:', asset.url?.startsWith('data:'));
                                console.error('URL preview (first 200 chars):', asset.url?.substring(0, 200));
                                // Replace with placeholder
                                e.target.style.display = 'none';
                                const parent = e.target.parentElement;
                                const existingPlaceholder = parent.querySelector('.image-placeholder');
                                if (!existingPlaceholder) {
                                  const placeholder = document.createElement('div');
                                  placeholder.className = 'image-placeholder w-full h-full flex flex-col items-center justify-center gap-2';
                                  placeholder.innerHTML = `
                                    <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span class="text-gray-500 text-xs">Image failed to load</span>
                                  `;
                                  parent.appendChild(placeholder);
                                }
                              }}
                              onLoad={(e) => {
                                console.log('Image loaded successfully:', asset.name);
                                console.log('Image dimensions:', e.target.naturalWidth, 'x', e.target.naturalHeight);
                                // Remove any existing placeholder
                                const parent = e.target.parentElement;
                                const placeholder = parent.querySelector('.image-placeholder');
                                if (placeholder) {
                                  placeholder.remove();
                                }
                              }}
                            />
                          ) : asset.url ? (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                              <ImageIcon className="w-12 h-12 text-gray-500" />
                              <span className="text-gray-500 text-xs">Invalid image URL format</span>
                              <span className="text-gray-600 text-xs">URL: {asset.url?.substring(0, 50)}...</span>
                            </div>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                              <ImageIcon className="w-12 h-12 text-gray-500" />
                              <span className="text-gray-500 text-xs">No image URL available</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                            <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">Click to view full size</span>
                          </div>
                        </div>
                      ) : asset.type === 'document' && asset.url && asset.url.includes('pdf') ? (
                        <div className="w-full h-48 rounded-lg mb-2 overflow-hidden bg-gray-900/50 flex items-center justify-center relative group cursor-pointer"
                          onClick={() => {
                            // Open PDF preview
                            const newWindow = window.open();
                            if (newWindow) {
                              newWindow.document.write(`
                                <html>
                                  <head>
                                    <title>${asset.name}</title>
                                    <style>
                                      body {
                                        margin: 0;
                                        padding: 0;
                                        background: #1a1a1a;
                                      }
                                      iframe {
                                        width: 100%;
                                        height: 100vh;
                                        border: none;
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    <iframe src="${asset.url}" type="application/pdf"></iframe>
                                  </body>
                                </html>
                              `);
                            }
                          }}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-16 h-16 text-gray-400" />
                            <span className="text-gray-400 text-sm">PDF Document</span>
                            <span className="text-gray-500 text-xs group-hover:text-orange-400 transition-colors">Click to view</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-900/50 rounded-lg mb-2 flex items-center justify-center">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-16 h-16 text-gray-500" />
                            <span className="text-gray-400 text-sm">{asset.type || 'File'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {asset.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{asset.description}</p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(asset.file_size)}</span>
                    {asset.url && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDownload(asset)}
                          className="text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1"
                          title="Download file"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                        <button
                          onClick={() => {
                            // Open in new window for viewing
                            const newWindow = window.open();
                            if (newWindow) {
                              newWindow.document.write(`
                                <html>
                                  <head>
                                    <title>${asset.name}</title>
                                    <style>
                                      body {
                                        margin: 0;
                                        padding: 20px;
                                        background: #1a1a1a;
                                        color: white;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        min-height: 100vh;
                                      }
                                      img {
                                        max-width: 100%;
                                        max-height: 100vh;
                                        object-fit: contain;
                                      }
                                      iframe {
                                        width: 100%;
                                        height: 100vh;
                                        border: none;
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    ${asset.type === 'image' 
                                      ? `<img src="${asset.url}" alt="${asset.name}" />`
                                      : asset.type === 'document' && asset.url.includes('pdf')
                                      ? `<iframe src="${asset.url}" type="application/pdf"></iframe>`
                                      : `<p>Preview not available. <a href="${asset.url}" download="${asset.name}" style="color: #f97316;">Download</a> to view.</p>`
                                    }
                                  </body>
                                </html>
                              `);
                            }
                          }}
                          className="text-orange-500 hover:text-orange-400 transition-colors"
                          title="View file"
                        >
                          View →
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Uploaded: {new Date(asset.created_at).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
            <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Assets</h3>
            <p className="text-gray-400 mb-6">You don't have any stored assets yet.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <Upload className="w-5 h-5" />
              Upload Your First Asset
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Upload Assets</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                    setDefaultMetadata({
                      type: 'image',
                      category: 'logo',
                      description: ''
                    });
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* File Upload Area */}
              <div
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors mb-6 ${
                  dragActive
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white mb-2">Drag and drop your files here</p>
                  <p className="text-gray-400 text-sm mb-2">You can select multiple files at once</p>
                  <p className="text-gray-400 text-sm mb-4">or</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Browse Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,application/pdf,.doc,.docx,.txt,.zip,.rar"
                    multiple={true}
                  />
                </div>
              </div>

              {/* Default Metadata (Apply to All) */}
              {selectedFiles.length > 0 && (
                <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-300">Default Metadata (Apply to All)</h3>
                    <button
                      onClick={handleApplyDefaultMetadata}
                      className="text-xs text-orange-400 hover:text-orange-300"
                    >
                      Apply to All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Type</label>
                      <select
                        value={defaultMetadata.type}
                        onChange={(e) => setDefaultMetadata({ ...defaultMetadata, type: e.target.value })}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="image">Image</option>
                        <option value="document">Document</option>
                        <option value="video">Video</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                      <select
                        value={defaultMetadata.category}
                        onChange={(e) => setDefaultMetadata({ ...defaultMetadata, category: e.target.value })}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="logo">Logo</option>
                        <option value="branding">Branding</option>
                        <option value="image">Image</option>
                        <option value="document">Document</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

        {/* Bulk Actions Bar */}
        {isSelectMode && selectedAssets.size > 0 && (
          <div className="mb-6 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-orange-500/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold">
                {selectedAssets.size} asset{selectedAssets.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkDownload}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download ({selectedAssets.size})
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedAssets.size})
              </button>
            </div>
          </div>
        )}

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-white">
              Selected Files ({selectedFiles.length})
            </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedFiles.map((fileData) => (
                      <div
                        key={fileData.id}
                        className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex gap-4">
                          {/* Preview */}
                          <div className="flex-shrink-0">
                            {fileData.type === 'image' ? (
                              <img
                                src={fileData.url}
                                alt={fileData.name}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                                <FileText className="w-8 h-8 text-gray-500" />
                              </div>
                            )}
                          </div>

                          {/* Metadata Form */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Asset Name <span className="text-red-400">*</span>
                              </label>
                              <input
                                type="text"
                                value={fileData.name}
                                onChange={(e) => handleUpdateFileMetadata(fileData.id, { name: e.target.value })}
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Asset name"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Type</label>
                                <select
                                  value={fileData.type}
                                  onChange={(e) => handleUpdateFileMetadata(fileData.id, { type: e.target.value })}
                                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                  <option value="image">Image</option>
                                  <option value="document">Document</option>
                                  <option value="video">Video</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                                <select
                                  value={fileData.category}
                                  onChange={(e) => handleUpdateFileMetadata(fileData.id, { category: e.target.value })}
                                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                  <option value="logo">Logo</option>
                                  <option value="branding">Branding</option>
                                  <option value="image">Image</option>
                                  <option value="document">Document</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>{fileData.originalName}</span>
                              <span>{formatFileSize(fileData.file_size)}</span>
                              <button
                                onClick={() => handleRemoveFile(fileData.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || uploading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Uploading {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload {selectedFiles.length} Asset{selectedFiles.length > 1 ? 's' : ''}
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                    setDefaultMetadata({
                      type: 'image',
                      category: 'logo',
                      description: ''
                    });
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl max-w-md w-full transform transition-all animate-scale-in">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white text-center mb-2">
                {Array.isArray(assetToDelete) && assetToDelete.length > 1
                  ? `Delete ${assetToDelete.length} Assets?`
                  : 'Delete Asset?'}
              </h3>
              
              <p className="text-gray-400 text-center mb-8">
                {Array.isArray(assetToDelete) && assetToDelete.length > 1
                  ? `Are you sure you want to delete ${assetToDelete.length} assets? This action cannot be undone.`
                  : 'Are you sure you want to delete this asset? This action cannot be undone.'}
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AssetsPage;

