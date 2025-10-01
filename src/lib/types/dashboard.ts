// types/dashboard.ts
export interface MenuItem {
  name: string;
  href: string;
  icon: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: 'indigo' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export interface TableHeader {
  key: string;
  label: string;
}

export interface TableData {
  [key: string]: string | number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
    tension?: number;
  }[];
}