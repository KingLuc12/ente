import { openCache } from "@/next/blob-cache";
import { BlobOptions } from "types/image";
import {
    FaceAlignment,
    FaceCrop,
    FaceCropConfig,
    StoredFaceCrop,
} from "types/machineLearning";
import { cropWithRotation, imageBitmapToBlob } from "utils/image";
import { enlargeBox } from ".";
import { Box } from "../../../thirdparty/face-api/classes";

export function getFaceCrop(
    imageBitmap: ImageBitmap,
    alignment: FaceAlignment,
    config: FaceCropConfig,
): FaceCrop {
    const alignmentBox = new Box({
        x: alignment.center.x - alignment.size / 2,
        y: alignment.center.y - alignment.size / 2,
        width: alignment.size,
        height: alignment.size,
    }).round();
    const scaleForPadding = 1 + config.padding * 2;
    const paddedBox = enlargeBox(alignmentBox, scaleForPadding).round();
    const faceImageBitmap = cropWithRotation(imageBitmap, paddedBox, 0, {
        width: config.maxSize,
        height: config.maxSize,
    });

    return {
        image: faceImageBitmap,
        imageBox: paddedBox,
    };
}

export async function storeFaceCrop(
    faceId: string,
    faceCrop: FaceCrop,
    blobOptions: BlobOptions,
): Promise<StoredFaceCrop> {
    const faceCropBlob = await imageBitmapToBlob(faceCrop.image, blobOptions);
    const faceCropUrl = `/${faceId}`;
    const faceCropCache = await openCache("face-crops");
    await faceCropCache.put(faceCropUrl, faceCropBlob);
    return {
        imageUrl: faceCropUrl,
        imageBox: faceCrop.imageBox,
    };
}
