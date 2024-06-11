import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isGameActive = localStorage.getItem('isGameActive') === 'true';
    if (!isGameActive) {
      this.router.navigate(['/screen1']);
      return false;
    }
    return true;
  }
}
