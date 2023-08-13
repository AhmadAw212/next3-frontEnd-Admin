import { Component, Input } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  @Input() tableTitle?: string;
  @Input() showExportButton?: boolean;
  @Input() exportButtonText?: string;
  @Input() isLoading?: boolean;
  @Input() items?: any[]; // Modify this type based on your data structure
  @Input() noDataMessage?: string;
  @Input() tableHeaders?: string[];
  @Input() fieldNames?: string[];
  selectedRow!: HTMLElement;
  constructor(private dateFormatService: DateFormatterService) {}
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
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
  exportToExcel() {
    // const data = this.users?.map((user) => {
    //   return {
    //     'User Name': user.userName,
    //     'Display Name': user.displayName,
    //     Email: user.email,
    //     Company: user.companyDescription,
    //     Active: user.activeDesc,
    //     'Created Date': this.datePipe.transform(
    //       user.sysCreatedDate,
    //       this.dateFormat('excelDateTimeFormat')
    //     ),
    //     'Created By': user.sysCreatedBy,
    //     'Updated Date': this.datePipe.transform(
    //       user.sysUpdatedDate,
    //       this.dateFormat('excelDateTimeFormat')
    //     ),
    //     'Updated By': user.sysUpdatedBy,
    //   };
    // });
    // Save the Excel file.
    // Convert the data to a worksheet
    // const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Users.xlsx');
  }
}
