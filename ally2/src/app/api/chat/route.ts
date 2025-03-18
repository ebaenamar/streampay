import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
// In production, use environment variables for the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // Add your API key in .env.local for development
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // You can use a different model based on your needs
      messages: [
        {
          role: "system",
          content: `You are a dietary recommendation assistant called NutriChat. 
          You help users with personalized dietary advice, suggest healthier alternatives to their food choices, 
          and provide guidance on nutrition. You have knowledge about various diets, nutritional information of foods, 
          and can suggest meals based on dietary restrictions and preferences. 
          When users mention food delivery services like UberEats, suggest healthier alternatives to common orders. 
          Be friendly, supportive, and encouraging.`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseMessage = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ message: responseMessage });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}
