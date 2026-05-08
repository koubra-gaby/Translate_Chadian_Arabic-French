<<<<<<< HEAD
# Traduction Automatique : Arabe Tchadien <> Français

### Un modèle de traduction basé sur le NLP pour la langue tchadienne.

Ce projet a pour but de créer un système de traduction automatique performant, spécialisé dans la traduction de l'arabe tchadien vers le français et vice-versa. Il s'appuie sur des modèles d'intelligence artificielle de pointe pour répondre à un besoin linguistique local et combler un manque dans les outils de traduction existants.

---

### Structure du projet ⚙️

L'organisation de ce dépôt suit une architecture modulaire, ce qui facilite la compréhension et la contribution.

* **`Backend/`** : Ce dossier contient les fichiers de la logique métier, la logique du serveur, et la gestion des données pour l'application de traduction.
* **`interface/`** : Contient le code source de l'interface utilisateur.
* **`modèle_ensemble_de_données/`** : Ce dossier contient les datasets du projet. Il y a dans ce dossier deux sous-dossiers dont le dossier `mini_dataset` qui contient juste une partie de l'ensemble du dataset afin de permettre d'entraîner le modèle dans les GPU gratuits comme Kaggle et le dossier `complet_dataset` qui contient l'ensemble de nos données.
* **`notebooks`** : : Les notebooks `code_entrainement.ipynb` qui contient les codes pour l'entraînement, `scrapping.ipynb` pour l'extraction et `traitement_données.ipynb` pour le nettoyage de nos données.

---

### Sources de données 💾
Les données utilisées pour ce projet ont été extraites à partir des sources suivantes. Nous remercions les contributeurs de ces plateformes pour rendre ce projet possible.

* [Bible Gateway](https://www.biblegateway.com/) : Pour l'extraction de nos données en français
* [tala-al-nuur-fi-tchaad](https://www.tala-al-nuur-fi-tchaad.com/fr)- : Pour l'extraction de nos données en arabe tchadien

---

### Technologies utilisées 🛠️

* **Langages :** Python, JavaScript
* **Libraries :** Hugging Face (pour les modèles de NLP), PyTorch, TensorFlow
* **Outils :** Jupyter Notebook, Git, GitHub

---

### Comment utiliser le projet ? 🚀

Pour cloner et lancer une version locale du projet, suis les étapes ci-dessous.

1.  **Clone ce dépôt :**
    ```bash
    git clone [https://github.com/koubra-gaby/Translate_Chadian_Arabic-French.git](https://github.com/koubra-gaby/Translate_Chadian_Arabic-French.git)
    cd Translate_Chadian_Arabic-French
    ```
2.  **Installe les dépendances :**
    Navigue vers les dossiers `Backend` et `interface` pour installer les dépendances nécessaires.

---

### Contribution et Contact 💬

Les contributions sont les bienvenues ! N'hésite pas à ouvrir une `issue` ou une `pull request` pour proposer des améliorations.

* **LinkedIn :** [Koubra Gaby](https://www.linkedin.com/in/koubra-gaby-309a50250?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BEnIDMuXQT%2B6S7wHraGiLNg%3D%3D)
* **E-mail :** koubragaby1@gmail.com
