# backend/cli_commands.py
import click
from app import create_app
from models import db

@click.group()
def db_cli():
    """Database commands."""
    pass

@db_cli.command("init")
def init_db():
    """Initialize the database tables."""
    app = create_app()
    with app.app_context():
        db.create_all()
        click.echo("Base de données initialisée (tables créées).")

# Ajoutez cette commande pour lancer le serveur via flask run (meilleure pratique)
@click.command("run")
@click.option("--host", default="127.0.0.1", help="Host address.")
@click.option("--port", default=5000, type=int, help="Port number.")
@click.option("--debug/--no-debug", default=True, help="Enable/disable debug mode.")
def run_server(host, port, debug):
    """Run the development server."""
    app = create_app()
    app.run(host=host, port=port, debug=debug)
    click.echo(f"Serveur démarré sur http://{host}:{port} (debug={debug}).")


if __name__ == '__main__':
    # Ceci ne devrait normalement pas être exécuté directement,
    # mais plutôt via 'flask db init' ou 'flask run'
    pass