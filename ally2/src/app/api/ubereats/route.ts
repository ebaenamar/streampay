import { NextRequest, NextResponse } from "next/server";

// This is a mock implementation of the UberEats API integration
// In a real application, you would use the actual UberEats API
export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    // Mock data for demonstration purposes
    const mockOrderHistory = [
      {
        id: "order1",
        restaurant: "Burger King",
        items: [
          { name: "Whopper", calories: 660, fat: 40, protein: 28, carbs: 49 },
          { name: "Medium Fries", calories: 380, fat: 17, protein: 4, carbs: 53 },
          { name: "Soda", calories: 210, fat: 0, protein: 0, carbs: 58 },
        ],
        date: "2025-03-15T18:30:00Z",
        totalCalories: 1250,
      },
      {
        id: "order2",
        restaurant: "Pizza Hut",
        items: [
          { name: "Pepperoni Pizza (3 slices)", calories: 720, fat: 30, protein: 36, carbs: 84 },
          { name: "Breadsticks", calories: 340, fat: 12, protein: 10, carbs: 50 },
          { name: "Soda", calories: 210, fat: 0, protein: 0, carbs: 58 },
        ],
        date: "2025-03-10T19:45:00Z",
        totalCalories: 1270,
      },
      {
        id: "order3",
        restaurant: "Taco Bell",
        items: [
          { name: "Crunchy Taco Supreme (2)", calories: 360, fat: 22, protein: 14, carbs: 28 },
          { name: "Burrito Supreme", calories: 390, fat: 14, protein: 16, carbs: 51 },
          { name: "Nachos", calories: 320, fat: 18, protein: 8, carbs: 35 },
        ],
        date: "2025-03-05T20:15:00Z",
        totalCalories: 1070,
      },
    ];

    // Mock healthier alternatives
    const healthierAlternatives = {
      "Burger King": [
        {
          original: "Whopper",
          alternative: "Grilled Chicken Sandwich",
          caloriesDifference: -240,
          reason: "Lower in calories and fat, higher in protein",
        },
        {
          original: "Medium Fries",
          alternative: "Side Salad",
          caloriesDifference: -330,
          reason: "Much lower in calories and carbs, adds vegetables to your meal",
        },
        {
          original: "Soda",
          alternative: "Unsweetened Iced Tea",
          caloriesDifference: -200,
          reason: "Eliminates added sugars and empty calories",
        },
      ],
      "Pizza Hut": [
        {
          original: "Pepperoni Pizza (3 slices)",
          alternative: "Thin 'N Crispy Veggie Lover's Pizza (2 slices)",
          caloriesDifference: -320,
          reason: "Thinner crust and vegetable toppings reduce calories while adding nutrients",
        },
        {
          original: "Breadsticks",
          alternative: "Garden Salad with Light Dressing",
          caloriesDifference: -240,
          reason: "Adds vegetables and fiber while reducing carbs and calories",
        },
      ],
      "Taco Bell": [
        {
          original: "Crunchy Taco Supreme (2)",
          alternative: "Fresco Style Soft Tacos (2)",
          caloriesDifference: -120,
          reason: "Removes cheese and sour cream, lower in fat while maintaining protein",
        },
        {
          original: "Burrito Supreme",
          alternative: "Power Menu Bowl - Veggie",
          caloriesDifference: -40,
          reason: "Higher in fiber and nutrients, better macronutrient balance",
        },
        {
          original: "Nachos",
          alternative: "Black Beans and Rice",
          caloriesDifference: -170,
          reason: "Higher in fiber and protein, lower in fat and calories",
        },
      ],
    };

    // Analyze order patterns
    const frequentRestaurants = [
      { name: "Burger King", visits: 8 },
      { name: "Pizza Hut", visits: 5 },
      { name: "Taco Bell", visits: 4 },
    ];

    const nutritionAnalysis = {
      averageCaloriesPerMeal: 1197,
      highCalorieMeals: 15,
      lowProteinMeals: 8,
      highSodiumMeals: 12,
      highSugarMeals: 10,
    };

    return NextResponse.json({
      orderHistory: mockOrderHistory,
      frequentRestaurants,
      nutritionAnalysis,
      healthierAlternatives,
    });
  } catch (error) {
    console.error("Error in UberEats API:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}
