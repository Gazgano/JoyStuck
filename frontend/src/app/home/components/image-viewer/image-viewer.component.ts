import { Component, OnInit, Inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Logger } from '@app/core/services/logger.service';

const log = new Logger('ImageViewerComponent');

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageViewerComponent implements OnInit {

  public currentImageIndex: number;

  constructor(public dialogRef: MatDialogRef<ImageViewerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data.images && this.data.images.length > 0) {
      this.currentImageIndex = this.data.selectedImageIndex || 0;
    }
  }

  get currentImage(): HTMLImageElement {
    return this.data.images[this.currentImageIndex];
  }

  nextImage() {
    if (this.currentImageIndex === this.data.images.length - 1) {
      this.currentImageIndex = 0;
    } else {
      ++this.currentImageIndex;
    }
  }

  previousImage() {
    if (this.currentImageIndex === 0) {
      this.currentImageIndex = this.data.images.length - 1;
    } else {
      --this.currentImageIndex;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  @HostListener('window:keydown', ['$event'])
  reactOnKeyboard(keyEvent: KeyboardEvent) {
    switch (keyEvent.key) {
      case 'ArrowLeft':
        this.previousImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
    }
  }
}
