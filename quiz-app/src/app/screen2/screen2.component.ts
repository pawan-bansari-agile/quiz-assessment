import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/app.service';
import { AnswerResponse, Game } from '../services/types';
import { MatDialog } from '@angular/material/dialog';
import { IncorrectAnswerDialogComponent } from '../incorrect-answer-dialog/incorrect-answer-dialog.component';
import { QuitDialogComponent } from '../quit-dialog/quit-dialog.component';
import { LifelineDialogComponent } from '../lifeline-dialog/lifeline-dialog.component';
import { GameCompletionDialogComponent } from '../game-completion-dialog/game-completion-dialog.component';

@Component({
  selector: 'app-screen2',
  templateUrl: './screen2.component.html',
  styleUrls: ['./screen2.component.css'],
})
export class Screen2Component implements OnInit, OnDestroy {
  currentQuestion: any = null;
  selectedOption: string = '';
  prizeLevels: any[] = [];
  currentPrizeIndex: number = 0;
  game!: Game;
  showCorrectAnswer: boolean = false;
  correctAnswer: string = '';
  nextQuestion: any = null;
  showNextQuestionButton: boolean = false;
  showIncorrectAnswerPopup: boolean = false;
  gameId: number | null = null;
  isGameCompleted: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['game']) {
      this.game = navigation.extras.state['game'] as Game;
      this.currentQuestion = this.game.askedQuestions[0];
      this.prizeLevels = navigation.extras.state['prizeLevels'];
      this.currentPrizeIndex =
        navigation.extras.state['currentPrizeIndex'] || 0;
      this.gameId = this.game.id;
      localStorage.setItem('isGameActive', 'true');
    } else {
      this.router.navigate(['/screen1']);
    }
  }

  ngOnInit() {
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    document.addEventListener(
      'visibilitychange',
      this.handleVisibilityChange.bind(this)
    );
  }

  ngOnDestroy() {
    window.removeEventListener(
      'beforeunload',
      this.handleBeforeUnload.bind(this)
    );
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange.bind(this)
    );
    this.checkAndMarkGameIncomplete();
    localStorage.removeItem('isGameActive');
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: Event) {
    this.checkAndMarkGameIncomplete();
    this.router.navigate(['/screen1']);
  }

  @HostListener('document:visibilitychange', ['$event'])
  handleVisibilityChange(event: Event) {
    if (document.visibilityState === 'hidden') {
      this.checkAndMarkGameIncomplete();
    }
  }

  private checkAndMarkGameIncomplete() {
    if (!this.isGameCompleted && this.gameId !== null) {
      this.markGameIncomplete(this.gameId);
    }
  }

  private handleUnload() {
    if (!this.isGameCompleted && this.gameId !== null) {
      this.markGameIncomplete(this.gameId);
    }
  }

  private markGameIncomplete(gameId: number) {
    this.apiService.markGameIncomplete(gameId).subscribe(() => {
      this.router.navigate(['/screen1']);
    });
  }

  submitAnswer() {
    if (this.selectedOption) {
      this.apiService
        .answerQuestion(this.game.id, this.selectedOption)
        .subscribe((result: AnswerResponse) => {
          // Display correct answer
          this.correctAnswer = result.correctAnswer;
          if (result.correct) {
            this.showCorrectAnswer = true;
            this.correctAnswer = result.correctAnswer;
            this.currentPrizeIndex = result.currentPrizeIndex;
            if (result.message) {
              this.isGameCompleted = true;
              this.dialog
                .open(GameCompletionDialogComponent, {
                  data: {
                    message: result.message,
                    prizeMoney: result.prizeMoney,
                  },
                  disableClose: true,
                })
                .afterClosed()
                .subscribe(() => {
                  this.router.navigate(['/screen1']);
                });
            } else {
              this.showNextQuestionButton = true;
              this.nextQuestion = result.nextQuestion;
            }
          } else {
            this.isGameCompleted = true;
            const dialogRef = this.dialog.open(IncorrectAnswerDialogComponent, {
              data: { correctAnswer: this.correctAnswer },
              disableClose: true,
            });

            dialogRef.afterClosed().subscribe(() => {
              this.router.navigate(['/screen1']);
            });
          }
        });
    }
  }

  gotoNextQuestion() {
    // Reset variables
    this.selectedOption = ''; // Clear selected option
    this.correctAnswer = ''; // Clear correct answer
    this.showNextQuestionButton = false; // Hide next question button
    // Display the next question
    this.currentQuestion = this.nextQuestion;
    this.showCorrectAnswer = false;
  }

  quitGame() {
    this.isGameCompleted = true;
    this.apiService
      .quitGame(this.game.id)
      .subscribe((response: { message: string; prizeMoney: number }) => {
        const dialogRef = this.dialog.open(QuitDialogComponent, {
          data: { message: response.message },
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe(() => {
          if (response.prizeMoney > 0) {
            this.router.navigate(['/screen1']);
          }
        });
      });
  }

  useLifeline50() {
    this.apiService
      .fiftyfifty(this.game.id)
      .subscribe(
        (response: { remainingOptions: string[]; message: string }) => {
          if (response.message) {
            this.dialog.open(LifelineDialogComponent, {
              data: { message: response.message },
              disableClose: true,
            });
          } else {
            this.currentQuestion.options = response.remainingOptions;
          }
        }
      );
  }

  useAskTheAI() {
    this.apiService
      .askTheAI(this.game.id)
      .subscribe((response: { hint: string; message: string }) => {
        if (response.message) {
          this.dialog.open(LifelineDialogComponent, {
            data: { message: response.message },
            disableClose: true,
          });
        } else {
          this.dialog.open(LifelineDialogComponent, {
            data: { message: response.hint },
            disableClose: true,
          });
        }
      });
  }
}
