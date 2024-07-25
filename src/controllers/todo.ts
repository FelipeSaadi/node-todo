import { RequestHandler } from "express"
import { Todo } from "../models/Todo"

export const all: RequestHandler = async (req, res) => {
    const data = await Todo.findAll()
    res.json({ data: data })
}

export const add: RequestHandler = async (req, res) => {
    let { title, done } = req.body

    if (title) {
        if (done) {
            switch (done) {
                case 'true':
                case '1':
                    done = true
                default:
                    done = false
            }
        }

        let newTodo = await Todo.create({
            title: title,
            done: done ? true : false
        })

        res.status(201).json({ ok: newTodo })
    }
    else {
        res.status(400).json({ error: 'Dados não enviados' })
    }
}

export const update: RequestHandler = async (req, res) => {
    const { id } = req.params
    const { title, done } = req.body

    const todo = await Todo.findByPk(id)
    if (todo) {
        if (title) {
            todo.title = title
        }

        if (done) {
            switch (done.toLowerCase()) {
                case 'true':
                case '1':
                    todo.done = true
                    break
                default:
                    todo.done = false
                    break
            }
        }

        await todo.save()
        res.json({ ok: todo })

    } else {
        res.json({ error: 'Todo não encontrado' })
    }
}

export const remove: RequestHandler = async (req, res) => {
    const { id } = req.params

    try {
        const todo = await Todo.findByPk(id)
        if (todo) {
            await todo.destroy()
            res.json({ ok: todo })

        } else {
            res.json({ error: 'Todo não encontrado' })
        }
    }
    catch (error) {
        res.json({ error: 'Erro ao remover o todo' })
    }
}