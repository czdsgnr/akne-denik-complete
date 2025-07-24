// 📁 src/lib/uploadPhotoToStorage.js - KOMPLETNÍ CLOUDINARY VERZE

export const uploadPhotoToStorage = async (photoFile, userId, day, photoType = 'single') => {
  try {
    console.log('🌤️ === CLOUDINARY UPLOAD START ===')
    console.log('📁 File details:', {
      name: photoFile.name,
      size: photoFile.size,
      type: photoFile.type
    })
    
    // ✅ CLOUDINARY KONFIGURACE
    const CLOUD_NAME = 'dzd3kxrmg'           // ← Váš Cloud Name
    const UPLOAD_PRESET = 'akne_photos'      // ← Váš Upload Preset
    
    // ✅ VYTVOŘENÍ FORM DATA
    const formData = new FormData()
    formData.append('file', photoFile)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', `user_photos/${userId}`)
    
    // ✅ JEDINEČNÝ NÁZEV SOUBORU
    const timestamp = Date.now()
    const fileName = `day-${day}-${photoType}-${timestamp}`
    formData.append('public_id', fileName)
    
    // ✅ CLOUDINARY URL
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    
    console.log('📤 Upload URL:', uploadUrl)
    console.log('📂 Folder:', `user_photos/${userId}`)
    console.log('📋 Public ID:', fileName)
    
    // ✅ UPLOAD REQUEST
    console.log('🚀 Starting upload...')
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })
    
    console.log('📊 Response status:', response.status)
    console.log('📊 Response ok:', response.ok)
    
    // ✅ ERROR HANDLING
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Cloudinary error response:', errorText)
      throw new Error(`Cloudinary upload failed: ${response.status}`)
    }
    
    // ✅ SUCCESS - PARSE RESPONSE
    const data = await response.json()
    console.log('🎉 Upload successful!')
    console.log('🔗 Image URL:', data.secure_url)
    console.log('📊 Image info:', {
      public_id: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height,
      bytes: data.bytes
    })
    
    return data.secure_url
    
  } catch (error) {
    console.error('💥 === CLOUDINARY UPLOAD ERROR ===')
    console.error('❌ Error message:', error.message)
    console.error('❌ Error stack:', error.stack)
    throw error
  }
}

// ✅ MULTIPLE PHOTOS SUPPORT (pro dual photo days)
export const uploadMultiplePhotos = async (photos, userId, day) => {
  try {
    console.log('🌤️ === MULTIPLE PHOTOS UPLOAD ===')
    console.log('📸 Photos count:', photos.length)
    
    const uploadPromises = photos.map(async (photo) => {
      if (!photo.file) return null
      
      const url = await uploadPhotoToStorage(photo.file, userId, day, photo.type)
      return {
        url,
        type: photo.type
      }
    })
    
    const results = await Promise.all(uploadPromises)
    const successfulUploads = results.filter(result => result !== null)
    
    console.log('✅ Multiple upload completed:', successfulUploads.length, 'photos')
    return successfulUploads
    
  } catch (error) {
    console.error('❌ Multiple photos upload error:', error)
    throw error
  }
}

// ✅ FILE VALIDATION
export const validatePhotoFile = (file) => {
  if (!file) {
    throw new Error('Žádný soubor nebyl vybrán')
  }
  
  // Povolené typy
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    throw new Error('Neplatný formát souboru. Použijte JPG, PNG nebo WebP.')
  }
  
  // Maximální velikost 10MB
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('Soubor je příliš velký. Maximální velikost je 10MB.')
  }
  
  return true
}