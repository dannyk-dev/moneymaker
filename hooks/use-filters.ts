import { upperFirst } from "scule";

type TFilterMap<T extends string> = Record<T, number>;
export type TFilterMapReturn = {
  label: string;
  value: number;
};

export function useFilters<T extends string>(
  mapper: TFilterMap<T>
): TFilterMapReturn[] {
  const fields = Object.entries(mapper);

  return fields.map(([label, value]) => ({
    label: upperFirst(label.toLowerCase()),
    value: value as number,
  }));
}
