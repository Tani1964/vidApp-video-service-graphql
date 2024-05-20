import { Entity, PrimaryGeneratedColumn, Column, BaseEntity , CreateDateColumn, UpdateDateColumn} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class VideoEntity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  description! : string;

  @Field()
  @Column()
  user_id! : string;

  @Field()
  @CreateDateColumn()
  created_at?: Date;

  @Field()
  @UpdateDateColumn()
  updated_at?: Date;
}
