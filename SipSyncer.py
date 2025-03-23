import random
from langchain_huggingface import HuggingFaceEndpoint
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import re

def sipsyncer(taste, mood, feel):
    prompt_template = ChatPromptTemplate.from_messages(
        [
            ("ai", """
                    You are SipSync, an AI herbal tea expert and matchmaker. Your job is to recommend the perfect herbal tea based on the user's input.
                    Based on the provided ailment, mood, and taste preference, generate a detailed response including:

                    Tea Name:
                    - Display the recommended herbal tea name.

                    Ingredients:
                    - List the required ingredients with precise measurements.  
                    - Mention optional add-ons for enhanced benefits or flavor.

                    Preparation Method: 
                    - Provide step-by-step instructions on how to brew the tea for maximum effectiveness.

                    Health Benefits:
                    - Clearly explain how the tea helps relieve the given ailment.  
                    - Mention any additional wellness benefits.

                    Flavor Profile & Mood Pairing:
                    - Describe the taste experience (e.g., soothing, spicy, floral).  
                    - Suggest the ideal mood or setting for drinking the tea.

                    Pro Tip:
                    - Offer an extra brewing or serving tip for enhanced benefits.

                    Ensure the response is well-structured, engaging, and easy to follow.
                    """),
            ("user", "{question}"),
        ]
    )

    model_id = [
        "mistralai/Mistral-7B-Instruct-v0.2",
        "mistralai/Mistral-7B-Instruct-v0.3",
        "mistralai/Mixtral-8x7B-Instruct-v0.1"
    ]
    selected_model = random.choice(model_id)
    print(f"Using model: {selected_model}")

    llm = HuggingFaceEndpoint(
        repo_id=selected_model,
        task="text-generation",
        max_new_tokens=5000,
    )
    print()
    prompt = f'''Generate a healthy drink recipe based on the user's {feel}, which needs to be alleviated. The drink 
    should align with the user's preferred {taste} and complement their {mood}. Provide the drink name, ingredients, 
    preparation steps, and health benefits.'''

    # Combine the prompt and model into a chain using the 'Runnable' pattern
    chain = prompt_template | llm | StrOutputParser()

    full_bio_data = chain.invoke({"question": prompt}).strip()
    start_index = full_bio_data.find("Tea Name")
    text = full_bio_data[start_index:] if start_index != -1 else full_bio_data

    # Define categories to structure the text
    categories = {
    }

    # Clean up excess spaces
    text = re.sub(r'[ ]{2,}', ' ', text)

    # Format text with structured headers
    for key, value in categories.items():
        text = re.sub(fr"{key}:", f"\n{value}", text)

    return {
        "Recipe": text,
    }
