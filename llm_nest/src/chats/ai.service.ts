import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AIResponse } from './interface/conversation.interface';
@Injectable()
export class AIService {
  constructor(private httpService: HttpService) {}

  async query(input_text: string, model: string, history: [
    {
      role: string;
      content: string;
    }
  ]) :Promise<AIResponse> {
    const response = await this.httpService
      .post('http://fastapi_app:8000/query', {
        input_text,
        model,
        history,
      })
      .toPromise();
    return response.data as AIResponse;
  }
}