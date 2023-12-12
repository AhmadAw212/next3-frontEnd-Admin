import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaugeComponentComponent } from './gauge-component/gauge-component.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginNavComponent } from '../login-nav/login-nav.component';
import { LoginPageComponent } from '../login-page/login-page.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SendEmailComponent } from '../send-email/send-email.component';
import { SendEmailButtonComponent } from '../send-email-button/send-email-button.component';
import { NgxEditorModule } from 'ngx-editor';
import { ProfilesNavComponent } from '../common-components/profiles-nav/profiles-nav.component';
import { ViewNotesComponent } from '../view-notes/view-notes.component';
import { DataEntryButtonComponent } from '../data-entry-button/data-entry-button.component';
import { DataEntryComponent } from '../data-mgmt/data-entry/data-entry.component';
import { ViewNoteDialogComponent } from '../view-notes/view-note-dialog/view-note-dialog.component';
import { RouterModule } from '@angular/router';
// import { GaugeComponentComponent } from './gauge-component/gauge-component.component';
// import { GaugeComponentComponent } from './gauge-component/gauge-component.component';

@NgModule({
  declarations: [
    GaugeComponentComponent,
    PaginatorComponent,
    LoginNavComponent,
    SideMenuComponent,
    NavbarComponent,
    SendEmailComponent,
    SendEmailButtonComponent,
    ProfilesNavComponent,
    ViewNotesComponent,
    DataEntryButtonComponent,
    DataEntryComponent,
    ViewNoteDialogComponent,
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    NgSelectModule,
    BsDatepickerModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    NgxEditorModule,
    RouterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  exports: [
    GaugeComponentComponent,
    PaginatorComponent,
    MatPaginatorModule,
    NgSelectModule,
    BsDatepickerModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSidenavModule,
    FormsModule,
    MatListModule,
    NgxEditorModule,
    RouterModule,
    NgMultiSelectDropDownModule,
    LoginNavComponent,
    NavbarComponent,
    SideMenuComponent,
    ProfilesNavComponent,
    ViewNotesComponent,
    DataEntryButtonComponent,
    DataEntryComponent,
    ViewNoteDialogComponent,
  ],
})
export class SharedModule {}
