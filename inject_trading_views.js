const fs = require('fs');

let viewsJs = fs.readFileSync('src/views.js', 'utf8');

if (!viewsJs.includes('TRADING_CARDS_DATA')) {
    viewsJs = "import { TRADING_CARDS_DATA } from './trading_cards_data.js';\n" + viewsJs;
    let logic = fs.readFileSync('extracted_trading_logic.js', 'utf8');
    viewsJs += '\n' + logic + '\nwindow.renderTradingCardsView = renderTradingCardsView;\n';
    fs.writeFileSync('src/views.js', viewsJs, 'utf8');
    console.log("Injected trading cards into views.js.");
} else {
    console.log("Already exists in views.js.");
}
