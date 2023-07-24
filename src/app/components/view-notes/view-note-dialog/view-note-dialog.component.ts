import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { ViewPolicyDialogComponent } from '../../view-policy/view-policy-dialog/view-policy-dialog.component';

@Component({
  selector: 'app-view-note-dialog',
  templateUrl: './view-note-dialog.component.html',
  styleUrls: ['./view-note-dialog.component.css'],
})
export class ViewNoteDialogComponent implements OnInit {
  dico?: any;
  notes?: any;
  constructor(
    private dataService: DataServiceService,
    private dialogRef: MatDialogRef<ViewNoteDialogComponent>,
    private dicoService: DicoServiceService
  ) {}
  ngOnInit(): void {
    this.getDico();
    this.getNotificationMessageByDepCount();
  }

  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  getNotificationMessageByDepCount() {
    this.dataService
      .getNotificationMessageByDep('ER', '10.114011920')
      .subscribe({
        next: (data) => {
          this.notes = data.data;
          console.log(data.data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
