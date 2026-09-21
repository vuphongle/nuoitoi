'use client';

import * as React from 'react';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import { MagnifyingGlassMinus, MagnifyingGlassPlus } from '@phosphor-icons/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getCroppedImageFile } from './crop-image';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

interface ImageCropperDialogProps {
  open: boolean;
  imageSrc: string | null;
  fileName: string;
  onOpenChange: (open: boolean) => void;
  onCropped: (file: File) => void;
}

export function ImageCropperDialog({
  open,
  imageSrc,
  fileName,
  onOpenChange,
  onCropped,
}: ImageCropperDialogProps) {
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleCropComplete = React.useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsSaving(true);
    try {
      const file = await getCroppedImageFile(imageSrc, croppedAreaPixels, fileName);
      onCropped(file);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle>Cắt ảnh theo hình vuông</DialogTitle>
        </DialogHeader>

        <div className="relative h-80 w-full overflow-hidden rounded-lg bg-muted">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="rect"
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <MagnifyingGlassMinus size={18} className="shrink-0 text-muted-foreground" />
          <input
            type="range"
            className="w-full accent-primary"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={ZOOM_STEP}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            aria-label="Thu phóng ảnh"
          />
          <MagnifyingGlassPlus size={18} className="shrink-0 text-muted-foreground" />
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSaving || !croppedAreaPixels}
            isLoading={isSaving}
          >
            Cắt ảnh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
