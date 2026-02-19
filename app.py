from flask import Flask, render_template
from models import db

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'binary-baniyas-super-secret'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///deceptiscan.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()

    @app.route('/')
    def home():
        return render_template('index.html')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0')