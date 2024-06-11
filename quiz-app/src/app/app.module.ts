import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Screen1Component } from './screen1/screen1.component';
import { Screen2Component } from './screen2/screen2.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ApiService } from './services/app.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { IncorrectAnswerDialogComponent } from './incorrect-answer-dialog/incorrect-answer-dialog.component';
import { QuitDialogComponent } from './quit-dialog/quit-dialog.component';
import { LifelineDialogComponent } from './lifeline-dialog/lifeline-dialog.component';
import { GameCompletionDialogComponent } from './game-completion-dialog/game-completion-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    Screen1Component,
    Screen2Component,
    IncorrectAnswerDialogComponent,
    QuitDialogComponent,
    LifelineDialogComponent,
    GameCompletionDialogComponent,
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
