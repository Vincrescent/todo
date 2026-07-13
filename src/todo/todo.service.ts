import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create(createTodoDto);
    return this.todoRepository.save(todo);
  }

  async findAll(completed?: boolean): Promise<Todo[]> {
    if (completed === undefined) {
      return this.todoRepository.find({ order: { createdAt: 'DESC' } });
    }
    return this.todoRepository.find({
      where: { completed },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo dengan ID ${id} tidak ditemukan`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id); // otomatis 404 kalau tidak ada
    Object.assign(todo, updateTodoDto);
    return this.todoRepository.save(todo);
  }

  async remove(id: number): Promise<{ message: string }> {
    const todo = await this.findOne(id); // otomatis 404 kalau tidak ada
    await this.todoRepository.remove(todo);
    return { message: `Todo dengan ID ${id} berhasil dihapus` };
  }
}
