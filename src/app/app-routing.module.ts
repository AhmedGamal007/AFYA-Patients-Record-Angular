import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordsComponent } from './component/records/records.component';
import { AddPatientComponent } from './component/add.patient/add.patient.component';
import { EditPatientComponent } from './component/edit.patient/edit.patient.component';
import { FinanceComponent } from './finance/finance.component';

const routes: Routes = [
{
    path: '',
    redirectTo: 'records',
    pathMatch: 'full'
  },
  {
    path:"records",
    component: RecordsComponent
  }
  ,
  {
    path:"finance",
    component: FinanceComponent
  }
  ,
  {
    path:"addPatient",
    component: AddPatientComponent
  }
  ,
  {
    path:"editPatient/:id",
    component: EditPatientComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
