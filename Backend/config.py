# /home/koubra/Documents/PFE/InterfacePFE/Backend/config.py
import os
basedir = os.path.abspath(os.path.dirname(__file__))
class Config:
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(basedir, "instance", "app.db")}?check_same_thread=False'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') 
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') 