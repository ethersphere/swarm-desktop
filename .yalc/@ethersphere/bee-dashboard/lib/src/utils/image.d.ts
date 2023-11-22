interface Dimensions {
    width: number;
    height: number;
}
/**
 * Get the dimensions of the image after resize
 *
 * @param imgWidth  Current image width
 * @param imgHeight Current image height
 * @param maxWidth  Desired max width
 * @param maxHeight Desired max height
 *
 * @returns Downscaled dimensions of the image to fit in the bounding box
 */
export declare function getDimensions(imgWidth: number, imgHeight: number, maxWidth?: number, maxHeight?: number): Dimensions;
/**
 * Resize image passed to fit in the bounding box defined with maxWidth and maxHeight.
 * Note that one or both of the bounding box dimensions may be omitted
 *
 * @param file      Image file to be resized
 * @param maxWidth  Maximal image width
 * @param maxHeight Maximal image height
 *
 * @returns Promise that resolves into the resized image blob
 */
export declare function resize(file: File, maxWidth?: number, maxHeight?: number): Promise<Blob>;
export {};
