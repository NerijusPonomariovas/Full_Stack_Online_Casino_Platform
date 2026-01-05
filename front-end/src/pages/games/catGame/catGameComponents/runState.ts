export const runState = {
  bet: 0,
  settled: false,
};

export function startRun(bet: number) {
  runState.bet = bet;
  runState.settled = false;
}

export function settleRun() {
  runState.settled = true;
}

export const multipliers: number[] = [
    -2, -1.75, -1.5, -1, -0.5, 0, 1, 2, 8, 32,
];
