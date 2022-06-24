# Réseau social avec la stack MERNG

## Description :
Petit réseau social utilisant la stack MERNG (MongoDB Express React Node.js GraphQL).<br/>
On peut s'inscrire et se connecter pour ensuite créer des posts publics qui peuvent être "likés" ou commentés par d'autres utilisateurs connectés.<br/>
On peut aussi aller sur le profil d'un utilisateur et commencer une conversation privée avec lui par messagerie instantannée.<br/>
Déploiement Front-End : Netlify<br/>
Déploiement Back-End : Heroku<br/>
Base de données : MongoDB

## Lien du site :
https://social-network-1994.netlify.app/

## Utilisation :
### Inscription / Connexion :
Vous pouvez vous inscrire en entrant un nom d'utilisateur ainsi qu'un mot de passe en cliquant sur "s'inscrire".<br/>
Vous pouvez aussi tester directement l'application en utilisant les deux utilisateurs test créés à cet effet :<br/>
-Nom d'utilisateur: test01, mot de passe: 123456<br/>
-Nom d'utilisateur: test02, mot de passe: 123456<br/>
### Création d'un post :
Une fois connecté, depuis la page d'accueil vous pourrez créer un poste en écrivant votre message dans le champ à cet effet en haut à gauche du site.<br/>
Une fois votre message terminé, vous n'avez plus qu'à cliquer sur "valider" pour publier votre poste.<br/>
### Liker / Commenter / Supprimer un poste
Un fois connecté, il vous sera possible de liker ou de commenter un poste (le vôtre ou celui d'autres utilisateurs) grace aux icones prévus à cet effet.<br/>
Si c'est votre propre poste, vous pourrez le supprimer en cliquant sur l'icone rouge représentant une poubelle.<br/>
### Commencer une discution instantannée privée avec un utilisateur
Depuis la page d'accueil, cliquez sur le nom d'un utilisateur ayant créé un poste pour accéder à son profil.<br/>
Une fois sur son profil, cliquez sur "discuter" pour commencer une conversation privée.<br/>
Vous trouverez en bas de la page une zone de texte permettant d'écrire votre message ainsi que le bouton "envoyer".<br/>
Une fois votre message envoyé, vous pourrez voir en temps réel si votre message a été vu par l'autre utilisateur.<br/>
### Voir ses messages / Continuer une conversation
Vous pourrez accédez à la liste de vos conversation en cliquant sur l'onglet "Messages".<br/>
Sélectionnez une conversation (un message s'affiche si vous n'avez encore commencé aucune conversation) pour accéder aux messages de celle-ci.<br/>

## Technologies utilisées :
### Front-End :
-React<br/>
-React Router DOM<br/>
-Apollo client<br/>
-Semantic UI CSS<br/>
-jwt decode<br/>
-subscription-transport-ws<br/>

### Back-End :
-Node.js<br/>
-Express<br/>
-Mongoose<br/>
-GraphQl<br/>
-bcryptjs<br/>
-subscriptions-transport-ws<br/>

### Testing :
-Jest / React Testing Library : pour les tests unitaires sur le composant react "Register" dans client/src/pages/Register/Register.test.js<br/>
-Cypress : pour les tests d'intégration et end-to-end dans client/cypress/integration/0-MERNG<br/>

