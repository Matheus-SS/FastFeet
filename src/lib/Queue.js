import Bee from 'bee-queue';
import OrderRegistrationMail from '../app/jobs/OrderRegistrationMail';
import CancelationDelivery from '../app/jobs/CancelationDelivery';

import redisConfig from '../config/redis';

const jobs = [OrderRegistrationMail, CancelationDelivery];

class Queue {
  constructor() {
    this.queues = {};

    this.initQueue();
  }

  initQueue() {
    jobs.forEach(({ key, handleEmailQueue }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handleEmailQueue,
      };
    });
  }

  addJobs(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handleEmailQueue } = this.queues[job.key];
      bee.on('failed', this.handleQueueFailure).process(handleEmailQueue);
    });
  }
  handleQueueFailure(job, err) {
    console.log(`Queue ${job.queue.name}:FAILED`, err);
  }
}

export default new Queue();
