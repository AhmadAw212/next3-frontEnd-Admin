import { Component, OnInit } from '@angular/core';
import { CoreDocument } from 'src/app/model/core-document';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddDocumentDialogComponent } from '../add-document-dialog/add-document-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-core-document',
  templateUrl: './core-document.component.html',
  styleUrls: ['./core-document.component.css'],
})
export class CoreDocumentComponent implements OnInit {
  fileName: string = '';
  path: string = '';
  docData?: CoreDocument[];
  reportDateTimeFormat?: string;
  updatedDocValues?: CoreDocument[] = [];
  constructor(
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
  }

  // onTdBlur(
  //   event: FocusEvent,
  //   document: CoreDocument,
  //   property: 'configValue' | 'description'
  // ) {
  //   const tdElement = event.target as HTMLTableCellElement;
  //   const oldValue = document[property];
  //   const newValue = tdElement.innerText.trim();

  //   if (oldValue !== newValue) {
  //     document[property] = newValue;
  //     this.updatedDocValues?.push({
  //       id: config.id,
  //       configValue: config.configValue,
  //       description: config.description,
  //     });
  //     console.log(this.updatedConfigValues);
  //   }
  // }

  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
    });
  }
  coreDocSearch() {
    this.dataService.coreDocSearch(this.fileName, this.path).subscribe({
      next: (res) => {
        this.docData = res.data;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteDocument(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this document',
      () => {
        this.dataService.deleteDocument(id).subscribe({
          next: (res) => {
            this.alertifyService.error(res.message!);
            this.coreDocSearch();
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    );
  }

  openCoreDocDialog() {
    this.dialog.open(AddDocumentDialogComponent);
  }
}
