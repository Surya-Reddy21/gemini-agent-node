import { Tool, SchemaType } from "@google/generative-ai";

// Define types for our database and tool arguments
interface InventoryDB {
  [key: string]: number;
}

const inventoryDB: InventoryDB = {
  "organic soap": 12,
  "bamboo toothbrush": 50,
  "recycled notebook": 5,
};

// Interface for arguments coming from AI
interface CheckInventoryArgs {
  item: string;
}

interface PlaceOrderArgs {
  item: string;
  quantity: number;
}

// Tool Implementation Map
export const toolsImplementation: Record<string, (args: any) => any> = {
  check_inventory: ({ item }: CheckInventoryArgs) => {
    console.log(`🔎 [TOOL] Checking stock for: ${item}`);
    const qty = inventoryDB[item.toLowerCase()] || 0;
    return { item, quantity: qty };
  },

  // ✅ ADDED PRICE TOOL
  get_price: ({ item }: CheckInventoryArgs) => {
    console.log(`💰 [TOOL] Getting price for: ${item}`);
    const prices: Record<string, string> = {
      "organic soap": "$5.99",
      "bamboo toothbrush": "$2.49", 
      "recycled notebook": "$8.99"
    };
    const price = prices[item.toLowerCase()] || "Price not available";
    return { item, price };
  },

  place_order: ({ item, quantity }: PlaceOrderArgs) => {
    console.log(`🚚 [TOOL] Ordering ${quantity} x ${item}`);
    return {
      status: "success",
      orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
      message: `Successfully ordered ${quantity} units of ${item}`,
    };
  },
};
