import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddLanguageComponent } from '../add-language/add-language.component';

@Component({
  selector: 'app-language-config',
  templateUrl: './language-config.component.html',
  styleUrls: ['./language-config.component.css'],
})
export class LanguageConfigComponent {
  constructor(private dialog: MatDialog) {}

  openCoreConfigDialog() {
    this.dialog.open(AddLanguageComponent);
  }
}
