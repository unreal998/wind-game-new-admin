export interface DistributeRewardsParams {
  dailyReward: number;
  tasksNeeded: number;
  tasksCompleted: number;
  earnedSoFar: number;
  productPrices: number[];
}

export function distributeRewards({
  dailyReward,
  tasksNeeded,
  tasksCompleted,
  earnedSoFar,
  productPrices,
}: DistributeRewardsParams): number[] {
  const payments: number[] = [];

  let remainingDailyReward = dailyReward - earnedSoFar;

  if (remainingDailyReward < 0) {
    remainingDailyReward = 0;
  }

  const remainingTasks = tasksNeeded - tasksCompleted;
  const remainingPrices = productPrices.slice(tasksCompleted);
  const totalRemainingPrice = remainingPrices.reduce(
    (sum, price) => sum + price,
    0,
  );

  const baseRewardPerTask = (remainingDailyReward * 0.5) / remainingTasks;

  const priceBasedRewardTotal = remainingDailyReward * 0.5;

  remainingPrices.forEach((price) => {
    const priceBasedReward = (price / totalRemainingPrice) *
      priceBasedRewardTotal;
    const totalRewardForTask = baseRewardPerTask + priceBasedReward;
    payments.push(totalRewardForTask);
  });

  return payments;
}

export function calculateDailyReward(
  balance: number,
  monthlyPercent: number,
): number {
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).getDate();
  const dailyPercent = Math.pow(1 + monthlyPercent, 1 / daysInMonth) - 1;
  const dailyReward = balance * dailyPercent;

  return dailyReward;
}

export function calculateMonthlyProfit(
  initialBalance: number,
  monthlyPercent: number,
): number {
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).getDate();
  const dailyRate = Math.pow(1 + monthlyPercent, 1 / daysInMonth) - 1;

  let currentBalance = initialBalance;

  for (let day = 1; day <= daysInMonth; day++) {
    const dailyProfit = currentBalance * dailyRate;
    currentBalance += dailyProfit;
    console.log(
      `День ${day}: ${currentBalance.toFixed(2)} TON (+${
        dailyProfit.toFixed(6)
      } TON)`,
    );
  }

  const totalProfit = currentBalance - initialBalance;
  // const effectiveMonthlyRate = (currentBalance / initialBalance - 1) * 100;

  return totalProfit;
}
