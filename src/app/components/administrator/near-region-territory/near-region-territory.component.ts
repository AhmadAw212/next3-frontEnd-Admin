import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NearRegionTerritory } from 'src/app/model/near-region-territory';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddNearRegionTerritoryComponent } from './add-near-region-territory/add-near-region-territory.component';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-near-region-territory',
  templateUrl: './near-region-territory.component.html',
  styleUrls: ['./near-region-territory.component.css'],
})
export class NearRegionTerritoryComponent implements OnInit, OnChanges {
  selectedRow!: HTMLElement;
  @Input() selectedRegion?: type;
  nearRegion?: NearRegionTerritory[];
  reportDateTimeFormat?: string;
  updatedRegion?: NearRegionTerritory[] = [];
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private dialog: MatDialog,
    private dicoService: DicoServiceService
  ) {}

  ngOnChanges(): void {
    this.getRegionTerritory();
  }
  ngOnInit(): void {
    this.getRegionTerritory();
    this.dateFormatterService();
    this.getDico();
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  trackNearTerritoryById(index: number, territory: NearRegionTerritory) {
    return territory.id;
  }
  dateFormatterService() {
    this.dateFormatService.dateFormatter();
    this.dateFormatService.date.subscribe(() => {
      this.reportDateTimeFormat = this.dateFormatService.reportDateTimeFormat;
    });
  }

  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.closest('tr') as HTMLElement;
    this.selectedRow.classList.add('highlight');
  }
  onTdBlur(
    event: FocusEvent,
    region: NearRegionTerritory,
    property: 'priority'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = region[property];
    const newValue = tdElement.innerText.trim();
    const updatedRegion = this.updatedRegion ?? [];

    const index = updatedRegion.findIndex((item) => item.id === region.id);
    if (index !== -1) {
      updatedRegion.splice(index, 1);
    }

    if (oldValue !== Number(newValue)) {
      region[property] = parseInt(newValue);
      this.updatedRegion?.push({
        id: region.id,
        priority: region.priority,
      });
      // console.log(this.updatedRegion);
    }
  }
  updateNearRegion() {
    const parentRegion = this.selectedRegion?.code!;
    if (this.updatedRegion?.length) {
      this.dataService
        .updateNearRegion(parentRegion, this.updatedRegion)
        .subscribe({
          next: (res) => {
            this.alertifyService.success(res.message!);
            this.updatedRegion = [];

            console.log(res);
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
  getRegionTerritory() {
    const regionCode = this.selectedRegion?.code!;
    this.dataService.getNearRegionTerritory(regionCode).subscribe({
      next: (res) => {
        this.nearRegion = res.data.data;
        // console.log(res);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }
  deleteCarCover(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteNearRegionTerritory(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.getRegionTerritory();
          },
          error: (err) => {
            if (err.status === 401 || err.status === 500) {
              this.authService.logout();
              this.alertifyService.dialogAlert('Error');
            }
          },
        });
      }
    );
  }
  addNearRegionDialog() {
    const dialogRef = this.dialog.open(AddNearRegionTerritoryComponent, {
      data: {
        parentRegion: this.selectedRegion?.code,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getRegionTerritory();
    });
  }
}
