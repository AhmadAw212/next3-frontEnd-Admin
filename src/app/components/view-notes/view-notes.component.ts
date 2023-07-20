import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewNoteDialogComponent } from './view-note-dialog/view-note-dialog.component';

@Component({
  selector: 'app-view-notes',
  templateUrl: './view-notes.component.html',
  styleUrls: ['./view-notes.component.css'],
})
export class ViewNotesComponent {
  constructor(private dialog: MatDialog) {}
  viewNoteDialog() {
    this.dialog.open(ViewNoteDialogComponent, {
      width: '500px',
      maxHeight: '600px',
    });
  }
}
