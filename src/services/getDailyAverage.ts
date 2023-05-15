///// this makes sure i only have one value for each day so i have connected lines

const getDailyAverage = (data: any) => {
  const groupedData: any = {};

  data.forEach(({ x, y }: any) => {
    if (groupedData[x]) {
      groupedData[x].push(y);
    } else {
      groupedData[x] = [y];
    }
  });

  // Calculate average for each date
  const averagedData = Object.keys(groupedData).map((x) => {
    const yValues = groupedData[x];
    const averageY =
      yValues.reduce((sum: number, y: number) => sum + y, 0) / yValues.length;
    return { x, y: averageY };
  });

  return averagedData;
};

export { getDailyAverage };
