// Fictional paired jump measurements for the landing-page demo only.
export type JumpResult = { sj: number; dj: number };
export const team = [
    { name: 'Noah Berger', sj: 36, dj: 32 },
    { name: 'Luca Stein', sj: 28, dj: 29 },
    { name: 'Elias Winter', sj: 31, dj: 24 },
    { name: 'Finn Adler', sj: 26, dj: 26 },
    { name: 'Leon Hartmann', sj: 33, dj: 30 },
    { name: 'Milan Weiss', sj: 29, dj: 20 },
    { name: 'Jonas Falk', sj: 24, dj: 25 },
    { name: 'Ben Novak', sj: 39, dj: 37 },
    { name: 'Theo Brandt', sj: 32, dj: 34 },
    { name: 'Luis Kern', sj: 27, dj: 32 },
    { name: 'Emil Lorenz', sj: 34, dj: 27 },
    { name: 'Anton Wolf', sj: 22, dj: 22 },
    { name: 'Oscar Lind', sj: 30, dj: 28 },
    { name: 'Felix Sommer', sj: 35, dj: 35 },
    { name: 'David Reiter', sj: 25, dj: 18 },
    { name: 'Niko Weber', sj: 37, dj: 29 },
  ];
  // Seeded approximately normal, positively associated synthetic population.
  let seed = 1041426;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) + .5) / 4294967296;
  const normal = () => Math.sqrt(-2 * Math.log(random())) * Math.cos(2 * Math.PI * random());
  const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
  const round = (n: number) => Math.round(n * 10) / 10;
  export const peers = Array.from({ length: 240 }, () => {
    const common = normal();
    return { sj: round(clamp(40.8 + common * 5.9 + normal() * 3.7, 16, 62)), dj: round(clamp(39.1 + common * 5.5 + normal() * 5.2, 14, 62)) };
  });
  export const median = (data: readonly JumpResult[], key: keyof JumpResult) => {
    const values = data.map(a => a[key]).sort((a,b) => a-b), middle = Math.floor(values.length / 2);
    return values.length % 2 ? values[middle] : (values[middle-1] + values[middle]) / 2;
  };
  // Midrank percentile, independently for each metric. Never an invented
  // composite performance score or a claim about overall athletic ability.
  export const percentile = (data: readonly JumpResult[], key: keyof JumpResult, value: number) => Math.round(100 * (data.filter(a => a[key] < value).length + .5 * data.filter(a => a[key] === value).length) / data.length);

export const position = (value: number, maximum: number) => (value - 10) / (maximum - 10) * 100
