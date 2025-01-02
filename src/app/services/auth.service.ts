import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/api/students/login`, credentials)
      .pipe(map(user => {
        if (user && typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/api/students/register`, user);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const token = this.currentUserValue?.token;
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  isAuthenticated(): boolean {
    const token = this.currentUserValue?.token;
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    return this.currentUserValue?.token || null;
  }
}
