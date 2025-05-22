const calculateFine = (duedate) => {
  const finePerHour = 0.5;
  const now = new Date();

  if (now > duedate) {
    const lateHours = Math.ceil((now - duedate) / (1000 * 60 * 60));
    return lateHours * finePerHour;
  }

  return 0;
};

export default calculateFine;