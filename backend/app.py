from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import jwt
import os
import re
from functools import wraps
from models import db, User, Product, Category,CartItem
from sqlalchemy import desc

# Test directory permissions
try:
    with open('test.txt', 'w') as f:
        f.write('test')
    os.remove('test.txt')
    print("Directory is writable")
except Exception as e:
    print(f"Directory is not writable: {e}")

# Get the absolute path of the current directory
basedir = os.path.abspath(os.path.dirname(__file__))

# Set up database path and ensure directory exists
db_path = os.path.join(basedir, 'ecommerce.db')
db_dir = os.path.dirname(db_path)

# Ensure the directory exists and has proper permissions
if not os.path.exists(db_dir):
    os.makedirs(db_dir, mode=0o777)

app = Flask(__name__)
CORS(app)

# Configure Flask app
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

def init_db():
    with app.app_context():
        # Create the database tables if they don't exist
        db.create_all()
        
        # Check if admin user already exists
        existing_admin = User.query.filter_by(username="admin").first()
        if not existing_admin:
            # Create admin user
            admin = User(
                username="admin",
                email="admin@example.com",
                full_name="Admin User",
                is_admin=True
            )
            admin.set_password("Admin@123")
            db.session.add(admin)
            
            # Create some initial categories if they don't exist
            if Category.query.count() == 0:
                electronics = Category(name="Electronics", description="Electronic devices and gadgets")
                clothing = Category(name="Clothing", description="Apparel and fashion items")
                db.session.add(electronics)
                db.session.add(clothing)
            
            db.session.commit()
            print("Database initialized successfully with admin user and categories")
        else:
            print("Database already initialized")

# Validation functions
def is_valid_email(email):
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(email_pattern, email))

def is_valid_password(password):
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one number"
    
    if not any(char in "!@#$%^&*()_+-=[]{}|;:,.<>?" for char in password):
        return False, "Password must contain at least one special character"
    
    return True, "Password is valid"

