import { Tool, SchemaType } from "@google/generative-ai";

export const toolsDeclaration: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "check_inventory",
        description: "Check the current stock quantity of a specific product.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            item: {
              type: SchemaType.STRING,
              description: "The name of the product (e.g., 'organic soap')",
            },
          },
          required: ["item"],
        },
      },
      
      // ✅ ADDED PRICE TOOL
      {
        name: "get_price",
        description: "Get the current price of a specific product.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            item: {
              type: SchemaType.STRING,
              description: "The name of the product (e.g., 'organic soap')",
            },
          },
          required: ["item"],
        },
      },
      
      {
        name: "place_order",
        description: "Place a new order for a product with the supplier.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            item: { 
              type: SchemaType.STRING, 
              description: "Product name" 
            },
            quantity: { 
              type: SchemaType.NUMBER, 
              description: "Quantity to order" 
            },
          },
          required: ["item", "quantity"],
        },
      },
    ],
  },
];
