import type { InitialValues, FormData } from "../types/FormData";

const initialValues: InitialValues = {
  sampleSize: 10,
  sampleMean: 2.5,
  sampleDeviation: 0.1,
};
const mockData: FormData[] = [initialValues];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getInitialValues(): Promise<InitialValues> {
  await delay(500);
  return initialValues;
}

export async function addData(data: FormData) {
  await delay(500);
  mockData.push(data);
}

export async function getDataList(): Promise<FormData[]> {
  await delay(500);
  return mockData;
}
