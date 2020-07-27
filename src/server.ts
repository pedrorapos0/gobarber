import express from 'express';
import routes from '.';

const app = express();
app.use(express.json());
app.use('/', routes);
app.listen(3333, () => console.log('🚀️App listening on port 3333'));