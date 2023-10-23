import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  notificationId?: string;
  @Input() label?: string;
  selectedIndex?: number = 0;
  constructor(
    private dataService: DataServiceService,
    private dialogRef: MatDialogRef<ViewNoteDialogComponent>,
    private dicoService: DicoServiceService,
    private loginDataService: LoadingServiceService,
    private dateFormatService: DateFormatterService,
    private fb: FormBuilder,
    private alertifyService: AlertifyService,
    private profileService: LoadingServiceService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.notificationId = data.notificationId;
  }
  ngOnDestroy(): void {
    if (this.notificationsSubscribtion || this.LossCarDataByNotificationSub) {
      this.notificationsSubscribtion?.unsubscribe();
      this.LossCarDataByNotificationSub?.unsubscribe();
    }
  }

  buildForm() {
    const profile = this.profileService.getSelectedProfile();
    const department = profile.code.toUpperCase();
    // const department = selectedProfile?.toUpperCase();
    this.department = department;
    this.noteForm = this.fb.group({
      id: [null],
      bodilyInjury: this.fb.group({
        injuredId: [null],
      }),
      notification: this.fb.group({
        notificationId: [this.notificationId],
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
    this.selectedIndex = -1;
    this.noteForm.patchValue({
      id: null,
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
  selectedNote(note: any, selectedIndex: number) {
    this.selectNote = note; // Store the selected row data
    this.selectedIndex = selectedIndex;
    // console.log(note);
    const createdBy = note?.sysCreatedBy;
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
        this.selectNote?.remarkShowToAssessment
      ),
      remarkShowToCallCenter: this.transformValueFromResponse(
        this.selectNote?.remarkShowToCallCenter
      ),
      remarkShowToClaimResolution: this.transformValueFromResponse(
        this.selectNote?.remarkShowToClaimResolution
      ),
      remarkShowToDataManagement: this.transformValueFromResponse(
        this.selectNote?.remarkShowToDataManagement
      ),

      subject: this.selectNote?.subject,
      text: this.selectNote?.text,
      msgTypeRelated: this.selectNote?.msgTypeRelated,
      id: this.selectNote?.id,
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
    // console.log(this.department);
    this.notificationsSubscribtion = this.dataService
      .getNotificationMessageByDep(this.department!, this.notificationId!)
      .subscribe({
        next: (data) => {
          this.notes = data.data;
          this.selectedNote(this.notes[0], 0);
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
    // Get the 'id' from the form and set it back with a default value if it's empty
    const id = this.noteForm.get('id')?.value;
    this.noteForm.get('id')?.setValue(id || null);

    // Prepare the data for the API call
    const formData: any = { ...this.noteForm.value };
    const preparedFormData = this.prepareFormData(formData);

    // Make the API call
    this.dataService.addnote(preparedFormData).subscribe({
      next: (data) => {
        this.alertifyService.success('Note Added successfully');
        this.getNotificationMessageByDep();
        // Add more specific actions if needed
      },
      error: (err) => {
        // Handle errors more gracefully, e.g., display a user-friendly message
        this.alertifyService.error(err.error.message || 'An error occurred');
        // You can log the error for debugging, but consider more user-friendly messaging
        console.log(err);
      },
    });
  }
  getLossCarDataByNotificationId() {
    if (this.notificationId) {
      this.LossCarDataByNotificationSub = this.dataService
        .getLossCarDataByNotificationId(this.notificationId!)
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
}
