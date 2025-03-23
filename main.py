from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from SipSyncer import sipsyncer

load_dotenv()

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/recipe_gen", methods=["POST"])
def recipe_gen():
    data = request.json
    mood = data.get("mood_val")
    feel = data.get("feel_val")
    taste = data.get("taste_val")
    result = sipsyncer(taste, mood, feel)
    return jsonify({"Recipe": result})

if __name__ == "__main__":
    app.run(debug=True)
