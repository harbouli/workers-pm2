import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { workerThreadFilePath } from './worker/config';

@Injectable()
export class AppService {
  blocking(cpuTimeMs: number) {
    const startTime = Date.now();
    while (Date.now() - startTime < cpuTimeMs) {}
  }
  async worker(cpuTimeMs: number) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerThreadFilePath, {
        workerData: {
          cpuTimeMs,
        },
      });
      worker.on('message', (message) => {
        console.log('Worker thread got a message: ', message);
        resolve(message);
      });
      worker.on('error', (error) => {
        console.log('Worker thread got a error: ', error);
        reject(error);
      });
      worker.on('exit', (code) => {
        console.log('Worker got a code: ', code);
      });
    });
  }
}
