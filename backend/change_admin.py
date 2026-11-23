from app import app, db
from models import User   # use the same class name as on line 235

with app.app_context():
    a = User.query.filter_by(email="admin@tiko.co.ke").first()
    a.email = "admin@ticketyangu.co.ke"
    a.set_password("adminlog954")
    db.session.commit()
    print("Admin updated")