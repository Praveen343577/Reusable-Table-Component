export const getDelta = (currentStr, prevStr) => {
  if (prevStr === undefined || prevStr === null) return null;
  if (currentStr === prevStr) return null;

  const extractNumber = (str) => {
    const match = str.match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : null;
  };

  const curr = extractNumber(currentStr);
  const prev = extractNumber(prevStr);

  if (curr === null || prev === null) return null;
  
  const diff = curr - prev;
  if (diff === 0) return null;

  return {
    value: Math.abs(diff),
    direction: diff > 0 ? 'up' : 'down',
  };
};
