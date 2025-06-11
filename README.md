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
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> 7c9b918 (Initialize project using Create React App)
