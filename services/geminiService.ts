
import { GoogleGenAI } from "@google/genai";

// IMPORTANT: API_KEY must be set in the environment variables.
// For local development, you might use a .env file and a tool like dotenv.
// In a production environment, this should be configured securely.
// DO NOT prompt the user for the API key or manage it in the UI.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn(
    "API_KEY for Gemini is not set in process.env.API_KEY. " +
    "Boilerplate code generation will use fallback responses. " +
    "Ensure the API_KEY is configured in your environment."
  );
}

export async function generateBoilerplateCode(
  modelName: string,
  taskDescription: string,
  language: 'javascript' | 'python' | 'curl'
): Promise<string> {
  if (!ai) {
    return Promise.resolve(`// Gemini API Key not configured or invalid. Cannot generate live code.
// Please ensure process.env.API_KEY is set correctly.
//
// Fallback example for ${language} to use model '${modelName}' for task '${taskDescription}':
${getFallbackCode(language, modelName, taskDescription)}`);
  }

  const prompt = `Generate ${language} boilerplate code to integrate with an AI model named '${modelName}' for the task: '${taskDescription}'.
The model is accessible via a hypothetical REST API endpoint like '/api/v1/models/${modelName}/predict'.
Assume the API requires a Bearer token for authentication, passed in an 'Authorization' header. The API key is "YOUR_API_KEY_HERE".
The request body should be JSON, typically with a key like "input_text", "image_url", or "audio_data" depending on the task. For '${taskDescription}', assume the main input key is "prompt".
The response is expected to be JSON, with the primary result under a key like "output", "prediction", or "result". For '${taskDescription}', assume the key is "generated_text".

Include:
1. How to define the API endpoint URL and API key.
2. How to construct the request headers and body.
3. How to make the API request (e.g., using fetch in JavaScript, requests library in Python, or a full cURL command).
4. How to parse the JSON response and access the primary result.
5. Basic error handling for network issues or bad HTTP status codes.

Provide only the raw code block for the specified language, without any introductory or concluding sentences, or markdown code fences.
The code should be as complete and runnable as possible, with clear placeholders for user-specific parts like "YOUR_API_KEY_HERE" or example input.
For Python, use the 'requests' library. For JavaScript, use 'fetch' and modern async/await syntax. For cURL, provide a complete, executable command.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17", // Use the specified model
      contents: prompt,
      // config: { thinkingConfig: { thinkingBudget: 0 } } // Low latency if needed. Default (thinking enabled) is better for code quality.
    });
    return response.text;
  } catch (error) {
    console.error("Error generating boilerplate code with Gemini:", error);
    return `// Error generating code via Gemini: ${error instanceof Error ? error.message : String(error)}
//
// Fallback example for ${language} to use model '${modelName}' for task '${taskDescription}':
${getFallbackCode(language, modelName, taskDescription)}`;
  }
}

function getFallbackCode(language: string, modelName: string, taskDescription: string): string {
  const exampleInput = taskDescription.toLowerCase().includes('image') ? '"https://example.com/image.jpg"' : taskDescription.toLowerCase().includes('audio') ? '"path/to/audio.wav"' : '"Your example prompt here"';
  const inputKey = taskDescription.toLowerCase().includes('image') ? 'image_url' : taskDescription.toLowerCase().includes('audio') ? 'audio_file_path' : 'prompt';


  if (language === 'python') {
    return `import requests
import json

API_URL = "https://your-api-base.com/api/v1/models/${modelName}/predict"
API_KEY = "YOUR_API_KEY_HERE" # Replace with your actual API key

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "${inputKey}": ${exampleInput} 
    # Add other parameters if needed, e.g., "max_tokens": 100
}

def call_model():
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()  # Raises an HTTPError for bad responses (4XX or 5XX)
        
        result = response.json()
        generated_text = result.get("generated_text") # Or "prediction", "output", etc.
        
        print(f"Model Name: ${modelName}")
        print(f"Task: ${taskDescription}")
        print(f"Input: {payload}")
        print(f"Generated Text: {generated_text}")
        return generated_text
        
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        print(f"Response content: {response.content}")
    except requests.exceptions.RequestException as req_err:
        print(f"Request error occurred: {req_err}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    call_model()`;
  }
  if (language === 'javascript') {
    return `const API_URL = "https://your-api-base.com/api/v1/models/${modelName}/predict";
const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key

async function callModel() {
  const payload = {
    "${inputKey}": ${exampleInput},
    // Add other parameters if needed, e.g., max_tokens: 100
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(\`HTTP error! Status: \${response.status}, Body: \${errorBody}\`);
    }

    const result = await response.json();
    const generatedText = result.generated_text; // Or "prediction", "output", etc.

    console.log("Model Name:", "${modelName}");
    console.log("Task:", "${taskDescription}");
    console.log("Input:", payload);
    console.log("Generated Text:", generatedText);
    return generatedText;

  } catch (error) {
    console.error("Error calling model:", error.message);
  }
}

callModel();`;
  }
  if (language === 'curl') {
    return `curl -X POST \\
  "https://your-api-base.com/api/v1/models/${modelName}/predict" \\
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "${inputKey}": ${exampleInput}
    # Add other parameters if needed, e.g., "max_tokens": 100
  }'

# This command sends a request to the ${modelName} model.
# Replace YOUR_API_KEY_HERE with your actual API key.
# The input is '${taskDescription}'.
# The response will be JSON containing the 'generated_text' (or similar key).`;
  }
  return `// Fallback code for ${language} not implemented.`;
}
