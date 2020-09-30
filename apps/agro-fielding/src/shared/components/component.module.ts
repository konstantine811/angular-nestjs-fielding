import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// material
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
// components
import { DialogOverviewMapPointHomeComponent } from './dialog-overview-map-point-home/dialog-overview-map-point-home.component';

@NgModule({
  imports: [FormsModule, MatDialogModule, MatInputModule, MatButtonModule],
  declarations: [DialogOverviewMapPointHomeComponent],
  exports: [DialogOverviewMapPointHomeComponent],
})
export class ComponentModule {}
