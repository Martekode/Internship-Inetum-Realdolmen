import express from 'express';
import {
    getPackages,
    getPackage,
    createPackage,
    deletePackage
} from '../controllers/packages.js';

const router = express.Router();

router.get('/', getPackages);

router.post('/', createPackage);

router.get('/:id', getPackage);

router.delete('/:id', deletePackage);

export default router;