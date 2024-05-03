import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CopilotSeatsComponent } from './copilot-seats/copilot-seats.component';
import { CopilotUsageComponent } from './copilot-usage/copilot-usage.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'copilot-seats', component: CopilotSeatsComponent },
  { path: 'copilot-usage', component: CopilotUsageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
