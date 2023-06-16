import { Component, OnInit } from '@angular/core';
import { CoreDocument } from 'src/app/model/core-document';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddDocumentDialogComponent } from '../add-dialogs/add-document-dialog/add-document-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { CoreProfile } from 'src/app/model/core-profile';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-core-document',
  templateUrl: './core-document.component.html',
  styleUrls: ['./core-document.component.css'],
})
export class CoreDocumentComponent implements OnInit {
  fileName: string = '';
  path: string = '';
  docData?: CoreDocument[] = [];
  reportDateTimeFormat?: string;
  updatedDocValues?: CoreDocument[] = [];
  coreDocument?: CoreDocument;
  selectedRow!: HTMLElement;
  isLoading: boolean = false;
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService
  ) {}

  ngOnInit(): void {
    this.dateFormatService.dateFormatter();
    this.dateFormatterService();
    this.getDico();
  }
  getDico() {
    this.isLoading = true;
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.parentNode as HTMLElement;
    this.selectedRow.classList.add('highlight');
  }

  dateFormatterService() {
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
    });
  }
  isImage(contentType: string): boolean {
    return contentType.startsWith('image/');
  }
  coreDocSearch() {
    this.isLoading = true;
    this.dataService.coreDocSearch(this.fileName, this.path).subscribe({
      next: (res) => {
        this.docData = res.data;
        this.docData = res.data.map((res: CoreDocument) => {
          // console.log(`data:image/jpeg;base64,${res.content}`);
          return {
            ...res,
            content: `data:image/jpeg;base64,${res.content}`,
          };
        });
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false;
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

  openUpdateDocumentDialog(document: CoreDocument) {
    // this.dialog.open();
  }
}
