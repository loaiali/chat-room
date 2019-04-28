import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public _inputPassword: String
  public _inputUsername: String

  constructor(private authService: AuthService, private readonly router: Router) { }

  ngOnInit() {
  }

  public _onSignInClicked() {
    console.log("signed in clicked")
    this.authService.login(this._inputUsername, this._inputPassword).subscribe((success) => {
      if (!success) {
        console.log("sign in failed")
        return
      }
      console.log("signed in successfully")
      console.log("user token is ", this.authService.getToken())
      this.router.navigate(["rooms"]);
    })
  }

}
