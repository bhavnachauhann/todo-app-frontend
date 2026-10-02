// Week starts on Monday and ends on Sunday
export function getWeekStart(date) {
  const start = new Date(date);
  const day = start.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function formatDay(date) {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function groupTasksByWeek(tasks) {
  const weeks = {};

  tasks.forEach((task) => {
    const start = getWeekStart(task.dateTime);
    const key = start.getTime();

    if (!weeks[key]) {
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      weeks[key] = {
        key,
        label: `${formatDay(start)} - ${formatDay(end)}`,
        tasks: [],
        openCount: 0,
        completedCount: 0,
      };
    }

    weeks[key].tasks.push(task);
    if (task.status === "Completed") {
      weeks[key].completedCount++;
    } else {
      weeks[key].openCount++;
    }
  });

  return Object.values(weeks).sort((a, b) => a.key - b.key);
}
