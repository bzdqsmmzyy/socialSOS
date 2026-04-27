import { Controller, Get, Post, Query, Body, HttpCode } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('categories')
  getCategories() {
    console.log('[GET] /api/quiz/categories');
    return {
      code: 200,
      msg: 'success',
      data: this.quizService.getAllCategories()
    };
  }

  @Get('questions')
  getQuestions(@Query('categoryId') categoryId?: string) {
    const cid = categoryId ? Number(categoryId) : undefined;
    console.log(`[GET] /api/quiz/questions?categoryId=${cid || 'all'}`);
    return {
      code: 200,
      msg: 'success',
      data: this.quizService.getAllQuestions(cid)
    };
  }

  @Get('today')
  getTodayQuestion() {
    console.log('[GET] /api/quiz/today');
    return {
      code: 200,
      msg: 'success',
      data: this.quizService.getTodayQuestion()
    };
  }

  @Get('stats')
  getUserStats() {
    console.log('[GET] /api/quiz/stats');
    return {
      code: 200,
      msg: 'success',
      data: this.quizService.getUserStats()
    };
  }

  @Post('answer')
  @HttpCode(200)
  answerQuestion(@Body() body: { questionId: number; isCorrect: boolean }) {
    console.log(`[POST] /api/quiz/questionId=${body.questionId}, isCorrect=${body.isCorrect}`);
    return {
      code: 200,
      msg: 'success',
      data: this.quizService.answerQuestion(body.questionId, body.isCorrect)
    };
  }

  @Post('favorite')
  @HttpCode(200)
  toggleFavorite(@Body() body: { questionId: number }) {
    console.log(`[POST] /api/quiz/favorite questionId=${body.questionId}`);
    return {
      code: 200,
      msg: 'success',
      data: this.quizService.toggleFavorite(body.questionId)
    };
  }

  @Get('favorites')
  getFavorites() {
    console.log('[GET] /api/quiz/favorites');
    return {
      code: 200,
      msg: 'success',
      data: this.quizService.getFavorites()
    };
  }
}
