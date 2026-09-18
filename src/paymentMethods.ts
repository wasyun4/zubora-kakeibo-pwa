export type PaymentMethod = {
  id: string;
  name: string;
  isActive: boolean;
};

export const initialPaymentMethods: PaymentMethod[] = [
  {
    id: "cash",
    name: "現金",
    isActive: true,
  },
  {
    id: "creditCard",
    name: "クレジットカード",
    isActive: true,
  },
  {
    id: "digitalPayment",
    name: "QR・電子マネー",
    isActive: true,
  },
  {
    id: "bankAccount",
    name: "福銀",
    isActive: true,
  },
  {
    id: "bankAccountRisona",
    name: "りそな",
    isActive: true,
  },
  {
    id: "paymentOther",
    name: "その他",
    isActive: true,
  },
];
