"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ExternalLink } from "lucide-react";

type OrderItem = {
  name: string;
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
};

type Order = {
  id: string;
  restaurant: string;
  items: OrderItem[];
  date: string;
  totalCalories: number;
};

type Alternative = {
  original: string;
  alternative: string;
  caloriesDifference: number;
  reason: string;
};

type UberEatsData = {
  orderHistory: Order[];
  frequentRestaurants: { name: string; visits: number }[];
  nutritionAnalysis: {
    averageCaloriesPerMeal: number;
    highCalorieMeals: number;
    lowProteinMeals: number;
    highSodiumMeals: number;
    highSugarMeals: number;
  };
  healthierAlternatives: Record<string, Alternative[]>;
};

export default function UberEatsIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<UberEatsData | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  const connectUberEats = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would involve OAuth authentication
      // For this demo, we'll simulate the connection and fetch mock data
      const mockAccessToken = "mock-access-token";
      
      const response = await fetch("/api/ubereats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: mockAccessToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to UberEats");
      }

      const uberEatsData = await response.json();
      setData(uberEatsData);
      setIsConnected(true);
      
      // Select the first restaurant by default
      if (uberEatsData.frequentRestaurants.length > 0) {
        setSelectedRestaurant(uberEatsData.frequentRestaurants[0].name);
      }
    } catch (error) {
      console.error("Error connecting to UberEats:", error);
      alert("Failed to connect to UberEats. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border">
      <div className="p-4 bg-primary text-white font-medium">
        <h2>UberEats Integration</h2>
      </div>

      <div className="p-6">
        {!isConnected ? (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-4">Connect Your UberEats Account</h3>
            <p className="text-gray-600 mb-6">
              Link your UberEats account to get personalized recommendations based on your order history.
            </p>
            <Button onClick={connectUberEats} disabled={isLoading}>
              {isLoading ? "Connecting..." : "Connect UberEats"}
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Your Nutrition Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Avg. Calories/Meal</p>
                  <p className="text-2xl font-bold text-primary">
                    {data?.nutritionAnalysis.averageCaloriesPerMeal}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">High Calorie Meals</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {data?.nutritionAnalysis.highCalorieMeals}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Low Protein Meals</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {data?.nutritionAnalysis.lowProteinMeals}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Your Frequent Restaurants</h3>
              <div className="flex flex-wrap gap-2">
                {data?.frequentRestaurants.map((restaurant) => (
                  <Button
                    key={restaurant.name}
                    variant={selectedRestaurant === restaurant.name ? "default" : "outline"}
                    onClick={() => setSelectedRestaurant(restaurant.name)}
                    className="mb-2"
                  >
                    {restaurant.name} ({restaurant.visits} visits)
                  </Button>
                ))}
              </div>
            </div>

            {selectedRestaurant && data?.healthierAlternatives[selectedRestaurant] && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Healthier Alternatives for {selectedRestaurant}
                </h3>
                <div className="space-y-4">
                  {data.healthierAlternatives[selectedRestaurant].map((alt, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium">{alt.original}</p>
                          <p className="text-sm text-gray-600">Original Order</p>
                        </div>
                        <ArrowRight className="mx-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="font-medium text-green-600">{alt.alternative}</p>
                          <p className="text-sm text-gray-600">
                            Saves {Math.abs(alt.caloriesDifference)} calories
                          </p>
                        </div>
                      </div>
                      <p className="text-sm bg-gray-50 p-2 rounded">{alt.reason}</p>
                      <div className="mt-3 flex justify-end">
                        <Button size="sm" className="flex items-center gap-1">
                          <ExternalLink size={14} />
                          Order Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Orders</h3>
              <div className="space-y-3">
                {data?.orderHistory.map((order) => (
                  <div key={order.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{order.restaurant}</h4>
                      <span className="text-sm text-gray-600">
                        {formatDate(order.date)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-1 border-b last:border-0">
                          <span>{item.name}</span>
                          <span>{item.calories} cal</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t flex justify-between">
                      <span className="font-medium">Total Calories:</span>
                      <span className="font-bold">{order.totalCalories}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
