import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TaskCreatedEventDto } from './dto/task-event.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private isConnected = false;
  private isConnecting = false;

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // Try to connect to Kafka, but don't block app startup if it fails
    try {
      this.logger.log('Attempting to connect to Kafka...');
      await this.ensureKafkaConnection();
      this.logger.log('Kafka client connected successfully');
    } catch (error) {
      this.logger.warn(
        'Failed to connect to Kafka at startup. Will retry on first publish attempt.',
        error.message,
      );
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      try {
        await this.kafkaClient.close();
        this.logger.log('Kafka client disconnected');
      } catch (error) {
        this.logger.error('Error disconnecting from Kafka:', error);
      }
    }
  }

  private async ensureKafkaConnection(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    if (this.isConnecting) {
      // Wait for ongoing connection attempt
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return this.ensureKafkaConnection();
    }

    this.isConnecting = true;
    try {
      await this.kafkaClient.connect();
      this.isConnected = true;
    } finally {
      this.isConnecting = false;
    }
  }

  async publishTaskCreated(event: TaskCreatedEventDto): Promise<void> {
    try {
      // Ensure Kafka is connected before publishing
      await this.ensureKafkaConnection();

      this.logger.log(`Publishing task.created event for task: ${event.data._id}`);
      
      await this.kafkaClient.emit('task.created', {
        key: event.data._id,
        value: JSON.stringify(event),
      });

      this.logger.log(`Successfully published task.created event for task: ${event.data._id}`);
    } catch (error) {
      this.logger.error(
        `Failed to publish task.created event for task: ${event.data._id}`,
        error.stack,
      );
      // Don't throw error - we don't want to fail task creation if notification fails
    }
  }
}
