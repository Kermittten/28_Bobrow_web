from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipes.db'
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
db = SQLAlchemy(app)

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(100))
    rating = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.now)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    recipes = Recipe.query.all()
    return render_template('index.html', recipes=recipes)

@app.route('/add', methods=['GET', 'POST'])
def add_recipe():
    if request.method == 'POST':
        title = request.form['title']
        ingredients = request.form['ingredients']
        instructions = request.form['instructions']
        image = request.files['image']

        if image:
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        else:
            filename = None

        recipe = Recipe(
            title=title,
            ingredients=ingredients,
            instructions=instructions,
            image=filename
        )
        db.session.add(recipe)
        db.session.commit()
        flash('Рецепт успешно добавлен!', 'success')
        return redirect(url_for('index'))

    return render_template('add_recipe.html')

@app.route('/recipe/<int:id>')
def recipe_detail(id):
    recipe = Recipe.query.get_or_404(id)
    return render_template('recipe_detail.html', recipe=recipe)

@app.route('/rate/<int:id>', methods=['POST'])
def rate_recipe(id):
    recipe = Recipe.query.get_or_404(id)
    rating = int(request.form['rating'])
    recipe.rating = rating
    db.session.commit()
    flash('Спасибо за оценку!', 'info')
    return redirect(url_for('recipe_detail', id=id))

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)