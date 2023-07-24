import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { ViewPolicyDialogComponent } from '../../view-policy/view-policy-dialog/view-policy-dialog.component';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { Editor, Toolbar } from 'ngx-editor';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-note-dialog',
  templateUrl: './view-note-dialog.component.html',
  styleUrls: ['./view-note-dialog.component.css'],
})
export class ViewNoteDialogComponent implements OnInit {
  dico?: any;
  notes?: any;
  displayName?: string;
  selectedRow!: HTMLElement;
  editor!: Editor;
  noteForm!: FormGroup;
  toolbar: Toolbar = [
    ['bold', 'italic', 'align_center', 'underline', 'strike'],

    ['background_color', 'text_color'],
  ];
  selectNote?: any;
  constructor(
    private dataService: DataServiceService,
    private dialogRef: MatDialogRef<ViewNoteDialogComponent>,
    private dicoService: DicoServiceService,
    private loginDataService: LoadingServiceService,
    private dateFormatService: DateFormatterService,
    private fb: FormBuilder
  ) {}

  buildForm() {
    this.noteForm = this.fb.group({
      subject: [''],
      level: [''],
      text: [''],
      callCenter: [false],
      dataManagement: [false],
      assessment: [false],
      claimResolution: [false],
      surveyor: [false],
      repairShop: [false],
      expert: [false],
    });

    // ... rest of the component code
  }

  ngOnInit(): void {
    this.getDico();
    this.getNotificationMessageByDep();
    this.data();
    this.buildForm();
    this.editor = new Editor();
  }
  close() {
    this.dialogRef.close();
  }
  highlightRow(event: Event) {
    const clickedField = event.target as HTMLElement;
    const clickedRow = clickedField.closest('tr') as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow;
    this.selectedRow.classList.add('highlight');
  }
  data() {
    const data = this.loginDataService.getLoginInfo();
    const displayName = data?.displayName;
    this.displayName = displayName;
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  selectedNote(note: any) {
    this.selectNote = note; // Store the selected row data
    console.log(this.selectNote);
    this.updateFormWithSelectedRow(); // Update the form with the selected row data
  }
  updateFormWithSelectedRow() {
    // Use the form's patchValue method to set the form control values with the selected row data
    this.noteForm.patchValue({
      subject: this.selectNote.subject,
      level: this.selectNote.level,
      text: this.selectNote.text,
      callCenter: this.selectNote.remarkShowToCallCenter,
      dataManagement: this.selectNote.remarkShowToDataManagement,
      assessment: this.selectNote.remarkShowToAssessment,
      claimResolution: this.selectNote.remarkShowToClaimResolution,
      // surveyor: this.selectNote.surveyor,
      // repairShop: this.selectNote.repairShop,
      // expert: this.selectNote.expert,
    });
  }
  getNotificationMessageByDep() {
    this.dataService
      .getNotificationMessageByDep('ER', '10.114011920')
      .subscribe({
        next: (data) => {
          this.notes = data.data;
          console.log(this.notes);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
