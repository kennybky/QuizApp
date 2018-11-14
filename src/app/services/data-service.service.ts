import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Question} from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private http: HttpClient) {

  }


  async getAllQuestions(difficulty: String): Promise<Question[]> {
    const response = await this.http.get<any>(`https://opentdb.com/api.php?
             amount=10&difficulty=${difficulty}&type=multiple`).toPromise();
    console.log(response)
    return response.results;
  }

  async getCategoryQuestions(category: number, difficulty: String): Promise<Question[]> {
      const response = await this.http.get<Response>(`https://opentdb.com/api.php?&category=${category}&
             amount=10&difficulty=${difficulty}&type=multiple`).toPromise();
      console.log(response)
      return response.results;
  }
}

class Response {
    response_code: number;
    results: Question[];
}
