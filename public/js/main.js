import { HappyCityGame } from "./src/model/HappyCityGame.js";

const game = new HappyCityGame(2);

console.log('Initialisation', JSON.parse(JSON.stringify(game)));

game.addCardToLine(3);
game.addCardToLine(3);

console.log('Remplir zone centrale', JSON.parse(JSON.stringify(game)));

game.newTurn();

console.log('New Turn', JSON.parse(JSON.stringify(game)));

game.removeCardFromLine(3, game.centralZone.getLine(3).visibleCards[1].name);

console.log('Supprimer carte ligne 3', JSON.parse(JSON.stringify(game)));

game.addCardToLine(2);
game.addCardToLine(2);

console.log('Ajouter cartes ligne 2', JSON.parse(JSON.stringify(game)));
