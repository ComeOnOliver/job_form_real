// app/services/JobService.ts

import fs from 'fs';
import path from 'path';

interface Job {
  superLink: string;
  jobTitle: string;
  companyName: string;
  index: number;
  createdTime: string;
}

const DATA_PATH = path.join(__dirname, '../../data/jobs.json');

export class JobService {
  static readJobs(): Job[] {
    try {
      if (!fs.existsSync(DATA_PATH)) {
        fs.writeFileSync(DATA_PATH, JSON.stringify([]));
      }
      const fileContent = fs.readFileSync(DATA_PATH, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error("Error reading from jobs.json:", error);
      // Initialize the file with an empty array if there's an error
      fs.writeFileSync(DATA_PATH, JSON.stringify([]));
      return [];
    }
  }

  static addJob(jobData: Omit<Job, 'index' | 'createdTime'>): Job {
    const jobs = JobService.readJobs();
    const newIndex = jobs.length > 0 ? jobs[jobs.length - 1].index + 1 : 1;
    const newJob: Job = {
      ...jobData, // Spread the jobData into the new job object
      index: newIndex,
      createdTime: new Date().toISOString(),
    };
    jobs.push(newJob);
    fs.writeFileSync(DATA_PATH, JSON.stringify(jobs, null, 2));
    return newJob;
  }

  static deleteJob(index: number): void {
    const jobs = JobService.readJobs();
    const updatedJobs = jobs.filter(job => job.index !== index);
    fs.writeFileSync(DATA_PATH, JSON.stringify(updatedJobs, null, 2));
  }

  // Additional method in JobService.ts

  static countJobsToday(): number {
    const jobs = JobService.readJobs();
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    return jobs.filter(job => job.createdTime.startsWith(today)).length;
  }

  static getJobsAppliedToday(): Job[] {
    const jobs = this.readJobs();
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    return jobs.filter(job => job.createdTime.startsWith(today));
  }
  static countAllJobs(): number {
    const jobs = JobService.readJobs();
    return jobs.length + 814;
  }

  static countJobsThisWeek(): number {
    const jobs = JobService.readJobs();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return jobs.filter(job => {
        const jobDate = new Date(job.createdTime);
        return jobDate > oneWeekAgo;
    }).length;
}
}
