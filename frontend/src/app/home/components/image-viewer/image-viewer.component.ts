import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
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
    if (this.currentImageIndex === this.data.images - 1) {
      this.currentImageIndex = 0;
    } else {
      ++this.currentImageIndex; 
    }
  }

  previousImage() {
    if (this.currentImageIndex === 0) {
      this.currentImageIndex = this.data.images - 1;
    } else {
      --this.currentImageIndex; 
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
