# create_db.py
from app import create_app
from models import db
import os # Importez os ici aussi

app = create_app()

with app.app_context():
    # Affichage du chemin complet que Flask-SQLAlchemy essaie d'ouvrir
    db_path_uri = app.config['SQLALCHEMY_DATABASE_URI']
    # Extrait le chemin du fichier de l'URI SQLite
    if db_path_uri.startswith('sqlite:///'):
        actual_file_path = db_path_uri[len('sqlite:///'):]
    else:
        actual_file_path = db_path_uri # Ou gérer d'autres types de DB si applicable

    print(f"Tentative de création de la base de données à l'emplacement absolu : {os.path.abspath(actual_file_path)}")
    
    # Assurez-vous que le répertoire existe avant d'appeler create_all
    db_dir = os.path.dirname(os.path.abspath(actual_file_path))
    if not os.path.exists(db_dir):
        print(f"Création du répertoire manquant : {db_dir}")
        os.makedirs(db_dir)

    db.create_all() # Crée toutes les tables définies dans vos modèles
    print("Base de données et tables créées avec succès !")