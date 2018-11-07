import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VoteComponent } from './vote/vote.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [{
  path: 'vote',
  component: VoteComponent
}, {
  path: 'image',
  component: UploadComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
