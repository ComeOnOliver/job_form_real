import express, { Express, Request, Response } from "express";
import { JobService } from './jobServices';
import cors from 'cors'; // Import CORS package


export class Server {

    private app: Express;

    constructor(app: Express) {
        this.app = app;
        // Middleware to parse JSON
        this.app.use(cors());
        this.app.use(express.json());

        this.app.get("/api", (req: Request, res: Response): void => {
            res.send("You have reached the API!");
        })

        this.app.get("/api/jobs", (req: Request, res: Response): void => {
            const jobs = JobService.readJobs();
            res.json(jobs);
        });

        this.app.post("/api/jobs", (req: Request, res: Response): void => {
            const jobData = req.body;
            console.log("Received job data:", jobData);
            const newJob = JobService.addJob(jobData); // Pass the entire request body
            res.status(201).json(newJob);
        });

        this.app.delete("/api/jobs/:index", (req: Request, res: Response): void => {
            const index = parseInt(req.params.index);
            JobService.deleteJob(index);
            res.status(202).send(`Job index ${index} deleted`);
        });


        this.app.get("/api/jobs/countToday", (req: Request, res: Response): void => {
            const count = JobService.countJobsToday();
            res.json({ count });
        });

        this.app.get("/api/jobs/today", (req: Request, res: Response): void => {
            try {
                const todayJobs = JobService.getJobsAppliedToday();
                res.json(todayJobs);
            } catch (error) {
                res.status(500).send("An error occurred while fetching today's jobs.");
            }
        });

        this.app.get("/api/jobs/total", (req: Request, res: Response): void => {
            const total = JobService.countAllJobs();
            res.json({ total });
        });
        this.app.get("/api/jobs/week", (req: Request, res: Response): void => {
            const week = JobService.countJobsThisWeek();
            res.json({ week });
        });
    }

    public start(port: number): void {
        this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
    }

}