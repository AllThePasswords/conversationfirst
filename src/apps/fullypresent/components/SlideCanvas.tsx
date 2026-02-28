import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Canvas, FabricImage, IText, Shadow, Rect, Group, FabricObject, ActiveSelection, loadSVGFromString } from 'fabric';

// Canvas dimensions - 16:9 HD
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

// Module-level clipboard for copy/paste across slides (single or multiple objects)
let canvasClipboard: string | null = null;
let canvasClipboardMulti: boolean = false;

// Supported file types
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
const SVG_TYPES = ['image/svg+xml'];
const PDF_TYPES = ['application/pdf'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export interface SimpleSelectedObjectInfo {
  type: 'image' | 'video' | 'text' | null;
  videoAutoplay?: boolean;
  videoLoop?: boolean;
  cornerRadius?: number;
  shadowIntensity?: number;
  shadowEnabled?: boolean;
  shadowDarkness?: number;
  shadowDepth?: number;
}

export interface SimpleSlideCanvasHandle {
  addFile: (file: File) => Promise<void>;
  addFromDataUrl: (dataUrl: string, name: string, type: 'image' | 'video' | 'svg' | 'pdf', options?: { fullBleed?: boolean }) => Promise<void>;
  addText: () => void;
  getJson: () => string;
  loadJson: (json: string) => Promise<void>;
  clear: () => void;
  getDataUrl: () => string;
  isLoading: () => boolean;
  setVideoAutoplay: (autoplay: boolean) => void;
  setVideoLoop: (loop: boolean) => void;
  getSelectedInfo: () => SimpleSelectedObjectInfo | null;
  setCornerRadius: (radius: number) => void;
  setShadowIntensity: (intensity: number) => void;
  setShadowEnabled: (enabled: boolean) => void;
  setShadowDarkness: (darkness: number) => void;
  setShadowDepth: (depth: number) => void;
  setSlideBackground: (dataUrl: string) => Promise<void>;
}

// Create thumbnail from video
async function createVideoThumbnail(videoUrl: string): Promise<{
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'metadata';

    video.onloadeddata = () => {
      video.currentTime = 0.1; // Seek to get first frame
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
      }
      resolve({
        canvas,
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };

    video.onerror = () => reject(new Error('Failed to load video'));
    video.src = videoUrl;
    video.load();
  });
}

// Convert File/Blob to data URL for persistence
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Lazy-load pdf.js from CDN
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pdfJsPromise: Promise<any> | null = null;
async function loadPdfJs() {
  if (pdfJsPromise) return pdfJsPromise;
  pdfJsPromise = (async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
    return new Promise((resolve, reject) => {
      const classicScript = document.createElement('script');
      classicScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.js';
      classicScript.onload = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lib = (window as any).pdfjsLib;
        if (lib) {
          lib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
          resolve(lib);
        } else {
          reject(new Error('pdf.js failed to load'));
        }
      };
      classicScript.onerror = () => reject(new Error('Failed to load pdf.js'));
      document.head.appendChild(classicScript);
    });
  })();
  return pdfJsPromise;
}

// Media info for vault storage
export interface AddedMediaInfo {
  name: string;
  type: 'image' | 'video' | 'svg' | 'pdf';
  dataUrl: string;
  thumbnail?: string; // For videos and PDFs
  pageCount?: number; // For PDFs
}

export interface SimpleSlideCanvasProps {
  className?: string;
  onContentChange?: () => void;
  onSelectionChange?: (info: SimpleSelectedObjectInfo | null) => void;
  onMediaAdded?: (media: AddedMediaInfo) => void; // Called when image/video is added
}

