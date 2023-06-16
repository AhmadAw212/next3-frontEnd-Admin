import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { Editor } from 'ngx-editor';
import { debounceTime, takeUntil, switchMap, Subject } from 'rxjs';
@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css'],
})
export class SendEmailComponent implements OnInit, OnDestroy {
  navBarTitle = 'Send Email';
  emailFormBuild!: FormGroup;
  from?: string;
  fileName?: string;
  attachments: File[] = [];
  subject?: string;
  bcc?: string[];
  to?: string;
  body?: string;
  fileType?: string;
  recipients!: string[];
  signature?: string;
  sanitizedSignature?: SafeHtml;
  editor!: Editor;
  selectedRecipients: string[] = [];
  private searchTerms = new Subject<string>();
  private unsubscribe$ = new Subject<void>();
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private sanitizer: DomSanitizer,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.emailForm();
    this.getEmailFrom();
    this.editor = new Editor();
    this.searchRecipient();
  }
  ngOnDestroy(): void {
    this.editor.destroy();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  emailForm() {
    this.emailFormBuild = this.formBuilder.group({
      from: [{ value: this.from, disabled: true }],
      recipients: ['', Validators.required],
      BCC: '',
      subject: ['', Validators.required],
      body: '',
    });
    this.emailFormBuild.get('from')?.disable();
  }

  addRecipient(): void {
    const recipients = this.emailFormBuild.get('recipients')?.value;
    const lastRecipient = recipients[recipients.length - 1];
    if (recipients.length === 1 || lastRecipient) {
      const recipientToAdd = lastRecipient ? lastRecipient : recipients[0];

      this.dataService.addEmailContact(recipientToAdd).subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.alertify.success(res.message);
            console.log(res);
          } else {
            this.alertify.error(res.message);
          }
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
    }
    // this.focusRecipientsField();
  }

  focusRecipientsField() {
    const recipientsField = document.getElementById('recipients');
    if (recipientsField) {
      recipientsField.focus();
    }
  }

  getEmailFrom() {
    this.dataService.getFromEmail().subscribe({
      next: (res) => {
        this.emailFormBuild.get('from')?.setValue(res.data.email);
        const signature = res.data.signature;

        this.sanitizedSignature =
          this.sanitizer.bypassSecurityTrustHtml(signature);

        this.emailFormBuild
          .get('body')
          ?.setValue('<br><br><br><br>' + signature);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }

  // setEmailBodyValue(signature: string) {
  //   const bodyControl = this.emailFormBuild.get('body');
  //   const currentValue = bodyControl?.value || '';
  //   const newValue = `${currentValue}${signature}`;
  //   bodyControl?.setValue(newValue);
  // }
  handleImageUpload(event: any) {
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.attachments.push(file);
    }
  }
  openFileSelection() {
    const fileInput = this.document.getElementById('image');
    if (fileInput) {
      fileInput.click();
    }
  }
  get formControl() {
    return this.emailFormBuild.controls;
  }
  sendEmail() {
    const recipients = this.emailFormBuild.get('recipients')?.value;
    const fileName = this.fileName!;
    const body = this.emailFormBuild.get('body')?.value;
    const subject = this.emailFormBuild.get('subject')?.value;
    const file = this.attachments!;
    const bcc = this.emailFormBuild.get('BCC')?.value;
    // return console.log(this.emailFormBuild.value);
    this.dataService
      .sendEmail(recipients, fileName, body, subject, file, bcc)
      .subscribe({
        next: (res) => {
          this.alertifyService.dialogAlert('Email Sent');
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
  }

  searchRecipient() {
    this.searchTerms
      .pipe(
        debounceTime(300), // Wait for 300 milliseconds of inactivity
        takeUntil(this.unsubscribe$),
        switchMap((term: string) => this.dataService.searchRecipient(term))
      )
      .subscribe({
        next: (res) => {
          this.recipients = res.data;
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  searchRecipients(event: any) {
    const substring = event.term;
    this.searchTerms.next(substring);
  }
}
// }
