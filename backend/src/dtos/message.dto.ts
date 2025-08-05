import { Expose } from 'class-transformer';

export interface IMessageDto {
  message: string;
}

export class MessageDto implements IMessageDto {
  @Expose()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
