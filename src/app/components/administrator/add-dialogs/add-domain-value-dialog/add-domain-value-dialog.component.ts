import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreDomainValue } from 'src/app/model/core-domain-value';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-add-domain-value-dialog',
  templateUrl: './add-domain-value-dialog.component.html',
  styleUrls: ['./add-domain-value-dialog.component.css'],
})
export class AddDomainValueDialogComponent {
  code?: string;
  description?: string;
  val1?: string;
  val2?: string;
  val3?: string;
  val4?: string;
  val5?: string;
  val6?: string;
  val7?: string;
  val8?: string;
  val9?: string;
  val10?: string;
  val11?: string;
  coreDomainId?: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public domainValues: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddDomainValueDialogComponent>
  ) {
    this.coreDomainId = domainValues.domainId;
    console.log(this.domainValues);
  }

  getDomainValuesData(id: string) {
    this.dataService.coreDomainValue(id).subscribe({
      next: (res) => {
        this.domainValues.domainValues = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addDomainValue() {
    const id = this.domainValues.domainId;
    const domainData: CoreDomainValue = {
      code: this.code!,
      description: this.description!,
      coreDomainId: this.coreDomainId,
      val1: this.val1,
      val2: this.val2,
      val3: this.val3,
      val4: this.val4,
      val5: this.val5,
      val6: this.val6,
      val7: this.val7,
      val8: this.val8,
      val9: this.val9,
      val10: this.val10,
      val11: this.val11,
    };
    this.dataService.addDomainValue(id, domainData).subscribe({
      next: (res) => {
        this.alertifyService.success(res.message!);
        this.dialogRef.close();
        this.getDomainValuesData(id);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
