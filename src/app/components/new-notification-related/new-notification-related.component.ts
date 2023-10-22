import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-new-notification-related',
  templateUrl: './new-notification-related.component.html',
  styleUrls: ['./new-notification-related.component.css'],
})
export class NewNotificationRelatedComponent implements OnInit {
  dico?: any;
  count?: number;
  @Input() label?: string;
  @Input() notificationId?: string;
  relatedType: type[] = [];
  @ViewChild('relatedDialog') relatedDialog!: TemplateRef<any>;
  relatedForm!: FormGroup;
  relatedNotification?: any[];
  selectedIndex?: number = 0;
  selectedRelated?: any;
  isRelatedType: boolean = false;
  notificationRelated: boolean = false;
  constructor(
    private dataService: DataServiceService,
    private dicoService: DicoServiceService,
    private loginDataService: LoadingServiceService,
    private dateFormatService: DateFormatterService,
    private fb: FormBuilder,
    private alertifyService: AlertifyService,
    private profileService: LoadingServiceService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getDico();
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  selectRelated(selectedRelated: any, selectedIndex: number) {
    // this.complaintForm.disable();

    this.selectedRelated = selectedRelated;
    this.selectedIndex = selectedIndex;
    // console.log(selectedRelated);
    if (selectedRelated) {
      this.relatedForm.patchValue(selectedRelated);
    }
  }
  addRelatedNotification() {
    this.relatedForm.reset();
    this.selectedIndex = -1;
  }
  close() {
    this.dialog.closeAll();
  }
  cancel() {
    this.addRelatedNotification();
  }
  addNewRelatedNotifications() {
    if (!this.notificationId) {
      return;
    }
    if (this.relatedForm.valid) {
      this.relatedForm.get('notification')?.setValue(this.notificationId);
      const notificationRelatedId = this.relatedForm.get(
        'notificationRelatedId'
      )?.value;

      if (!notificationRelatedId) {
        this.relatedForm.get('notificationRelatedId')?.setValue('');
      } else {
        this.relatedForm
          .get('notificationRelatedId')
          ?.setValue(notificationRelatedId);
      }
      this.dataService
        .addNewRelatedNotifications([this.relatedForm.value])
        .subscribe({
          next: (res) => {
            this.alertifyService.success(res.message);
            this.getCarsNotificationRelatedByNotId();
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  getRelatedTypeLovFindAll() {
    if (!this.isRelatedType) {
      this.dataService.getRelatedTypeLovFindAll().subscribe({
        next: (res) => {
          this.relatedType = res.data;
          this.isRelatedType = true;
          // this.relatedType.push({ code: '', description: '' });
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
          this.isRelatedType = false;
        },
      });
    }
  }
  buildForm() {
    this.relatedForm = this.fb.group({
      notification: [''],
      notificationRelVisa: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      notificationRelatedTypeCode: [''],
      notificationRelatedRemarks: [''],
      notificationRelatedId: [''],
    });
  }
  get form() {
    return this.relatedForm.controls;
  }
  deleteRelatedNotification(notificationRelatedId: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService
          .deleteRelatedNotification(notificationRelatedId)
          .subscribe({
            next: (data) => {
              this.alertifyService.error(data.message!);
              this.getCarsNotificationRelatedByNotId();
            },
            error: (err) => {
              this.alertifyService.error(err.error.message);
            },
          });
      }
    );
  }
  viewRelatedDialog() {
    this.buildForm();

    if (!this.notificationId) {
      return;
    }
    const dialogRef = this.dialog.open(this.relatedDialog, {
      data: {},
      width: '1000px',
      maxHeight: '800px',
    });
    dialogRef.afterOpened().subscribe(() => {
      this.getDico();
      this.getRelatedTypeLovFindAll();
      this.getCarsNotificationRelatedByNotId();
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getCarsNotificationRelatedByNotId() {
    if (!this.notificationId) {
      return;
    }

    this.dataService
      .getCarsNotificationRelatedByNotId(this.notificationId!)
      .subscribe({
        next: (res) => {
          this.relatedNotification = res.data;
          this.notificationRelated = true;
          if (this.relatedNotification && this.relatedNotification.length > 0)
            this.selectRelated(this.relatedNotification[0], 0);
          // console.log(res);
        },
        error: (err) => {
          this.notificationRelated = false;
          console.log(err);
        },
      });
  }
}
