// frontend/src/components/JobForm.js

import React, { useState, useEffect } from 'react';
import { submitJobApplication, getTodaysJobCount } from '../services/apiService';
import { Button, Form, FormGroup, Label, Input, Alert, Container, Table, Col } from 'reactstrap';
import { getJobsAppliedToday } from '../services/apiService';
import { getTotalJobCount, getThisWeekJobCount } from '../services/apiService';


function JobForm() {
    const [superLink, setSuperLink] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [todaysCount, setTodaysCount] = useState(0);
    const [error, setError] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [jobsToday, setJobsToday] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalJobs, setTotalJobs] = useState(0);
    const [jobsThisWeek, setJobsThisWeek] = useState(0);

    useEffect(() => {
        // ... existing useEffect content

        const fetchTotalJobs = async () => {
            const total = await getTotalJobCount();
            setTotalJobs(total);
        };

        const fetchJobsThisWeek = async () => {
            const week = await getThisWeekJobCount();
            setJobsThisWeek(week);
        };

        fetchTotalJobs();
        fetchJobsThisWeek();
    }, []);

    useEffect(() => {
        fetchJobsAppliedToday();
        // You might want to re-fetch when rowsPerPage changes
        // fetchJobsAppliedToday(rowsPerPage);
    }, [rowsPerPage]); // Add rowsPerPage as a dependency

    const handleRowsChange = (e) => {
        setRowsPerPage(Number(e.target.value));
    };

    const fetchJobsAppliedToday = async () => {
        try {
            const jobs = await getJobsAppliedToday();
            setJobsToday(jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            // Handle error
        }
    };

    useEffect(() => {
        updateCount();
    }, []);

    const isValidUrl = (url) => {
        // Simple URL validation
        const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!urlPattern.test(url);
    }

    const updateCount = async () => {
        const count = await getTodaysJobCount();
        const weekCount = await getThisWeekJobCount();
        const totalCount = await getTotalJobCount();
        
        setTodaysCount(count);
        setJobsThisWeek(weekCount);
        setTotalJobs(totalCount);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation checks
        if (!isValidUrl(superLink)) {
            setError('Please enter a valid Job Link.');
            return;
        }
        if (!jobTitle.trim() || !companyName.trim()) {
            setError('Job Title and Company Name cannot be empty.');
            return;
        }

        try {
            await submitJobApplication({ superLink, jobTitle, companyName });
            updateCount(); // Refresh the count
            setShowNotification(true); // Show submission notification
            setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds
            // Reset form fields
            setSuperLink('');
            setJobTitle('');
            setCompanyName('');
        } catch (error) {
            console.error('Error submitting job:', error);
            setError('Failed to submit the job. Please try again.');
        }
    };


    return (
        <Container className="mt-5">
            <h2 className="mb-4 text-center">Job Application Form</h2>
            <Form onSubmit={handleSubmit}>
                <FormGroup row>
                    <Label for="superLink" sm={2} className="text-right font-weight-bold">
                        Job Link
                    </Label>
                    <Col sm={10}>
                        <Input
                            type="url"
                            name="superLink"
                            id="superLink"
                            placeholder="Enter job link"
                            value={superLink}
                            onChange={(e) => setSuperLink(e.target.value)}
                            required
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="jobTitle" sm={2} className="text-right font-weight-bold">
                        Job Title
                    </Label>
                    <Col sm={10}>
                        <Input
                            type="text"
                            name="jobTitle"
                            id="jobTitle"
                            placeholder="Enter job title"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            required
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="companyName" sm={2} className="text-right font-weight-bold">
                        Company Name
                    </Label>
                    <Col sm={10}>
                        <Input
                            type="text"
                            name="companyName"
                            id="companyName"
                            placeholder="Enter company name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Col sm={{ size: 10, offset: 2 }}>
                        <Button color="primary" type="submit">Submit</Button>
                    </Col>
                </FormGroup>
            </Form>
            {showNotification && <Alert color="success" className="mt-3">Successfully submitted the job application!</Alert>}
            {error && <Alert color="danger" className="mt-3">{error}</Alert>}
            <div className="mt-3">
                <strong>Jobs Applied Today:</strong> {todaysCount}
            </div>

            <div className="mt-3">
                <strong>Jobs Applied This Week:</strong> {jobsThisWeek}
            </div>
            <div className="mt-3">
                <strong>Total Jobs Applied:</strong> {totalJobs}
            </div>


            <div>

                <hr />
                <h3 className="mt-4">Jobs Applied Today</h3>
                <FormGroup row>
                    <Label for="rowsPerPageSelect" sm={2}>Rows per page:</Label>
                    <Col sm={2}>
                        <Input
                            type="select"
                            name="rowsPerPage"
                            id="rowsPerPageSelect"
                            value={rowsPerPage}
                            onChange={handleRowsChange}
                            className="small-dropdown" // Apply the custom class here
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </Input>
                    </Col>
                </FormGroup>
                <Table striped bordered hover responsive className="mt-3">


                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Job Link</th>
                            <th>Job Title</th>
                            <th>Company Name</th>
                            <th>Applied Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobsToday.slice(0, rowsPerPage).map((job, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td><a href={job.superLink} target="_blank" rel="noopener noreferrer">{job.superLink}</a></td>
                                <td>{job.jobTitle}</td>
                                <td>{job.companyName}</td>
                                <td>{new Date(job.createdTime).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </div>

        </Container>
    );
}

export default JobForm;
