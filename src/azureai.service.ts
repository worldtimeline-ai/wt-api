/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AzureAIService {
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly deployment: string;
  private readonly assistantId: string;
  private readonly apiVersion: string;

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get<string>('AZURE_OPENAI_ENDPOINT') ?? '';
    this.apiKey = this.configService.get<string>('AZURE_OPENAI_API_KEY') ?? '';
    this.deployment = this.configService.get<string>('AZURE_OPENAI_DEPLOYMENT') ?? '';
    this.assistantId = this.configService.get<string>('AZURE_OPENAI_ASSISTANT_ID') ?? '';
    this.apiVersion = '2024-05-01-preview';
  }

  async createNewThread(): Promise<{ id: string }> {
    try {
      const newThreadResponse = await axios.post<{ id: string }>(
        `${this.endpoint}/openai/threads?api-version=${this.apiVersion}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
          },
        },
      );
      console.log('New Thread Response:', newThreadResponse.data);
      return newThreadResponse.data;
    } catch (error) {
      console.error(
        'Error calling Azure OpenAI:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async createUserQuery(threadId: string, data: any): Promise<any> {
    try {
      const newQueryResponse = await axios.post(
        `${this.endpoint}/openai/threads/${threadId}/messages?api-version=${this.apiVersion}`,
        {
          role: 'user',
          content: 'What happened around 40.597257, 35.072831 with zoom at 10 during 1560-1590?',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
          },
        },
      );
      console.log('User Query Response:', newQueryResponse.data);
      return newQueryResponse.data;
    } catch (error) {
      console.error(
        'Error calling Azure OpenAI:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async runThread(threadId: string): Promise<any> {
    try {
      const runThreadResponse = await axios.post(
        `${this.endpoint}/openai/threads/${threadId}/runs?api-version=${this.apiVersion}`,
        {
          assistant_id: this.assistantId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
          },
        },
      );
      console.log('Run Thread Response:', runThreadResponse.data);
      return runThreadResponse.data;
    } catch (error) {
      console.error(
        'Error calling Azure OpenAI:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async threadStatus(threadId: string, runId: string): Promise<any> {
    try {
      const statusResponse = await axios.get(
        `${this.endpoint}/openai/threads/${threadId}/runs/${runId}?api-version=${this.apiVersion}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
          },
        },
      );
      console.log('Status Response:', statusResponse.data);
      return statusResponse.data;
    } catch (error) {
      console.error(
        'Error calling Azure OpenAI:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async threadMessage(threadId: string): Promise<any> {
    try {
      const messageResponse = await axios.get(
        `${this.endpoint}/openai/threads/${threadId}/messages?api-version=${this.apiVersion}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
          },
        },
      );
      console.log('Message Response:', messageResponse.data);
      return messageResponse.data;
    } catch (error) {
      console.error(
        'Error calling Azure OpenAI:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}
