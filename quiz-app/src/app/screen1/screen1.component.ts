import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/app.service';
import { LeaderBoardResponse } from '../services/types';

@Component({
  selector: 'app-screen1',
  templateUrl: './screen1.component.html',
  styleUrls: ['./screen1.component.css'],
})
export class Screen1Component implements OnInit {
  displayName: string = '';
  leaderboard: LeaderBoardResponse[] = [];
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchLeaderboard();
  }

  fetchLeaderboard() {
    this.apiService.getLeaderboard().subscribe(
      (data: LeaderBoardResponse[]) => {
        if (data && data.length > 0) {
          if (data[0].message) {
            this.errorMessage = data[0].message;
            this.leaderboard = [];
          } else {
            this.leaderboard = data;
            console.log('✌️leaderboard --->', this.leaderboard);
            this.errorMessage = '';
          }
        } else {
          this.errorMessage = 'No data available';
          this.leaderboard = [];
        }
      },
      (error) => {
        this.errorMessage = 'An error occurred while fetching the leaderboard';
        this.leaderboard = [];
      }
    );
  }

  startGame() {
    if (this.displayName) {
      this.apiService.startGame(this.displayName).subscribe((response: any) => {
        localStorage.setItem('isGameActive', 'true');
        this.router.navigate(['/screen2'], {
          state: {
            game: response.game,
            prizeLevels: response.prizeLevels,
            currentPrizeLevel: response.currentPrizeLevel,
          },
        });
      });
    }
  }
}
