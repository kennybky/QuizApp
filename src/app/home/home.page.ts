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

    @ViewChild('doughnutCanvas') doughnutCanvas;

  constructor(private dataService: DataService, private quizService: QuizService, private storage: Storage) {
  }

    category: any;
    difficulty: String;
    step = 1;
    questions: Question[];
    current = true as boolean;
    counter = 0;
    correctAnswers = 0;
    quizzes: QuizResults[];
    results: QuizResults;

    doughnutChart: Chart;

    ngOnInit(): void {
      this.correctAnswers = 0;
      this.step = 1;
      this.storage.ready().then(() => {
          this.getQuizzes();
      });

      // test chart
// this.results = new QuizResults({name: 'All', value: 2}, 'easy', 10, 5);
// this.step = 5;
// this.displayChart();
    }

    async getQuizzes() {
      this.quizzes = await this.storage.get('quizzes');
    }


    selectCategory(value: any) {
      this.category = value;
      this.step = 2;
    }

    getCategories() {
        return this.quizService.categories;
    }

    getDifficulties() {
        return this.quizService.difficulties;
    }


    selectDifficulty(difficulty: String) {
      this.difficulty = difficulty;
      this.step = 3;
    }

    async startQuiz() {
        const quiz = new QuizResults(this.category, this.difficulty, 10, 0);
        const started = await this.quizService.startQuiz(quiz);
            if (started) {
               const results = await this.watchQuiz();
               this.showResults(results);
            } else {
                this.noQuestions();
            }
    }

    noQuestions () {
        // ionic modal
        this.step = 1;
    }

  async watchQuiz(): Promise<QuizResults> {
        this.current = true;
        this.step = 4;
        return await this.quizService.start();
    }

    showResults(results: QuizResults) {
        // show results
        console.log('ended');
        if (this.quizzes == null){
           this.quizzes = [];
        }
        this.quizzes.push(results)
        this.storage.set('quizzes', this.quizzes).then(() => {
            console.log('saved!');
        }).catch((err) => {
            console.log(err);
        });
        this.current = false;
        this.step = 5;
        this.results = results;
        this.displayChart();
    }

    displayChart() {
        const correct = (this.results.correct_answers / this.results.num_questions) * 50;
        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                labels: ['Correct', 'Wrong'],
                datasets: [{
                    label: '# correct',
                    data: [],
                    backgroundColor: [
                        'rgba(13, 200, 25, 0.8)',
                        'rgba(128,128,128,0.8)'
                    ],
                }]
            },
            options: {
                animation: {
                    animateRotate: true
                }
            }
        });

                this.doughnutChart.data.datasets.forEach((dataset) => {
                    dataset.data.push(correct);
                    dataset.data.push(50 - correct);
                });

        this.doughnutChart.update({
            duration: 2000,
            easing: 'easeInCirc'
        });

    }
}


