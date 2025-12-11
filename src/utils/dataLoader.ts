import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface OrderScenario {
  id: string;
  description: string;
  instrument: string;
  side: string;
  quantity: string;
  price: string;
  expectedStatus?: string;
  expectedError?: boolean;
}

interface OrdersYaml {
  orders?: OrderScenario[];
  negativeOrders?: OrderScenario[];
}

export class DataLoader {
  static loadOrderScenarios(): OrderScenario[] {
    const filePath = path.resolve(__dirname, '../data/orders.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents) as OrdersYaml;

    if (!data.orders) return [];
    return data.orders;
  }

  static loadNegativeOrderScenarios(): OrderScenario[] {
    const filePath = path.resolve(__dirname, '../data/orders.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents) as OrdersYaml;

    if (!data.negativeOrders) return [];
    return data.negativeOrders;
  }
}