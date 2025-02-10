export interface PostSettings {
  tone: number; // 0-1: casual to formal
  personality: {
    charm: number;   // 0-100
    wit: number;     // 0-100
    humor: number;   // 0-100
    sarcasm: number; // 0-100
  };
  length: 'brief' | 'standard' | 'detailed';
}
