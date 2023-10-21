import { HappyCityGame } from "./src/model/HappyCityGame.js";

const game = new HappyCityGame(2);

console.log('Game 1', JSON.parse(JSON.stringify(game)));

game.addCardToLine(2);
game.addCardToLine(2);
game.addCardToLine(2);

console.log('Game 2', JSON.parse(JSON.stringify(game)));

game.removeCardFromLine(2, game.centralZone.getLine(2).visibleCards[1].name);

console.log('Game 3', JSON.parse(JSON.stringify(game)));

game.earnRevenue();

console.log('Game 4', JSON.parse(JSON.stringify(game)));

