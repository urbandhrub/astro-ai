import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message, birthDetails } = await req.json();

  const systemPrompt = "You are PanjikaAI, a wise Bengali Vedic astrologer from Kolkata. Speak respectfully and give practical answers.";

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: birthDetails ? `${birthDetails}\n\n${message}` : message }
        ],
        temperature: 0.75,
        max_tokens: 700,
      }),
    });

    const data = await res.json();
    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (e) {
    return NextResponse.json({ reply: "কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।" });
  }
}
