import { useState, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ImageCropper = ({ isOpen, onClose, onCropComplete, selectedImage }) => {
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 / 1 });
  const [imageRef, setImageRef] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleCropComplete = useCallback((crop) => {
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
        setCroppedImage(blob); // Store the cropped image as a Blob
      }, 'image/jpeg', 0.95); // Adjust quality if needed
    }
  }, [imageRef]);

  const handleSave = () => {
    if (croppedImage) {
      onCropComplete(croppedImage); // Pass the cropped image back to the parent
      onClose(); // Close the modal
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop Your Image</DialogTitle>
        </DialogHeader>
        {selectedImage && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={handleCropComplete}
            aspect={1 / 1} // Square aspect ratio
            circularCrop // Optional: circular crop
          >
            <img
              src={selectedImage}
              onLoad={(e) => setImageRef(e.currentTarget)}
              alt="Crop preview"
            />
          </ReactCrop>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;