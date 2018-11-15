import { Component } from '@angular/core';
import {Storage} from '@ionic/storage';
import {QuizResults} from '../models/quiz-results';

@Component({
  selector: 'app-about',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss']
})
export class HistoryPage {

    quizzes = [] as QuizResults[];
    dataInitialized = false;
    scorePercentage: number;
    storageReady = false;

    constructor(private storage: Storage) {
      console.log('here');
      this.storage.ready().then(() => {
          this.storageReady = true;
          this.initializeData().then(() => {
              this.dataInitialized = true;
          });
      });
    }

    async initializeData() {
        this.quizzes = await this.storage.get('quizzes');
        let total = 0, correct = 0;
        this.quizzes.forEach((quiz) => {
            total += quiz.num_questions;
            correct += quiz.correct_answers;
        });

        this.scorePercentage = Math.floor((correct / total) * 100);
    }

    refresh() {
        if (this.storageReady) {
            this.initializeData();
        }
    }
}
