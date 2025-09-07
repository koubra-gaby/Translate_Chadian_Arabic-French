# backend/app.py
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db, bcrypt, jwt


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

    from routes.auth import auth_bp
    from routes.translation import translation_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(translation_bp, url_prefix='/api')

    # --- AJOUTEZ CECI POUR CRÉER LES TABLES LORSQUE L'APP DÉMARRE (en dev) ---
    with app.app_context():
        db.create_all() # Crée les tables définies dans models.py si elles n'existent pas
    # ----------------------------------------------------------------------

    try:
        from cli_commands import db_cli, run_server
        @app.cli.command("db")
        def db_command():
            """Run database commands."""
            db_cli()

        app.cli.add_command(run_server)
    except ImportError:
        print("Avertissement: cli_commands.py non trouvé ou ne contient pas les commandes attendues.")
        print("Les commandes 'flask db' et 'flask run_server' ne seront pas disponibles.")

    return app