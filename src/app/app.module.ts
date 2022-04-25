import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { TableComponent } from './components/table/table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelComponent } from './components/panel/panel.component';
import { PageControlsComponent } from './components/page-controls/page-controls.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchInputComponent,
    TableComponent,
    PanelComponent,
    PageControlsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
