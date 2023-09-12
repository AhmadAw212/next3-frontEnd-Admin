import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-towing-company',
  templateUrl: './add-towing-company.component.html',
  styleUrls: ['./add-towing-company.component.css'],
})
export class AddTowingCompanyComponent implements OnInit {
  insuranceCompany?: string;
  towingCompanies?: any[];
  companies?: any[] = [];
  selectedCompany?: string;
  selectedTowing?: string;
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddTowingCompanyComponent>,
    private dicoService: DicoServiceService
  ) {}
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  async ngOnInit(): Promise<void> {
    this.getDico();
    await this.getCompaniesPerUser();
    this.getAvailableTowingCompanies();
  }

  async getCompaniesPerUser(): Promise<void> {
    try {
      const res = await lastValueFrom(
        this.dataService.getCompaniesListByCurrentUser()
      );
      this.companies = res.companyList;
      this.selectedCompany = this.companies![0]?.companyId || null;
      // console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
  getAvailableTowingCompanies() {
    this.dataService.getTowingCompanies(this.selectedCompany!).subscribe({
      next: (res) => {
        this.towingCompanies = res.data;
        console.log(res);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error', err.error.message);
      },
    });
  }
  addTowingSupplierToInsuranceCompany() {
    this.dataService
      .assignTowingSupplierToInsuranceCompany(
        this.selectedCompany!,
        this.selectedTowing!
      )
      .subscribe({
        next: (res) => {
          this.alertifyService.success(res.message);
          this.dialogRef.close(res.data);
        },
        error: (err) => {
          this.alertifyService.error(err.error.message);
        },
      });
  }
  close() {
    this.dialogRef.close();
  }
}
