// Static mock data for apps/buyer-portal — plan.md §9's RFQ/procurement flow
// has no real data yet (Fase 4+). Do not wire this to the database; it exists
// only so the buyer-portal placeholder renders something concrete.

export interface MockRfq {
  id: string;
  commodity: string;
  quantity: number;
  unit: string;
  moq: number;
  targetPrice: number;
  status: string;
  region: string;
}

export const MOCK_RFQS: MockRfq[] = [
  {
    id: "RFQ-DEMO-0001",
    commodity: "Kopi Robusta",
    quantity: 5000,
    unit: "kg",
    moq: 500,
    targetPrice: 31500,
    status: "PUBLISHED",
    region: "Kabupaten Bandung",
  },
  {
    id: "RFQ-DEMO-0002",
    commodity: "Gabah Kering",
    quantity: 20000,
    unit: "kg",
    moq: 2000,
    targetPrice: 6200,
    status: "MATCHING",
    region: "Kabupaten Sragen",
  },
  {
    id: "RFQ-DEMO-0003",
    commodity: "Telur Ayam",
    quantity: 1000,
    unit: "kg",
    moq: 100,
    targetPrice: 28000,
    status: "QUOTED",
    region: "Kabupaten Blitar",
  },
];
