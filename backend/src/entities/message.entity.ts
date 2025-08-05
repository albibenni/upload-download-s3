import { Expose } from 'class-transformer';

export interface IMessageEntity {
  message: string;
}

export class MessageEntity implements IMessageEntity {
  @Expose()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
