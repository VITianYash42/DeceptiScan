import json
from flask import Flask, render_template, jsonify, request
from flask_login import LoginManager, login_required, current_user
from models import db, User, Attempt

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
        # Updated to session.get to fix the SQLAlchemy warning!
        return db.session.get(User, int(id)) 

    # Register the Auth Blueprint
    from auth import auth
    app.register_blueprint(auth, url_prefix='/')

    with app.app_context():
        db.create_all()

    # --- FRONTEND ROUTES ---
    
    @app.route('/')
    def home():
        return render_template('index.html')
    
    @app.route('/leaderboard')
    def leaderboard():
        # Fetch the top 10 users sorted by score in descending order
        top_users = User.query.order_by(User.score.desc()).limit(10).all()
        return render_template('leaderboard.html', top_users=top_users)

    @app.route('/game')
    @login_required
    def game():
        return render_template('game/inbox.html')

    # --- API ENDPOINTS ---
    
    @app.route('/api/scenarios')
    def get_scenarios():
        with open('scenarios.json') as f:
            return jsonify(json.load(f))

    @app.route('/api/process-email', methods=['POST'])
    @login_required 
    def save_result():
        try:
            data = request.get_json()
            scenario_id = data.get('scenario_id')
            is_success = data.get('success')
            
            # 1. Calculate points
            points = 100 if is_success else -50
            
            # 2. Update the User's total score
            current_user.score += points
            
            # 3. Log this specific attempt in the database
            new_attempt = Attempt(
                user_id=current_user.id,
                scenario_id=scenario_id,
                success_bool=is_success
            )
            
            # 4. Save everything to SQLite
            db.session.add(new_attempt)
            db.session.commit()
            
            return jsonify({
                "status": "success",
                "message": "Score saved to database.",
                "data": {
                    "new_total_score": current_user.score,
                    "points_awarded": points
                }
            }), 200

        except Exception as e:
            db.session.rollback() 
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 400
        
    @app.route('/seed-leaderboard')
    def seed_leaderboard():
        from werkzeug.security import generate_password_hash
        
        # A list of fake hackathon users and scores
        fake_users = [
            ("CyberNinja99", 950),
            ("PhishHunter", 820),
            ("SecOps_Dave", 710),
            ("FirewallFrank", 600),
            ("ZeroTrust_Zoe", 550),
            ("ScamBuster", 880),
            ("NoobMaster", 120),
            ("ByteMe", 430),
            ("ClickHappy", -150)
        ]
        
        for username, score in fake_users:
            # Only add them if they don't already exist
            if not User.query.filter_by(username=username).first():
                user = User(
                    username=username,
                    email=f"{username.lower()}@demo.com",
                    password_hash=generate_password_hash("password123"),
                    score=score
                )
                db.session.add(user)
                
        db.session.commit()
        return "Hackathon magic complete! 🪄 Fake users added. Go check your leaderboard."

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0')