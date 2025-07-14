import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Cafe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  origem!: string;

  @Column()
  tipo!: string;

  @Column()
  torra!: string;

  @Column()
  aroma!: string;

  @Column()
  sabor!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  preco!: number;

  @Column('int')
  quantidadeEstoque!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

