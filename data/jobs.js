const mongoCollections = require("../data/collections");
const jobs = mongoCollections.jobs;
const candidate = require("./candidates");
const ObjectID = require('mongodb').ObjectID;

let exportedMethods = {
    /**
     * Grabs all jobs in the collections sorted by date
     * @return jobs All the jobs in the collection sorted by date
     */
    async getAllJobs() {
        const jobsCollection = await jobs();
        const joblist = await jobsCollection.find({}).toArray();
        return joblist;
    },

    /**
     * Grabs the job with the given job id
     * @param jobId The id of the requested job
     * @return job The job matching the given id
     */
    async getJobById(jobId) {
        if (!jobId) throw "You must provide an id to search for";

        const jobsCollection = await jobs();
        const job = await jobsCollection.findOne({ _id: new ObjectID(jobId) });
        if (job === null) throw "No job with that id";

        return job;
    },

     /**
     * Grabs all jobs for the given owner
     * @param owner The id of the owner
     * @return jobs The jobs for the given owner
     */
    async getJobByOwner(owner) {
        if (!owner) throw "You must provide an owner";

        const jobsCollection = await jobs();
        const joblist = await jobsCollection.find({ "owner": new ObjectID(owner) }).toArray();
        return joblist;
    },

    /**
     * Adds a job of the given object under the given employer id
     * @param employerId The id of the employer that is posting the new job
     * @param newJob The new job object to be added
     * @return added True if the new job was added; False otherwise
     */
    async addJob(employerId, newJob) {
        newJob.owner = employerId;
        /*
        * applicants could be add here or add this attribute when there is a an applicant applying for it
        * */
        //newJob.applicants = [];
        if (!employerId)
            throw "[ERROR] empty employer when[adding new job]";

        const jobsCollection = await jobs();
        const insertInfo = await jobsCollection.insertOne(newJob);
        if (insertInfo.insertedCount === 0) {
            throw "Could not add job";
        }

        return true;
    },

    /**
     * Removes a job with the given job id
     * @param jobId The id of the requested job to be removed
     * @return removed True if the job was removed; False otherwise
     */
    async removeJob(jobId) {
        if (!jobId) throw "You must provide an id to search for";

        const jobsCollection = await jobs();
        const deletionInfo = await jobsCollection.removeOne({ "id": jobId });

        if (deletionInfo.deletedCount === 0) {
            console.log(`[ERROR] Could not delete job with id of ${jobId}`) ;
            return false;
        }
        return true;
    },

    /**
     * Updates a job posting to open
     * @param jobId The id of the job to be opened
     * @return opened True if the job was opened; False otherwise
     */
    async openJob(jobId) {
        if (!jobId) throw "You must provide an id to search for";

        const jobsCollection = await jobs();
        const job = await this.get(jobId);
        const updatedJob = {
            $set:{
                Owner:job.Owner,
                DateOfCreation:job.DateOfCreation,
                Open:true,
                Title:job.Title,
                Description:job.Description,
                ListOfDesiredSkills:job.ListOfDesiredSkills,
                PayRate:job.PayRate
            }
        };

        const updateInfo = await jobsCollection.updateOne({ "id": jobId }, updatedJob);
        if (updateInfo.modifiedCount === 0) {
            console.log(`[ERROR] Cannot open the job of ${jobId}`);
            return false;
        }
        return true;
    },

    /**
     * Updates a job posting to closed
     * @param jobId The id of the job to be closed
     * @return opened True if the job was closed; False otherwise
     */
    async closeJob(jobId) {
        if (!jobId) throw "You must provide an id to search for";

        const jobsCollection = await jobs();
        const job = await this.get(jobId);
        const updatedJob = {
            $set:{
                Owner:job.Owner,
                DateOfCreation:job.DateOfCreation,
                Open:false,
                Title:job.Title,
                Description:job.Description,
                ListOfDesiredSkills:job.ListOfDesiredSkills,
                PayRate:job.PayRate
            }
        };

        const updateInfo = await jobsCollection.updateOne({ "id": jobId }, updatedJob);
        if (updateInfo.modifiedCount === 0) {
            console.log(`[ERROR] Cannot close the job of ${jobId}`);
            return false;
        }
        return true;
    },

    /**
     * Updates a job with a new title
     * @param jobId The id for the job to be updated
     * @param newTitle The new title for the requested job
     * @return updated True if the job was updated; False otherwise
     */
    async updateJobTitle(jobId, newTitle) {
        if (!jobId) throw "You must provide an id to search for";

        if (!newTitle | typeof(newTitle) !== 'string') throw "You must provide a title for the job";

        const jobsCollection = await jobs();
        const job = await this.get(jobId);
        const updatedJob = {
            $set:{
                Owner:job.Owner,
                DateOfCreation:job.DateOfCreation,
                Open:job.Open,
                Title:newTitle,
                Description:job.Description,
                ListOfDesiredSkills:job.ListOfDesiredSkills,
                PayRate:job.PayRate
            }
        };

        const updateInfo = await jobsCollection.updateOne({ "id": jobId }, updatedJob);
        if (updateInfo.modifiedCount === 0) {
            console.log(`[ERROR] Cannot update the job title of ${jobId}`);
            return false;
        }
        return true;
    },

    /**
     * Updates a job with a new description
     * @param jobId The id for the job to be updated
     * @param newDesc The new description for the requested job
     * @return updated True if the job was updated; False otherwise
     */
    async updateJobDesc(jobId, newDesc) {
        if (!jobId) throw "You must provide an id to search for";

        if (!newDesc) throw "You must provide a new description for the job";

        const jobsCollection = await jobs();
        const job = await this.get(jobId);
        const updatedJob = {
            $set:{
                Owner:job.Owner,
                DateOfCreation:job.DateOfCreation,
                Open:job.Open,
                Title:job.Title,
                Description:newDesc,
                ListOfDesiredSkills:job.ListOfDesiredSkills,
                PayRate:job.PayRate
            }
        };

        const updateInfo = await jobsCollection.updateOne({ "id": jobId }, updatedJob);
        if (updateInfo.modifiedCount === 0) {
            console.log(`[ERROR] Cannot update the job description of ${jobId}`);
            return false;
        }
        return true;
    },

    /**
     * Add the given skills to a job
     * @param jobId The id for the job to be updated
     * @param newSkills The new skills for the requested job
     * @return updated True if the job was updated; False otherwise
     */
    updateSkills: async function (jobId, newSkills) {///////////////////////////////
        if (!jobId) throw "You must provide an id to search for";

        if (!newSkills) throw "You must provide a new skills set object for the job";

        const jobsCollection = await jobs();
        const job = await this.get(jobId);

        const updatedJob = {
            $set:{
                Owner:job.Owner,
                DateOfCreation:job.DateOfCreation,
                Open:job.Open,
                Title:job.Title,
                Description:job.Description,
                ListOfDesiredSkills:newSkills,
                PayRate:job.PayRate
            }
        };

        const updateInfo = await jobsCollection.updateOne({ "id": jobId }, updatedJob);
        if (updateInfo.modifiedCount === 0) {
            console.log(`[ERROR] Cannot update the job skills set of ${jobId}`);
            return false;
        }
        return true;
    },

    /**
     * Add the given skills to a job
     * @param jobId The id for the job to be updated
     * @param newSkills The new skills for the requested job
     * @return updated True if the job was updated; False otherwise
     */
    addSkills: async function (jobId, newSkills) {///////////////////////////////
        if (!jobId) throw "You must provide an id to search for";

        if (!newSkills) throw "You must provide a new skills set object for the job";

        const jobsCollection = await jobs();
        const job = await this.get(jobId);
        let newSkillsSet = job.ListOfDesiredSkills;
        newSkillsSet.push(newSkills);

        const updatedJob = {
            $set:{
                Owner:job.Owner,
                DateOfCreation:job.DateOfCreation,
                Open:job.Open,
                Title:job.Title,
                Description:job.Description,
                ListOfDesiredSkills:newSkillsSet,
                PayRate:job.PayRate
            }
        };

        const updateInfo = await jobsCollection.updateOne({ "id": jobId }, updatedJob);
        if (updateInfo.modifiedCount === 0) {
            console.log(`[ERROR] Cannot add the job skills set of ${jobId}`);
            return false;
        }
        return true;
    },

    /**  modify it referring from Nate's code of candidate removeSkill
     * Remove the given skills from a job
     * @param jobId The id for the job to be updated
     * @param skills The skills to be removed from the requested job
     * @return updated True if the job was updated; False otherwise
     */
    async removeSkills(jobId, oldSkills) {
        if (!jobId || !oldSkills) {
            throw "ERROR: Not enough arguments given to update function";
        }

        const jobsCollection = await jobs();
        const job = jobsCollection.find({ "id": jobId});
        let currentSkills = job.ListOfDesiredSkills;
        let skills = currentSkills.filter(s => { oldSkills.includes(s) })

        let updatedJob = {"ListOfDesiredSkills":skills};

        const updated = await jobsCollection.updateOne({ "id": jobId }, {$set: updatedJob});

        if (!updated) {
            throw "ERROR: There was an error updating the candidate";
        }
    },

    /**
     * Updates a job with a new rate
     * @param jobId The id for the job to be updated
     * @param newRate The new rate for the requested job
     * @return updated True if the job was updated; False otherwise
     */
    async updateJobRate(jobId, newRate) {
        if (!jobId) throw "You must provide an id to search for";

        if (!newRate) throw "You must provide a new Rate for the job";

        const jobsCollection = await jobs();
        const job = await this.get(jobId);
        const updatedJob = {
            $set:{
                Owner:job.Owner,
                DateOfCreation:job.DateOfCreation,
                Open:job.Open,
                Title:job.Title,
                Description:job.Description,
                ListOfDesiredSkills:job.ListOfDesiredSkills,
                PayRate:newRate
            }
        };

        const updateInfo = await jobsCollection.updateOne({ "id": jobId }, updatedJob);
        if (updateInfo.modifiedCount === 0) {
            console.log(`[ERROR] Cannot update the job Rate of ${jobId}`);
            return false;
        }
        return true;
    },

    /**
     * Updates a job with a new rate type
     * @param jobId The id for the job to be updated
     * @param newRateType The new rate type for the requested job
     * @return updated True if the job was updated; False otherwise
     */
    async updateJobRateType(jobId, newRateType) {
        if (!jobId) throw "You must provide an id to search for";

        if (!newRateType) throw "You must provide a new Rate type for the job";

        const jobsCollection = await jobs();
        const job = await this.get(jobId);
        let newRate = job.PayRate;
        newRate.RateType = newRateType; //[Chen]: I assume the PayRate is an object that contains salary and RateType
        const updatedJob = {
            $set:{
                Owner:job.Owner,
                DateOfCreation:job.DateOfCreation,
                Open:job.Open,
                Title:job.Title,
                Description:job.Description,
                ListOfDesiredSkills:job.ListOfDesiredSkills,
                PayRate:newRate
            }
        };

        const updateInfo = await jobsCollection.updateOne({ "id": jobId }, updatedJob);
        if (updateInfo.modifiedCount === 0) {
            console.log(`[ERROR] Cannot update the job RateType of ${jobId}`);
            return false;
        }
        return true;
    },

    /**
     * Updates a job with a new type
     * @param jobId The id for the job to be updated
     * @param newType The new type for the requested job
     * @return updated True if the job was updated; False otherwise
     */
    async updateJobType(jobId, newType) { //we don't have this attribute

    },

    /*
    * searches jobs with a keyword list for a specific candidate
    * @param keyword list
    * @param candidate ID for checking whether the job has been applied by the candidate or not
    * @return a jobs list; each job object has a new attribute of applied flag
    * */

    async searchJobsBykeywordAndId(keywordList, candidateID) {
        if (!keywordList || !candidateID)
            throw "[ERROR] [searchJobByKeyword] parameters are wrong"

        const allJobs = await getAllJobs();
        // let applicant = await candidate.getCandidateById(candidateID);
        let keyworSplit = keywordList.split(' ');

        let matchedJobs = allJobs.filter(x => {
            for (let keyword in keyworSplit) {
                if (JSON.stringify(x.skills).toLocaleLowerCase().indexOf(keyworSplit[keyword] === -1))
                    return false;
            }
            return true;
        });

        if (matchedJobs.length() === 0){
            console.log("[WARNING] Empty result of searching jobs by keywords");
        }


        for (let indexOfJobs in matchedJobs) {
            matchedJobs[indexOfJobs].applied = matchedJobs[indexOfJobs].applicants.indexOf(candidateID) !== -1;
        }

        return matchedJobs;
    }
};

module.exports = exportedMethods;
