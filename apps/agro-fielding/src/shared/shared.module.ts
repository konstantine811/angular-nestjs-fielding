import { NgModule } from '@angular/core';
// shared modules
import { MaterialModule } from './libs/material/material.module';
import { ComponentModule } from './components/component.module';

@NgModule({
  imports: [MaterialModule, ComponentModule],
  exports: [MaterialModule, ComponentModule],
})
export class SharedModule {}
