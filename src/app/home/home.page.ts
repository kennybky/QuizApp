import {Component, OnInit, ViewChild} from '@angular/core';
import {Question} from '../models/question';
import {DataService} from '../services/data-service';
import {QuestionComponent} from '../question/question.component';
import { Storage } from '@ionic/storage';
import {QuizService} from '../services/quiz-service';
import {QuizResults} from '../models/quiz-results';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

    quizStarted: boolean;

  constructor(private dataService: DataService, private quizService: QuizService, private storage: Storage) {
  }

    ngOnInit(): void {
    }

    startQuiz() {
      this.quizStarted = true;
    }
}


