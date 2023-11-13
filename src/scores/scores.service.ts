import { Injectable } from '@nestjs/common';

const SCORING_SERVER = 'http://106.10.57.235:3000';
@Injectable()
export class ScoresService {
  async grade(code: string, language: string, problemNumber: number) {
    const response = await fetch(`${SCORING_SERVER}/v2/scoring`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        testcase: {
          parameters: [10, 20],
          answer: 200,
        },
      }),
    });

    return response.json();
  }
}
