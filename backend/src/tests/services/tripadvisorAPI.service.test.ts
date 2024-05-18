import mongoose, { connect } from 'mongoose';
import TripAdvisorService from '../../api/tripadvisorAPI.service';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import request from 'supertest';
// import {App} from "supertest/types"
import connectToDatabase from '@utils/dbConfig';


const restaurant = {
    name: 'Restaurant1',
    location: 'tel-aviv',
    rating: 4.5
} as const;


const assertRestaurant = () => {
    expect(restaurant).toBeDefined();
    expect(restaurant).toHaveLength(1);
    expect(restaurant).toHaveProperty('name', restaurant.name);
    expect(restaurant).toHaveProperty('rating', restaurant.rating);
}


describe('TripAdvisor API Service', () => {
    test('Test mock Restaurant', async () => {
        expect(restaurant).toBeDefined();
        expect(restaurant).toHaveProperty('name', 'Restaurant1');
        expect(restaurant).toHaveProperty('location', 'tel-aviv');
        expect(restaurant).toHaveProperty('rating', 4.5);
        await TripAdvisorService.fetchReviews();
    });
});