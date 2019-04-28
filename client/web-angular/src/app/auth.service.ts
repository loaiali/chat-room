import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import base64 from 'base-64'


export interface UserType {
  name: String;
  email: String;
  token: String;
}

export interface UserInfoType {
  name: String;
  email: String;
  password: String;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: UserType;
  private url = "http://localhost:5000"
  constructor(private http: HttpClient) {
    this.user = {
      name: "",
      email: "",
      token: "",
    }
  }


  public login(username: String, password: String) {
    return Observable.create((observer) => {
      this.http.get(`${this.url}/login`, {
        headers: {
          "Authorization": `Basic ${base64.encode(`${username}:${password}`)}`,
        },
        observe: 'response'
      }).toPromise().then((res) => {
        console.log(res)
        if (!res.ok) {
          observer.next(false)
        }
        else {
          this.user.token = res.body["token"]
          this.user.name = username
          observer.next(true)
        }
        observer.complete()
      }).catch(observer.error)
    })
  }

  public signup(userInfo: UserInfoType) {
    return Observable.create((observer) => {
      fetch(`${this.url}/signup`, {
        method: 'POST',
        body: JSON.stringify(userInfo),
      }).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            this.user.token = data.token
            this.user.name = userInfo.name
            observer.next(true)
          })
        }
        else
          observer.next(false)
        observer.complete()
      }).catch(observer.error)
    })
  }

  public getCurrUser(): UserType {
    return this.user
  }

  /**
   * short hand for getCurrentUser().token
   */
  public getToken(): String {
    return this.user.token
  }

}
