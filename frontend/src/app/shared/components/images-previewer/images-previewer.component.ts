import { Component, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as uid from 'uid';

import { FileSizePipe } from '@app/shared/pipes/file-size.pipe';
import { Image } from '@app/core/models/image.model';

@Component({
  selector: 'app-images-previewer',
  templateUrl: './images-previewer.component.html',
  styleUrls: ['./images-previewer.component.scss']
})
export class ImagesPreviewerComponent {

  @ViewChild('imageUploader', { static: true }) filesInput: ElementRef;
  @Input() palette: string;
  @Input() maxImageSizeInBytes: number;
  
  public images: Image[] = [];
  
  constructor(
    private matSnackBar: MatSnackBar, 
    private cd: ChangeDetectorRef
  ) { }

  readFiles() {
    const files: FileList = this.filesInput.nativeElement.files;
    if (files.length === 0) { return; }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      if (!this.controlFiles(files[i])) { return; }
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

  private controlFiles(file: File): boolean {
    // format control
    if (file.type.match(/image\/*/) == null) {
      this.matSnackBar.open(`Only images are supported`, 'Dismiss', { duration: 5000 });
      return false;
    }

    // size control
    if (this.maxImageSizeInBytes && file.size >= this.maxImageSizeInBytes) {
      this.matSnackBar.open(
        `'${file.name}' is too big. Maximum size is ${new FileSizePipe().transform(this.maxImageSizeInBytes)}`,
        'Dismiss',
        { duration: 5000 }
      );
      return false;
    }

    return true;
  }

  private readAndStoreImage(file: File) {
    const reader = new FileReader();
    
    reader.onloadend = event => {
      this.images.push({
        uid: uid(20),
        file,
        url: reader.result as string,
        uploadProgress: null
      });
      this.refreshView();
    };
    
    reader.readAsDataURL(file);
  }
}
