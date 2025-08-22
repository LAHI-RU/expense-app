import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './src/routes';
import { errorHandler } from './src/middlewares/error';

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Server is running!');
});


const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
