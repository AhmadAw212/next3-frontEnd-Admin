import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { ViewPolicyDialogComponent } from '../../view-policy/view-policy-dialog/view-policy-dialog.component';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertifyService } from 'src/app/services/alertify.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-note-dialog',
  templateUrl: './view-note-dialog.component.html',
  styleUrls: ['./view-note-dialog.component.css'],
})
export class ViewNoteDialogComponent implements OnInit, OnDestroy {
  dico?: any;
  notes?: any;
  displayName?: string;
  selectedRow!: HTMLElement;
  editor!: Editor;
  noteForm!: FormGroup;
  levels?: any[];
  username?: string;
  toolbar: Toolbar = [
    ['bold', 'italic', 'align_center', 'underline', 'strike'],

    ['background_color', 'text_color'],
  ];
  selectNote?: any;
  isFormDisabled = false;
  department?: string;
  notificationsSubscribtion?: Subscription;
  LossCarDataByNotificationSub?: Subscription;
  constructor(
    private dataService: DataServiceService,
    private dialogRef: MatDialogRef<ViewNoteDialogComponent>,
    private dicoService: DicoServiceService,
    private loginDataService: LoadingServiceService,
    private dateFormatService: DateFormatterService,
    private fb: FormBuilder,
    private alertifyService: AlertifyService
  ) {}
  ngOnDestroy(): void {
    if (this.notificationsSubscribtion || this.LossCarDataByNotificationSub) {
      this.notificationsSubscribtion?.unsubscribe();
      this.LossCarDataByNotificationSub?.unsubscribe();
    }
  }

