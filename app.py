from flask import Flask, request, jsonify
from flask_cors import CORS
from responder import giveEvent
from bedrock import bedrock_handler
from compMed import lambda_handler


app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests from your React frontend


@app.route('/analyze', methods=['POST'])
def analyze_symptoms():
    try:
        # Get the JSON data sent from the frontend
        data = request.get_json()

        # Extract the fields from the JSON data
        symptoms = data.get('symptoms')
        medications = data.get('medications')
        age = data.get('age')
        event = {"text": f"{symptoms} {medications} {age}"}

        # Perform the processing (this is where you'd add your logic)
        # Example: Let's pretend we're simply returning a mock result
        print(f"Event object: {event}")

        response = lambda_handler(event, None)
        print("response  ")
        response2 = bedrock_handler({'text' : 'Turn the following information extracted into a JSON into a summary with specific possible diagnoses and convey it in some actionable form to the patient without using overly technical jargon. Make sure it is informal, has only complete sentences without any bulleted lists, does not exceed 200 words (this is a hard limit). If diagnoses are low probability, say so. Do not explicitly say anything like "Here is a concise summary of your symptoms and diagnoses," just tell them. Take your time, take a deep breath. ' + str(response)}, None)
        # Assuming response2 contains the JSON data
        print("response 2   ")

        text = response2['output']['message']['content'][0]['text']
        print("response done")
        result = {
            'text' : text
        }
        print(result)
        #return json response
        return result  # This is correct for sending a JSON response

        

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
