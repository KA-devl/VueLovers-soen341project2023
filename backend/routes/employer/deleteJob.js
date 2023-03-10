const jobPosting = require('../../models/jobpost');

// DELETE JOBPOSTING BY ITS ID
const deleteJobPosting = (app) => {
  app.delete('/api/delete-job/:id', async (req, res) => {
    try {
      const jobpost = await jobPosting.findById(req.params.id);

      if (!jobpost)
        return res.status(400).json({ sucess: false, message: err.message });

      jobpost.remove();

      res.status(201).json({
        sucess: true,
        message: `Job with id ${req.params.id} has been deleted`,
        data: jobpost,
      });
    } catch (err) {
      res.status(400).json({ sucess: false, message: `The job id is invalid` });
    }
  });
};

module.exports = deleteJobPosting;
