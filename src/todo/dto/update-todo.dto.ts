import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';

// PartialType membuat semua field dari CreateTodoDto menjadi opsional,
// tapi tetap memakai aturan validasi yang sama (IsIn, IsDateString, dst)
// jika field tersebut dikirim saat PUT /api/v1/todos/:id
export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
