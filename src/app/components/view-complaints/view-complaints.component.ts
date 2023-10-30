import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Editor } from 'ngx-editor';
import { Subscription } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-view-complaints',
  templateUrl: './view-complaints.component.html',
  styleUrls: ['./view-complaints.component.css'],
})
export class ViewComplaintsComponent implements OnInit, OnDestroy {
  count?: number;
  @Input() label?: string;
  @Input() notificationId!: string;
  @ViewChild('complaintDialog') complaintDialog!: TemplateRef<any>;
  complaintForm!: FormGroup;
  department?: string;
  complaints?: any[] = [];
  levels?: any[];
  dico?: any;
  editor!: Editor;
  LossCarDataByNotificationSub?: Subscription;
  selectedComplaint?: any;
  selectedIndex: number = 0;
  constructor(
    private dataService: DataServiceService,
    // private dialogRef: MatDialogRef<ViewComplaintsComponent>,
    private dicoService: DicoServiceService,
    private loginDataService: LoadingServiceService,
    private dateFormatService: DateFormatterService,
    private fb: FormBuilder,
    private alertifyService: AlertifyService,
    private profileService: LoadingServiceService,
    // @Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialog
  ) {
    this.department = this.profileService
      .getSelectedProfile()
      .code.toUpperCase();
    // this.buildForm();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    // this.getNotificationComplaintsByDepCount();
  }
  ngOnDestroy(): void {
    if (this.LossCarDataByNotificationSub) {
      this.LossCarDataByNotificationSub.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.getNotificationComplaintsByDepCount();
  }

  viewCompDialog() {
    this.buildForm();
    this.editor = new Editor();
    if (!this.notificationId) {
      return;
    }

    const dialogRef = this.dialog.open(this.complaintDialog, {
      data: {},
      width: '1000px',
      maxHeight: '800px',
    });
    dialogRef.afterOpened().subscribe(() => {
      this.getDico();
      this.getCarsNotificationComplaintsByDep();
      this.getLossCarDataByNotificationId();
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getNotificationComplaintsByDepCount();
    });
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  isFormValid() {
    return this.complaintForm.valid;
  }
  buildForm() {
    this.complaintForm = this.fb.group({
      carsCompId: [''],
      carsCompBodId: [null],

      carsCompNotId: this.fb.group({
        notificationId: [''],
      }),
      carsCompCarId: [null],
      carsCompMatId: [null],
      carsComSub: ['', [Validators.required]],
      carsComText: ['', [Validators.required]],
      carsCompClosed: [''],
      carsCompFromDep: [''],
      carsCompTransToDep: [null],
      msgTypeRelated: ['', [Validators.required]],
    });
  }
  close() {
    this.dialog.closeAll();
  }
  selectComplaint(selectedComplaint: any, selectedIndex: number) {
    this.complaintForm.disable();

    this.selectedComplaint = selectedComplaint;
    this.selectedIndex = selectedIndex;
    // console.log(selectedComplaint);
    if (selectedComplaint) {
      this.complaintForm.patchValue(selectedComplaint);
    }
  }
  cancel() {
    this.complaintForm.disable();
    this.selectedIndex = -1;
    this.complaintForm.reset();
  }
  saveComplaint() {
    const carsComSub = this.complaintForm.get('carsComSub')?.value;
    const msgTypeRelated = this.complaintForm.get('msgTypeRelated')?.value;
    const carsComText = this.complaintForm.get('carsComText')?.value;

    if (!carsComSub || !msgTypeRelated || !carsComText) {
      this.alertifyService.error('Please fill in all required fields');
      return;
    }

    if (!this.complaintForm.valid) {
      return;
    }

    const carsCompId = this.complaintForm.get('carsCompId')?.value;

    this.complaintForm
      .get('carsCompNotId.notificationId')
      ?.setValue(this.notificationId);
    this.complaintForm.get('carsCompClosed')?.setValue('N');

    if (!carsCompId) {
      this.complaintForm.get('carsCompId')?.setValue('');
    } else {
      this.complaintForm.get('carsCompId')?.setValue(carsCompId);
    }

    this.complaintForm.get('carsCompFromDep')?.setValue(this.department);

    this.dataService
      .addNotificationComplaint(this.complaintForm.value)
      .subscribe({
        next: (res) => {
          this.getCarsNotificationComplaintsByDep();
          this.alertifyService.success(res.message);
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  addComplaint() {
    this.complaintForm.enable(); // Re-enable the form for adding a new complaint
    this.selectedIndex = -1;
    this.complaintForm.reset();

    // You can use the following code to disable the Save button if required values are empty
  }

  getNotificationComplaintsByDepCount() {
    const department = this.profileService
      .getSelectedProfile()
      .code.toUpperCase();
    // console.log(department);
    this.dataService
      .getNotificationComplaintsByDepCount(this.notificationId!)
      .subscribe({
        next: (res) => {
          this.count = res.data;
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getCarsNotificationComplaintsByDep() {
    const department = this.profileService
      .getSelectedProfile()
      .code.toUpperCase();
    // console.log(department);
    this.dataService
      .getCarsNotificationComplaintsByDep(department, this.notificationId)
      .subscribe({
        next: (res) => {
          this.complaints = res.data;
          if (this.complaints && this.complaints.length > 0) {
            this.selectComplaint(this.complaints[0], 0);
          }
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  // close() {
  //   this.dialogRef.close();
  // }
  getLossCarDataByNotificationId() {
    if (this.notificationId) {
      this.LossCarDataByNotificationSub = this.dataService
        .getLossCarDataByNotificationId(this.notificationId!)
        .subscribe({
          next: (data) => {
            this.levels = data.data;
            for (const item of this.levels!) {
              if (item.ins_TP === 'INSURED' || item.ins_TP === 'TP') {
                // this.complaintForm
                //   .get('carsCompCarId.carId')
                //   ?.patchValue(item.id);
                item.id = 'LossCar;' + item.id;
              } else if (item.ins_TP === 'BODILY') {
                // this.complaintForm
                //   .get('carsCompBodId.injuredId')
                //   ?.patchValue(item.id);
                item.id = 'BodilyInjury;' + item.id;
              } else if (item.ins_TP === 'MATERIAL DAMAGE') {
                // this.complaintForm.get('carsCompMatId.matDamageId');
                item.id = 'MaterialDamage;' + item.id;
              }
            }
            // console.log(this.levels);
          },
          error: (err) => {
            this.alertifyService.error(err.error.message);
            // this.close();
            console.log(err);
          },
        });
    }
  }
}
