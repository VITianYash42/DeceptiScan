from flask import Flask, render_template, jsonify, request
from flask_login import LoginManager, login_required
from models import db, User

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'binary-baniyas-super-secret'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///deceptiscan.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    # Initialize Login Manager
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    # Register the Auth Blueprint
    from auth import auth
    app.register_blueprint(auth, url_prefix='/')

    with app.app_context():
        db.create_all()

    # --- FRONTEND ROUTES ---
    
    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/game')
    # @login_required <-- We keep this commented out until Aditya finishes the Auth UI
    def game():
        return render_template('game/inbox.html')

    # --- API ENDPOINTS ---
    
    @app.route('/api/update-score', methods=['POST'])
    def update_score():
        """
        Frontend should send JSON: {"scenario_id": 1, "success": true}
        """
        try:
            data = request.get_json()
            received_status = data.get('success')
            
            return jsonify({
                "status": "success",
                "message": "Score recorded successfully.",
                "data": {
                    "scenario_attempted": data.get('scenario_id'),
                    "points_awarded": 100 if received_status else -50
                }
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e),
                "data": None
            }), 400

    return app # <-- Notice how all routes are ABOVE this return statement!

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0')