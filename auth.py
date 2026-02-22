from flask import Blueprint, render_template, redirect, url_for, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required
from models import db, User

# THIS IS THE EXACT LINE PYTHON IS LOOKING FOR:
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
    # current_user is automatically available in the template via Flask-Login
    return render_template('auth/profile.html')