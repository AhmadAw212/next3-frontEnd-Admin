import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreDocument } from '../model/core-document';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css'],
})
export class ImageDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public document: CoreDocument) {
    console.log(document);
  }
}
