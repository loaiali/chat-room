import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = []
// const routes: Routes = [
//   { path: "login", component:  },
//   { path: "room/:room", component: },

// ];

// const routes: Routes = [
//   { path: "", component: AnimalsComponent },
//   { path: "animals/:animal", component: AnimalsComponent },
// ]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
