import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsIn,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty({ message: 'title tidak boleh kosong' })
  @IsString({ message: 'title harus berupa string' })
  @MaxLength(100, { message: 'title maksimal 100 karakter' })
  title: string;

  @IsOptional()
  @IsString({ message: 'description harus berupa string' })
  description?: string;

  // completed sengaja dibuat opsional (default false di entity) agar body
  // create tetap valid walau completed tidak dikirim.
  @IsOptional()
  @IsBoolean({ message: 'completed harus berupa boolean (true/false)' })
  completed?: boolean;

  // priority dibuat opsional karena entity sudah punya default: 'low'.
  // Saat dikirim, nilainya tetap wajib salah satu dari enum berikut.
  @IsOptional()
  @IsIn(['low', 'medium', 'high'], {
    message: 'priority harus salah satu dari: low, medium, high',
  })
  priority?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'dueDate harus berformat tanggal valid (YYYY-MM-DD)' },
  )
  dueDate?: string;
}