# JWT token decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.split()[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(username=data['user']).first()
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except:
            return jsonify({'message': 'Invalid token'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Admin authorization decorator
def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if not current_user.is_admin:
            return jsonify({'message': 'Admin privileges required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

# User Routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        required_fields = ['username', 'email', 'password']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Validate email format
        if not is_valid_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password
        is_password_valid, password_message = is_valid_password(data['password'])
        if not is_password_valid:
            return jsonify({'error': password_message}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400

        user = User(
            username=data['username'],
            email=data['email'],
            full_name=data.get('full_name', ''),
            address=data.get('address', ''),
            phone=data.get('phone', ''),
            is_admin=False  # Regular users are not admins by default
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({'error': 'Missing username or password'}), 400

        user = User.query.filter_by(username=data['username']).first()
        if user and user.check_password(data['password']):
            token = jwt.encode({
                'user': user.username,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, app.config['SECRET_KEY'])
            return jsonify({
                'token': token,
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.full_name,
                    'is_admin': user.is_admin
                }
            })
        return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'username': current_user.username,
        'email': current_user.email,
        'full_name': current_user.full_name,
        'address': current_user.address,
        'phone': current_user.phone,
        'is_admin': current_user.is_admin,
        'created_at': current_user.created_at.isoformat()
    })

@app.route('/api/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    try:
        data = request.json
        updateable_fields = ['full_name', 'address', 'phone']
        
        if 'email' in data:
            if not is_valid_email(data['email']):
                return jsonify({'error': 'Invalid email format'}), 400
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != current_user.id:
                return jsonify({'error': 'Email already exists'}), 400
            current_user.email = data['email']
        
        for field in updateable_fields:
            if field in data:
                setattr(current_user, field, data[field])
        
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Category Routes
@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'description': c.description
    } for c in categories])

@app.route('/api/categories', methods=['POST'])
@token_required
@admin_required
def add_category(current_user):
    try:
        data = request.json
        category = Category(
            name=data['name'],
            description=data.get('description', '')
        )
        db.session.add(category)
        db.session.commit()
        return jsonify({'message': 'Category added successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories/<int:id>', methods=['PUT'])
@token_required
@admin_required
def update_category(current_user, id):
    try:
        category = Category.query.get_or_404(id)
        data = request.json
        
        updateable_fields = ['name', 'description']
        for field in updateable_fields:
            if field in data:
                setattr(category, field, data[field])
        
        db.session.commit()
        return jsonify({'message': 'Category updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories/<int:id>', methods=['DELETE'])
@token_required
@admin_required
def delete_category(current_user, id):
    try:
        category = Category.query.get_or_404(id)
        # Check if category has products
        if category.products:
            return jsonify({'error': 'Cannot delete category with products'}), 400
        
        db.session.delete(category)
        db.session.commit()
        return jsonify({'message': 'Category deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Product Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        category_id = request.args.get('category_id', type=int)
        
        query = Product.query
        
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        products = query.order_by(desc(Product.created_at)).paginate(
            page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'items': [{
                'id': p.id,
                'name': p.name,
                'description': p.description,
                'price': p.price,
                'image_url': p.image_url,
                'stock': p.stock,
                'category_id': p.category_id,
                'created_at': p.created_at.isoformat()
            } for p in products.items],
            'total': products.total,
            'pages': products.pages,
            'current_page': products.page
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products', methods=['POST'])
@token_required
@admin_required
def add_product(current_user):
    try:
        data = request.json
        required_fields = ['name', 'price', 'category_id']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        product = Product(
            name=data['name'],
            description=data.get('description', ''),
            price=data['price'],
            image_url=data.get('image_url', ''),
            stock=data.get('stock', 0),
            category_id=data['category_id']
        )
        db.session.add(product)
        db.session.commit()
        return jsonify({'message': 'Product added successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<int:id>', methods=['PUT'])
@token_required
@admin_required
def update_product(current_user, id):
    try:
        product = Product.query.get_or_404(id)
        data = request.json
        
        updateable_fields = ['name', 'description', 'price', 'image_url', 'stock', 'category_id']
        for field in updateable_fields:
            if field in data:
                setattr(product, field, data[field])
        
        db.session.commit()
        return jsonify({'message': 'Product updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<int:id>', methods=['DELETE'])
@token_required
@admin_required
def delete_product(current_user, id):
    try:
        product = Product.query.get_or_404(id)
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
@app.route('/api/cart', methods=['GET'])
@token_required
def get_cart(current_user):
    try:
        cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
        result = []
        total = 0
        
        for item in cart_items:
            product = Product.query.get(item.product_id)
            item_data = {
                'id': item.id,
                'product_id': product.id,
                'product_name': product.name,
                'price': product.price,
                'image_url': product.image_url,
                'quantity': item.quantity,
                'subtotal': product.price * item.quantity,
                'added_at': item.added_at.isoformat()
            }
            result.append(item_data)
            total += item_data['subtotal']
        
        return jsonify({
            'items': result,
            'total': total,
            'item_count': len(result)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cart', methods=['POST'])
@token_required
def add_to_cart(current_user):
    try:
        data = request.json
        if not data or 'product_id' not in data:
            return jsonify({'error': 'Product ID is required'}), 400
        
        product_id = data['product_id']
        quantity = data.get('quantity', 1)
        
        # Validate quantity
        if quantity <= 0:
            return jsonify({'error': 'Quantity must be positive'}), 400
        
        # Check if product exists and has sufficient stock
        product = Product.query.get_or_404(product_id)
        if product.stock < quantity:
            return jsonify({'error': 'Insufficient stock'}), 400
        
        # Check if item already in cart
        cart_item = CartItem.query.filter_by(
            user_id=current_user.id,
            product_id=product_id
        ).first()
        
        if cart_item:
            # Update quantity if already in cart
            new_quantity = cart_item.quantity + quantity
            if product.stock < new_quantity:
                return jsonify({'error': 'Insufficient stock for requested quantity'}), 400
            cart_item.quantity = new_quantity
        else:
            # Add new cart item
            cart_item = CartItem(
                user_id=current_user.id,
                product_id=product_id,
                quantity=quantity
            )
            db.session.add(cart_item)
        
        db.session.commit()
        return jsonify({'message': 'Item added to cart successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/cart/<int:item_id>', methods=['PUT'])
@token_required
def update_cart_item(current_user, item_id):
    try:
        cart_item = CartItem.query.filter_by(id=item_id, user_id=current_user.id).first()
        if not cart_item:
            return jsonify({'error': 'Cart item not found'}), 404
        
        data = request.json
        if 'quantity' not in data:
            return jsonify({'error': 'Quantity is required'}), 400
        
        quantity = data['quantity']
        if quantity <= 0:
            return jsonify({'error': 'Quantity must be positive'}), 400
        
        # Check stock availability
        product = Product.query.get(cart_item.product_id)
        if product.stock < quantity:
            return jsonify({'error': 'Insufficient stock'}), 400
        
        cart_item.quantity = quantity
        db.session.commit()
        return jsonify({'message': 'Cart item updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/cart/<int:item_id>', methods=['DELETE'])
@token_required
def remove_from_cart(current_user, item_id):
    try:
        cart_item = CartItem.query.filter_by(id=item_id, user_id=current_user.id).first()
        if not cart_item:
            return jsonify({'error': 'Cart item not found'}), 404
        
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({'message': 'Item removed from cart successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/cart/clear', methods=['DELETE'])
@token_required
def clear_cart(current_user):
    try:
        cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
        for item in cart_items:
            db.session.delete(item)
        
        db.session.commit()
        return jsonify({'message': 'Cart cleared successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    init_db()  # Initialize database when running directly
    app.run(debug=True)