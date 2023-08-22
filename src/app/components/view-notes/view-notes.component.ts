import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewNoteDialogComponent } from './view-note-dialog/view-note-dialog.component';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-view-notes',
  templateUrl: './view-notes.component.html',
  styleUrls: ['./view-notes.component.css'],
})
export class ViewNotesComponent implements OnInit {
  count?: number;
  constructor(
    private dialog: MatDialog,
    private dataService: DataServiceService,
    private profileService: LoadingServiceService
  ) {}
  ngOnInit(): void {
    this.getNotificationMessageByDepCount();
  }
  viewNoteDialog() {
    const dialogRef = this.dialog.open(ViewNoteDialogComponent, {
      width: '1000px',
      maxHeight: '600px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getNotificationMessageByDepCount();
    });
  }

  getNotificationMessageByDepCount() {
    const profile = this.profileService.getSelectedProfile();
    const department = profile.code.toUpperCase();
    // console.log(department);
    this.dataService
      .getNotificationMessageByDepCount(department!, '10.9100729')
      .subscribe({
        next: (data) => {
          this.count = data.data;
          // console.log(data.data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
