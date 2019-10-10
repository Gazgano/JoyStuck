export interface Image {
  uid?: string;
  file?: File;
  url?: ArrayBuffer | string;
  dimensionsRate?: number;
  uploadProgress?: number | null;
}
