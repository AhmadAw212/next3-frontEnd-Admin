import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css'],
})
export class SendEmailComponent implements OnInit {
  navBarTitle = 'Send Email';
  emailFormBuild!: FormGroup;
  from?: string;
  fileName?: string;
  multipart?: File;
  subject?: string;
  bcc?: string;
  to?: string;
  body?: string;
  fileType?: string;
  recipients: string = '';
  strippedSignature?: string;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.emailForm();
    this.getEmailFrom();
  }
  emailForm() {
    this.emailFormBuild = this.formBuilder.group({
      from: [{ value: this.from, disabled: true }],
      recipients: ['', Validators.required],
      BCC: '',
      subject: '',
      body: '',
    });
    this.emailFormBuild.get('from')?.disable();
  }

  addRecipient(): void {
    const recipientsControl = this.emailFormBuild.get('recipients');
    const trimmedRecipients = recipientsControl?.value.trim();

    if (trimmedRecipients) {
      const hasComma = trimmedRecipients.endsWith(',');

      if (!hasComma) {
        const updatedRecipients = trimmedRecipients + ',';
        recipientsControl?.setValue(updatedRecipients);
      }
    }

    // recipientsControl?.reset();
    this.focusRecipientsField();
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
        const strippedSignature = this.stripHtmlTags(signature);
        this.emailFormBuild
          .get('body')
          ?.setValue('\n\n\n\n\n\n' + strippedSignature);

        // this.signature = res.data.signature;
        // this.emailForm();
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }
  stripHtmlTags(html: string): string {
    return html.replace(/<[^>]+>/g, '');
  }
  handleImageUpload(event: any) {
    const file = event.target.files[0];
    // Implement logic to handle the uploaded image here
    this.fileName = file.name;
    this.multipart = file;
    this.fileType = file.type;
    // console.log(file);
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
    const file = this.multipart!;
    const bcc = this.emailFormBuild.get('BCC')?.value;

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
}
// }
