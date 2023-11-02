export type FormData = {
  sampleMean: number;
  sampleSize: number;
  sampleDeviation: number;
  hypothesizedMean?: number;
};

export type InitialValues = Omit<FormData, 'hypothesizedMean'>;