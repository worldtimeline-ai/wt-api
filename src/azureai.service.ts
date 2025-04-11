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
    this.apiVersion = this.configService.get<string>('AZURE_OPENAI_VERSION') ?? '';
  }

  async chatMessage(data: any): Promise<any> {
    const messages = [
      {
        role: 'system',
        content: `You are a world history assistant that only responds in valid JSON format. \
        Do not include any explanations, extra text, ticks, quotes, new line characters, or Markdown formatting. \
        If you cannot provide a valid JSON response, return an empty JSON object {}. \
        You are assisting me on giving all major and sub-major events that happened during an inputted year range and map area selected. Please give as many events per request as possible. \
        I will send the center of map in the form of latitude, longitude and the zoom value. I am expecting the events that happened in all the regions visible on the map. \
        Each result should have a list of events (field key: 'description') that happened during the inputted region and period. \
        Include a geolocation (in the form of latitude, longitude) (field key: 'location') where any event happened. \
        Include the year or year range (field key: 'year') on which event happened. \
        Also, each event will have a list of tags (field key: 'tags') it belongs to like: \
        - political \
        - economical \
        - social \
        - cultural \
        - art \
        - environment \
        - science \
        - food \
        - literature \
        - military \
        - military \
        etc.The tags should not be the heading for events. \
        Rather the response should have a list of events.and each event have list of tags highlighted.`,
      },
      {
        role: 'user',
        content: `What happened around ${data.view.center.lat} N, ${data.view.center.lng} E with map zoom position at ${data.view.zoom} during ${data.year.start}-${data.year.end}?`,
      },
    ];
    try {
      const chatResponse = await axios.post<{ choices: [{ message: any }] }>(
        `${this.endpoint}/openai/deployments/${this.deployment}/chat/completions?api-version=${this.apiVersion}`,
        {
          messages: messages,
          temperature: 0.95,
          top_p: 0.95,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
          },
        },
      );
      console.log('Chat Response:', chatResponse.data);
      return JSON.parse(chatResponse.data?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error calling Azure OpenAI:', error.response?.data || error.message);
      throw error;
    }
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
      console.error('Error calling Azure OpenAI:', error.response?.data || error.message);
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
      console.error('Error calling Azure OpenAI:', error.response?.data || error.message);
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
      console.error('Error calling Azure OpenAI:', error.response?.data || error.message);
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
      console.error('Error calling Azure OpenAI:', error.response?.data || error.message);
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
      console.error('Error calling Azure OpenAI:', error.response?.data || error.message);
      throw error;
    }
  }
}
