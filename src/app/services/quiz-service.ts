import { Injectable } from '@angular/core';
import {Component} from '@angular/core/src/metadata/directives';
import {DataService} from './data-service';
import {QuizResults} from '../models/quiz-results';
import {Question} from '../models/question';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

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
    ] as any[];
    difficulties =  ['easy', 'medium', 'hard'] as String[];
    questions: Question[];
    counter: number;
    results: QuizResults;
    stopQuiz = false;
    private subject = new Subject<any>();

  constructor(private data: DataService) {
  }

  async startQuiz(results: QuizResults) {
      if (results.category.value === -1) {
          this.questions = await this.data.getAllQuestions(results.difficulty);
      } else {
          this.questions = await this.data.getCategoryQuestions(results.category.value, results.difficulty);
      }
      if (this.questions.length > 0) {
          this.startCounter(results);
          return true;
      } else {
            return false;
      }
  }
    startCounter(results: QuizResults) {
        this.counter = 0;
        this.stopQuiz = false;
        results.num_questions = this.questions.length;
        results.correct_answers = 0;
        this.results = results;
    }

    // getQuestion() {
    //     return this.questions[this.counter++];
    // }

    getQuestion() {
        return this.subject.asObservable();
    }

    setQuestion() {
      if (this.canContinue()) {
          this.subject.next({
              question: this.questions[this.counter++],
              counter: this.counter,
              results: this.results
          });
      } else {
          this.stopQuiz = true;
      }
    }

    recordAnswer(correct) {
        this.results.correct_answers += correct ? 1 : 0;
        this.setQuestion();
    }

    canContinue() {
    return this.counter < this.results.num_questions;
    }

    async start() {
      this.setQuestion();
     const promise = new Promise((resolve) => {
         const watch = setInterval( () => {
             if (this.stopQuiz) {
                 clearInterval(watch);
                 resolve();
             }
         }, 200);
     });
        await promise;
     return this.results;
    }
}
