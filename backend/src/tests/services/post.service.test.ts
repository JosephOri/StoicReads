import mongoose, { connect } from 'mongoose';
import {} from '../../services/post.service';
import PostModel, { IPost } from '../../models/Post';
import Post from '../../interfaces/Post';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import connectToDatabase from '../../utils/dbConfig';

