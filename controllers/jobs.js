const Job = require("../models/Job");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors")
const getAllJobs = async (req, res) => {
    // we are only looking for jobs associated with the specific user
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');

    if (jobs.length === 0) return res.status(StatusCodes.OK).json({ msg: "No items found..." })

    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;
    const job = await Job.findOne({ createdBy: userId, _id: jobId });
    if (!job) throw new NotFoundError("Not found");
    res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
};
const updateJob = async (req, res) => {
    const { body: { company, position }, user: { userId }, params: { id: jobId } } = req;

    if (!company || !position) throw new BadRequestError("Please fill the company and position");

    const job = await Job.findOneAndUpdate({ createdBy: userId, _id: jobId }, req.body, { new: true, runValidators: true });

    if (!job) throw new NotFoundError("Not found");

    res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;
    const job = await Job.findOneAndRemove({ createdBy: userId, _id: jobId });
    if (!job) throw new NotFoundError("Not found");
    res.status(StatusCodes.OK).send();
};
module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}