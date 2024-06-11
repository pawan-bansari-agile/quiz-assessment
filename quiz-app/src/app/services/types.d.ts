export interface PlayerResponse {
  displayName: string;
  id: number;
  prizeMoney: number;
  startTime: string;
}

export interface LeaderBoardResponse {
  displayName?: string;
  prizeMoney?: number;
  startTime?: string;
  status?: string;
  message?: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
}

// export interface Game {
//   currentLevel: number;
//   lifeline50Used: boolean;
//   lifelineAIUsed: boolean;
//   status: string;
//   player: PlayerResponse;
//   askedQuestions: Question[];
//   currentQuestionId: number | null;
//   id: number;
// }
export interface Game {
  id: number;
  displayName: string;
  prizeMoney: number;
  startTime: string;
  currentLevel: number;
  askedQuestions: Question[];
}

export interface AnswerResponse {
  correct: boolean;
  nextQuestion?: Question;
  prizeMoney: number;
  prizeLevels: number[];
  currentPrizeIndex: number; // Add this line
  message?: string; // Optionally add this if you're using it
  correctAnswer: string;
}

export interface GameResponse {
  game: Game;
}

// export interface AnswerResponse {
//   correct: boolean;
//   nextQuestion?: Question;
//   message?: string;
//   prizeMoney: number;
// }
