import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { Database } from './database.js';

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title } = req.query;

            const users = database.select('tasks', title ? {
                title,
                description: title,
            } : null);

            return res.end(JSON.stringify(users));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body;

            if (title && description) {

                const task = {
                    id: randomUUID(),
                    title,
                    description,
                    completed_at: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                }

                database.insert('tasks', task);
            } else {
                return res.writeHead(400).end('Title or description is missing!');
            }

            return res.writeHead(201).end('Task has been created with success!');
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const { title, description } = req.body;

            if (title && description) {

                const error = database.update('tasks', id, {
                    title,
                    description,
                    updated_at: new Date()
                });

                if (error)
                    return res.writeHead(error.status).end(error.message)
            } else {
                return res.writeHead(400).end('Title or description is missing!');
            }

            return res.writeHead(204).end();
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;

            const error = database.delete('tasks', id);

            if (error)
                return res.writeHead(error.status).end(error.message)

            return res.writeHead(204).end();
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params;

            const error = database.checkTask('tasks', id);

            if (error)
                return res.writeHead(error.status).end(error.message)

            return res.writeHead(204).end();
        }
    }
]