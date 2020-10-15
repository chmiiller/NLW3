import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';

export default {
    async index(request: Request, response: Response) {
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });
        return response.json(orphanageView.renderMany(orphanages));
    },

    async show(request: Request, response: Response) {
        const { id } = request.params;
        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        });
        return response.json(orphanageView.render(orphanage));
    },

    async create(request: Request, response: Response) {
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
        } = request.body;

        const orphanagesRepository = getRepository(Orphanage);

        // cast multiple files as Multer File Array
        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return { path: image.filename };
        });
        
        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            images,
        };

        const schema = Yup.object().shape({
            name: Yup.string().required('Name is mandatory'),
            latitude: Yup.number().required('Latitude is mandatory'),
            longitude: Yup.number().required('Longitude is mandatory'),
            about: Yup.string().required('About is mandatory').max(300),
            instructions: Yup.string().required('Instructions is mandatory'),
            opening_hours: Yup.string().required('Opening hours are mandatory'),
            open_on_weekends: Yup.boolean().required('Opened on weekend is mandatory'),
            images: Yup.array(Yup.object().shape({
                path: Yup.string().required('Image path is mandatory'),
            }))
        });

        await schema.validate(data, {
            abortEarly: false
        });

        const orphanage = orphanagesRepository.create(data);
        
        await orphanagesRepository.save(orphanage);
    
        return response.status(201).json(orphanage);
    }
};