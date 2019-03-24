import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {Question} from '../models/question';
import {HomePage} from '../home/home.page';
import {Observable, TimeInterval} from 'rxjs';
import Timeout = NodeJS.Timeout;
import {QuizService} from '../services/quiz-service';
import {QuizResults} from '../models/quiz-results';


interface GameState {
    question: Question;
    counter: number;
    results: QuizResults;
}

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnChanges {

  constructor(private quiz: QuizService) {
      this.quiz.getQuestion().subscribe((gameState: GameState) => {
          console.log(gameState);
          this.question = gameState.question;
          this.counter = gameState.counter;
          this.results = gameState.results;
          this.displayChoices();
      });
  }
    @Input() start: boolean;
  question: Question;
  choices = [] as Array<String>;
  result: String;
  showingAnswer = false;
  selected: String;
  time_left = 10;
  timer: Timeout;
  chosen = false;
  counter = 0;
  results: QuizResults;



  ngOnInit() {
  }

  getColor (value) {
    if (value === this.selected) {
      if (value === this.question.correct_answer) {
        return 'success';
      } else {
        return 'danger';
      }
    } else {
      return 'light';
    }
  }

  reset () {
    this.showingAnswer = false;
  }

  displayChoices() {
    this.time_left = 10;
    this.chosen = false;
    console.log(this.question.incorrect_answers);
    const choices = [];
    for (const choice of this.question.incorrect_answers) {
      choices.push(choice);
      }
    const i = this.getRand(this.question.incorrect_answers.length);
    console.log(i);
    choices.splice(i, 0, this.question.correct_answer);
    this.choices = choices;
    this.showingAnswer = false;
    if (this.timer != null) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.time_left--;
      if (this.time_left <= 0) {
        clearInterval(this.timer);
        this.selectAnswer(null);
      }
    }, 1000);
  }

  getRand(i) {
    return Math.floor((Math.random() * i));
  }

  selectAnswer(answer: String) {
    if (this.chosen) {
      return;
    }
    this.chosen = true;
      this.showingAnswer = true;
    this.selected = answer;
    let correct;
    if (answer === this.question.correct_answer) {
      this.result = 'Correct!';
      correct = true;
    } else {
      this.result = 'Wrong!';
      correct = false;
    }
    setTimeout(() => {
      this.navigateNext(correct);
    }, 2000);
  }

  navigateNext(correct) {
   this.quiz.recordAnswer(correct);
  }

    ngOnChanges(changes: SimpleChanges): void {
        // const start: SimpleChange = changes.start;
        // if (start.currentValue === true) {
        //   this.refreshQuestion();
        // }
    }

    // refreshQuestion() {
    //     this.question = this.quiz.getQuestion();
    //     this.displayChoices();
    // }

}
