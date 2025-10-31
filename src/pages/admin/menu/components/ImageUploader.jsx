import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Star, Trash2, ShieldCheck } from 'lucide-react';

const ImageUploader = ({ onImagesChange, initialImages = [] }) => {
    const [images, setImages] = useState([]); // { file: File, url: string, isFeatured: boolean }
    const fileInputRef = useRef(null);

    const getImagesKey = (imgs) => {
        return JSON.stringify(imgs.map(img => ({ url: img.url, isFeatured: img.isFeatured })));
    };

    useEffect(() => {
        // Chỉ cập nhật nếu initialImages có thật và khác với state hiện tại
        // để tránh re-render không cần thiết
        if (initialImages && initialImages.length > 0) {
            const initialKey = getImagesKey(initialImages);
            const currentKey = getImagesKey(images);
            if (initialKey !== currentKey) {
                setImages(initialImages);
            }
        }
    }, [initialImages]);

    // Call onImagesChange whenever the images state changes
    useEffect(() => {
        onImagesChange(images);
    }, [images, onImagesChange]);

    // Hook này sẽ chạy khi component bị hủy (unmount)
    useEffect(() => {
        return () => {
            // Thu hồi tất cả các blob URL đã tạo để giải phóng bộ nhớ
            images.forEach(image => {
                if (image.url.startsWith('blob:')) {
                    URL.revokeObjectURL(image.url);
                }
            });
        };
    }, [images]);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map((file, index) => ({
            file,
            url: URL.createObjectURL(file), // Tạo URL tạm thời
            isFeatured: images.length === 0 && index === 0,
        }));

        setImages(prev => [...prev, ...newImages]);
    };

    const handleSetFeatured = (indexToFeature) => {
        setImages(prev => prev.map((img, index) => ({
            ...img,
            isFeatured: index === indexToFeature
        })));
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(prev => {
            const imageToRemove = prev[indexToRemove];
            const newImages = prev.filter((_, index) => index !== indexToRemove);

            // If the removed image was featured and there are other images left,
            // make the new first image the featured one.
            if (imageToRemove.isFeatured && newImages.length > 0) {
                newImages[0].isFeatured = true;
            }
            return newImages;
        });
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Menu Item Images</h3>
            <p className="mt-1 text-sm text-gray-500">Add up to 5 images. The first image will be the default featured image.</p>

            {/* Image url Grid */}
            {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {images.map((image, index) => (
                        <div key={index} className="group relative aspect-square overflow-hidden rounded-md">
                            <div className="absolute inset-0 bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50">
                                <img src={image.url} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                                {/* Actions */}
                                <div className="absolute top-1 right-1">
                                    <button type="button" onClick={() => handleRemoveImage(index)} className="rounded-full bg-red-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                {/* Featured Badge/Button */}
                                {image.isFeatured ? (
                                    <div className="absolute bottom-1 left-1 flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-bold text-white">
                                        <ShieldCheck size={14} /> Featured
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => handleSetFeatured(index)} className="absolute bottom-1 left-1 rounded-md bg-blue-600 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-blue-700">
                                        <Star size={14} /> Set Featured
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            <div
                className="mt-4 flex cursor-pointer justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 hover:border-indigo-500"
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <span className="font-medium text-indigo-600">Click to upload</span>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>
        </div>
    );
};

export default ImageUploader;  