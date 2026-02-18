from flask import Flask, render_template

app = Flask(__name__)
app.config['SECRET_KEY'] = 'binary-baniyas-secret-key'

# Routes
@app.route('/')
def home():
    return "<h1>DeceptiScan is Running! 🚀</h1><p>Pranav, replace this with index.html</p>"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')