"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Crop, RotateCcw, RotateCw, ZoomIn, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/ui/modal";
import { api } from "@/lib/api"; // adjust import path to wherever `api` actually lives in this project

// Size (px) of the square crop viewport shown in the modal.
const VIEWPORT_SIZE = 256;
// Size (px) of the final exported logo (square, PNG).
const OUTPUT_SIZE = 512;

export default function GeneralInformationSection({ hasAccess = () => true }) {
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const viewportRef = useRef(null);

  const [logoUrl, setLogoUrl] = useState(
    "https://t4.ftcdn.net/jpg/02/38/94/05/240_F_238940516_0BihE7YocY9vpgClPDDWuuaLneDwxtWn.jpg",
  );

  // --- Crop modal state ---
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // data URL of the picked file
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [zoomScale, setZoomScale] = useState(1); // 1x - 3x on top of the base "cover" fit
  const [rotation, setRotation] = useState(0); // 0 | 90 | 180 | 270
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // top-left position of the image, in viewport px
  const dragState = useRef(null); // { startX, startY, startOffsetX, startOffsetY }

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleTriggerUpload = () => {
    setUploadError("");
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setUploadError("Please choose a PNG or JPG image.");
      e.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be under 2MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setZoomScale(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setUploadError("");
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // allow re-selecting the same file later
  };

  // Base "cover" scale so the image always fully fills the square viewport,
  // accounting for rotation (swap width/height on 90/270).
  const getBaseScale = useCallback(() => {
    if (!naturalSize.width || !naturalSize.height) return 1;
    const rotated = rotation % 180 !== 0;
    const w = rotated ? naturalSize.height : naturalSize.width;
    const h = rotated ? naturalSize.width : naturalSize.height;
    return Math.max(VIEWPORT_SIZE / w, VIEWPORT_SIZE / h);
  }, [naturalSize, rotation]);

  // The image box itself always keeps its natural (unswapped) aspect ratio —
  // rotation is applied as a separate CSS transform around the box's center,
  // same as the canvas export below. getBaseScale already accounts for
  // rotation so the box is guaranteed to cover the viewport once rotated.
  const getDisplaySize = useCallback(() => {
    const scale = getBaseScale() * zoomScale;
    return {
      width: naturalSize.width * scale,
      height: naturalSize.height * scale,
      scale,
    };
  }, [getBaseScale, zoomScale, naturalSize]);

  const clampOffset = useCallback(
    (next) => {
      const { width, height } = getDisplaySize();
      const minX = VIEWPORT_SIZE - width;
      const minY = VIEWPORT_SIZE - height;
      return {
        x: Math.min(0, Math.max(minX, next.x)),
        y: Math.min(0, Math.max(minY, next.y)),
      };
    },
    [getDisplaySize],
  );

  // Re-center whenever a new image loads or rotation changes. Rotation always
  // recenters (rather than trying to preserve the pan offset) so the rotation
  // math below — which rotates the box around its own center — stays simple
  // and always keeps the image covering the crop viewport.
  useEffect(() => {
    const { width, height } = getDisplaySize();
    setOffset({
      x: (VIEWPORT_SIZE - width) / 2,
      y: (VIEWPORT_SIZE - height) / 2,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [naturalSize, rotation]);

  useEffect(() => {
    setOffset((prev) => clampOffset(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomScale]);

  const handleImageLoad = (e) => {
    setNaturalSize({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    });
  };

  // --- Drag to move (mouse + touch) ---
  const handlePointerDown = (clientX, clientY) => {
    dragState.current = {
      startX: clientX,
      startY: clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
    };
  };

  const handlePointerMove = (clientX, clientY) => {
    if (!dragState.current) return;
    const dx = clientX - dragState.current.startX;
    const dy = clientY - dragState.current.startY;
    setOffset(
      clampOffset({
        x: dragState.current.startOffsetX + dx,
        y: dragState.current.startOffsetY + dy,
      }),
    );
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  const handleRotate = (dir) => {
    setRotation((r) => (r + (dir === "left" ? -90 : 90) + 360) % 360);
  };

  const handleCancelCrop = () => {
    setIsCropOpen(false);
    setSelectedImage(null);
    setUploadError("");
  };

  // Renders the crop into a square canvas and returns a Blob + preview data URL.
  const renderCroppedImage = () =>
    new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));

        const { width, height } = getDisplaySize();
        const outputScale = OUTPUT_SIZE / VIEWPORT_SIZE;

        // Mirrors the preview exactly: the image box sits at (offset.x, offset.y)
        // with its natural aspect ratio, and rotation happens around the box's
        // own center — same as the CSS `transform: rotate()` with a center origin.
        const centerX = (offset.x + width / 2) * outputScale;
        const centerY = (offset.y + height / 2) * outputScale;
        const drawW = width * outputScale;
        const drawH = height * outputScale;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Failed to export image"));
            resolve({ blob, dataUrl: canvas.toDataURL("image/png") });
          },
          "image/png",
          0.92,
        );
      };
      img.onerror = reject;
      img.src = selectedImage;
    });

  const handleExecuteCrop = async () => {
    setUploadError("");
    setIsUploading(true);
    try {
      const { blob, dataUrl } = await renderCroppedImage();

      // Optimistic preview while the upload is in flight.
      setLogoUrl(dataUrl);

      // --- Backend integration point ---
      // Backend route isn't wired up yet. This assumes a shape consistent with
      // the rest of api.js: reuse the generic uploadFiles() helper with a new
      // "logo" purpose (the backend will need to accept that value and route
      // it to the right Cloudinary folder), then persist the resulting URL on
      // the school profile. Swap this block out once the real route exists.
      const file = new File([blob], "school-logo.png", { type: "image/png" });
      const uploadResult = await api.uploadFiles([file], "logo");
      const uploadedUrl = uploadResult?.[0]?.url;
      if (uploadedUrl) {
        await api.updateSchoolProfile({ logo: uploadedUrl });
        setLogoUrl(uploadedUrl);
      }

      setIsCropOpen(false);
      setSelectedImage(null);
    } catch (err) {
      setUploadError(
        err?.message || "Couldn't upload the logo. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {hasAccess("generalInfo") && (
        <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">General Information</h2>
          <p className="text-sm text-slate-500 mb-6">Update your school's basic information.</p>

          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-full">School Logo</div>

              <div className="w-32 h-32 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 shadow-sm overflow-hidden">
                <img
                  src={logoUrl}
                  alt="School Logo"
                  className="object-contain h-full w-full opacity-90 dark:mix-blend-normal mix-blend-multiply"
                />
              </div>

              {hasAccess("generalInfoEdit") && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={handleTriggerUpload}
                    className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center gap-1.5 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    <Upload size={16} /> Change Logo
                  </button>
                  <span className="text-[11px] text-slate-400 -mt-2">PNG, JPG up to 2MB</span>
                  {uploadError && !isCropOpen && (
                    <span className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {uploadError}
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="sc-name">School Name</Label>
                <Input
                  id="sc-name"
                  type="text"
                  defaultValue="EduSphere International School"
                  disabled={!hasAccess("generalInfoEdit")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sc-code">School Code</Label>
                <Input
                  id="sc-code"
                  type="text"
                  defaultValue="EDU1234"
                  disabled
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sc-email">Email Address</Label>
                <Input
                  id="sc-email"
                  type="email"
                  defaultValue="info@edusphere.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sc-phone">Phone Number</Label>
                <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20">
                  <div className="bg-slate-50 dark:bg-slate-700/60 border-r border-slate-200 dark:border-slate-700 px-3 py-2 text-sm flex items-center gap-1.5 cursor-default">
                    <span>🇮🇳</span>
                  </div>
                  <Input
                    id="sc-phone"
                    type="text"
                    defaultValue="+91 98765 43210"
                    className="border-0 focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 max-w-xl w-full space-y-1.5">
                <Label htmlFor="sc-address">Address</Label>
                <Textarea
                  id="sc-address"
                  rows={3}
                  defaultValue="123 Education Street, Knowledge City, Bangalore"
                  disabled={!hasAccess("generalInfoEdit")}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isCropOpen} onClose={isUploading ? () => {} : handleCancelCrop}>
        <ModalContent maxWidth="max-w-md">
          <ModalHeader>
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-sm">
              <Crop size={16} className="text-indigo-500" />
              <span>Adjust School Logo</span>
            </div>
          </ModalHeader>

          <div className="py-4 space-y-5 flex flex-col items-center">
            <div
              ref={viewportRef}
              className="relative bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 cursor-move select-none touch-none"
              style={{ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE }}
              onMouseDown={(e) => {
                e.preventDefault();
                handlePointerDown(e.clientX, e.clientY);
              }}
              onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={(e) => {
                const t = e.touches[0];
                handlePointerDown(t.clientX, t.clientY);
              }}
              onTouchMove={(e) => {
                const t = e.touches[0];
                handlePointerMove(t.clientX, t.clientY);
              }}
              onTouchEnd={handlePointerUp}
            >
              {selectedImage && (
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="To crop"
                  onLoad={handleImageLoad}
                  draggable={false}
                  className="absolute pointer-events-none"
                  style={{
                    left: offset.x,
                    top: offset.y,
                    width: getDisplaySize().width || "auto",
                    height: getDisplaySize().height || "auto",
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                  }}
                />
              )}
              {/* circular crop guide — final export is square, this just helps framing a logo mark */}
              <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-indigo-500/50 rounded-xl" />
            </div>

            <div className="w-full space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1"><ZoomIn size={12} /> Zoom</span>
                  <span>{Math.round(zoomScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoomScale}
                  onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                  disabled={isUploading}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Rotate</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRotate("left")}
                    disabled={isUploading}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRotate("right")}
                    disabled={isUploading}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    <RotateCw size={14} />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center">Drag the image to reposition it.</p>

              {uploadError && (
                <p className="text-[11px] text-red-500 flex items-center justify-center gap-1">
                  <AlertCircle size={12} /> {uploadError}
                </p>
              )}
            </div>
          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelCrop}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleExecuteCrop}
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 size={14} className="animate-spin" /> Uploading...
                </span>
              ) : (
                "Apply & Save"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}