import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import {
  AnswerResponse,
  GameResponse,
  LeaderBoardResponse,
  PlayerResponse,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  baseURL = 'http://localhost:3000/quiz';

  startGame(displayName: string): Observable<any> {
    const createPlayerUrl = `${this.baseURL}/player`;
    return this.http
      .post<PlayerResponse>(createPlayerUrl, { displayName })
      .pipe(
        switchMap((player) => {
          const startGameUrl = `${this.baseURL}/game/${player.id}`;
          return this.http.post<GameResponse>(startGameUrl, {
            playerId: player.id,
          });
        })
      );
  }

  getLeaderboard(): Observable<any[]> {
    const leaderBoardUrl = `${this.baseURL}/leaderboard`;
    return this.http.get<LeaderBoardResponse[]>(leaderBoardUrl);
  }

  answerQuestion(gameId: number, answer: string) {
    return this.http.post<AnswerResponse>(
      `${this.baseURL}/game/${gameId}/answer`,
      {
        answer: answer,
      }
    );
  }

  fiftyfifty(
    gameId: number
  ): Observable<{ message: string; remainingOptions: string[] }> {
    return this.http.post<{ message: string; remainingOptions: string[] }>(
      `${this.baseURL}/game/${gameId}/lifeline/50-50`,
      {}
    );
  }

  askTheAI(gameId: number): Observable<{ message: string; hint: string }> {
    return this.http.post<{ message: string; hint: string }>(
      `${this.baseURL}/game/${gameId}/lifeline/ask-the-ai`,
      {}
    );
  }

  quitGame(
    gameId: number
  ): Observable<{ message: string; prizeMoney: number }> {
    return this.http.post<{ message: string; prizeMoney: number }>(
      `${this.baseURL}/game/${gameId}/quit`,
      {}
    );
  }

  getGames(gameId: number) {
    return this.http.get(`${this.baseURL}/game/${gameId}`);
  }

  markGameIncomplete(gameId: number) {
    return this.http.post(`${this.baseURL}/mark-incomplete`, {
      gameId: gameId,
    });
  }
}
