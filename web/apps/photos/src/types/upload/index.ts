import type { ElectronFile } from "@/next/types/file";
import {
    B64EncryptionResult,
    LocalFileAttributes,
} from "@ente/shared/crypto/types";
import { FILE_TYPE } from "constants/file";
import { Collection } from "types/collection";
import {
    FilePublicMagicMetadata,
    FilePublicMagicMetadataProps,
    MetadataFileAttributes,
    S3FileAttributes,
} from "types/file";
import { EncryptedMagicMetadata } from "types/magicMetadata";

export interface DataStream {
    stream: ReadableStream<Uint8Array>;
    chunkCount: number;
}

export function isDataStream(object: any): object is DataStream {
    return "stream" in object;
}

export type Logger = (message: string) => void;

export interface Metadata {
    /**
     * The file name.
     *
     * See: [Note: File name for local EnteFile objects]
     */
    title: string;
    creationTime: number;
    modificationTime: number;
    latitude: number;
    longitude: number;
    fileType: FILE_TYPE;
    hasStaticThumbnail?: boolean;
    hash?: string;
    imageHash?: string;
    videoHash?: string;
    localID?: number;
    version?: number;
    deviceFolder?: string;
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface ParsedMetadataJSON {
    creationTime: number;
    modificationTime: number;
    latitude: number;
    longitude: number;
}

export interface MultipartUploadURLs {
    objectKey: string;
    partURLs: string[];
    completeURL: string;
}

export interface FileTypeInfo {
    fileType: FILE_TYPE;
    exactType: string;
    mimeType?: string;
    imageType?: string;
    videoType?: string;
}

export interface UploadAsset {
    isLivePhoto?: boolean;
    file?: File | ElectronFile;
    livePhotoAssets?: LivePhotoAssets;
}

export interface LivePhotoAssets {
    image: globalThis.File | ElectronFile;
    video: globalThis.File | ElectronFile;
}

export interface FileWithCollection extends UploadAsset {
    localID: number;
    collection?: Collection;
    collectionID?: number;
}

export interface UploadAsset2 {
    isLivePhoto?: boolean;
    file?: File | ElectronFile | string;
    livePhotoAssets?: LivePhotoAssets2;
}

export interface LivePhotoAssets2 {
    image: File | ElectronFile | string;
    video: File | ElectronFile | string;
}

export interface FileWithCollection2 extends UploadAsset2 {
    localID: number;
    collection?: Collection;
    collectionID?: number;
}

export type ParsedMetadataJSONMap = Map<string, ParsedMetadataJSON>;

export interface UploadURL {
    url: string;
    objectKey: string;
}

export interface FileInMemory {
    filedata: Uint8Array | DataStream;
    /** The JPEG data of the generated thumbnail */
    thumbnail: Uint8Array;
    /**
     * `true` if this is a fallback (all black) thumbnail we're returning since
     * thumbnail generation failed for some reason.
     */
    hasStaticThumbnail: boolean;
}

export interface FileWithMetadata
    extends Omit<FileInMemory, "hasStaticThumbnail"> {
    metadata: Metadata;
    localID: number;
    pubMagicMetadata: FilePublicMagicMetadata;
}

export interface EncryptedFile {
    file: ProcessedFile;
    fileKey: B64EncryptionResult;
}
export interface ProcessedFile {
    file: LocalFileAttributes<Uint8Array | DataStream>;
    thumbnail: LocalFileAttributes<Uint8Array>;
    metadata: LocalFileAttributes<string>;
    pubMagicMetadata: EncryptedMagicMetadata;
    localID: number;
}
export interface BackupedFile {
    file: S3FileAttributes;
    thumbnail: S3FileAttributes;
    metadata: MetadataFileAttributes;
    pubMagicMetadata: EncryptedMagicMetadata;
}

export interface UploadFile extends BackupedFile {
    collectionID: number;
    encryptedKey: string;
    keyDecryptionNonce: string;
}

export interface ParsedExtractedMetadata {
    location: Location;
    creationTime: number;
    width: number;
    height: number;
}

export interface PublicUploadProps {
    token: string;
    passwordToken: string;
    accessedThroughSharedURL: boolean;
}

export interface ExtractMetadataResult {
    metadata: Metadata;
    publicMagicMetadata: FilePublicMagicMetadataProps;
}
