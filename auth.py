from flask import Blueprint, render_template, redirect, url_for, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from models import db, User, Attempt

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password_hash, password):
            login_user(user, remember=True)
            return redirect(url_for('home')) 
        else:
            flash('Invalid email or password.', 'error')

    return render_template('auth/login.html')

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if user already exists
        user_exists = User.query.filter_by(email=email).first()
        if user_exists:
            flash('Email already registered.', 'error')
            return redirect(url_for('auth.register'))

        # Create new user
        new_user = User(
            email=email,
            username=username,
            password_hash=generate_password_hash(password, method='pbkdf2:sha256')
        )
        db.session.add(new_user)
        db.session.commit()

        login_user(new_user, remember=True)
        return redirect(url_for('home'))

    return render_template('auth/register.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@auth.route('/profile')
@login_required
def profile():
    # Fetch all attempts for the current logged-in user
    user_attempts = Attempt.query.filter_by(user_id=current_user.id).all()
    
    # Calculate successful catches and failed clicks
    successful_catches = sum(1 for attempt in user_attempts if attempt.success_bool)
    failed_clicks = sum(1 for attempt in user_attempts if not attempt.success_bool)

    # Pass the calculated stats to the profile template
    return render_template('auth/profile.html', 
                           successful_catches=successful_catches, 
                           failed_clicks=failed_clicks)
