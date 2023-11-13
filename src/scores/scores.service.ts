import { Injectable } from '@nestjs/common';

const SCORING_SERVER = 'http://10.41.177.25:3000';
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