export const SimpleSlideCanvas = forwardRef<SimpleSlideCanvasHandle, SimpleSlideCanvasProps>(
  function SimpleSlideCanvas({ className = '', onContentChange, onSelectionChange, onMediaAdded }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasElRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<Canvas | null>(null);
    const [displaySize, setDisplaySize] = useState({ width: 800, height: 450 });
    const [isEmpty, setIsEmpty] = useState(true);
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const loadingRef = useRef(false); // For synchronous access (file loading)
    const loadingJsonRef = useRef(false); // For synchronous access (JSON loading)
    const suppressChangeRef = useRef(false); // Suppress onContentChange during loadJson

    // Keep refs to callbacks so canvas events always call the latest version
    const onContentChangeRef = useRef(onContentChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const onMediaAddedRef = useRef(onMediaAdded);

    // Update refs when callbacks change
    useEffect(() => {
      onContentChangeRef.current = onContentChange;
    }, [onContentChange]);
    useEffect(() => {
      onSelectionChangeRef.current = onSelectionChange;
    }, [onSelectionChange]);
    useEffect(() => {
      onMediaAddedRef.current = onMediaAdded;
    }, [onMediaAdded]);

    // Track if component is disposed/unmounted
    const isDisposedRef = useRef(false);

    // Undo/redo history
    const historyRef = useRef<string[]>([]);
    const historyIndexRef = useRef(-1);
    const isUndoRedoRef = useRef(false); // Prevent saving state during undo/redo
    const MAX_HISTORY = 50;

    // Calculate display size maintaining 16:9 aspect ratio
    const updateDisplaySize = useCallback(() => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // Calculate size that fits in container while maintaining 16:9
      let width = containerWidth;
      let height = width / (16 / 9);

      if (height > containerHeight) {
        height = containerHeight;
        width = height * (16 / 9);
      }

      setDisplaySize({ width, height });
    }, []);

    // Initialize canvas
    useEffect(() => {
      if (!canvasElRef.current || fabricRef.current) return;

      // Reset disposed flag on mount
      isDisposedRef.current = false;

      const canvas = new Canvas(canvasElRef.current, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: '#ffffff',
        selection: true,
      });

      fabricRef.current = canvas;

      // Update isEmpty on changes
      const updateEmpty = () => {
        setIsEmpty(canvas.getObjects().length === 0);
      };

      // Trigger auto-save (unless suppressed during load)
      // Uses ref to always call the latest callback
      const triggerSave = () => {
        if (!suppressChangeRef.current && !isUndoRedoRef.current) {
          onContentChangeRef.current?.();
        }
      };

      canvas.on('object:added', updateEmpty);
      canvas.on('object:removed', updateEmpty);

      // Auto-save on all content changes
      canvas.on('object:added', triggerSave);
      canvas.on('object:removed', triggerSave);
      canvas.on('object:modified', triggerSave); // Move, resize, rotate
      canvas.on('text:changed', triggerSave); // Text editing

      // Save to history on modifications
      const saveHistory = () => {
        if (!isUndoRedoRef.current && !suppressChangeRef.current) {
          const json = JSON.stringify(canvas.toJSON());
          // Remove any redo states
          historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
          historyRef.current.push(json);
          if (historyRef.current.length > MAX_HISTORY) {
            historyRef.current.shift();
          } else {
            historyIndexRef.current++;
          }
        }
      };

      canvas.on('object:added', saveHistory);
      canvas.on('object:removed', saveHistory);
      canvas.on('object:modified', saveHistory);
      canvas.on('text:changed', saveHistory);

      // Save initial empty state
      historyRef.current = [JSON.stringify(canvas.toJSON())];
      historyIndexRef.current = 0;

      // Selection change handler - uses ref to always call latest callback
      const handleSelectionChange = () => {
        const activeObj = canvas.getActiveObject();
        if (!activeObj) {
          onSelectionChangeRef.current?.(null);
          return;
        }

        const isVideo = (activeObj as any).isVideo === true;
        const isText = activeObj.type === 'i-text' || activeObj.type === 'text';

        // Extract current shadow properties
        let shadowIntensity = 0;
        let shadowEnabled = false;
        let shadowDarkness = 50;
        let shadowDepth = 50;
        if (activeObj.shadow && typeof activeObj.shadow === 'object') {
          const shadow = activeObj.shadow as { blur?: number; offsetY?: number; color?: string };
          shadowEnabled = true;
          if (shadow.blur) {
            // Map blur (5-40) back to intensity (0-100)
            shadowIntensity = Math.round(((shadow.blur - 5) / 35) * 100);
            shadowIntensity = Math.max(0, Math.min(100, shadowIntensity));
            // Map blur (5-50) back to depth (0-100)
            shadowDepth = Math.round(((shadow.blur - 5) / 45) * 100);
            shadowDepth = Math.max(0, Math.min(100, shadowDepth));
          }
          if (shadow.color) {
            // Extract opacity from rgba color string
            const match = shadow.color.match(/[\d.]+(?=\))/);
            if (match) {
              const opacity = parseFloat(match[0]);
              // Map opacity (0.05-0.40) back to darkness (0-100)
              shadowDarkness = Math.round(((opacity - 0.05) / 0.35) * 100);
              shadowDarkness = Math.max(0, Math.min(100, shadowDarkness));
            }
          }
        }

        // Extract current corner radius from clipPath
        let cornerRadius = 0;
        if (activeObj.clipPath && (activeObj.clipPath as any).rx) {
          cornerRadius = Math.round((activeObj.clipPath as any).rx * (activeObj.scaleX || 1));
        }

        const info: SimpleSelectedObjectInfo = {
          type: isVideo ? 'video' : isText ? 'text' : 'image',
          videoAutoplay: isVideo ? (activeObj as any).videoAutoplay : undefined,
          videoLoop: isVideo ? (activeObj as any).videoLoop : undefined,
          cornerRadius,
          shadowIntensity,
          shadowEnabled,
          shadowDarkness,
          shadowDepth,
        };

        onSelectionChangeRef.current?.(info);
      };

      canvas.on('selection:created', handleSelectionChange);
      canvas.on('selection:updated', handleSelectionChange);
      canvas.on('selection:cleared', () => onSelectionChangeRef.current?.(null));

      // Initial size calculation
      updateDisplaySize();

      return () => {
        // Suppress change events during unmount to prevent saving empty content
        suppressChangeRef.current = true;
        isDisposedRef.current = true;
        canvas.dispose();
        fabricRef.current = null;
      };
    }, [updateDisplaySize]); // Removed onContentChange - we use refs now

    // Handle resize
    useEffect(() => {
      const observer = new ResizeObserver(updateDisplaySize);
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
      return () => observer.disconnect();
    }, [updateDisplaySize]);

    // Apply zoom when display size changes
    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas || displaySize.width === 0) return;

      const zoom = displaySize.width / CANVAS_WIDTH;
      canvas.setZoom(zoom);
      canvas.setDimensions({
        width: displaySize.width,
        height: displaySize.height,
      });
      canvas.renderAll();
    }, [displaySize]);

    // Add file (image, video, SVG, or PDF) to canvas - SIMPLE and CENTERED
    const addFile = useCallback(async (file: File) => {
      const canvas = fabricRef.current;
      if (!canvas) {
        console.error('Canvas not initialized');
        return;
      }

      // Set loading state
      setIsLoadingContent(true);
      loadingRef.current = true;
      console.log('addFile: Starting to load', file.name);

      const url = URL.createObjectURL(file);
      const isVideo = VIDEO_TYPES.includes(file.type);
      const isImage = IMAGE_TYPES.includes(file.type);
      const isSvg = SVG_TYPES.includes(file.type);
      const isPdf = PDF_TYPES.includes(file.type);

      if (!isVideo && !isImage && !isSvg && !isPdf) {
        console.error('Unsupported file type:', file.type);
        URL.revokeObjectURL(url);
        setIsLoadingContent(false);
        loadingRef.current = false;
        return;
      }

      try {
        if (isSvg) {
          // Handle SVG - parse and add as Fabric group
          const svgText = await file.text();
          const svgDataUrl = await fileToDataUrl(file);
          URL.revokeObjectURL(url);

          const result = await loadSVGFromString(svgText);
          if (!result.objects || result.objects.length === 0) {
            throw new Error('Empty or invalid SVG');
          }

          const group = new Group(result.objects.filter((obj): obj is FabricObject => obj !== null));
          const objWidth = group.width || 100;
          const objHeight = group.height || 100;

          const maxWidth = CANVAS_WIDTH * 0.6;
          const maxHeight = CANVAS_HEIGHT * 0.6;
          const svgScale = Math.min(maxWidth / objWidth, maxHeight / objHeight, 1);

          group.set({
            left: CANVAS_WIDTH / 2,
            top: CANVAS_HEIGHT / 2,
            originX: 'center',
            originY: 'center',
            scaleX: svgScale,
            scaleY: svgScale,
          });

          canvas.add(group);
          canvas.setActiveObject(group);
          canvas.renderAll();

          onMediaAdded?.({
            name: file.name,
            type: 'svg',
            dataUrl: svgDataUrl,
          });

          console.log('addFile: SVG added successfully');
        } else if (isPdf) {
          // Handle PDF - render first page as image
          const pdfDataUrl = await fileToDataUrl(file);
          URL.revokeObjectURL(url);

          const pdfjsLib = await loadPdfJs();
          const pdfData = atob(pdfDataUrl.split(',')[1]);
          const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
          const pageCount = pdfDoc.numPages;

          const page = await pdfDoc.getPage(1);
          const viewport = page.getViewport({ scale: 2 });
          const pdfCanvas = document.createElement('canvas');
          pdfCanvas.width = viewport.width;
          pdfCanvas.height = viewport.height;
          const pdfCtx = pdfCanvas.getContext('2d')!;
          await page.render({ canvasContext: pdfCtx, viewport }).promise;

          const pageImageUrl = pdfCanvas.toDataURL('image/png');
          const img = await FabricImage.fromURL(pageImageUrl);

          const pdfImgWidth = img.width || 100;
          const pdfImgHeight = img.height || 100;
          const pdfMaxWidth = CANVAS_WIDTH * 0.6;
          const pdfMaxHeight = CANVAS_HEIGHT * 0.6;
          const pdfScale = Math.min(pdfMaxWidth / pdfImgWidth, pdfMaxHeight / pdfImgHeight, 1);

          img.set({
            left: CANVAS_WIDTH / 2,
            top: CANVAS_HEIGHT / 2,
            originX: 'center',
            originY: 'center',
            scaleX: pdfScale,
            scaleY: pdfScale,
            /* shadow added via design panel, not by default */
          });

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();

          // Create smaller thumbnail for vault
          const thumbCanvas = document.createElement('canvas');
          const thumbScale = 400 / viewport.width;
          thumbCanvas.width = 400;
          thumbCanvas.height = viewport.height * thumbScale;
          const thumbCtx = thumbCanvas.getContext('2d')!;
          thumbCtx.drawImage(pdfCanvas, 0, 0, thumbCanvas.width, thumbCanvas.height);

          onMediaAdded?.({
            name: file.name,
            type: 'pdf',
            dataUrl: pdfDataUrl,
            thumbnail: thumbCanvas.toDataURL('image/jpeg', 0.7),
            pageCount,
          });

          console.log('addFile: PDF page 1 added successfully', `(${pageCount} pages total)`);
        } else if (isImage) {
          // Handle image - convert to data URL for persistence (blob URLs don't survive reload)
          const imageDataUrl = await fileToDataUrl(file);
          const img = await FabricImage.fromURL(imageDataUrl);

          // Clean up the temporary blob URL
          URL.revokeObjectURL(url);

          const imgWidth = img.width || 100;
          const imgHeight = img.height || 100;

          console.log('Original image size:', imgWidth, 'x', imgHeight);

          // Scale to fit within 60% of canvas
          const maxWidth = CANVAS_WIDTH * 0.6;
          const maxHeight = CANVAS_HEIGHT * 0.6;
          const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);

          console.log('Scale factor:', scale);

          // Position at exact center
          img.set({
            left: CANVAS_WIDTH / 2,
            top: CANVAS_HEIGHT / 2,
            originX: 'center',
            originY: 'center',
            scaleX: scale,
            scaleY: scale,
            /* shadow added via design panel, not by default */
          });

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();

          // Notify parent to add to vault
          onMediaAdded?.({
            name: file.name,
            type: 'image',
            dataUrl: imageDataUrl,
          });

          console.log('addFile: Image added successfully with data URL');
        } else {
          // Handle video - create thumbnail with play button
          console.log('Processing video:', file.name);

          const { canvas: thumbCanvas, width, height } = await createVideoThumbnail(url);

          // Convert video file to data URL for persistence (blob URLs don't survive reload)
          const videoDataUrl = await fileToDataUrl(file);

          // Create FabricImage from thumbnail canvas
          const thumbImg = new FabricImage(thumbCanvas);

          // Scale to fit within 60% of canvas
          const maxWidth = CANVAS_WIDTH * 0.6;
          const maxHeight = CANVAS_HEIGHT * 0.6;
          const scale = Math.min(maxWidth / width, maxHeight / height, 1);

          // Set up the thumbnail image with shadow (no play button overlay)
          thumbImg.set({
            left: CANVAS_WIDTH / 2,
            top: CANVAS_HEIGHT / 2,
            scaleX: scale,
            scaleY: scale,
            originX: 'center',
            originY: 'center',
            /* shadow added via design panel, not by default */
          });

          // Store video data on the image - use data URL for persistence
          (thumbImg as any).isVideo = true;
          (thumbImg as any).videoUrl = videoDataUrl; // Use data URL instead of blob URL
          (thumbImg as any).videoFileName = file.name;
          (thumbImg as any).videoAutoplay = true; // Default to autoplay
          (thumbImg as any).videoLoop = false; // Default to no loop

          canvas.add(thumbImg);
          canvas.setActiveObject(thumbImg);
          canvas.renderAll();

          // Clean up blob URL since we're using data URL now
          URL.revokeObjectURL(url);

          // Notify parent to add to vault (with thumbnail)
          const thumbnailDataUrl = thumbCanvas.toDataURL('image/jpeg', 0.7);
          onMediaAdded?.({
            name: file.name,
            type: 'video',
            dataUrl: videoDataUrl,
            thumbnail: thumbnailDataUrl,
          });

          console.log('addFile: Video thumbnail added successfully');
        }

        // Trigger save after content is added
        onContentChange?.();
      } catch (err) {
        console.error('Failed to load file:', err);
      } finally {
        // Clear loading state
        setIsLoadingContent(false);
        loadingRef.current = false;
        console.log('addFile: Loading complete');
      }
    }, [onContentChange, onMediaAdded]);

    // Add media from vault (by data URL) - doesn't trigger onMediaAdded since it's already in vault
    const addFromDataUrl = useCallback(async (dataUrl: string, name: string, type: 'image' | 'video' | 'svg' | 'pdf', options?: { fullBleed?: boolean }) => {
      const canvas = fabricRef.current;
      if (!canvas) {
        console.error('Canvas not initialized');
        return;
      }

      setIsLoadingContent(true);
      loadingRef.current = true;

      try {
        if (type === 'svg') {
          // Decode SVG data URL to text and load as Fabric group
          const svgText = atob(dataUrl.split(',')[1]);
          const result = await loadSVGFromString(svgText);
          if (!result.objects || result.objects.length === 0) {
            throw new Error('Empty or invalid SVG');
          }

          const group = new Group(result.objects.filter((obj): obj is FabricObject => obj !== null));
          const objWidth = group.width || 100;
          const objHeight = group.height || 100;
          const maxWidth = CANVAS_WIDTH * 0.6;
          const maxHeight = CANVAS_HEIGHT * 0.6;
          const svgScale = Math.min(maxWidth / objWidth, maxHeight / objHeight, 1);

          group.set({
            left: CANVAS_WIDTH / 2,
            top: CANVAS_HEIGHT / 2,
            originX: 'center',
            originY: 'center',
            scaleX: svgScale,
            scaleY: svgScale,
          });

          canvas.add(group);
          canvas.setActiveObject(group);
          canvas.renderAll();
        } else if (type === 'pdf') {
          // Render first page of PDF as image
          const pdfjsLib = await loadPdfJs();
          const pdfData = atob(dataUrl.split(',')[1]);
          const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;

          const page = await pdfDoc.getPage(1);
          const viewport = page.getViewport({ scale: 2 });
          const pdfCanvas = document.createElement('canvas');
          pdfCanvas.width = viewport.width;
          pdfCanvas.height = viewport.height;
          const pdfCtx = pdfCanvas.getContext('2d')!;
          await page.render({ canvasContext: pdfCtx, viewport }).promise;

          const pageImageUrl = pdfCanvas.toDataURL('image/png');
          const img = await FabricImage.fromURL(pageImageUrl);

          const imgWidth = img.width || 100;
          const imgHeight = img.height || 100;
          const maxWidth = CANVAS_WIDTH * 0.6;
          const maxHeight = CANVAS_HEIGHT * 0.6;
          const pdfScale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);

          img.set({
            left: CANVAS_WIDTH / 2,
            top: CANVAS_HEIGHT / 2,
            originX: 'center',
            originY: 'center',
            scaleX: pdfScale,
            scaleY: pdfScale,
            /* shadow added via design panel, not by default */
          });

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        } else if (type === 'image') {
          const img = await FabricImage.fromURL(dataUrl);

          const imgWidth = img.width || 100;
          const imgHeight = img.height || 100;

          if (options?.fullBleed) {
            // Scale to cover the entire canvas (no shadow, no mockup)
            const coverScale = Math.max(CANVAS_WIDTH / imgWidth, CANVAS_HEIGHT / imgHeight);
            img.set({
              left: CANVAS_WIDTH / 2,
              top: CANVAS_HEIGHT / 2,
              originX: 'center',
              originY: 'center',
              scaleX: coverScale,
              scaleY: coverScale,
            });
          } else {
            const maxWidth = CANVAS_WIDTH * 0.6;
            const maxHeight = CANVAS_HEIGHT * 0.6;
            const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);

            img.set({
              left: CANVAS_WIDTH / 2,
              top: CANVAS_HEIGHT / 2,
              originX: 'center',
              originY: 'center',
              scaleX: scale,
              scaleY: scale,
              shadow: new Shadow({
                color: 'rgba(0, 0, 0, 0.15)',
                blur: 20,
                offsetX: 0,
                offsetY: 10,
              }),
            });
          }

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        } else {
          // For video, create thumbnail from the data URL
          const { canvas: thumbCanvas, width, height } = await createVideoThumbnail(dataUrl);
          const thumbImg = new FabricImage(thumbCanvas);

          const maxWidth = CANVAS_WIDTH * 0.6;
          const maxHeight = CANVAS_HEIGHT * 0.6;
          const scale = Math.min(maxWidth / width, maxHeight / height, 1);

          thumbImg.set({
            left: CANVAS_WIDTH / 2,
            top: CANVAS_HEIGHT / 2,
            scaleX: scale,
            scaleY: scale,
            originX: 'center',
            originY: 'center',
            /* shadow added via design panel, not by default */
          });

          (thumbImg as any).isVideo = true;
          (thumbImg as any).videoUrl = dataUrl;
          (thumbImg as any).videoFileName = name;
          (thumbImg as any).videoAutoplay = true;
          (thumbImg as any).videoLoop = false;

          canvas.add(thumbImg);
          canvas.setActiveObject(thumbImg);
          canvas.renderAll();
        }

        onContentChange?.();
      } catch (err) {
        console.error('Failed to add from vault:', err);
      } finally {
        setIsLoadingContent(false);
        loadingRef.current = false;
      }
    }, [onContentChange]);

    // Add text
    const addText = useCallback(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const text = new IText('Type here...', {
        left: CANVAS_WIDTH / 2,
        top: CANVAS_HEIGHT / 2,
        originX: 'center',
        originY: 'center',
        fontSize: 64,
        fontWeight: '600',
        fontFamily: 'Inter, system-ui, sans-serif',
        fill: '#1a1a1a',
      });

      canvas.add(text);
      canvas.setActiveObject(text);
      text.enterEditing();
      text.selectAll();
      canvas.renderAll();
    }, []);

    // Custom properties to include in JSON serialization
    const CUSTOM_PROPERTIES = [
      'isVideo',
      'videoUrl',
      'videoAutoplay',
      'videoLoop',
      'videoFileName',
    ];

    // Get canvas JSON - include custom properties
    const getJson = useCallback(() => {
      const canvas = fabricRef.current;
      if (!canvas) {
        console.log('getJson: No canvas');
        return '';
      }
      try {
        // Get base JSON
        const canvasJson = canvas.toJSON();

        // Manually add custom properties to each object
        const objects = canvas.getObjects();
        canvasJson.objects = canvasJson.objects.map((objJson: Record<string, unknown>, index: number) => {
          const obj = objects[index];
          if (obj) {
            CUSTOM_PROPERTIES.forEach((prop) => {
              if ((obj as any)[prop] !== undefined) {
                objJson[prop] = (obj as any)[prop];
              }
            });
          }
          return objJson;
        });

        const json = JSON.stringify(canvasJson);
        console.log('getJson: Got JSON, length:', json.length, 'objects:', canvas.getObjects().length);
        return json;
      } catch (err) {
        console.error('getJson failed:', err);
        return '';
      }
    }, []);

    // Load canvas from JSON
    const loadJson = useCallback(async (json: string) => {
      // Skip if canvas is disposed/unmounting
      if (isDisposedRef.current) return;

      const canvas = fabricRef.current;
      if (!canvas) return;

      // Check if canvas context is valid (not disposed)
      const ctx = (canvas as any).contextContainer;
      if (!ctx) return;

      // Set loading state and suppress onContentChange during load
      loadingJsonRef.current = true;
      suppressChangeRef.current = true;

      if (!json || json === '') {
        try {
          canvas.clear();
          canvas.backgroundColor = '#ffffff';
          canvas.renderAll();
          console.log('loadJson: Cleared canvas (empty JSON)');
        } catch (err) {
          console.error('loadJson clear failed:', err);
        }
        suppressChangeRef.current = false;
        loadingJsonRef.current = false;
        return;
      }

      try {
        // Parse JSON to extract custom properties
        const parsedJson = JSON.parse(json);
        const customPropsMap: Record<number, Record<string, unknown>> = {};

        // Store custom properties before loading
        if (parsedJson.objects) {
          parsedJson.objects.forEach((obj: Record<string, unknown>, index: number) => {
            const customProps: Record<string, unknown> = {};
            CUSTOM_PROPERTIES.forEach((prop) => {
              if (obj[prop] !== undefined) {
                customProps[prop] = obj[prop];
              }
            });
            if (Object.keys(customProps).length > 0) {
              customPropsMap[index] = customProps;
            }
          });
        }

        await canvas.loadFromJSON(json);

        // Restore custom properties to objects
        const objects = canvas.getObjects();
        Object.entries(customPropsMap).forEach(([indexStr, props]) => {
          const index = parseInt(indexStr, 10);
          const obj = objects[index];
          if (obj) {
            Object.entries(props).forEach(([key, value]) => {
              (obj as any)[key] = value;
            });
          }
        });

        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
        console.log('loadJson: Loaded, objects:', canvas.getObjects().length);
      } catch (err) {
        console.error('loadJson failed:', err);
        try {
          canvas.clear();
          canvas.backgroundColor = '#ffffff';
          canvas.renderAll();
        } catch {
          // Ignore secondary error
        }
      } finally {
        // Re-enable content change notifications and clear loading state
        suppressChangeRef.current = false;
        loadingJsonRef.current = false;
      }
    }, []);

    // Clear canvas
    const clear = useCallback(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      // Suppress onContentChange during clear
      suppressChangeRef.current = true;
      try {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
        console.log('clear: Canvas cleared');
      } catch (err) {
        console.error('clear failed:', err);
      } finally {
        suppressChangeRef.current = false;
      }
    }, []);

    // Get data URL for thumbnail
    const getDataUrl = useCallback(() => {
      const canvas = fabricRef.current;
      if (!canvas) return '';
      try {
        return canvas.toDataURL({
          format: 'png',
          quality: 0.5,
          multiplier: 0.2, // Small thumbnail
        });
      } catch (err) {
        console.error('getDataUrl failed:', err);
        return '';
      }
    }, []);

    // Check if currently loading (either files or JSON)
    const isLoading = useCallback(() => {
      return loadingRef.current || loadingJsonRef.current;
    }, []);

    // Undo
    const undo = useCallback(async () => {
      const canvas = fabricRef.current;
      if (!canvas || historyIndexRef.current <= 0) return;

      isUndoRedoRef.current = true;
      suppressChangeRef.current = true;

      historyIndexRef.current--;
      const json = historyRef.current[historyIndexRef.current];

      try {
        await canvas.loadFromJSON(json);
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
      } catch (err) {
        console.error('Undo failed:', err);
      } finally {
        isUndoRedoRef.current = false;
        suppressChangeRef.current = false;
      }
    }, []);

    // Redo
    const redo = useCallback(async () => {
      const canvas = fabricRef.current;
      if (!canvas || historyIndexRef.current >= historyRef.current.length - 1) return;

      isUndoRedoRef.current = true;
      suppressChangeRef.current = true;

      historyIndexRef.current++;
      const json = historyRef.current[historyIndexRef.current];

      try {
        await canvas.loadFromJSON(json);
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
      } catch (err) {
        console.error('Redo failed:', err);
      } finally {
        isUndoRedoRef.current = false;
        suppressChangeRef.current = false;
      }
    }, []);

    // Set video autoplay
    const setVideoAutoplay = useCallback((autoplay: boolean) => {
      const canvas = fabricRef.current;
      const activeObj = canvas?.getActiveObject();
      if (activeObj && (activeObj as any).isVideo) {
        (activeObj as any).videoAutoplay = autoplay;
        canvas?.renderAll();
        onContentChange?.();
      }
    }, [onContentChange]);

    // Set video loop
    const setVideoLoop = useCallback((loop: boolean) => {
      const canvas = fabricRef.current;
      const activeObj = canvas?.getActiveObject();
      if (activeObj && (activeObj as any).isVideo) {
        (activeObj as any).videoLoop = loop;
        canvas?.renderAll();
        onContentChange?.();
      }
    }, [onContentChange]);

    // Set corner radius for selected image/video
    const setCornerRadius = useCallback((radius: number) => {
      const canvas = fabricRef.current;
      const activeObj = canvas?.getActiveObject();
      if (!activeObj || activeObj.type === 'i-text' || activeObj.type === 'text') return;

      // For images, use clipPath with a rounded rect
      if (activeObj.type === 'image' || (activeObj as any).isVideo) {
        if (radius === 0) {
          // Remove clipPath
          activeObj.clipPath = undefined;
        } else {
          // Create rounded rectangle clipPath
          const clipRect = new Rect({
            width: activeObj.width || 100,
            height: activeObj.height || 100,
            rx: radius / (activeObj.scaleX || 1), // Adjust for scale
            ry: radius / (activeObj.scaleY || 1),
            originX: 'center',
            originY: 'center',
          });
          activeObj.clipPath = clipRect;
        }

        canvas?.renderAll();
        onContentChange?.();
      }
    }, [onContentChange]);

    // Set shadow intensity for selected object
    const setShadowIntensity = useCallback((intensity: number) => {
      const canvas = fabricRef.current;
      const activeObj = canvas?.getActiveObject();
      if (!activeObj || activeObj.type === 'i-text' || activeObj.type === 'text') return;

      if (intensity === 0) {
        // Remove shadow
        activeObj.shadow = null;
      } else {
        // Map intensity (0-100) to shadow properties
        const blur = 5 + (intensity / 100) * 35; // 5-40px blur
        const offsetY = 2 + (intensity / 100) * 18; // 2-20px offset
        const opacity = 0.05 + (intensity / 100) * 0.25; // 5-30% opacity

        activeObj.shadow = new Shadow({
          color: `rgba(0, 0, 0, ${opacity.toFixed(2)})`,
          blur: Math.round(blur),
          offsetX: 0,
          offsetY: Math.round(offsetY),
        });
      }

      canvas?.renderAll();
      onContentChange?.();
    }, [onContentChange]);

    // Helper to apply shadow from darkness + depth values
    const applyShadow = useCallback((obj: FabricObject, darkness: number, depth: number) => {
      const canvas = fabricRef.current;
      const blur = 5 + (depth / 100) * 45; // 5-50px blur
      const offsetY = 2 + (depth / 100) * 28; // 2-30px offset
      const opacity = 0.05 + (darkness / 100) * 0.35; // 5-40% opacity

      obj.shadow = new Shadow({
        color: `rgba(0, 0, 0, ${opacity.toFixed(2)})`,
        blur: Math.round(blur),
        offsetX: 0,
        offsetY: Math.round(offsetY),
      });

      canvas?.renderAll();
      onContentChange?.();
    }, [onContentChange]);

    // Toggle shadow on/off
    const setShadowEnabled = useCallback((enabled: boolean) => {
      const canvas = fabricRef.current;
      const activeObj = canvas?.getActiveObject();
      if (!activeObj || activeObj.type === 'i-text' || activeObj.type === 'text') return;

      if (!enabled) {
        activeObj.shadow = null;
      } else {
        // Apply default shadow (50/50 darkness/depth)
        applyShadow(activeObj, 50, 50);
      }

      canvas?.renderAll();
      onContentChange?.();
    }, [onContentChange, applyShadow]);

    // Set shadow darkness (opacity)
    const setShadowDarkness = useCallback((darkness: number) => {
      const canvas = fabricRef.current;
      const activeObj = canvas?.getActiveObject();
      if (!activeObj || activeObj.type === 'i-text' || activeObj.type === 'text') return;
      if (!activeObj.shadow) return;

      // Get current depth from existing shadow
      const shadow = activeObj.shadow as { blur?: number };
      const currentBlur = shadow.blur || 25;
      const currentDepth = Math.round(((currentBlur - 5) / 45) * 100);

      applyShadow(activeObj, darkness, currentDepth);
    }, [applyShadow]);

    // Set shadow depth (blur + offsetY)
    const setShadowDepth = useCallback((depth: number) => {
      const canvas = fabricRef.current;
      const activeObj = canvas?.getActiveObject();
      if (!activeObj || activeObj.type === 'i-text' || activeObj.type === 'text') return;
      if (!activeObj.shadow) return;

      // Get current darkness from existing shadow
      const shadow = activeObj.shadow as { color?: string };
      let currentDarkness = 50;
      if (shadow.color) {
        const match = shadow.color.match(/[\d.]+(?=\))/);
        if (match) {
          const opacity = parseFloat(match[0]);
          currentDarkness = Math.round(((opacity - 0.05) / 0.35) * 100);
        }
      }

      applyShadow(activeObj, currentDarkness, depth);
    }, [applyShadow]);

    // Get selected object info
    const getSelectedInfo = useCallback((): SimpleSelectedObjectInfo | null => {
      const canvas = fabricRef.current;
      const activeObj = canvas?.getActiveObject();
      if (!activeObj) return null;

      const isVideo = (activeObj as any).isVideo === true;
      const isText = activeObj.type === 'i-text' || activeObj.type === 'text';

      return {
        type: isVideo ? 'video' : isText ? 'text' : 'image',
        videoAutoplay: isVideo ? (activeObj as any).videoAutoplay : undefined,
        videoLoop: isVideo ? (activeObj as any).videoLoop : undefined,
      };
    }, []);

    // Set a full-bleed background image for imported slides (e.g. Figma frames)
    const setSlideBackground = useCallback(async (dataUrl: string) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const img = await FabricImage.fromURL(dataUrl);
      const imgWidth = img.width || 1;
      const imgHeight = img.height || 1;

      // Scale to cover the full canvas
      const coverScale = Math.max(CANVAS_WIDTH / imgWidth, CANVAS_HEIGHT / imgHeight);
      img.set({
        left: 0,
        top: 0,
        originX: 'left',
        originY: 'top',
        scaleX: coverScale,
        scaleY: coverScale,
        selectable: false,
        evented: false,
      });

      // Insert at index 0 so it's behind everything else
      canvas.insertAt(0, img);
      canvas.renderAll();
      onContentChange?.();
    }, [onContentChange]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      addFile,
      addFromDataUrl,
      addText,
      getJson,
      loadJson,
      clear,
      getDataUrl,
      isLoading,
      setVideoAutoplay,
      setVideoLoop,
      getSelectedInfo,
      setCornerRadius,
      setShadowIntensity,
      setShadowEnabled,
      setShadowDarkness,
      setShadowDepth,
      setSlideBackground,
    }), [addFile, addFromDataUrl, addText, getJson, loadJson, clear, getDataUrl, isLoading, setVideoAutoplay, setVideoLoop, getSelectedInfo, setCornerRadius, setShadowIntensity, setShadowEnabled, setShadowDarkness, setShadowDepth, setSlideBackground]);

    // Handle paste (external clipboard images/videos)
    useEffect(() => {
      const handlePaste = async (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
          if (item.type.startsWith('image/') || item.type.startsWith('video/')) {
            e.preventDefault();
            // External image paste takes priority -- clear canvas clipboard
            canvasClipboard = null;
            const blob = item.getAsFile();
            if (blob) {
              await addFile(blob);
            }
            return;
          }
        }
      };

      document.addEventListener('paste', handlePaste);
      return () => document.removeEventListener('paste', handlePaste);
    }, [addFile]);

    // Handle drag and drop (HTML5 standard)
    const handleDrop = useCallback(async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      // Check for vault media first
      const vaultData = e.dataTransfer?.getData('application/x-vault-media');
      if (vaultData) {
        try {
          const { dataUrl, name, type } = JSON.parse(vaultData);
          await addFromDataUrl(dataUrl, name, type);
          return;
        } catch (err) {
          console.error('Failed to parse vault media data:', err);
        }
      }

      // Fall back to file drops
      const files = e.dataTransfer?.files;
      if (!files) return;

      for (const file of files) {
        if (file.type.startsWith('image/') || file.type.startsWith('video/') || PDF_TYPES.includes(file.type)) {
          await addFile(file);
        }
      }
    }, [addFile, addFromDataUrl]);

    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      // Only set false if we're leaving the container (not entering a child)
      if (e.currentTarget === e.target) {
        setIsDragOver(false);
      }
    }, []);

    // Handle keyboard
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const active = document.activeElement;
        const isInInput = active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA';
        const canvas = fabricRef.current;

        // Undo: Cmd+Z (Mac) or Ctrl+Z (Windows)
        if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
          if (!isInInput) {
            e.preventDefault();
            undo();
          }
        }

        // Redo: Cmd+Shift+Z (Mac) or Ctrl+Shift+Z / Ctrl+Y (Windows)
        if ((e.metaKey || e.ctrlKey) && (e.key === 'z' && e.shiftKey || e.key === 'y')) {
          if (!isInInput) {
            e.preventDefault();
            redo();
          }
        }

        // Select All: Cmd+A
        if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
          if (!isInInput && canvas) {
            e.preventDefault();
            const objects = canvas.getObjects();
            if (objects.length > 0) {
              canvas.discardActiveObject();
              const selection = new ActiveSelection(objects, { canvas });
              canvas.setActiveObject(selection);
              canvas.renderAll();
            }
          }
        }

        // Copy: Cmd+C (single or multiple objects)
        if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
          if (!isInInput && canvas) {
            const activeObj = canvas.getActiveObject();
            if (activeObj && !(activeObj instanceof IText && (activeObj as IText).isEditing)) {
              e.preventDefault();
              const extraProps = ['videoAutoplay', 'videoLoop', 'videoSrc', 'videoFileName'] as any;
              if (activeObj instanceof ActiveSelection) {
                // Multi-select: serialize each object individually
                const objects = (activeObj as ActiveSelection).getObjects();
                canvasClipboard = JSON.stringify(objects.map(obj => obj.toObject(extraProps)));
                canvasClipboardMulti = true;
              } else {
                canvasClipboard = JSON.stringify(activeObj.toObject(extraProps));
                canvasClipboardMulti = false;
              }
            }
          }
        }

        // Cut: Cmd+X (single or multiple objects)
        if ((e.metaKey || e.ctrlKey) && e.key === 'x') {
          if (!isInInput && canvas) {
            const activeObj = canvas.getActiveObject();
            if (activeObj && !(activeObj instanceof IText && (activeObj as IText).isEditing)) {
              e.preventDefault();
              const extraProps = ['videoAutoplay', 'videoLoop', 'videoSrc', 'videoFileName'] as any;
              if (activeObj instanceof ActiveSelection) {
                const objects = (activeObj as ActiveSelection).getObjects();
                canvasClipboard = JSON.stringify(objects.map(obj => obj.toObject(extraProps)));
                canvasClipboardMulti = true;
                // Remove all selected objects
                canvas.discardActiveObject();
                objects.forEach(obj => canvas.remove(obj));
              } else {
                canvasClipboard = JSON.stringify(activeObj.toObject(extraProps));
                canvasClipboardMulti = false;
                canvas.remove(activeObj);
              }
              canvas.renderAll();
            }
          }
        }

        // Paste: Cmd+V (canvas objects -- external clipboard paste is handled separately)
        if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
          if (!isInInput && canvasClipboard && canvas) {
            e.preventDefault();
            try {
              const parsed = JSON.parse(canvasClipboard);
              const objectsToAdd: any[] = canvasClipboardMulti ? parsed : [parsed];

              // Offset pasted objects so they're not exactly on top
              objectsToAdd.forEach(objData => {
                objData.left = (objData.left || 0) + 30;
                objData.top = (objData.top || 0) + 30;
              });

              // Add objects via full canvas round-trip (handles image re-hydration)
              const currentJson = JSON.parse(JSON.stringify(canvas.toJSON()));
              const prevCount = currentJson.objects.length;
              objectsToAdd.forEach(obj => currentJson.objects.push(obj));
              suppressChangeRef.current = true;
              canvas.loadFromJSON(JSON.stringify(currentJson)).then(() => {
                canvas.renderAll();
                // Select the pasted object(s)
                const allObjects = canvas.getObjects();
                const newObjects = allObjects.slice(prevCount);
                if (newObjects.length === 1) {
                  canvas.setActiveObject(newObjects[0]);
                } else if (newObjects.length > 1) {
                  const selection = new ActiveSelection(newObjects, { canvas });
                  canvas.setActiveObject(selection);
                }
                canvas.renderAll();
                suppressChangeRef.current = false;
                onContentChangeRef.current?.();
              }).catch(() => {
                suppressChangeRef.current = false;
              });
            } catch {
              // Invalid clipboard data, ignore
            }
          }
        }

        if (e.key === 't' || e.key === 'T') {
          if (!isInInput) {
            e.preventDefault();
            addText();
          }
        }

        if (e.key === 'Delete' || e.key === 'Backspace') {
          const activeObj = canvas?.getActiveObject();
          if (activeObj && !(activeObj instanceof IText && (activeObj as IText).isEditing)) {
            e.preventDefault();
            if (activeObj instanceof ActiveSelection) {
              const objects = (activeObj as ActiveSelection).getObjects();
              canvas?.discardActiveObject();
              objects.forEach(obj => canvas?.remove(obj));
            } else {
              canvas?.remove(activeObj);
            }
            canvas?.renderAll();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [addText, undo, redo]);

    return (
      <div
        ref={containerRef}
        className={`fp-canvas-container ${className}`}
        style={{ minHeight: 200 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div
          className={`fp-canvas-inner ${isDragOver ? 'drag-active' : ''}`}
          style={{
            width: displaySize.width,
            height: displaySize.height,
          }}
        >
          <canvas ref={canvasElRef} />
        </div>

        {/* Drag overlay */}
        {isDragOver && (
          <div className="fp-canvas-drag-overlay">
            <div className="fp-canvas-drag-overlay-content">
              <svg className="fp-canvas-drag-overlay-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <p className="fp-canvas-drag-overlay-text">Drop to add to slide</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && !isLoadingContent && !isDragOver && (
          <div className="fp-canvas-empty">
            <div className="fp-canvas-empty-content">
              <p className="fp-canvas-empty-title">Press <kbd className="fp-canvas-kbd">T</kbd> to add text</p>
              <p className="fp-canvas-empty-hint">or paste/drop an image</p>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoadingContent && (
          <div className="fp-canvas-loading">
            <div className="fp-canvas-loading-content">
              <div className="fp-canvas-loading-spinner" />
              <p className="fp-canvas-loading-text">Adding content...</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);
