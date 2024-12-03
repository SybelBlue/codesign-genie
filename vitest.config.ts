import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export default defineConfig({
    test: {
        testTimeout: 10000,
    },
    resolve: {
        alias: {
            '$lib': resolve(__dirname, './src/lib')
        }
    }
}); 