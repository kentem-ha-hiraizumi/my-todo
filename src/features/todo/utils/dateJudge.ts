/** 期限超過しているかどうかの判定 */
export const isOverdue = (endAt?: number, completed?: boolean) => {
  if (!endAt || completed) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return endAt < today.getTime();
};

/** 本日期限かどうかの判定 */
export const isDueToday = (endAt?: number, completed?: boolean) => {
  if (!endAt || completed) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return endAt >= today.getTime() && endAt < tomorrow.getTime();
};
