import { Injectable } from '@nestjs/common';
import { AzureAIService } from './azureai.service';

@Injectable()
export class AppService {
  constructor(private azureAIService: AzureAIService) {}

  async createQuery(threadId: string, data: any): Promise<any> {
    try {
      let createNewThread = !threadId;
      if (createNewThread) {
        try {
          await this.azureAIService.createUserQuery(threadId, data);
        } catch (error) {
          console.error(error);
          createNewThread = true;
        }
      }
      if (createNewThread) {
        const newThread = await this.azureAIService.createNewThread();
        threadId = newThread.id;
        await this.azureAIService.createUserQuery(threadId, data);
      }
      return await this.azureAIService.runThread(threadId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getRunStatus(threadId: string, runId: string): Promise<any> {
    try {
      return await this.azureAIService.threadStatus(threadId, runId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getEvents(threadId: string): Promise<any> {
    try {
      return await this.azureAIService.threadMessage(threadId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
