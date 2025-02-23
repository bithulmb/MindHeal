// hooks/useImageCropper.js
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

const useImageCropper = () => {
  const [selectedImage, setSelectedImage] = useState(null); // Image to crop
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 / 1 }); // Crop settings
  const [croppedImage, setCroppedImage] = useState(null); // Final cropped image
  const [isCropModalOpen, setIsCropModalOpen] = useState(false); // Modal state
  const [imageRef, setImageRef] = useState(null); // Image reference
  const [uploading, setUploading] = useState(false); // Upload state

  // Handle file selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!acceptedTypes.includes(file.type)) {
      toast.error("Only .jpg, .jpeg, .png, and .webp formats are supported");
      return;
    }
    if (file.size > maxSize) {
      toast.error("Max file size is 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Handle crop completion
  const onCropComplete = useCallback((crop) => {
    if (imageRef && crop.width && crop.height) {
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.naturalWidth / imageRef.width;
      const scaleY = imageRef.naturalHeight / imageRef.height;
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        imageRef,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      canvas.toBlob((blob) => {
        setCroppedImage(blob);
      }, 'image/jpeg', 0.95);
    }
  }, [imageRef]);

  // Reset states after use
  const resetCropper = () => {
    setSelectedImage(null);
    setCroppedImage(null);
    setIsCropModalOpen(false);
    setImageRef(null);
    setUploading(false);
  };

  return {
    selectedImage,
    crop,
    setCrop,
    croppedImage,
    isCropModalOpen,
    setIsCropModalOpen,
    imageRef,
    setImageRef,
    uploading,
    setUploading,
    handleImageSelect,
    onCropComplete,
    resetCropper,
  };
};

export default useImageCropper;