import express from 'express';
import {
    getAllPackages,
    getPackage,
    createPackage,
    deletePackage
} from '../controllers/packages.js';

const router = express.Router();

router.get('/', getAllPackages);

router.post('/', createPackage);

router.get('/:id', getPackage);

router.delete('/:id', deletePackage);

export default router;