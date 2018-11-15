export class QuizResults {
    correct_answers: number;
    num_questions: number;
    category: {
        name: String;
        value: number;
    };
    difficulty: string;

    constructor (cat = null, diff = null , numQ = 10, cAns = 0) {
            this.correct_answers = cAns;
            this.num_questions = numQ;
            this.category = cat;
            this.difficulty = diff;
    }
}
