import express from 'express';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import relationshipRoutes from './routes/relationships.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';

const app = express();

// Middlewares
app.use('/images', express.static('images'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
})
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(cookieParser());

// Multer package for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images')
  },
  filename: function (req, file, cb) {

    cb(null, Date.now() + file.originalname);
  }
})

const upload = multer({ storage: storage })

// Route for handling uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename)
})


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/relationships', relationshipRoutes);

app.listen(8800, () => {
  console.log('Api working');
})