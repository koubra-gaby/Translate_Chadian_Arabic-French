import sqlite3
import os

db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'instance', 'app.db')

print(f"Tentative de connexion à la base de données : {db_path}")

# Assurez-vous que le répertoire parent existe
db_dir = os.path.dirname(db_path)
if not os.path.exists(db_dir):
    print(f"Création du répertoire de la base de données : {db_dir}")
    os.makedirs(db_dir)

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY, name TEXT)")
    conn.commit()
    conn.close()
    print("Connexion et création de table réussies.")
except sqlite3.OperationalError as e:
    print(f"Erreur opérationnelle SQLite: {e}")
    print(f"Vérifiez les permissions pour le répertoire : {db_dir}")
except Exception as e:
    print(f"Une erreur inattendue s'est produite : {e}")

print(f"Permissions du répertoire '{db_dir}':")
try:
    import stat
    mode = os.stat(db_dir).st_mode
    print(f"Mode (octal): {oct(mode)}")
    print(f"Est un répertoire: {stat.S_ISDIR(mode)}")
    print(f"Permissions d'écriture pour le propriétaire: {bool(mode & stat.S_IWUSR)}")
    print(f"Permissions d'écriture pour le groupe: {bool(mode & stat.S_IWGRP)}")
    print(f"Permissions d'écriture pour les autres: {bool(mode & stat.S_IWOTH)}")
except Exception as e:
    print(f"Impossible de récupérer les informations de permission: {e}")