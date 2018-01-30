const app = require('./angular-init');
const chatComponent = require('./chat');
const topComponent = require('./top');
const publicComponent = require('./public');
const enterComponent = require('./enter');

app.component('enter',enterComponent);
app.component('public', publicComponent);
app.component('top', topComponent);
app.component('chat', chatComponent);
