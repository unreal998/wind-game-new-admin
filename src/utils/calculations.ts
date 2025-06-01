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

  // Розрахунок суми, яка має бути нарахована за день
  console.log("🟪 Щоденна винагорода:", dailyReward);

  // Вираховуємо суму, яка залишається для нарахування після врахування вже зароблених коштів
  let remainingDailyReward = dailyReward - earnedSoFar;
  console.log(
    "🟪 Залишок щоденної винагороди:",
    dailyReward,
    " - ",
    earnedSoFar,
    " = ",
    remainingDailyReward,
  );

  // Перевірка, щоб уникнути негативного розподілу
  if (remainingDailyReward < 0) {
    remainingDailyReward = 0;
  }

  const remainingTasks = tasksNeeded - tasksCompleted;
  const remainingPrices = productPrices.slice(tasksCompleted);
  const totalRemainingPrice = remainingPrices.reduce(
    (sum, price) => sum + price,
    0,
  );

  // Базова ставка за завдання (50% від загальної винагороди)
  const baseRewardPerTask = (remainingDailyReward * 0.5) / remainingTasks;

  // Відсоток від вартості товару (50% від загальної винагороди)
  const priceBasedRewardTotal = remainingDailyReward * 0.5;

  remainingPrices.forEach((price) => {
    const priceBasedReward = (price / totalRemainingPrice) *
      priceBasedRewardTotal;
    const totalRewardForTask = baseRewardPerTask + priceBasedReward;
    payments.push(totalRewardForTask);
  });

  console.log("🟪 Вивід за завдання:", payments);

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

  console.log("📊 Розрахунок щоденної винагороди:");
  console.log(`Баланс: ${balance.toFixed(2)} TON`);
  console.log(`Місячний відсоток: ${(monthlyPercent * 100).toFixed(2)}%`);
  console.log(`Днів у місяці: ${daysInMonth}`);
  console.log(`Щоденний відсоток: ${(dailyPercent * 100).toFixed(6)}%`);
  console.log(`Щоденна винагорода: ${dailyReward.toFixed(6)} TON`);

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

  console.log("📊 Розрахунок місячного прибутку зі складним відсотком:");
  console.log(`Початковий баланс: ${initialBalance.toFixed(2)} TON`);
  console.log(`Місячний відсоток: ${(monthlyPercent * 100).toFixed(2)}%`);
  console.log(`Кількість днів у місяці: ${daysInMonth}`);
  console.log(`Щоденна ставка: ${(dailyRate * 100).toFixed(6)}%`);

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
  const effectiveMonthlyRate = (currentBalance / initialBalance - 1) * 100;

  console.log(`Кінцевий баланс: ${currentBalance.toFixed(2)} TON`);
  console.log(`Загальний дохід: ${totalProfit.toFixed(2)} TON`);
  console.log(`Ефективна місячна ставка: ${effectiveMonthlyRate.toFixed(2)}%`);

  return totalProfit;
}
