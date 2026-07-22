export type Category = {
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
};

export type PriceConfiguration = {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: string[];
  };
};
export type Attribute = {
  name: string;
  widgetType: "radio" | "switch";
  defaultValue: string;
  availableOptions: string[];
};
