
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, magicLevel = 50, negativePrompt = "", type = "text" } = await req.json()
    
    console.log(`Generating image with prompt: "${prompt}", magicLevel: ${magicLevel}`)
    
    // Get API key from environment
    const apiKey = Deno.env.get("OPENAI_API_KEY")
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured")
    }
    
    let requestBody: any = {}
    
    if (type === "text") {
      // Text to image generation
      let enhancedPrompt = prompt
      
      // Add Ghibli styling based on magic level
      if (magicLevel > 70) {
        enhancedPrompt += ". High-quality, detailed Studio Ghibli art style with magical elements, vibrant colors, and dreamlike atmosphere."
      } else if (magicLevel > 40) {
        enhancedPrompt += ". Studio Ghibli art style with soft colors and whimsical elements."
      } else {
        enhancedPrompt += ". Light Studio Ghibli inspired aesthetic."
      }
      
      requestBody = {
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: magicLevel > 60 ? "hd" : "standard"
      }
      
      if (negativePrompt) {
        requestBody.prompt += ` Avoid: ${negativePrompt}`
      }
    } else if (type === "image") {
      // Image transformation not supported by DALL-E 3
      // For now we'll just use text prompt
      let enhancedPrompt = prompt || "Transform this image in Studio Ghibli style"
      
      requestBody = {
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: magicLevel > 60 ? "hd" : "standard"
      }
    }
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      console.error("OpenAI API error:", data)
      throw new Error(data.error?.message || "Error generating image")
    }
    
    console.log("Image generated successfully")
    
    return new Response(JSON.stringify({
      imageUrl: data.data[0].url,
      prompt: prompt,
      createdAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    })
    
  } catch (error) {
    console.error("Error:", error.message)
    return new Response(JSON.stringify({
      error: error.message || "An error occurred during image generation"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    })
  }
})
