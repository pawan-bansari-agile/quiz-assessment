import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Screen1Component } from './screen1/screen1.component';
import { Screen2Component } from './screen2/screen2.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'screen1', component: Screen1Component },
  { path: 'screen2', component: Screen2Component, canActivate: [AuthGuard] },
  // { path: '', redirectTo: '/screen1', pathMatch: 'full' },
  { path: '**', redirectTo: 'screen1' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
