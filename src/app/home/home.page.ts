import {Component, OnInit} from '@angular/core';
import {Question} from '../models/question';
import {DataServiceService} from '../services/data-service.service';
import {QuestionComponent} from '../question/question.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  constructor(private dataService: DataServiceService) {
  }
    categories = [
        {
          name: 'All',
            value: -1
        },
        {
            name: 'General Knowledge',
              value: 9
        },
        {
          name: 'books',
          value: 10},
        {name: 'film', value: 11},
        {name: 'music', value: 12},
        {name: 'television', value: 14},
        {name: 'politics', value: 24},
        {name: 'sports', value: 21}
    ];
  difficulties =  ['easy', 'medium', 'hard'];
    category: number;
    difficulty: String;
    step = 1;
    questions: Question[];
    current: Question;
    counter = 0;
    correctAnswers = 0;

    ngOnInit(): void {
      this.correctAnswers = 0;
      this.step = 1;
    }


    selectCategory(value: number) {
      this.category = value;
      this.step = 2;
    }

    getCategory () {
      return this.categories.find((cat: any) => {
        return this.category === cat.value;
      });
    }

    selectDifficulty(difficulty: String) {
      this.difficulty = difficulty;
      this.step = 3;
    }

    async startQuiz() {
      if (this.category === -1) {
          this.questions = await this.dataService.getAllQuestions(this.difficulty);
      } else {
        this.questions = await this.dataService.getCategoryQuestions(this.category, this.difficulty);
      }
      if (this.questions.length > 0) {
          this.startCountDown();
          this.insertQuestion();
          this.step = 4;
      } else {
        this.step = 1;
      }
    }

    startCountDown() {
      this.counter = 0;
    }

    insertQuestion() {
      this.current = this.questions[this.counter];
      if (this.current === undefined || this.counter >= 10) {
        this.reset();
      }
    }

    changeQuestion(correct) {
      this.correctAnswers += correct ? 1 : 0;
      this.counter++;
      this.insertQuestion();
    }

    reset() {
      this.step = 1;
      this.current = null;
      this.counter = 0;
        this.correctAnswers = 0;
    }

}


