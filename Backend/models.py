from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager


db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    translations = db.relationship('Translation', backref='author', lazy=True)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"User('{self.email}')"

class Translation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    source_text = db.Column(db.Text, nullable=False)
    translated_text = db.Column(db.Text, nullable=False)
    from_lang = db.Column(db.String(10), nullable=False)
    to_lang = db.Column(db.String(10), nullable=False)
    is_correction = db.Column(db.Boolean, default=False)
    # This foreign key setup for original_translation_id is correct for self-referencing
    original_translation_id = db.Column(db.Integer, db.ForeignKey('translation.id'), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Added backref for the relationship with User model (optional if you're using 'author' backref already)
    # user = db.relationship('User', backref=db.backref('translations', lazy=True))
    # Self-referencing relationship for corrections
    original_translation = db.relationship(
        'Translation', remote_side=[id], backref=db.backref('corrections', lazy='dynamic')
    )

    def __repr__(self):
        return f"Translation('{self.source_text}' to '{self.translated_text}')"

    # --- UPDATED `to_dict` METHOD ---
    def to_dict(self):
        return {
            'id': self.id,
            # Frontend uses 'userId', so keep it consistent with /get_translations
            'userId': self.user_id,
            # Frontend uses 'sourceText', so keep it consistent with /get_translations
            'sourceText': self.source_text,
            # Frontend uses 'translatedText', so keep it consistent with /get_translations
            'translatedText': self.translated_text,
            # Frontend uses 'fromLang', so keep it consistent with /get_translations
            'fromLang': self.from_lang,
            # Frontend uses 'toLang', so keep it consistent with /get_translations
            'toLang': self.to_lang,
            # Frontend uses 'isCorrection', so keep it consistent with /get_translations
            'isCorrection': self.is_correction,
            # Frontend uses 'originalTranslationId', so keep it consistent with /get_translations
            'originalTranslationId': self.original_translation_id,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None # Ensure timestamp is handled even if None
        }
    # ----------------------------