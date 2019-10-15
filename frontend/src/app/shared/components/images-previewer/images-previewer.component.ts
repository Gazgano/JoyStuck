import { Component, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';

import { FileService } from '@app/core/services/file.service';
import { Logger } from '@app/core/services/logger.service';

const log = new Logger('ImagesPreviewerComponent');

@Component({
  selector: 'app-images-previewer',
  templateUrl: './images-previewer.component.html',
  styleUrls: ['./images-previewer.component.scss']
})
export class ImagesPreviewerComponent {

  @ViewChild('imageUploader', { static: true }) filesInput: ElementRef;
  @Input() palette: string;
  @Input() maxImageSizeInBytes: number;

  public images: { file: File, storageURL: string, uploadProgress: number }[] = [];

  constructor(
    private fileService: FileService,
    private cd: ChangeDetectorRef
  ) { }

  readFiles() {
    const files: FileList = this.filesInput.nativeElement.files;
    if (files.length === 0) { return; }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      if (!this.fileService.controlFiles(files[i], { typePattern: /image\/*/, maxSizeInBytes: this.maxImageSizeInBytes })) {
        return;
      }
      this.readAndStoreImage(files[i]);
    }

    return;
  }

  deleteFile(index: number) {
    this.images.splice(index, 1);
  }

  deleteAllFiles() {
    this.images = [];
  }

  refreshView() {
    this.cd.detectChanges();
  }

  private readAndStoreImage(file: File) {
    this.fileService.readAndGetFileURL(file).subscribe(
      url => {
        this.images.push({file, storageURL: url, uploadProgress: null});
        this.refreshView();
      },
      error => log.warn(`An error occured when reading the file '${file.name}'`)
    );
  }
}
