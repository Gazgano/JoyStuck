export interface Image {
  uid?: string;
  file?: File;
  url?: ArrayBuffer | string;
  uploadProgress?: number | null;
}
