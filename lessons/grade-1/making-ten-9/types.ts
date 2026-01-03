
export enum Stage {
  WELCOME = 'WELCOME',
  WARMUP = 'WARMUP',
  SCENARIO = 'SCENARIO', // Milk boxes
  METHOD = 'METHOD',     // Branch diagram / Sticks
  TRY = 'TRY',           // Self-try adjustable branch diagram
  PATTERN = 'PATTERN',   // Table finding rules
  PRACTICE = 'PRACTICE',
  SUMMARY = 'SUMMARY'
}

export interface InteractiveElementProps {
  onComplete: () => void;
  isActive: boolean;
}
