import { BrowserModule } from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {
  MatAutocompleteModule, MatButtonModule, MatButtonToggleModule,
  MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule,
  MatGridListModule, MatIconModule, MatInputModule,
  MatListModule, MatMenuModule, MatNativeDateModule,
  MatOptionModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule,
  MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule,
  MatStepperModule,
  MatTableModule, MatTabsModule, MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { DataTableComponent } from './data-table/component';
import {AppService} from "./app.service";
import {CdkTableModule} from "@angular/cdk/table";
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent
  ],
  imports: [
    HttpClientModule,

    BrowserModule,
    BrowserAnimationsModule,

    CommonModule,

    FormsModule,
    ReactiveFormsModule,

    FlexLayoutModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,

    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,

    CdkTableModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