  buildForm() {
    const selectedProfile = localStorage
      .getItem('selectedProfile')
      ?.split('.')[2];
    const department = selectedProfile?.toUpperCase();
    this.department = department;
    this.noteForm = this.fb.group({
      id: [null],
      bodilyInjury: this.fb.group({
        injuredId: [null],
      }),
      notification: this.fb.group({
        notificationId: ['10.9100729'],
      }),
      lossCar: this.fb.group({
        carId: [null],
      }),
      materialDamage: this.fb.group({
        matDamageId: [null],
      }),
      remarkFromDep: [department],
      // remarkFromDepDescription: ['CallCenter'],
      remarkShowToAssessment: ['Y'],
      remarkShowToCallCenter: ['Y'],
      remarkShowToClaimResolution: ['Y'],
      remarkShowToDataManagement: ['Y'],
      // remarkShowToExpert: [''],
      // remarkShowToRepairShop: ['', Validators.required],
      subject: [''],
      text: [''],
      msgTypeRelated: [null],
    });
  }
  clearForm() {
    this.noteForm.enable();
    this.noteForm.patchValue({
      subject: '',
      text: '',
      msgTypeRelated: null,
      remarkShowToAssessment: 'Y',
      remarkShowToCallCenter: 'Y',
      remarkShowToClaimResolution: 'Y',
      remarkShowToDataManagement: 'Y',
    });
  }
  async ngOnInit(): Promise<void> {
    try {
      // Fetch the required data using the data() function and await its completion
      this.buildForm();
      this.editor = new Editor();
      await this.getData();
      // Other functions that depend on the data can be called after the data() function completes
      this.getDico();
      this.getNotificationMessageByDep();
      this.getLossCarDataByNotificationId();
    } catch (error) {
      console.error('Error while fetching data:', error);
      // Handle the error appropriately, such as showing an error message or retrying the request.
    }
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
  async getData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Call your service here to fetch data
      this.loginDataService.loginInfo$.subscribe({
        next: (data: any) => {
          const displayName = data?.displayName;
          this.displayName = displayName;
          const createdBy = data?.coreUserId;
          this.username = createdBy;
          resolve(); // Resolve the promise when the data is successfully fetched
        },
        error: (error: any) => {
          console.error('Error fetching data:', error);
          reject(error); // Reject the promise if there is an error during the service call
        },
      });
    });
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
    // console.log(note);
    const createdBy = note.sysCreatedBy;
    if (createdBy !== this.username) {
      this.noteForm.disable();
    } else {
      this.isFormDisabled = this.isMoreThan24Hours(note.sysCreatedDate);
      if (this.isFormDisabled) {
        this.noteForm.disable();
      } else {
        this.noteForm.enable();
      }
      // console.log(this.isFormDisabled);
    }
    this.updateFormWithSelectedRow();
  }
  isMoreThan24Hours(sysCreatedDate: any): boolean {
    const createdDate = new Date(sysCreatedDate); // Convert sysCreatedDate to a Date object
    // console.log(createdDate);
    const currentDate = new Date(); // Get the current date
    // console.log(currentDate);
    // Calculate the time difference in milliseconds
    const timeDifference = currentDate.getTime() - createdDate.getTime();

    // Equivalent time in milliseconds for 24 hours
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;

    // Compare the time difference with 24 hours
    return timeDifference > twentyFourHoursInMilliseconds;
  }

  updateFormWithSelectedRow() {
    // console.log(this.isMoreThan24Hours(this.selectNote.sysCreatedDate));
    // this.isMoreThan24Hours(this.selectNote.sysCreatedDate);
    this.noteForm.patchValue({
      remarkShowToAssessment: this.transformValueFromResponse(
        this.selectNote.remarkShowToAssessment
      ),
      remarkShowToCallCenter: this.transformValueFromResponse(
        this.selectNote.remarkShowToCallCenter
      ),
      remarkShowToClaimResolution: this.transformValueFromResponse(
        this.selectNote.remarkShowToClaimResolution
      ),
      remarkShowToDataManagement: this.transformValueFromResponse(
        this.selectNote.remarkShowToDataManagement
      ),

      subject: this.selectNote.subject,
      text: this.selectNote.text,
      msgTypeRelated: this.selectNote.msgTypeRelated,
    });
  }
  extractValueFromMsgTypeRelated(msgTypeRelated: string) {
    // Assuming msgTypeRelated has the format "LossCar;10.114011920.0"
    const parts = msgTypeRelated.split(';');

    if (parts.length >= 2) {
      // console.log(parts[1]);
      return parts[1];
    } else {
      return null;
    }
  }
  private transformValueFromResponse(value: string): boolean {
    return value === 'Y' ? true : false;
  }
  getNotificationMessageByDep() {
    console.log(this.department);
    this.notificationsSubscribtion = this.dataService
      .getNotificationMessageByDep(this.department!, '10.9100729')
      .subscribe({
        next: (data) => {
          this.notes = data.data;
          // console.log(this.notes);
        },
        error: (err) => {
          this.close();
          console.log(err);
        },
      });
  }
  private prepareFormData(formData: any) {
    formData.remarkShowToCallCenter = formData.remarkShowToCallCenter
      ? 'Y'
      : 'N';
    formData.remarkShowToClaimResolution = formData.remarkShowToClaimResolution
      ? 'Y'
      : 'N';
    formData.remarkShowToDataManagement = formData.remarkShowToDataManagement
      ? 'Y'
      : 'N';
    formData.remarkShowToAssessment = formData.remarkShowToAssessment
      ? 'Y'
      : 'N';

    if (formData.bodilyInjury.injuredId === null) {
      formData.bodilyInjury = null;
    }

    if (formData.lossCar.carId === null) {
      formData.lossCar = null;
    }

    if (formData.materialDamage.matDamageId === null) {
      formData.materialDamage = null;
    }

    return formData;
  }

  // Function to add a new notification message
  addNotificationMessageBean() {
    this.clearForm();
  }

  // Function to update an existing notification message
  updateNote() {
    this.noteForm.patchValue({
      id: this.selectNote?.id,
    });

    const formData: any = { ...this.noteForm.value };
    const preparedFormData = this.prepareFormData(formData);

    this.dataService.addnote(preparedFormData).subscribe({
      next: (data) => {
        this.alertifyService.success('Note Added successfully');
        this.getNotificationMessageByDep();
        // console.log(data);
      },
      error: (err) => {
        this.alertifyService.error(err.error.message);
        console.log(err);
      },
    });
  }
  getLossCarDataByNotificationId() {
    this.LossCarDataByNotificationSub = this.dataService
      .getLossCarDataByNotificationId('10.9100729')
      .subscribe({
        next: (data) => {
          this.levels = data.data;
          for (const item of this.levels!) {
            if (item.ins_TP === 'INSURED' || item.ins_TP === 'TP') {
              item.id = 'LossCar;' + item.id;
            } else if (item.ins_TP === 'BODILY') {
              item.id = 'BodilyInjury;' + item.id;
            } else if (item.ins_TP === 'MATERIAL DAMAGE') {
              item.id = 'MaterialDamage;' + item.id;
            }
          }
          // console.log(this.levels);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
          this.close();
          console.log(err);
        },
      });
  }
}