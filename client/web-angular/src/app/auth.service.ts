import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { Base64 } from 'js-base64';

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
          "Authorization": `Basic ${Base64.encode(`${username}:${password}`)}`,
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
      this.http.post(`${this.url}/signup`, userInfo, {
        observe: 'response'
      }).toPromise().then((res) => {
        console.log(res)
        if (!res.ok) {
          observer.next(false)
        }
        else {
          this.user.token = res.body["token"]
          this.user.name = userInfo.name
          observer.next(true)
        }
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
