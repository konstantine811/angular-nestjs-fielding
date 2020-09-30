import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// model
import { DialogOverviewMapPointHome } from '@agro-fieling/app/shared/core/model/dialog-overview-map-point-home.model';

@Component({
  selector: 'agro-fielding-dialog-overview-map-point-home',
  templateUrl: './dialog-overview-map-point-home.component.html',
  styleUrls: ['./dialog-overview-map-point-home.component.scss'],
})
export class DialogOverviewMapPointHomeComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DialogOverviewMapPointHomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogOverviewMapPointHome.DialogData
  ) {}

  ngOnInit(): void {}
}
