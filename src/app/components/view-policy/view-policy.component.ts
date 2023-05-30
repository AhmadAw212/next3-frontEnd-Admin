import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewPolicyDialogComponent } from '../view-policy-dialog/view-policy-dialog.component';

@Component({
  selector: 'app-view-policy',
  templateUrl: './view-policy.component.html',
  styleUrls: ['./view-policy.component.css'],
})
export class ViewPolicyComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  viewPolicyComponent() {
    this.dialog.open(ViewPolicyDialogComponent, {
      width: '1000px',
      maxHeight: '600px',
    });
  }
}
