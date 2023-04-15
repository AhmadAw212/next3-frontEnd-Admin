import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigData } from 'src/app/model/config-data';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddConfigDialogComponent } from '../add-config-dialog/add-config-dialog.component';

@Component({
  selector: 'app-core-configuration',
  templateUrl: './core-configuration.component.html',
  styleUrls: ['./core-configuration.component.css'],
})
export class CoreConfigurationComponent {
  description: string = '';
  id: string = '';
  configData?: ConfigData[];
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog
  ) {}
  onTdDoubleClick(event: MouseEvent) {
    const tdElement = event.target as HTMLTableCellElement;
    tdElement.focus();
  }
  coreConfigSearch() {
    this.dataService.coreConfigSearch(this.id, this.description).subscribe({
      next: (data) => {
        this.configData = data.data;
        console.log(data.data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  openCoreConfigDialog() {
    this.dialog.open(AddConfigDialogComponent);
  }
}
