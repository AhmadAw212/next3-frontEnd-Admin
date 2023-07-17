import { Component, OnInit } from '@angular/core';
import { CoreDocument } from 'src/app/model/core-document';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddDocumentDialogComponent } from '../add-dialogs/add-document-dialog/add-document-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { CoreProfile } from 'src/app/model/core-profile';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UpdateDocumentComponent } from '../update-dialogs/update-document/update-document.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
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
  dateFormats?: any;
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private userRolesService: UsersRolesService
  ) {}

  ngOnInit(): void {
    this.dateFormatterService();
    this.getDico();
    this.userRolesService.getUserRoles();
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }

  trackDocById(index: number, doc: any): string {
    return doc.id;
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  exportToExcel() {
    const data = this.docData?.map((data) => {
      return {
        ID: data.id,
        Company: data.company,
        'Content Type': data.contentType,
        'File Name': data.fileName,
        'File Path': data.filePath,
        'Created Date': this.datePipe.transform(
          data.createdDate,
          this.dateFormat('excelDateTimeFormat')
        ),

        'Created By': data.createdBy,
        'Updated Date': this.datePipe.transform(
          data.updateDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        'Updated By': data.updatedBy,
      };
    });

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Core Document');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Core_Document.xlsx');
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
    // this.dateFormatService.dateFormatter();
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
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
        if (err.status === 401) {
          // this.authService.refreshTokens();
        } else {
          this.alertifyService.error(err.error.message);
          console.log(err);
        }
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
            if (err.status === 401) {
              // this.authService.refreshTokens();
            } else {
              this.alertifyService.error(err.error.message);
              console.log(err);
            }
          },
        });
      }
    );
  }

  openCoreDocDialog() {
    this.dialog.open(AddDocumentDialogComponent);
  }
  UpdateDocDialog(selectedDoc: CoreDocument) {
    // this.selectedDoc = selectedDoc;
    const dialogRef = this.dialog.open(UpdateDocumentComponent, {
      data: selectedDoc,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.coreDocSearch();
    });
  }
  // openUpdateDocumentDialog(document: CoreDocument) {
  //   // this.dialog.open();
  // }
}
