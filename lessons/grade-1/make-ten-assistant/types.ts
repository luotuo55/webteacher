
export type Language = 'zh' | 'en';

export interface MathState {
  num1: number;
  num2: number;
  borrowed: number; // How many circles moved from num2 to num1
}

export interface ExplanationResponse {
  steps: string[];
  tips: string;
}
