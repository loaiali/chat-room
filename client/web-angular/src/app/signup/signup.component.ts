import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  _inputUsername: String
  _inputPassword: String
  _inputEmail: String

  constructor(private authService: AuthService, private readonly router: Router) { }

  ngOnInit() {
  }

  _onSignUpClicked() {
    const info = {
      "name": this._inputUsername,
      "email": this._inputEmail,
      "password": this._inputPassword,
    }
    this.authService.signup(info).subscribe((success) => {
      if (success) {
        this.router.navigate(["rooms"])
        return
      }
      console.log("Error in sign up")
    })
  }

}
